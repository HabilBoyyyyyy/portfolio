from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter(prefix="/api", tags=["public"])

@router.get("/profile", response_model=schemas.ProfileOut)
def get_profile(db: Session = Depends(get_db)):
    profile = db.query(models.Profile).first()
    if not profile:
        # Return sensible default profile instead of throwing 404 on fresh DB
        return schemas.ProfileOut(
            name="Habil Baihaki Ramadhan",
            role="Full-Stack Developer & AI Engineer",
            tagline="I build digital experiences that matter.",
            bio=(
                "Informatics student at President University with a focus on AI/ML and "
                "full-stack web development. I build systems where software meets the real world "
                "— from IoT-connected campus apps to robotic arms and industrial inspection prototypes."
            ),
            email="habilramadhan1005@gmail.com",
            stat_projects="6+",
            stat_years="2+",
            stat_certs="4+",
        )
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

@router.get("/experiences", response_model=list[schemas.ExperienceOut])
@router.get("/experience", response_model=list[schemas.ExperienceOut])
def get_experiences(db: Session = Depends(get_db)):
    return (
        db.query(models.Experience)
        .filter(models.Experience.visible == True)
        .order_by(models.Experience.order, models.Experience.id)
        .all()
    )

@router.get("/certificates", response_model=list[schemas.CertificateOut])
def get_certificates(db: Session = Depends(get_db)):
    return db.query(models.Certificate).order_by(models.Certificate.id.desc()).all()

@router.get("/timeline", response_model=list[schemas.TimelineItemOut])
def get_timeline(db: Session = Depends(get_db)):
    return db.query(models.TimelineItem).order_by(models.TimelineItem.order, models.TimelineItem.id).all()

@router.get("/sections", response_model=list[schemas.SectionOut])
def get_sections(db: Session = Depends(get_db)):
    return db.query(models.Section).all()

@router.post("/contact", response_model=schemas.ContactMessageOut)
def submit_contact(payload: schemas.ContactMessageCreate, db: Session = Depends(get_db)):
    data = payload.model_dump() if hasattr(payload, "model_dump") else payload.dict()
    msg = models.ContactMessage(
        name=data["name"],
        email=data["email"],
        subject=data.get("subject"),
        message=data["message"],
        created_at=datetime.utcnow(),
        read=False,
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg