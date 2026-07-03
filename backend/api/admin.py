"""Admin API — approve, reject, remind, stats, export."""
import os
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel, EmailStr
from utils.supabase_client import get_supabase
from utils.qr_generator    import generate_qr_and_upload
from emails.service import send_approval_email, send_rejection_email, send_reminder_email

router       = APIRouter()
ADMIN_SECRET = os.getenv("ADMIN_SECRET", "ignyte2026admin")

def auth(authorization: str | None):
    if authorization != f"Bearer {ADMIN_SECRET}":
        raise HTTPException(status_code=401, detail="Unauthorized")

class ApprovePayload(BaseModel):
    registration_id: str
    participant_id:  str
    email:           EmailStr
    full_name:       str
    team_name:       str = "Team"

class RejectPayload(BaseModel):
    registration_id: str
    email:           EmailStr
    full_name:       str
    notes:           str = ""

@router.post("/approve")
async def approve(payload: ApprovePayload, authorization: str | None = Header(None)):
    auth(authorization)
    sb = get_supabase()
    try:
        qr_url, qr_data = generate_qr_and_upload(payload.participant_id, sb)
    except Exception as e:
        print(f"[QR] {e}"); qr_url = ""; qr_data = payload.participant_id

    sb.table("registrations").update({
        "status": "approved", "qr_code_url": qr_url,
        "qr_code_data": qr_data, "approved_at": "now()",
    }).eq("id", payload.registration_id).execute()

    send_approval_email(payload.email, payload.full_name, payload.participant_id, qr_url, payload.team_name)

    sb.table("audit_log").insert({
        "action": "APPROVE", "table_name": "registrations",
        "record_id": payload.registration_id,
        "details": {"participant_id": payload.participant_id},
    }).execute()
    return {"success": True, "qr_url": qr_url}

@router.post("/reject")
async def reject(payload: RejectPayload, authorization: str | None = Header(None)):
    auth(authorization)
    sb = get_supabase()
    sb.table("registrations").update({
        "status": "rejected", "admin_notes": payload.notes,
    }).eq("id", payload.registration_id).execute()
    send_rejection_email(payload.email, payload.full_name, payload.notes)
    sb.table("audit_log").insert({
        "action": "REJECT", "table_name": "registrations",
        "record_id": payload.registration_id, "details": {"notes": payload.notes},
    }).execute()
    return {"success": True}

@router.post("/remind")
async def remind_all(authorization: str | None = Header(None)):
    auth(authorization)
    sb  = get_supabase()
    res = sb.table("registrations").select("email,full_name,participant_id").eq("status","approved").execute()
    sent = 0
    for r in res.data:
        try:
            send_reminder_email(r["email"], r["full_name"], r["participant_id"]); sent += 1
        except Exception as e:
            print(f"[Remind] {r['email']}: {e}")
    return {"success": True, "sent": sent}

@router.get("/stats")
async def stats(authorization: str | None = Header(None)):
    auth(authorization)
    sb  = get_supabase()
    res = sb.table("registrations").select("status,attended,school_name,project_submitted").execute()
    d   = res.data
    return {
        "total":    len(d),
        "pending":  sum(1 for r in d if r["status"]=="pending"),
        "approved": sum(1 for r in d if r["status"]=="approved"),
        "rejected": sum(1 for r in d if r["status"]=="rejected"),
        "attended": sum(1 for r in d if r.get("attended")),
        "projects": sum(1 for r in d if r.get("project_submitted")),
        "schools":  {s: sum(1 for r in d if r["school_name"]==s) for s in set(r["school_name"] for r in d)},
    }

@router.get("/export")
async def export_all(authorization: str | None = Header(None)):
    auth(authorization)
    sb  = get_supabase()
    res = sb.table("registrations").select("*").order("created_at", desc=False).execute()
    return {"data": res.data, "count": len(res.data)}
