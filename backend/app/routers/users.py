from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_current_user
from app.models import User
from app.schemas import ProfileRead, ProfileUpdate, UserRead

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserRead)
async def read_current_user(current_user: User = Depends(get_current_user)) -> UserRead:
    return UserRead.model_validate(current_user)


@router.get("/profile", response_model=ProfileRead)
async def get_profile(current_user: User = Depends(get_current_user)) -> ProfileRead:
    """Returns the current user's profile data to pre-populate the profile form."""
    return ProfileRead.model_validate(current_user)


@router.put("/profile", response_model=ProfileRead)
async def update_profile(
    profile: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ProfileRead:
    """Saves the student's GPA, SAT score, intended major, target schools, and country."""
    # Only update fields that were actually sent (not None)
    for field, value in profile.model_dump(exclude_none=True).items():
        setattr(current_user, field, value)

    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return ProfileRead.model_validate(current_user)
