from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime
import re

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

class ProfileOut(BaseModel):
    name: str
    role: Optional[str] = None
    tagline: Optional[str] = None
    bio: Optional[str] = None
    email: Optional[str] = None
    resume_url: Optional[str] = None
    hero_image_url: Optional[str] = None
    about_image_url: Optional[str] = None
    stat_projects: Optional[str] = None
    stat_years: Optional[str] = None
    stat_certs: Optional[str] = None
    class Config:
        from_attributes = True

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    tagline: Optional[str] = None
    bio: Optional[str] = None
    email: Optional[str] = None
    resume_url: Optional[str] = None
    hero_image_url: Optional[str] = None
    about_image_url: Optional[str] = None
    stat_projects: Optional[str] = None
    stat_years: Optional[str] = None
    stat_certs: Optional[str] = None

class SkillOut(BaseModel):
    id: int
    name: str
    icon_url: Optional[str] = None
    category: Optional[str] = None
    progress: int
    description: Optional[str] = None
    order: int
    visible: bool
    class Config:
        from_attributes = True

class SkillCreate(BaseModel):
    name: str
    icon_url: Optional[str] = None
    category: Optional[str] = None
    progress: int = 0
    description: Optional[str] = None
    order: int = 0
    visible: bool = True

class SkillReorderItem(BaseModel):
    id: int
    order: int

class SkillReorderRequest(BaseModel):
    skills: list[SkillReorderItem]

class ProjectReorderItem(BaseModel):
    id: int
    order: int

class ProjectReorderRequest(BaseModel):
    projects: list[ProjectReorderItem]

class ProjectImageOut(BaseModel):
    id: int
    image_url: str
    order: int
    class Config:
        from_attributes = True

class ProjectOut(BaseModel):
    id: int
    slug: str
    title: str
    summary: Optional[str] = None
    write_up: Optional[str] = None
    tags: Optional[str] = None
    repo_url: Optional[str] = None
    demo_url: Optional[str] = None
    order: int
    visible: bool
    images: list[ProjectImageOut] = []
    class Config:
        from_attributes = True

class ProjectCreate(BaseModel):
    slug: str
    title: str
    summary: Optional[str] = None
    write_up: Optional[str] = None
    tags: Optional[str] = None
    repo_url: Optional[str] = None
    demo_url: Optional[str] = None
    order: int = 0
    visible: bool = True

class ExperienceOut(BaseModel):
    id: int
    role: str
    company: str
    company_url: Optional[str] = None
    company_logo_url: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    is_current: bool = False
    summary: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[str] = None
    order: int = 0
    visible: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    class Config:
        from_attributes = True

class ExperienceCreate(BaseModel):
    role: str
    company: str
    company_url: Optional[str] = None
    company_logo_url: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    is_current: bool = False
    summary: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[str] = None
    order: int = 0
    visible: bool = True

class ExperienceReorderItem(BaseModel):
    id: int
    order: int

class ExperienceReorderRequest(BaseModel):
    experiences: list[ExperienceReorderItem]

class CertificateOut(BaseModel):
    id: int
    name: str
    issuer: Optional[str] = None
    score: Optional[str] = None
    date: Optional[str] = None
    class Config:
        from_attributes = True

class CertificateCreate(BaseModel):
    name: str
    issuer: Optional[str] = None
    score: Optional[str] = None
    date: Optional[str] = None

class TimelineItemOut(BaseModel):
    id: int
    year: str
    title: str
    description: Optional[str] = None
    order: int
    class Config:
        from_attributes = True

class TimelineItemCreate(BaseModel):
    year: str
    title: str
    description: Optional[str] = None
    order: int = 0

class TimelineReorderItem(BaseModel):
    id: int
    order: int

class TimelineReorderRequest(BaseModel):
    items: list[TimelineReorderItem]

class SectionOut(BaseModel):
    key: str
    visible: bool
    class Config:
        from_attributes = True

class ContactMessageCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., min_length=3, max_length=200)
    subject: Optional[str] = Field(default=None, max_length=150)
    message: str = Field(..., min_length=1, max_length=3000)

    @field_validator("name", "message")
    @classmethod
    def strip_required(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("Field cannot be empty")
        return cleaned

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        cleaned = v.strip()
        if not EMAIL_REGEX.match(cleaned):
            raise ValueError("Invalid email address")
        return cleaned

    @field_validator("subject")
    @classmethod
    def clean_subject(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        cleaned = v.strip()
        return cleaned if cleaned else None

class ContactMessageOut(BaseModel):
    id: int
    name: str
    email: str
    subject: Optional[str] = None
    message: str
    created_at: Optional[datetime] = None
    read: bool = False
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class SectionUpdate(BaseModel):
    visible: bool

class ProjectImageCreate(BaseModel):
    image_url: str = Field(..., min_length=1)
    order: int = 0