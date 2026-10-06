from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import public, admin

app = FastAPI(title="Habil Portfolio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # add your Vercel URL here later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(public.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {"status": "Backend is alive"}