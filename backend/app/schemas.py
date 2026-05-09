from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime, date


# ─── User Schemas ───────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str = "student"

    @field_validator("role")
    @classmethod
    def role_must_be_valid(cls, v):
        if v not in ("student", "staff"):
            raise ValueError("Role must be student or staff")
        return v

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v):
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v


class UserOut(BaseModel):
    id: int
    full_name: str
    email: str
    role: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None

    @field_validator("role")
    @classmethod
    def role_valid(cls, v):
        if v is not None and v not in ("student", "staff", "admin"):
            raise ValueError("Invalid role")
        return v


# ─── Auth Schemas ────────────────────────────────────────────────────────────

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


class TokenData(BaseModel):
    user_id: Optional[int] = None


# ─── Equipment Schemas ───────────────────────────────────────────────────────

class EquipmentCreate(BaseModel):
    name: str
    description: Optional[str] = None
    category: str
    total_quantity: int = 1
    condition: str = "good"
    image_url: Optional[str] = None

    @field_validator("total_quantity")
    @classmethod
    def qty_positive(cls, v):
        if v < 1:
            raise ValueError("total_quantity must be at least 1")
        return v

    @field_validator("condition")
    @classmethod
    def condition_valid(cls, v):
        if v not in ("excellent", "good", "fair", "poor"):
            raise ValueError("condition must be excellent, good, fair, or poor")
        return v


class EquipmentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    total_quantity: Optional[int] = None
    condition: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None


class EquipmentOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    category: str
    total_quantity: int
    available_qty: int
    condition: str
    image_url: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class EquipmentListResponse(BaseModel):
    total: int
    equipment: list[EquipmentOut]


# ─── Borrow Request Schemas ──────────────────────────────────────────────────

class RequestCreate(BaseModel):
    equipment_id: int
    quantity_requested: int = 1
    due_date: date
    reason: Optional[str] = None

    @field_validator("quantity_requested")
    @classmethod
    def qty_positive(cls, v):
        if v < 1:
            raise ValueError("quantity_requested must be at least 1")
        return v


class RequestOut(BaseModel):
    id: int
    equipment_id: int
    equipment_name: str
    user_id: int
    user_name: str
    quantity_requested: int
    status: str
    reason: Optional[str]
    requested_at: datetime
    due_date: date
    approved_at: Optional[datetime]
    returned_at: Optional[datetime]
    admin_note: Optional[str]
    approved_by: Optional[int]

    model_config = {"from_attributes": True}


class ApproveRequest(BaseModel):
    admin_note: Optional[str] = None


class RejectRequest(BaseModel):
    admin_note: Optional[str] = None


class RequestListResponse(BaseModel):
    total: int
    requests: list[RequestOut]


# ─── User List Response ──────────────────────────────────────────────────────

class UserListResponse(BaseModel):
    total: int
    users: list[UserOut]


# ─── Dashboard Schemas ───────────────────────────────────────────────────────

class DashboardStats(BaseModel):
    total_equipment: int
    available_equipment: int
    pending_requests: int
    active_borrows: int
    total_users: Optional[int] = None
    my_pending: Optional[int] = None
    my_active_borrows: Optional[int] = None
