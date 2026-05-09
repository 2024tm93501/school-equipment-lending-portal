from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Date, ForeignKey, func
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base

def utcnow():
    return datetime.now(timezone.utc).replace(tzinfo=None)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="student")
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=utcnow)

    my_requests = relationship("BorrowRequest", foreign_keys="BorrowRequest.user_id", back_populates="user")
    approved_items = relationship("BorrowRequest", foreign_keys="BorrowRequest.approved_by", back_populates="approver")


class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(80), nullable=False)
    total_quantity = Column(Integer, nullable=False, default=1)
    available_qty = Column(Integer, nullable=False, default=1)
    condition = Column(String(30), nullable=False, default="good")
    image_url = Column(String(300), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

    requests = relationship("BorrowRequest", back_populates="equipment")


class BorrowRequest(Base):
    __tablename__ = "borrow_requests"

    id = Column(Integer, primary_key=True, index=True)
    equipment_id = Column(Integer, ForeignKey("equipment.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    quantity_requested = Column(Integer, nullable=False, default=1)
    status = Column(String(20), nullable=False, default="pending")
    reason = Column(Text, nullable=True)
    requested_at = Column(DateTime, default=utcnow)
    due_date = Column(Date, nullable=False)
    approved_at = Column(DateTime, nullable=True)
    returned_at = Column(DateTime, nullable=True)
    admin_note = Column(String(300), nullable=True)
    approved_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    user = relationship("User", foreign_keys=[user_id], back_populates="my_requests")
    equipment = relationship("Equipment", back_populates="requests")
    approver = relationship("User", foreign_keys=[approved_by], back_populates="approved_items")
