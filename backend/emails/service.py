"""Email service — uses Resend API with SMTP fallback."""
import os, resend, smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

resend.api_key  = os.getenv("RESEND_API_KEY", "")
EMAIL_FROM      = os.getenv("EMAIL_FROM",     "noreply@ignyte2026.com")
EMAIL_REPLY     = os.getenv("EMAIL_REPLY_TO", "ignyte2026@gmail.com")
FRONTEND_URL    = os.getenv("FRONTEND_URL",   "https://ignyte2026.vercel.app")

# ── Base HTML wrapper ──────────────────────────────────────────
def _base(content: str) -> str:
    return f"""<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<style>
body{{margin:0;background:#020408;font-family:'Segoe UI',sans-serif;color:#f0f6ff}}
.w{{max-width:600px;margin:0 auto;padding:40px 20px}}
.logo{{font-size:26px;font-weight:900;color:#00c3ff;margin-bottom:6px}}
.card{{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:20px;padding:32px;margin:20px 0}}
.btn{{display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#00c3ff,#8b5cf6);color:#fff!important;text-decoration:none;border-radius:12px;font-weight:700;font-size:15px;margin:16px 0}}
.tag{{display:inline-block;background:rgba(6,255,216,.1);border:1px solid rgba(6,255,216,.2);padding:4px 14px;border-radius:50px;font-size:12px;color:#06ffd8;font-family:monospace;margin-bottom:14px}}
.field{{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:12px 16px;margin:8px 0}}
.fl{{font-size:10px;color:#8899bb;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px}}
.fv{{font-weight:600;font-size:15px}}
.footer{{text-align:center;color:#8899bb;font-size:12px;margin-top:28px;padding-top:20px;border-top:1px solid rgba(255,255,255,.06)}}
</style></head><body>
<div class="w">
  <div class="logo">⬡ ignyte 2026</div>
  <div style="font-size:13px;color:#8899bb;margin-bottom:20px">Future Innovators Hackathon</div>
  {content}
  <div class="footer">© 2026 ignyte ·
    <a href="mailto:{EMAIL_REPLY}" style="color:#00c3ff;text-decoration:none">{EMAIL_REPLY}</a>
  </div>
</div></body></html>"""

# ── Templates ──────────────────────────────────────────────────
def tpl_received(name, pid, team):
    return _base(f"""<div class="card">
  <div class="tag">REGISTRATION RECEIVED</div>
  <h2 style="font-size:22px;margin:0 0 8px">Hey {name}! 🎉</h2>
  <p style="color:#8899bb;line-height:1.7">Your ignyte 2026 registration is <strong style="color:#ffd700">pending admin review</strong>.</p>
  <div class="field"><div class="fl">Participant ID</div><div class="fv" style="color:#06ffd8;font-family:monospace">{pid}</div></div>
  <div class="field"><div class="fl">Team</div><div class="fv">{team}</div></div>
  <p style="color:#8899bb;margin-top:14px;font-size:14px">You will receive your <strong style="color:#f0f6ff">QR Code</strong> within <strong style="color:#00c3ff">24 hours</strong> after approval.</p>
</div>""")

def tpl_approved(name, pid, qr_url, team):
    return _base(f"""<div class="card">
  <div class="tag" style="background:rgba(0,230,118,.1);border-color:rgba(0,230,118,.2);color:#00e676">✅ APPROVED</div>
  <h2 style="font-size:22px;margin:0 0 8px">You're In, {name}! 🚀</h2>
  <p style="color:#8899bb;line-height:1.7">Your registration is <strong style="color:#00e676">approved</strong>. Welcome to ignyte 2026!</p>
  <div class="field"><div class="fl">Participant ID</div><div class="fv" style="color:#06ffd8;font-family:monospace">{pid}</div></div>
  <div class="field"><div class="fl">Team</div><div class="fv">{team}</div></div>
  <div style="text-align:center;margin:20px 0">
    {"<img src='"+qr_url+"' alt='QR' style='width:160px;height:160px;border-radius:12px'/>" if qr_url else ""}
    <p style="color:#8899bb;font-size:12px;margin-top:8px">Show this QR at the event entrance</p>
  </div>
  <a href="{FRONTEND_URL}/submit" class="btn">Submit Your Project →</a>
</div>
<div style="background:rgba(255,215,0,.05);border:1px solid rgba(255,215,0,.15);border-radius:14px;padding:16px;text-align:center;margin-top:12px">
  <div style="font-weight:700;font-size:16px">August 20–21, 2026</div>
  <div style="color:#8899bb;font-size:13px;margin-top:4px">Arrive 30 mins early · Bring your QR code</div>
</div>""")

