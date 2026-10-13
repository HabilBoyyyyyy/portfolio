"""
Quick script to seed tech skills with devicon URLs.
Run:  python seed_skills.py
"""
from database import SessionLocal
from models import Skill

SKILLS = [
    # ── Languages ──
    {"name": "Python", "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", "category": "Languages", "order": 1},
    {"name": "JavaScript", "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", "category": "Languages", "order": 2},
    {"name": "TypeScript", "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", "category": "Languages", "order": 3},
    {"name": "C++", "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg", "category": "Languages", "order": 4},
    {"name": "PHP", "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg", "category": "Languages", "order": 5},
    {"name": "HTML", "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", "category": "Languages", "order": 6},
    {"name": "CSS", "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", "category": "Languages", "order": 7},

    # ── Frameworks ──
    {"name": "Next.js", "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", "category": "Frameworks", "order": 1},
    {"name": "React", "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", "category": "Frameworks", "order": 2},
    {"name": "FastAPI", "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg", "category": "Frameworks", "order": 3},
    {"name": "Tailwind CSS", "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg", "category": "Frameworks", "order": 4},
    {"name": "Node.js", "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", "category": "Frameworks", "order": 5},
    {"name": "PyTorch", "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg", "category": "Frameworks", "order": 6},

    # ── Tools & Platforms ──
    {"name": "Git", "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", "category": "Tools", "order": 1},
    {"name": "GitHub", "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", "category": "Tools", "order": 2},
    {"name": "Docker", "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", "category": "Tools", "order": 3},
    {"name": "PostgreSQL", "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", "category": "Tools", "order": 4},
    {"name": "MySQL", "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg", "category": "Tools", "order": 5},
    {"name": "VS Code", "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg", "category": "Tools", "order": 6},
    {"name": "Linux", "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg", "category": "Tools", "order": 7},
    {"name": "Figma", "icon_url": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg", "category": "Tools", "order": 8},
]


def main():
    db = SessionLocal()
    try:
        existing = db.query(Skill).count()
        if existing > 0:
            print(f"Already have {existing} skills. Skipping seed.")
            print("Delete existing skills first if you want to re-seed.")
            return

        for data in SKILLS:
            skill = Skill(
                name=data["name"],
                icon_url=data["icon_url"],
                category=data["category"],
                progress=80,
                order=data["order"],
                visible=True,
            )
            db.add(skill)

        db.commit()
        print(f"Seeded {len(SKILLS)} skills successfully!")
    finally:
        db.close()


if __name__ == "__main__":
    main()
