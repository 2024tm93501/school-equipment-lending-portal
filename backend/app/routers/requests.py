from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timezone

def _utcnow():
    return datetime.now(timezone.utc).replace(tzinfo=None)
from .. import models, schemas
from ..database import get_db
from ..dependencies import get_current_user, require_admin

router = APIRouter(prefix="/api/requests", tags=["requests"])


def _build_request_out(req: models.BorrowRequest) -> schemas.RequestOut:
    return schemas.RequestOut(
        id=req.id,
        equipment_id=req.equipment_id,
        equipment_name=req.equipment.name,
        user_id=req.user_id,
        user_name=req.user.full_name,
        quantity_requested=req.quantity_requested,
        status=req.status,
        reason=req.reason,
        requested_at=req.requested_at,
        due_date=req.due_date,
        approved_at=req.approved_at,
        returned_at=req.returned_at,
        admin_note=req.admin_note,
        approved_by=req.approved_by,
    )


@router.post("", response_model=schemas.RequestOut, status_code=status.HTTP_201_CREATED)
def submit_request(
    req_in: schemas.RequestCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    equipment = db.query(models.Equipment).filter(
        models.Equipment.id == req_in.equipment_id,
        models.Equipment.is_active == True
    ).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
    if equipment.available_qty < req_in.quantity_requested:
        raise HTTPException(
            status_code=400,
            detail=f"Only {equipment.available_qty} unit(s) available"
        )

    equipment.available_qty -= req_in.quantity_requested

    req = models.BorrowRequest(
        equipment_id=req_in.equipment_id,
        user_id=current_user.id,
        quantity_requested=req_in.quantity_requested,
        due_date=req_in.due_date,
        reason=req_in.reason,
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    return _build_request_out(req)


@router.get("/my", response_model=schemas.RequestListResponse)
def get_my_requests(
    status_filter: Optional[str] = Query(None, alias="status"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    query = db.query(models.BorrowRequest).filter(models.BorrowRequest.user_id == current_user.id)
    if status_filter:
        query = query.filter(models.BorrowRequest.status == status_filter)
    query = query.order_by(models.BorrowRequest.requested_at.desc())
    total = query.count()
    reqs = query.offset(skip).limit(limit).all()
    return {"total": total, "requests": [_build_request_out(r) for r in reqs]}


@router.get("", response_model=schemas.RequestListResponse)
def get_all_requests(
    status_filter: Optional[str] = Query(None, alias="status"),
    equipment_id: Optional[int] = Query(None),
    user_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin),
):
    query = db.query(models.BorrowRequest)
    if status_filter:
        query = query.filter(models.BorrowRequest.status == status_filter)
    if equipment_id:
        query = query.filter(models.BorrowRequest.equipment_id == equipment_id)
    if user_id:
        query = query.filter(models.BorrowRequest.user_id == user_id)
    if search:
        query = query.join(models.Equipment).join(models.User).filter(
            models.Equipment.name.ilike(f"%{search}%") |
            models.User.full_name.ilike(f"%{search}%")
        )
    query = query.order_by(models.BorrowRequest.requested_at.desc())
    total = query.count()
    reqs = query.offset(skip).limit(limit).all()
    return {"total": total, "requests": [_build_request_out(r) for r in reqs]}


@router.get("/{request_id}", response_model=schemas.RequestOut)
def get_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    req = db.query(models.BorrowRequest).filter(models.BorrowRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if current_user.role != "admin" and req.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    return _build_request_out(req)


@router.patch("/{request_id}/approve", response_model=schemas.RequestOut)
def approve_request(
    request_id: int,
    body: schemas.ApproveRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin),
):
    req = db.query(models.BorrowRequest).filter(models.BorrowRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status != "pending":
        raise HTTPException(status_code=400, detail=f"Cannot approve a {req.status} request")
    req.status = "approved"
    req.approved_at = _utcnow()
    req.approved_by = current_user.id
    req.admin_note = body.admin_note
    db.commit()
    db.refresh(req)
    return _build_request_out(req)


@router.patch("/{request_id}/reject", response_model=schemas.RequestOut)
def reject_request(
    request_id: int,
    body: schemas.RejectRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin),
):
    req = db.query(models.BorrowRequest).filter(models.BorrowRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status != "pending":
        raise HTTPException(status_code=400, detail=f"Cannot reject a {req.status} request")
    req.status = "rejected"
    req.admin_note = body.admin_note
    req.equipment.available_qty += req.quantity_requested
    db.commit()
    db.refresh(req)
    return _build_request_out(req)


@router.patch("/{request_id}/return", response_model=schemas.RequestOut)
def return_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin),
):
    req = db.query(models.BorrowRequest).filter(models.BorrowRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status != "approved":
        raise HTTPException(status_code=400, detail=f"Cannot mark returned a {req.status} request")
    req.status = "returned"
    req.returned_at = _utcnow()
    req.equipment.available_qty += req.quantity_requested
    db.commit()
    db.refresh(req)
    return _build_request_out(req)
