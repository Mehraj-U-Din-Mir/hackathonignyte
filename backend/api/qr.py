"""QR verification — check-in at event entrance."""
from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
from utils.supabase_client import get_supabase

router = APIRouter()

@router.get("/verify/{participant_id}")
async def verify_qr(participant_id: str):
    sb  = get_supabase()
    res = sb.table("registrations").select("*").eq("participant_id", participant_id.upper()).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Participant not found.")
    reg = res.data[0]
    if reg["status"] != "approved":
        return {"allowed": False, "reason": f"Registration is '{reg['status']}'. Entry not allowed.", "reg": {"name": reg["full_name"], "school": reg["school_name"]}}
    if reg.get("attended"):
        return {"allowed": False, "reason": f"Already checked in at {reg.get('attended_at','earlier')}", "reg": {"name": reg["full_name"], "school": reg["school_name"]}}
    now = datetime.now(timezone.utc).isoformat()
    sb.table("registrations").update({"attended": True, "attended_at": now}).eq("id", reg["id"]).execute()
    sb.table("audit_log").insert({"action":"CHECK_IN","table_name":"registrations","record_id":reg["id"],"details":{"participant_id":participant_id,"time":now}}).execute()
    return {"allowed": True, "message": f"Welcome, {reg['full_name']}! ✅", "reg": {"name":reg["full_name"],"school":reg["school_name"],"team":reg["team_name"],"class":reg["class"],"id":reg["participant_id"]}}

@router.get("/status/{participant_id}")
async def qr_status(participant_id: str):
    sb  = get_supabase()
    res = sb.table("registrations").select("participant_id,full_name,status,attended,attended_at").eq("participant_id", participant_id.upper()).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Not found")
    return res.data[0]
