'use client'

import { useState, useRef, useEffect } from 'react'
import { supabase, uploadFile } from '@/lib/supabase'
const FIELDS = [
  { name: 'full_name', label: 'Full Name *', type: 'text', placeholder: 'Your full name' },
  { name: 'parentage', label: 'Parentage *', type: 'text', placeholder: 'Father / Mother name' },
  { name: 'school_name', label: 'School Name *', type: 'text', placeholder: 'Your school name' },
  { name: 'city', label: 'City *', type: 'text', placeholder: 'Your city' },
  { name: 'contact_number', label: 'Contact Number *', type: 'tel', placeholder: '+91 XXXXX XXXXX' },
  { name: 'email', label: 'Email Address *', type: 'email', placeholder: 'you@email.com' },
  { name: 'team_name', label: 'Team Name *', type: 'text', placeholder: 'Your team name' },
  { name: 'upi_transaction_id', label: 'UPI Transaction ID *', type: 'text', placeholder: 'Transaction ID after payment' },
]

const INIT = { full_name: '', parentage: '', class: '', school_name: '', city: '', contact_number: '', email: '', team_name: '', team_members: '', skills: '', laptop_available: 'yes', upi_transaction_id: '' }

const STEPS = [
  { n: 1, h: 'Fill the Form', p: 'Complete all required fields including team information' },
  { n: 2, h: 'Pay ₹500 via UPI', p: 'Transfer fee to ignyte2026@upi and upload screenshot' },
  { n: 3, h: 'Admin Review', p: 'Our team reviews your registration within 24 hours' },
  { n: 4, h: 'Get QR Code', p: 'Receive your participant ID and QR code via email' },
]

export default function Registration() {
  const [form, setForm] = useState({ ...INIT })
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [popupVisible, setPopupVisible] = useState(false)
  const [pid, setPid] = useState('')
  const [visible, setVisible] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect() } }, { threshold: 0.04 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  // Trigger the popup entrance animation on the next frame after it mounts
  useEffect(() => {
    if (showPopup) {
      const t = setTimeout(() => setPopupVisible(true), 20)
      return () => clearTimeout(t)
    } else {
      setPopupVisible(false)
    }
  }, [showPopup])

  // Lock page scroll while popup is open
  useEffect(() => {
    if (showPopup) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }
  }, [showPopup])

  // Close popup on Escape
  useEffect(() => {
    if (!showPopup) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closePopup() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showPopup])

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const validate = () => {
    const req = ['full_name', 'parentage', 'class', 'school_name', 'city', 'contact_number', 'email', 'team_name', 'team_members', 'upi_transaction_id']
    for (const f of req) if (!(form as any)[f]?.trim()) return `${f.replace(/_/g, ' ')} is required`
    if (!file) return 'Payment screenshot is required'
    const members = form.team_members.split(',').filter(m => m.trim())
    if (members.length < 2 || members.length > 4) return 'Team must have 2–4 members (comma-separated)'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Invalid email address'
    return null
  }
