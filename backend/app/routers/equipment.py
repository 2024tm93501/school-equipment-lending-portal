from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from .. import models, schemas
from ..database import get_db
from ..dependencies import get_current_user, require_admin
from datetime import datetime, timezone

def _utcnow():
    return datetime.now(timezone.utc).replace(tzinfo=None)

router = APIRouter(prefix="/api/equipment", tags=["equipment"])


@router.get("", response_model=schemas.EquipmentListResponse)
def list_equipment(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    available_only: bool = Query(False),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    query = db.query(models.Equipment).filter(models.Equipment.is_active == True)
    if search:
        query = query.filter(
            models.Equipment.name.ilike(f"%{search}%") |
            models.Equipment.description.ilike(f"%{search}%")
        )
    if category:
        query = query.filter(models.Equipment.category == category)
    if available_only:
        query = query.filter(models.Equipment.available_qty > 0)
    total = query.count()
    items = query.offset(skip).limit(limit).all()
    return {"total": total, "equipment": items}


@router.get("/{equipment_id}", response_model=schemas.EquipmentOut)
def get_equipment(
    equipment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    item = db.query(models.Equipment).filter(
        models.Equipment.id == equipment_id,
        models.Equipment.is_active == True
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return item


@router.post("", response_model=schemas.EquipmentOut, status_code=status.HTTP_201_CREATED)
def create_equipment(
    eq_in: schemas.EquipmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin),
):
    item = models.Equipment(
        name=eq_in.name,
        description=eq_in.description,
        category=eq_in.category,
        total_quantity=eq_in.total_quantity,
        available_qty=eq_in.total_quantity,
        condition=eq_in.condition,
        image_url=eq_in.image_url,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{equipment_id}", response_model=schemas.EquipmentOut)
def update_equipment(
    equipment_id: int,
    eq_in: schemas.EquipmentUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin),
):
    item = db.query(models.Equipment).filter(models.Equipment.id == equipment_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Equipment not found")

    update_data = eq_in.model_dump(exclude_unset=True)

    if "total_quantity" in update_data:
        new_total = update_data["total_quantity"]
        active_borrows = item.total_quantity - item.available_qty
        new_available = new_total - active_borrows
        if new_available < 0:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot reduce total to {new_total}: {active_borrows} units currently borrowed"
            )
        update_data["available_qty"] = new_available

    update_data["updated_at"] = _utcnow()
    for field, value in update_data.items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{equipment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_equipment(
    equipment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin),
):
    item = db.query(models.Equipment).filter(models.Equipment.id == equipment_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Equipment not found")
    item.is_active = False
    db.commit()
