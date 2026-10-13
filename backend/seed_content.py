"""
seed_content.py
Loads the rewritten portfolio content into your database.

Run it from the backend folder with your venv active:

    python seed_content.py            # add new content, update existing, keep the rest
    python seed_content.py --reset    # first DELETE all skills, projects, project images,
                                      # certificates and timeline items, then load fresh

It never touches: contact messages, admin users, or section visibility.
It is safe to run more than once: items are matched by slug / name / year+title,
so running it twice does not create duplicates.
"""

import os
import sys

from database import SessionLocal
import models

# ---------------------------------------------------------------------------
# 1. CONTENT
#    Edit the text here before running, or edit it later in the admin dashboard.
# ---------------------------------------------------------------------------

PROFILE = {
    "name": "Habil Baihaki Ramadhan",
    "tagline": "I build web apps and the AI behind them.",
    "bio": (
        "I'm an Informatics student at President University, majoring in AI/ML, "
        "and I'm looking for internships in AI, web development, and data.\n\n"
        "I like projects where software meets the real world: a dormitory system "
        "that got a demo with the university's Dormitory Director, a robot arm that "
        "picks up trash, and a visual-inspection prototype for an industrial client.\n\n"
        "I started coding in high school in 2023. Since then I've built web apps with "
        "PHP, MySQL, and JavaScript, fine-tuned NLP models in Python, and programmed "
        "robots in C++. Right now I'm focused on AI engineering, and on getting models "
        "into products that people can actually use.\n\n"
        "I also take on key roles in campus projects and organizational activities, "
        "and I enjoy learning languages."
    ),
    "email": "habilramadhan1005@gmail.com",
    # Put your latest CV at frontend/public/files/Habil_Baihaki_Ramadhan_CV.pdf
    "resume_url": "/files/Habil_Baihaki_Ramadhan_CV.pdf",
    # Counted from the content below: 6 projects, coding since 2023, 2 certificates.
    "stat_projects": "6",
    "stat_years": "3",
    "stat_certs": "2",
}

SKILLS = [
    {
        "name": "Machine Learning & NLP",
        "category": "AI",
        "progress": 75,
        "description": (
            "Fine-tuning transformer models in Python for summarization and entity "
            "recognition (97.7% accuracy on NER), and building computer-vision models "
            "for industrial inspection."
        ),
        "order": 1,
    },
    {
        "name": "Frontend Development",
        "category": "Web",
        "progress": 65,
        "description": (
            "Responsive, clean interfaces with HTML, CSS, and JavaScript. Led the "
            "frontend for Presdorm, President University's dormitory management system."
        ),
        "order": 2,
    },
    {
        "name": "Embedded Systems & Robotics",
        "category": "Hardware",
        "progress": 50,
        "description": (
            "Microcontroller programming with Arduino and C++. Programmed the hand "
            "movement of a team-built trash-collecting robot."
        ),
        "order": 3,
    },
    {
        "name": "Backend & Databases",
        "category": "Web",
        "progress": 45,
        "description": (
            "PHP and MySQL for data-driven systems, from schema design to server-side "
            "logic. Currently learning FastAPI and PostgreSQL by building this site."
        ),
        "order": 4,
    },
    {
        "name": "Technical Writing & Review",
        "category": "Communication",
        "progress": 80,
        "description": (
            "Reviewed 500+ student resumes and wrote structured judging criteria "
            "for competition scoring."
        ),
        "order": 5,
    },
]

CERTIFICATES = [
    {
        "name": "Data Analysis Camp Batch 1",
        "issuer": "Ousean Indonesia & Data Analyst Camp",
        "score": "90",
        "date": None,
    },
    {
        "name": "Junior Administrative Assistant (English Vocational Training)",
        "issuer": "Ministry of Manpower, Indonesia",
        "score": None,
        "date": None,
    },
]

TIMELINE = [
    {
        "year": "2023",
        "title": "Started coding",
        "description": "Began learning programming in high school.",
        "order": 1,
    },
    {
        "year": "2024",
        "title": "Joined President University",
        "description": "Started the Informatics program.",
        "order": 2,
    },
    {
        "year": "2025",
        "title": "First full website project",
        "description": "Built Presdorm, a dormitory management system, with a team of four and led its frontend.",
        "order": 3,
    },
    {
        "year": "2025",
        "title": "Moved into AI",
        "description": "Joined the Artificial Intelligence focus and started learning machine learning fundamentals.",
        "order": 4,
    },
    {
        "year": "2026",
        "title": "Rebuilt this portfolio",
        "description": "Redesigned it from scratch with Next.js, FastAPI, and PostgreSQL, plus a private admin dashboard.",
        "order": 5,
    },
]

