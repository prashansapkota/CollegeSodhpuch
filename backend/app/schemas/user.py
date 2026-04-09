from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str


class UserRead(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str


# What the frontend sends when the user saves their profile.
# All fields are optional — the user can update just one field at a time.
class ProfileUpdate(BaseModel):
    gpa: float | None = None
    sat_score: int | None = None
    intended_major: str | None = None
    target_schools: str | None = None
    country_of_origin: str | None = None


# What the backend sends back when the frontend fetches the profile.
class ProfileRead(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    gpa: float | None
    sat_score: int | None
    intended_major: str | None
    target_schools: str | None
    country_of_origin: str | None

    model_config = ConfigDict(from_attributes=True)
