from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

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

class ProjectReorderItem(BaseModel):
    id: int
    order: int

class ProjectReorderRequest(BaseModel):
    projects: list[ProjectReorderItem]

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

class SectionOut(BaseModel):
    key: str
    visible: bool
    class Config:
        from_attributes = True

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: Optional[str] = None
    message: str

class ContactMessageOut(BaseModel):
    id: int
    name: str
    email: str
    subject: Optional[str] = None
    message: str
    created_at: datetime
    read: bool
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