# Write-ups are Markdown. The project page already shows the title as a big
# heading, so write-ups start at "##".
PROJECTS = [
    {
        "slug": "verivision",
        "title": "VeriVision",
        "summary": (
            "An AI visual-inspection platform for an industrial client. It grew from a "
            "pass/fail image classifier into a configurable system where new inspection "
            "tasks are defined in JSON templates, with no code changes."
        ),
        "tags": "Computer Vision, PyTorch, FastAPI, Next.js",
        "repo_url": None,
        "demo_url": None,
        "order": 1,
        "write_up": """
## Overview

VeriVision is a visual-inspection platform built for an industrial client by a team of three. Checking parts by eye is repetitive work, which makes it a good fit for computer vision.

## What it does

- Started as a binary **OK / NG** (pass or fail) image classifier.
- Grew into a configurable platform: inspection tasks are described in **JSON templates**, so a new product or check does not need code changes.
- The same pipeline can be trained on many different datasets without changing code.
- Accuracy was mostly above 80% across the datasets we tried.

## My role

I was the project manager and the AI engineer. I owned the AI side (building and training the models) and coordinated the team. My teammates handled the backend and the frontend.

## Tech stack

- **Models:** YOLOv8, MobileNetV2, PyTorch
- **Backend:** FastAPI, SQLite
- **Frontend:** Next.js, Tailwind CSS

## Status

A working demo. It has not been deployed in production.
""",
    },
    {
        "slug": "news-summarization-ner",
        "title": "News Summarization & NER",
        "summary": (
            "Fine-tuned transformer models for news summarization and named entity "
            "recognition, reaching 97.7% accuracy on entity recognition."
        ),
        "tags": "Python, NLP, Transformers",
        "repo_url": None,
        "demo_url": None,
        "order": 2,
        "write_up": """
## Overview

A hybrid NLP system that combines two tasks on news text: summarizing articles, and picking out the named entities (people, places, organizations) inside them.

## Approach

I fine-tuned several transformer models in Python, including **DistilBART, DistilBERT, T5, and RoBERTa**, and compared how they performed on each task.

- **Summarization data:** the CNN dataset
- **Entity recognition data:** the CoNLL dataset

## Results

- **Named entity recognition:** 97.7% accuracy
- **Summarization:** 0.3742 F1
""",
    },
    {
        "slug": "presdorm",
        "title": "Presdorm",
        "summary": (
            "A dormitory management system for President University with admin and "
            "resident roles. Built by a team of four; I led the frontend. It led to a "
            "demo with the Dormitory Director."
        ),
        "tags": "PHP, MySQL, JavaScript",
        "repo_url": "https://github.com/Thoriqzulatsari/presdorm-update",
        "demo_url": None,
        "order": 3,
        "write_up": """
## Overview

Presdorm is a prototype dormitory management system for President University. It was our first-year final project, built by a team of four.

## Features

The system has two kinds of users: **admins**, who manage the dormitory, and **residents** (students).

## My role

I led the frontend: the pages and interface that admins and residents use.

## Outcome

The prototype was demoed to the Dormitory Director in a meeting. A rollout was planned, but it did not go ahead.

## Tech stack

PHP, JavaScript, and MySQL.
""",
    },
    {
        "slug": "trash-collecting-robot",
        "title": "Trash-Collecting Robot",
        "summary": (
            "An Arduino robot that finds, grabs, and disposes of small trash items, "
            "combining a custom acrylic robotic hand with a mobile chassis. It succeeded "
            "in 7 of 10 test trials."
        ),
        "tags": "Arduino, C++, Robotics",
        "repo_url": None,
        "demo_url": None,
        "order": 4,
        "write_up": """
## Overview

A robot that locates small pieces of trash, picks them up, and disposes of them. It pairs a custom **acrylic robotic hand** with a **mobile chassis**, all controlled by an Arduino Uno.

## Hardware

- The arm uses **4 servo motors**.
- The mobile base carries **2 types of sensors**.

## My role

This was a team of five. I programmed the movement of the robot hand in C++.

## Results

In 10 test trials, the robot completed the task successfully **7 times**.

## Tech stack

Arduino Uno and C++.
""",
    },
    {
        "slug": "the-gallows",
        "title": "The Gallows",
        "summary": (
            "A film-noir detective hangman game in vanilla JavaScript, with a custom Web "
            "Audio sound engine, difficulty and category selection, and live scoring. "
            "No frameworks, no libraries."
        ),
        "tags": "JavaScript, Web Audio",
        "repo_url": "https://github.com/HabilBoyyyyyy/Hangman_game",
        "demo_url": None,
        "order": 5,
        "write_up": """
## Overview

The Gallows is a hangman game dressed as a film-noir detective story.

## Features

- A custom sound engine built on the **Web Audio API**
- Difficulty and category selection
- A live scoring system
- Built with plain HTML, CSS, and JavaScript: no frameworks and no libraries
""",
    },
    {
        "slug": "techsprint-case-study",
        "title": "TechSprint Case Study",
        "summary": (
            "Wrote the UI/UX Design track case study and judging rubric for TechSprint, "
            "a multi-track competition under PUMA IS with 8 competing teams."
        ),
        "tags": "UI/UX, Case Study",
        "repo_url": None,
        "demo_url": None,
        "order": 6,
        "write_up": """
## Overview

TechSprint was a multi-track competition run under PUMA IS, with 8 competing teams.

## My contribution

I wrote the case study for the **UI/UX Design track** and the **judging rubric** used to score the teams.

[Read the case study (Google Docs)](https://docs.google.com/document/d/1h4S9jVMmSjjNXds7NpR170MXFPavk2YLTFNVXsalHcU/edit?usp=sharing)
""",
    },
]

