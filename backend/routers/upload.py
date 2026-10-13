import os
import uuid
import httpx
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from auth import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["upload"])

SUPABASE_URL = os.getenv("SUPABASE_URL")          # e.g. https://xxx.supabase.co
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")   # service_role key
STORAGE_BUCKET = os.getenv("SUPABASE_BUCKET", "portfolio")

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "uploads")

ALLOWED_TYPES = {
    "image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf",
}
MAX_SIZE = 5 * 1024 * 1024  # 5 MB


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    admin: str = Depends(get_current_admin),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, f"File type '{file.content_type}' not allowed")

    contents = await file.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(400, "File too large (max 5 MB)")

    ext = os.path.splitext(file.filename or "file")[1].lower()
    if not ext:
        ext = ".bin"
    unique_name = f"{uuid.uuid4().hex}{ext}"

    if SUPABASE_URL and SUPABASE_KEY:
        url = await _upload_supabase(unique_name, contents, file.content_type)
    else:
        url = _upload_local(unique_name, contents)

    return {"url": url}


async def _upload_supabase(filename: str, data: bytes, content_type: str) -> str:
    """Upload to Supabase Storage and return the public URL."""
    upload_url = f"{SUPABASE_URL}/storage/v1/object/{STORAGE_BUCKET}/{filename}"
    headers = {
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": content_type,
        "x-upsert": "true",
    }
    async with httpx.AsyncClient() as client:
        resp = await client.post(upload_url, content=data, headers=headers, timeout=30)
    if resp.status_code not in (200, 201):
        raise HTTPException(502, f"Storage upload failed: {resp.text}")
    public_url = f"{SUPABASE_URL}/storage/v1/object/public/{STORAGE_BUCKET}/{filename}"
    return public_url


def _upload_local(filename: str, data: bytes) -> str:
    """Save file to local uploads/ dir (dev fallback)."""
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    path = os.path.join(UPLOAD_DIR, filename)
    with open(path, "wb") as f:
        f.write(data)
    return f"/uploads/{filename}"
