import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers import public, admin, upload

app = FastAPI(title="Habil Portfolio API")

raw_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,https://portfolio-peach-alpha-6fjhsx26xs.vercel.app",
)
allowed_origins = [o.strip() for o in raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded files locally (dev fallback when Supabase isn't configured)
uploads_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

app.include_router(public.router)
app.include_router(admin.router)
app.include_router(upload.router)

@app.get("/")
def root():
    return {"status": "Backend is alive"}