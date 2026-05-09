from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from ..dependencies import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=schemas.DashboardStats)
def get_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    total_equipment = db.query(models.Equipment).filter(models.Equipment.is_active == True).count()
    available_equipment = db.query(models.Equipment).filter(
        models.Equipment.is_active == True,
        models.Equipment.available_qty > 0
    ).count()
    pending_requests = db.query(models.BorrowRequest).filter(models.BorrowRequest.status == "pending").count()
    active_borrows = db.query(models.BorrowRequest).filter(models.BorrowRequest.status == "approved").count()

    stats = schemas.DashboardStats(
        total_equipment=total_equipment,
        available_equipment=available_equipment,
        pending_requests=pending_requests,
        active_borrows=active_borrows,
    )

    if current_user.role == "admin":
        stats.total_users = db.query(models.User).filter(models.User.is_active == True).count()
    else:
        stats.my_pending = db.query(models.BorrowRequest).filter(
            models.BorrowRequest.user_id == current_user.id,
            models.BorrowRequest.status == "pending"
        ).count()
        stats.my_active_borrows = db.query(models.BorrowRequest).filter(
            models.BorrowRequest.user_id == current_user.id,
            models.BorrowRequest.status == "approved"
        ).count()

    return stats
