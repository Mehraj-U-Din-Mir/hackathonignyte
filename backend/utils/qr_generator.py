"""QR Code generator — creates styled PNG and uploads to Supabase Storage."""
import qrcode
import qrcode.constants
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer
from io import BytesIO
import base64
import os

FRONTEND_URL = os.getenv("FRONTEND_URL", "https://ignyte2026.vercel.app")

def generate_qr_base64(participant_id: str) -> tuple[str, str]:
    qr_data = f"{FRONTEND_URL}/verify/{participant_id}"
    qr = qrcode.QRCode(
        version=3,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(qr_data)
    qr.make(fit=True)
    img = qr.make_image(
        image_factory=StyledPilImage,
        module_drawer=RoundedModuleDrawer(),
        back_color=(2, 4, 8),
        fill_color=(6, 255, 216),
    )
    buf = BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    b64 = base64.b64encode(buf.read()).decode("utf-8")
    return b64, qr_data

def generate_qr_and_upload(participant_id: str, supabase_client) -> tuple[str, str]:
    b64, qr_data = generate_qr_base64(participant_id)
    png_bytes = base64.b64decode(b64)
    filename  = f"{participant_id}.png"
    supabase_client.storage.from_("qr-codes").upload(
        path=filename,
        file=png_bytes,
        file_options={"content-type": "image/png", "upsert": "true"},
    )
    public_url = supabase_client.storage.from_("qr-codes").get_public_url(filename)
    return public_url, qr_data
