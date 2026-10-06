from database import SessionLocal
from models import AdminUser
from auth import hash_password

db = SessionLocal()
username = input("Choose admin username: ")
password = input("Choose admin password: ")

existing = db.query(AdminUser).filter(AdminUser.username == username).first()
if existing:
    print("That username already exists.")
else:
    admin = AdminUser(username=username, hashed_password=hash_password(password))
    db.add(admin)
    db.commit()
    print("Admin user created.")

db.close()