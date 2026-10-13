from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
from auth import verify_password, create_access_token, get_current_admin
import models, schemas

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.post("/login", response_model=schemas.TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.AdminUser).filter(models.AdminUser.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(401, "Incorrect username or password")
    token = create_access_token({"sub": user.username})
    return {"access_token": token}

# --- Profile ---
@router.put("/profile", response_model=schemas.ProfileOut)
def update_profile(payload: schemas.ProfileUpdate, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    profile = db.query(models.Profile).first()
    if not profile:
        profile = models.Profile(name=payload.name or "Habil")
        db.add(profile)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    return profile

# --- Skills ---
@router.get("/skills", response_model=list[schemas.SkillOut])
def get_admin_skills(db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    return db.query(models.Skill).order_by(models.Skill.order).all()

@router.post("/skills", response_model=schemas.SkillOut)
def create_skill(payload: schemas.SkillCreate, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    skill = models.Skill(**payload.model_dump())
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill

@router.put("/skills/{skill_id}", response_model=schemas.SkillOut)
def update_skill(skill_id: int, payload: schemas.SkillCreate, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    skill = db.query(models.Skill).filter(models.Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(404, "Skill not found")
    for field, value in payload.model_dump().items():
        setattr(skill, field, value)
    db.commit()
    db.refresh(skill)
    return skill

@router.delete("/skills/{skill_id}")
def delete_skill(skill_id: int, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    skill = db.query(models.Skill).filter(models.Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(404, "Skill not found")
    db.delete(skill)
    db.commit()
    return {"ok": True}

# --- Projects ---
@router.get("/projects", response_model=list[schemas.ProjectOut])
def get_admin_projects(db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    return db.query(models.Project).order_by(models.Project.order).all()

@router.post("/projects", response_model=schemas.ProjectOut)
def create_project(payload: schemas.ProjectCreate, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    project = models.Project(**payload.model_dump())
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.put("/projects/{project_id}", response_model=schemas.ProjectOut)
def update_project(project_id: int, payload: schemas.ProjectCreate, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(404, "Project not found")
    for field, value in payload.model_dump().items():
        setattr(project, field, value)
    db.commit()
    db.refresh(project)
    return project

@router.delete("/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(404, "Project not found")
    db.delete(project)
    db.commit()
    return {"ok": True}

# --- Certificates ---
@router.post("/certificates", response_model=schemas.CertificateOut)
def create_certificate(payload: schemas.CertificateCreate, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    cert = models.Certificate(**payload.model_dump())
    db.add(cert)
    db.commit()
    db.refresh(cert)
    return cert

@router.put("/certificates/{cert_id}", response_model=schemas.CertificateOut)
def update_certificate(cert_id: int, payload: schemas.CertificateCreate, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    cert = db.query(models.Certificate).filter(models.Certificate.id == cert_id).first()
    if not cert:
        raise HTTPException(404, "Certificate not found")
    for field, value in payload.model_dump().items():
        setattr(cert, field, value)
    db.commit()
    db.refresh(cert)
    return cert

@router.delete("/certificates/{cert_id}")
def delete_certificate(cert_id: int, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    cert = db.query(models.Certificate).filter(models.Certificate.id == cert_id).first()
    if not cert:
        raise HTTPException(404, "Certificate not found")
    db.delete(cert)
    db.commit()
    return {"ok": True}

# --- Timeline ---
@router.post("/timeline", response_model=schemas.TimelineItemOut)
def create_timeline_item(payload: schemas.TimelineItemCreate, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    item = models.TimelineItem(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/timeline/{item_id}", response_model=schemas.TimelineItemOut)
def update_timeline_item(item_id: int, payload: schemas.TimelineItemCreate, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    item = db.query(models.TimelineItem).filter(models.TimelineItem.id == item_id).first()
    if not item:
        raise HTTPException(404, "Timeline item not found")
    for field, value in payload.model_dump().items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/timeline/{item_id}")
def delete_timeline_item(item_id: int, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    item = db.query(models.TimelineItem).filter(models.TimelineItem.id == item_id).first()
    if not item:
        raise HTTPException(404, "Timeline item not found")
    db.delete(item)
    db.commit()
    return {"ok": True}

# --- Sections (show/hide) ---
@router.put("/sections/{key}", response_model=schemas.SectionOut)
def toggle_section(key: str, payload: schemas.SectionUpdate, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    section = db.query(models.Section).filter(models.Section.key == key).first()
    if not section:
        section = models.Section(key=key, visible=payload.visible)
        db.add(section)
    else:
        section.visible = payload.visible
    db.commit()
    db.refresh(section)
    return section

# --- Messages ---
@router.get("/messages", response_model=list[schemas.ContactMessageOut])
def get_messages(db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    return db.query(models.ContactMessage).order_by(models.ContactMessage.created_at.desc()).all()

@router.put("/messages/{msg_id}/read")
def mark_read(msg_id: int, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    msg = db.query(models.ContactMessage).filter(models.ContactMessage.id == msg_id).first()
    if not msg:
        raise HTTPException(404, "Message not found")
    msg.read = True
    db.commit()
    return {"ok": True}

@router.delete("/messages/{msg_id}")
def delete_message(msg_id: int, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    msg = db.query(models.ContactMessage).filter(models.ContactMessage.id == msg_id).first()
    if not msg:
        raise HTTPException(404, "Message not found")
    db.delete(msg)
    db.commit()
    return {"ok": True}

@router.post("/projects/{project_id}/images", response_model=schemas.ProjectImageOut)
def add_project_image(project_id: int, payload: schemas.ProjectImageCreate, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    clean_url = payload.image_url.strip()
    if not clean_url:
        raise HTTPException(400, "Image URL cannot be empty")
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(404, "Project not found")
    image = models.ProjectImage(project_id=project_id, image_url=clean_url, order=payload.order)
    db.add(image)
    db.commit()
    db.refresh(image)
    return image

@router.delete("/projects/images/{image_id}")
def delete_project_image(image_id: int, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    image = db.query(models.ProjectImage).filter(models.ProjectImage.id == image_id).first()
    if not image:
        raise HTTPException(404, "Image not found")
    db.delete(image)
    db.commit()
    return {"ok": True}