# ---------------------------------------------------------------------------
# 2. IMAGES
#    Put screenshots in frontend/public/images/projects/ named after the slug:
#        the-gallows-1.webp, the-gallows-2.webp, trash-collecting-robot-1.webp ...
#    The script attaches any matching files it finds. Missing files are skipped.
# ---------------------------------------------------------------------------

HERE = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.normpath(os.path.join(HERE, "..", "frontend", "public"))
IMAGE_EXTS = (".webp", ".png", ".jpg", ".jpeg")


def find_local_images(slug):
    folder = os.path.join(PUBLIC_DIR, "images", "projects")
    if not os.path.isdir(folder):
        return []
    names = sorted(
        f for f in os.listdir(folder)
        if f.lower().startswith(slug + "-") and f.lower().endswith(IMAGE_EXTS)
    )
    return [f"/images/projects/{n}" for n in names]


# ---------------------------------------------------------------------------
# 3. LOADING
# ---------------------------------------------------------------------------

def clean(text):
    return text.strip() if isinstance(text, str) else text


def reset_content(db):
    answer = input(
        "This DELETES every skill, project, project image, certificate and timeline item "
        "(including anything you added in the admin).\nType RESET to continue: "
    )
    if answer.strip() != "RESET":
        print("Cancelled. Nothing was changed.")
        sys.exit(0)
    db.query(models.ProjectImage).delete()
    db.query(models.Project).delete()
    db.query(models.Skill).delete()
    db.query(models.Certificate).delete()
    db.query(models.TimelineItem).delete()
    db.commit()
    print("Old content deleted.")


def load_profile(db):
    profile = db.query(models.Profile).first()
    if profile is None:
        profile = models.Profile(**PROFILE)
        db.add(profile)
    else:
        for key, value in PROFILE.items():
            setattr(profile, key, value)


def load_skills(db):
    for item in SKILLS:
        skill = db.query(models.Skill).filter(models.Skill.name == item["name"]).first()
        if skill is None:
            skill = models.Skill(name=item["name"])
            db.add(skill)
        skill.category = item["category"]
        skill.progress = item["progress"]
        skill.description = item["description"]
        skill.order = item["order"]
        skill.visible = True


def load_certificates(db):
    for item in CERTIFICATES:
        cert = db.query(models.Certificate).filter(models.Certificate.name == item["name"]).first()
        if cert is None:
            cert = models.Certificate(name=item["name"])
            db.add(cert)
        cert.issuer = item["issuer"]
        cert.score = item["score"]
        cert.date = item["date"]


def load_timeline(db):
    for item in TIMELINE:
        row = (
            db.query(models.TimelineItem)
            .filter(models.TimelineItem.year == item["year"], models.TimelineItem.title == item["title"])
            .first()
        )
        if row is None:
            row = models.TimelineItem(year=item["year"], title=item["title"])
            db.add(row)
        row.description = item["description"]
        row.order = item["order"]


def load_projects(db):
    for item in PROJECTS:
        project = db.query(models.Project).filter(models.Project.slug == item["slug"]).first()
        if project is None:
            project = models.Project(slug=item["slug"], title=item["title"])
            db.add(project)
        project.title = item["title"]
        project.summary = item["summary"]
        project.write_up = clean(item["write_up"])
        project.tags = item["tags"]
        project.repo_url = item["repo_url"]
        project.demo_url = item["demo_url"]
        project.order = item["order"]
        project.visible = True
        db.flush()  # assigns project.id so images can point at it

        existing = {img.image_url for img in project.images}
        for position, url in enumerate(find_local_images(item["slug"]), start=1):
            if url not in existing:
                db.add(models.ProjectImage(project_id=project.id, image_url=url, order=position))
                print(f"  + image for {item['slug']}: {url}")


def main():
    db = SessionLocal()
    try:
        if "--reset" in sys.argv:
            reset_content(db)
        load_profile(db)
        load_skills(db)
        load_certificates(db)
        load_timeline(db)
        load_projects(db)
        db.commit()
        print(
            f"Done: profile, {len(SKILLS)} skills, {len(PROJECTS)} projects, "
            f"{len(CERTIFICATES)} certificates, {len(TIMELINE)} timeline items."
        )
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
