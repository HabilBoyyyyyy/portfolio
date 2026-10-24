from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from database import Base

class Profile(Base):
    __tablename__ = "profile"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    role = Column(String)
    tagline = Column(String)
    bio = Column(Text)
    email = Column(String)
    resume_url = Column(String)
    hero_image_url = Column(String)
    about_image_url = Column(String)
    stat_projects = Column(String)
    stat_years = Column(String)
    stat_certs = Column(String)

class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    icon_url = Column(String)
    category = Column(String)
    progress = Column(Integer, default=0)
    description = Column(Text)
    order = Column(Integer, default=0)
    visible = Column(Boolean, default=True)

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True)
    slug = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=False)
    summary = Column(Text)
    write_up = Column(Text)
    tags = Column(String)
    repo_url = Column(String)
    demo_url = Column(String)
    order = Column(Integer, default=0)
    visible = Column(Boolean, default=True)
    images = relationship("ProjectImage", back_populates="project", cascade="all, delete-orphan")

class ProjectImage(Base):
    __tablename__ = "project_images"
    id = Column(Integer, primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    image_url = Column(String, nullable=False)
    order = Column(Integer, default=0)
    project = relationship("Project", back_populates="images")

class Experience(Base):
    __tablename__ = "experiences"
    id = Column(Integer, primary_key=True, index=True)
    role = Column(String(150), nullable=False)
    company = Column(String(150), nullable=False)
    company_url = Column(String(500))
    company_logo_url = Column(String(500))
    location = Column(String(150))
    employment_type = Column(String(80))
    start_date = Column(String(50), nullable=False)
    end_date = Column(String(50))
    is_current = Column(Boolean, default=False, server_default="0", nullable=False)
    summary = Column(Text)
    description = Column(Text)
    tags = Column(String(500))
    order = Column(Integer, default=0, server_default="0", nullable=False)
    visible = Column(Boolean, default=True, server_default="1", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, server_default=func.now(), onupdate=func.now(), nullable=False)

class Certificate(Base):
    __tablename__ = "certificates"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    issuer = Column(String)
    score = Column(String)
    date = Column(String)

class TimelineItem(Base):
    __tablename__ = "timeline_items"
    id = Column(Integer, primary_key=True)
    year = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    order = Column(Integer, default=0)

class Section(Base):
    __tablename__ = "sections"
    id = Column(Integer, primary_key=True)
    key = Column(String, unique=True, nullable=False)
    visible = Column(Boolean, default=True)

class ContactMessage(Base):
    __tablename__ = "contact_messages"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    subject = Column(String, nullable=True)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, server_default=func.now(), nullable=False)
    read = Column(Boolean, default=False, server_default="0", nullable=False)

class AdminUser(Base):
    __tablename__ = "admin_users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)