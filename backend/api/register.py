"""Registration API — confirmation email trigger."""
from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel, EmailStr
from emails.service import send_registration_received

router = APIRouter()

class ConfirmPayload(BaseModel):
    participant_id: str
    email:          EmailStr
    full_name:      str
    team_name:      str = "Your Team"

class CheckPayload(BaseModel):
    email: EmailStr

@router.post("/confirm")
async def confirm_registration(payload: ConfirmPayload, bg: BackgroundTasks):
    """Called by frontend after Supabase insert — sends confirmation email."""
    bg.add_task(send_registration_received, payload.email, payload.full_name, payload.participant_id, payload.team_name)
    return {"success": True, "message": "Confirmation email queued."}

@router.post("/check")
async def check_email(payload: CheckPayload):
    """Check if email is already registered."""
    from utils.supabase_client import get_supabase
    sb  = get_supabase()
    res = sb.table("registrations").select("id").eq("email", payload.email).execute()
    return {"registered": len(res.data) > 0}
