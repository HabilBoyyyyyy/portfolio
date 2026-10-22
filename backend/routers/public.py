from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/api", tags=["public"])

@router.get("/profile", response_model=schemas.ProfileOut)
def get_profile(db: Session = Depends(get_db)):
    profile = db.query(models.Profile).first()
    if not profile:
        raise HTTPException(404, "Profile not set up yet")
    return profile

@router.get("/skills", response_model=list[schemas.SkillOut])
def get_skills(db: Session = Depends(get_db)):
    return db.query(models.Skill).filter(models.Skill.visible == True).order_by(models.Skill.category, models.Skill.order).all()

@router.get("/projects", response_model=list[schemas.ProjectOut])
def get_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).filter(models.Project.visible == True).order_by(models.Project.order).all()

@router.get("/projects/{slug}", response_model=schemas.ProjectOut)
def get_project(slug: str, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(
        models.Project.slug == slug,
        models.Project.visible == True,
    ).first()
    if not project:
        raise HTTPException(404, "Project not found")
    return project

@router.get("/certificates", response_model=list[schemas.CertificateOut])
def get_certificates(db: Session = Depends(get_db)):
    return db.query(models.Certificate).all()

@router.get("/timeline", response_model=list[schemas.TimelineItemOut])
def get_timeline(db: Session = Depends(get_db)):
    return db.query(models.TimelineItem).order_by(models.TimelineItem.order).all()

@router.get("/sections", response_model=list[schemas.SectionOut])
def get_sections(db: Session = Depends(get_db)):
    return db.query(models.Section).all()

@router.post("/contact", response_model=schemas.ContactMessageOut)
def submit_contact(payload: schemas.ContactMessageCreate, db: Session = Depends(get_db)):
    msg = models.ContactMessage(**payload.model_dump())
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg
