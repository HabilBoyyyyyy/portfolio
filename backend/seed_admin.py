import argparse
from database import SessionLocal
from models import AdminUser
from auth import hash_password

def main():
    parser = argparse.ArgumentParser(description="Seed an admin user.")
    parser.add_argument("username", help="Admin username")
    parser.add_argument("password", help="Admin password")
    args = parser.parse_args()

    db = SessionLocal()
    try:
        existing = db.query(AdminUser).filter(AdminUser.username == args.username).first()
        if existing:
            print(f"User '{args.username}' already exists. Updating password...")
            existing.hashed_password = hash_password(args.password)
            db.commit()
            print("Password updated.")
        else:
            user = AdminUser(username=args.username, hashed_password=hash_password(args.password))
            db.add(user)
            db.commit()
            print(f"Admin user '{args.username}' created successfully.")
    finally:
        db.close()

if __name__ == "__main__":
    main()