const generatePid = () => 'BF26-' + Math.floor(1000 + Math.random() * 9000)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  const err = validate()
  if (err) { alert('❌ ' + err); return }
  setLoading(true)

  try {
    // 1. Check for duplicate email
    const { data: existing } = await supabase
      .from('registrations')
      .select('id')
      .eq('email', form.email)
      .maybeSingle()

    if (existing) {
      alert('❌ This email is already registered.')
      setLoading(false)
      return
    }

    const newPid = generatePid()

    // 2. Upload payment screenshot to Supabase Storage
    let screenshotUrl = ''
    if (file) {
      screenshotUrl = await uploadFile('payment-screenshots', `${newPid}-${file.name}`, file)
    }

    // 3. Insert registration row
    const { error } = await supabase.from('registrations').insert({
      participant_id: newPid,
      full_name: form.full_name,
      parentage: form.parentage,
      class: form.class,
      school_name: form.school_name,
      city: form.city,
      contact_number: form.contact_number,
      email: form.email,
      team_name: form.team_name,
      team_members: form.team_members.split(',').map(m => m.trim()).filter(Boolean),
      skills: form.skills,
      laptop_available: form.laptop_available === 'yes',
      upi_transaction_id: form.upi_transaction_id,
      payment_screenshot_url: screenshotUrl,
      status: 'pending',
    })

    if (error) throw error

    setPid(newPid)
    setSuccess(true)
  } catch (err: any) {
    alert('❌ Registration failed: ' + (err.message || 'Please try again.'))
  } finally {
    setLoading(false)
  }
}
  const closePopup = () => {
    setPopupVisible(false)
    // wait for exit animation before unmounting and revealing the success section
    setTimeout(() => {
      setShowPopup(false)
      setSuccess(true)
    }, 220)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else setDragActive(false)
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false)
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0])
  }

  const SuccessPopup = () => (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reg-success-title"
      onClick={(e) => { if (e.target === e.currentTarget) closePopup() }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: popupVisible ? 'rgba(10,7,4,0.72)' : 'rgba(10,7,4,0)',
        backdropFilter: popupVisible ? 'blur(6px)' : 'blur(0px)',
        WebkitBackdropFilter: popupVisible ? 'blur(6px)' : 'blur(0px)',
        transition: 'background 0.28s ease, backdrop-filter 0.28s ease',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 460,
          background: 'linear-gradient(180deg, rgba(32,25,18,0.98), rgba(20,15,10,0.98))',
          border: '1px solid rgba(245,196,81,0.18)',
          borderRadius: 26,
          padding: '2.75rem 2.25rem 2.25rem',
          textAlign: 'center',
          boxShadow: popupVisible
            ? '0 24px 70px rgba(0,0,0,0.55), 0 0 0 1px rgba(224,136,64,0.06), 0 0 60px rgba(224,136,64,0.08)'
            : '0 0 0 rgba(0,0,0,0)',
          opacity: popupVisible ? 1 : 0,
          transform: popupVisible ? 'translateY(0) scale(1)' : 'translateY(18px) scale(0.94)',
          transition: 'opacity 0.32s cubic-bezier(0.16,1,0.3,1), transform 0.32s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <button
          onClick={closePopup}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
            color: '#a89888',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div
          style={{
            width: 74,
            height: 74,
            margin: '0 auto 1.5rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(224,136,64,0.16), rgba(245,196,81,0.1))',
            border: '1px solid rgba(245,196,81,0.28)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: popupVisible ? 'scale(1)' : 'scale(0.5)',
            transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.08s',
          }}
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#f5c451" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h3 id="reg-success-title" style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.6rem', color: '#f5ede0', lineHeight: 1.15 }}>
          Registration Successful!
        </h3>
        <p style={{ color: '#a89888', fontSize: 13.5, lineHeight: 1.7, marginBottom: '1.75rem', maxWidth: 360, marginLeft: 'auto', marginRight: 'auto' }}>
          Your submission is <strong style={{ color: '#f5c451' }}>pending admin approval</strong>. You'll receive your QR Code and Participant ID by email within 24 hours.
        </p>

        <div style={{ background: 'rgba(224,136,64,0.05)', border: '1px solid rgba(224,136,64,0.14)', borderRadius: 16, padding: '1.1rem 1.25rem', marginBottom: '1.75rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, color: '#7a6f60', letterSpacing: 2.2, marginBottom: 8, textTransform: 'uppercase' }}>Participant ID</div>
          <div style={{ fontFamily: "'consolas',monospace", fontSize: '1.6rem', fontWeight: 800, color: '#f5c451', letterSpacing: '1.5px' }}>{pid}</div>
        </div>

        <button
          onClick={closePopup}
          className="btn-primary"
          style={{ width: '100%', padding: 14, fontSize: 14.5, justifyContent: 'center' }}
        >
          Continue
        </button>
      </div>
    </div>
  )

  if (success) return (
    <section id="register" style={{ padding: '6rem 2rem' }}>
      <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '4.5rem', marginBottom: '1.25rem', animation: 'float 3s ease-in-out infinite' }}>🎉</div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.9rem', lineHeight: 1.1 }} className="grad-text">You're Registered!</h2>
        <p style={{ color: '#a89888', fontSize: 14, lineHeight: 1.75, marginBottom: '2rem' }}>
          Your registration is <strong style={{ color: '#f5c451' }}>pending admin approval</strong>.<br />
          You'll receive your QR Code and Participant ID once approved.
        </p>
        <div style={{ background: 'rgba(224,136,64,0.04)', border: '1px solid rgba(224,136,64,0.12)', borderRadius: 18, padding: '1.75rem', marginBottom: '1.75rem' }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#7a6f60', letterSpacing: 2.5, marginBottom: 10, textTransform: 'uppercase' }}>Your Participant ID</div>
          <div style={{ fontFamily: "'consolas',monospace", fontSize: '2.2rem', fontWeight: 800, color: '#f5c451', letterSpacing: '2px' }}>{pid}</div>
          <div style={{ fontSize: 11, color: '#7a6f60', marginTop: 10 }}>Save this ID. Use it to submit your project at the event.</div>
        </div>
        <a href="/submit" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          Submit Your Project
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </a>
      </div>
    </section>
  )

  return (
    <section id="register" ref={ref} style={{ padding: '6rem 2rem', position: 'relative' }}>
      {showPopup && <SuccessPopup />}
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)' }}>
          <div className="section-label">secure registration</div>
          <h2 className="section-title">Join <span className="grad-text">ignyte 2026</span></h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '3.5rem', alignItems: 'start' }} className="registration-grid">
          {/* Steps */}
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-24px)', transition: 'all 0.75s cubic-bezier(0.16,1,0.3,1) 0.15s' }}>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '1.75rem', color: '#f5ede0' }}>How It Works</h3>
            {STEPS.map((s, i) => (
              <div key={s.n} style={{ display: 'flex', gap: '1rem', marginBottom: '1.6rem', alignItems: 'flex-start', opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(-16px)', transition: `all 0.55s cubic-bezier(0.16,1,0.3,1) ${0.28 + i * 0.08}s` }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg,#e08840,#b8451c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0, color: '#fff' }}>{s.n}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3, color: '#f5ede0' }}>{s.h}</div>
                  <div style={{ fontSize: 12, color: '#7a6f60', lineHeight: 1.55 }}>{s.p}</div>
                </div>
              </div>
            ))}
            <div style={{ background: 'rgba(224,136,64,0.04)', border: '1px solid rgba(224,136,64,0.12)', borderRadius: 18, padding: '1.6rem', marginTop: '1.25rem', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.55s cubic-bezier(0.16,1,0.3,1) 0.65s' }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#f5c451', letterSpacing: 2.5, marginBottom: '0.7rem', textTransform: 'uppercase' }}>UPI Payment</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f5ede0', marginBottom: 3, lineHeight: 1.45 }}>6005459096@ptyes or meermehraj25@okaxis</div>
              <div style={{ fontSize: 12, color: '#7a6f60', marginTop: 5 }}>₹500 per student · Screenshot required</div>
              <img src="C:\Users\Mehraj\Downloads\bytefest2026-optimized\bytefest2026-main\bytefest2026-main\frontend\assets\pay.jpeg" alt="" />
            </div>
          </div>

          {/* Form */}
          <div style={{ background: 'rgba(28,22,16,0.9)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, padding: '2.5rem', opacity: visible ? 1 : 0, transform: visible ? 'translateX(0)' : 'translateX(24px)', transition: 'all 0.75s cubic-bezier(0.16,1,0.3,1) 0.22s' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.75rem', color: '#f5ede0' }}>Registration Form</div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }} className="form-row">
                {FIELDS.map(f => (
                  <div key={f.name} style={{ marginBottom: '0.6rem' }}>
                    <label style={{ display: 'block', fontSize: 10, color: '#7a6f60', marginBottom: '0.4rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.4px', textTransform: 'uppercase' }}>{f.label}</label>
                    <input name={f.name} type={f.type} placeholder={f.placeholder} value={(form as any)[f.name]} onChange={set} className="form-input" />
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '0.85rem', marginTop: '0.4rem' }}>
                <label style={{ display: 'block', fontSize: 10, color: '#7a6f60', marginBottom: '0.4rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.4px', textTransform: 'uppercase' }}>Class *</label>
                <select name="class" value={form.class} onChange={set} className="form-input">
                  <option value="">Select Class</option>
                  {['6','7','8','9','10','11','12'].map(c => <option key={c} value={c}>Class {c}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: 10, color: '#7a6f60', marginBottom: '0.4rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.4px', textTransform: 'uppercase' }}>Team Members * (comma-separated, 2–4 names)</label>
                <input name="team_members" type="text" placeholder="Name 1, Name 2, Name 3, Name 4" value={form.team_members} onChange={set} className="form-input" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }} className="form-row">
                <div>
                  <label style={{ display: 'block', fontSize: 10, color: '#7a6f60', marginBottom: '0.4rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.4px', textTransform: 'uppercase' }}>Laptop Available?</label>
                  <select name="laptop_available" value={form.laptop_available} onChange={set} className="form-input">
                    <option value="yes">Yes — bringing my own</option>
                    {/* <option value="no">No — will need one</option> */}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 10, color: '#7a6f60', marginBottom: '0.4rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.4px', textTransform: 'uppercase' }}>Skills (optional)</label>
                  <input name="skills" type="text" placeholder="Python, Design, etc." value={form.skills} onChange={set} className="form-input" />
                </div>
              </div>

              {/* Payment screenshot */}
              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'block', fontSize: 10, color: '#7a6f60', marginBottom: '0.4rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '0.4px', textTransform: 'uppercase' }}>Payment Screenshot *</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                  style={{ border: `2px dashed ${dragActive ? 'rgba(224,136,64,0.5)' : file ? 'rgba(245,196,81,0.38)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, padding: '1.6rem', textAlign: 'center', cursor: 'pointer', color: file ? '#f5c451' : dragActive ? '#e08840' : '#7a6f60', fontSize: 13, transition: 'all .25s ease', background: dragActive ? 'rgba(224,136,64,0.04)' : file ? 'rgba(245,196,81,0.02)' : 'rgba(255,255,255,0.01)' }}
                >
                  {file ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                      {file.name}
                    </div>
                  ) : (
                    <div>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 6px', display: 'block', opacity: 0.45 }}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      Click to upload or drag &amp; drop<br />
                      <span style={{ fontSize: 11, opacity: 0.55 }}>JPG, PNG (max 5MB)</span>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setFile(e.target.files?.[0] || null)} />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: 16, fontSize: 15, justifyContent: 'center' }}>
                {loading
                  ? <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin-slow 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>Submitting…</>
                  : <>Submit Registration<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></>
                }
              </button>
              <p style={{ fontSize: 10, color: '#5a4f44', textAlign: 'center', marginTop: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                Secure · Admin-verified · QR code sent within 24 hours
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}