def tpl_rejected(name, reason):
    return _base(f"""<div class="card">
  <div class="tag" style="background:rgba(255,45,120,.1);border-color:rgba(255,45,120,.2);color:#ff2d78">REGISTRATION UPDATE</div>
  <h2 style="font-size:22px;margin:0 0 8px">Hi {name},</h2>
  <p style="color:#8899bb;line-height:1.7">Unfortunately your ignyte 2026 registration could not be approved at this time.</p>
  {"<div class='field'><div class='fl'>Reason</div><div class='fv' style='color:#ff2d78'>"+reason+"</div></div>" if reason else ""}
  <p style="color:#8899bb;margin-top:14px;font-size:14px">Contact us at <a href="mailto:{EMAIL_REPLY}" style="color:#00c3ff">{EMAIL_REPLY}</a> if you think this is an error.</p>
</div>""")

def tpl_reminder(name, pid):
    return _base(f"""<div class="card">
  <div class="tag">⏰ EVENT REMINDER</div>
  <h2 style="font-size:22px;margin:0 0 8px">Tomorrow is the day, {name}!</h2>
  <p style="color:#8899bb;line-height:1.7">ignyte 2026 starts <strong style="color:#00c3ff">tomorrow at 9:00 AM</strong>. Don't forget your QR code!</p>
  <div class="field"><div class="fl">Your Participant ID</div><div class="fv" style="color:#06ffd8;font-family:monospace">{pid}</div></div>
  <div style="background:rgba(0,195,255,.05);border:1px solid rgba(0,195,255,.15);border-radius:12px;padding:16px;margin-top:16px">
    <div style="font-weight:600;margin-bottom:8px">📋 What to bring</div>
    <ul style="color:#8899bb;font-size:13px;padding-left:18px;line-height:2">
      <li>This QR Code (printed or phone)</li><li>Laptop (if available)</li>
      <li>School ID</li><li>Charger and power adapter</li>
    </ul>
  </div>
</div>""")

# ── Senders ────────────────────────────────────────────────────
def _resend(to, subject, html):
    try:
        resend.Emails.send({"from": EMAIL_FROM, "to": [to], "subject": subject, "html": html, "reply_to": EMAIL_REPLY})
        return True
    except Exception as e:
        print(f"[Resend] {e}"); return False

def _smtp(to, subject, html):
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"]    = os.getenv("SMTP_USER", EMAIL_FROM)
        msg["To"]      = to
        msg.attach(MIMEText(html, "html"))
        with smtplib.SMTP(os.getenv("SMTP_HOST","smtp.gmail.com"), int(os.getenv("SMTP_PORT","587"))) as s:
            s.starttls()
            s.login(os.getenv("SMTP_USER",""), os.getenv("SMTP_PASS",""))
            s.sendmail(msg["From"], [to], msg.as_string())
        return True
    except Exception as e:
        print(f"[SMTP] {e}"); return False

def send_email(to, subject, html):
    return _resend(to, subject, html) if os.getenv("RESEND_API_KEY") else _smtp(to, subject, html)

# ── Public helpers ─────────────────────────────────────────────
def send_registration_received(to, name, pid, team):
    return send_email(to, "✅ ignyte 2026 – Registration Received!", tpl_received(name, pid, team))

def send_approval_email(to, name, pid, qr_url, team):
    return send_email(to, "🚀 ignyte 2026 – Approved! Here's Your QR Code", tpl_approved(name, pid, qr_url, team))

def send_rejection_email(to, name, reason=""):
    return send_email(to, "ignyte 2026 – Registration Update", tpl_rejected(name, reason))

def send_reminder_email(to, name, pid):
    return send_email(to, "⏰ ignyte 2026 Starts Tomorrow!", tpl_reminder(name, pid))
