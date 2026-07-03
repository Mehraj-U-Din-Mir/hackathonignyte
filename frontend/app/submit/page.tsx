'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { supabase, submitProject, uploadFile, getRegistrationByParticipantId, formatDate } from '@/lib/supabase'

type Step = 'verify' | 'form' | 'success'

export default function SubmitPage() {
  const [step,        setStep]        = useState<Step>('verify')
  const [pidInput,    setPidInput]    = useState('')
  const [verifying,   setVerifying]   = useState(false)
  const [verifyError, setVerifyError] = useState('')
  const [reg,         setReg]         = useState<any>(null)

  // Form state
  const [title,       setTitle]       = useState('')
  const [description, setDescription] = useState('')
  const [url,         setUrl]         = useState('')
  const [file,        setFile]        = useState<File|null>(null)
  const [submitting,  setSubmitting]  = useState(false)
  const [submitError, setSubmitError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  // Step 1: Verify participant ID
  const handleVerify = async () => {
    if (!pidInput.trim()) { setVerifyError('Please enter your Participant ID'); return }
    setVerifying(true)
    setVerifyError('')
    const data = await getRegistrationByParticipantId(pidInput.trim().toUpperCase())
    setVerifying(false)
    if (!data) {
      setVerifyError('Participant ID not found. Please check and try again.')
      return
    }
    if (data.status !== 'approved') {
      setVerifyError(`Your registration is "${data.status}". Only approved participants can submit projects.`)
      return
    }
    if (data.project_submitted) {
      setReg(data)
      setTitle(data.project_title || '')
      setDescription(data.project_description || '')
      setUrl(data.project_url || '')
      setStep('success')
      return
    }
    setReg(data)
    setStep('form')
  }

  // Step 2: Submit project
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim())       { setSubmitError('Project title is required'); return }
    if (!description.trim()) { setSubmitError('Project description is required'); return }
    setSubmitting(true)
    setSubmitError('')
    try {
      let fileUrl = ''
      if (file) {
        const ext  = file.name.split('.').pop()
        const path = `projects/${reg.participant_id}-${Date.now()}.${ext}`
        fileUrl    = await uploadFile('project-files', path, file)
      }
      const result = await submitProject(reg.participant_id, {
        project_title:       title.trim(),
        project_description: description.trim(),
        project_url:         url.trim(),
        project_file_url:    fileUrl,
      })
      if (!result.success) throw new Error(result.error)
      setStep('success')
    } catch (err: any) {
      setSubmitError(err.message || 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const S = {
    page:  { minHeight:'100vh', background:'#1a1410', color:'#f5ede0', fontFamily:'Space Grotesk,sans-serif' },
    wrap:  { maxWidth:680, margin:'0 auto', padding:'6rem 2rem 4rem' },
    input: { width:'100%', background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', borderRadius:10, padding:'12px 14px', color:'#f5ede0', fontFamily:'Space Grotesk,sans-serif', fontSize:14, outline:'none', transition:'border-color .2s', boxSizing:'border-box' as const },
    label: { display:'block', fontSize:11, color:'#a89888', marginBottom:'.5rem', fontFamily:'JetBrains Mono,monospace', letterSpacing:'.5px' } as React.CSSProperties,
    card:  { background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:24, padding:'2.5rem' },
  }

  return (
    <div style={S.page}>
      {/* Background */}
      <div style={{ position:'fixed', inset:0, backgroundImage:'linear-gradient(rgba(224, 136, 64, .025) 1px,transparent 1px),linear-gradient(90deg,rgba(224, 136, 64, .025) 1px,transparent 1px)', backgroundSize:'60px 60px', pointerEvents:'none', zIndex:0 }}/>
      <div style={{ position:'fixed', top:-150, left:-150, width:500, height:500, borderRadius:'50%', filter:'blur(120px)', background:'radial-gradient(circle,rgba(224, 136, 64, .1),transparent 70%)', pointerEvents:'none', zIndex:0 }}/>

      <div style={{ position:'relative', zIndex:1 }}>
        {/* Nav */}
        <nav style={{ position:'fixed', top:0, left:0, width:'100%', zIndex:100, padding:'1.2rem 2rem', background:'rgba(26, 20, 16, .8)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <Link href="/" style={{ fontFamily:'Syne,sans-serif', fontSize:'1.1rem', fontWeight:800, background:'linear-gradient(135deg,#e08840,#f5c451)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', textDecoration:'none' }}>⬡ ignyte 2026</Link>
          <Link href="/" style={{ color:'#a89888', textDecoration:'none', fontSize:13 }}>← Back to Home</Link>
        </nav>

        <div style={S.wrap}>
          {/* Header */}
          <div style={{ textAlign:'center', marginBottom:'3rem' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(245, 196, 81, .08)', border:'1px solid rgba(245, 196, 81, .2)', borderRadius:50, padding:'7px 18px', fontSize:12, fontFamily:'JetBrains Mono,monospace', color:'#f5c451', marginBottom:'1.5rem' }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#f5c451', display:'inline-block' }}/>
              PROJECT SUBMISSION PORTAL
            </div>
            <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:'clamp(2rem,5vw,3rem)', fontWeight:800, lineHeight:1.1, marginBottom:'.8rem' }}>
              Submit Your <span style={{ background:'linear-gradient(135deg,#e08840,#b8451c,#f5c451)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Project</span>
            </h1>
            <p style={{ color:'#a89888', fontSize:15, lineHeight:1.6 }}>
              Upload your hackathon project for evaluation by the judges.
            </p>
          </div>

          {/* Progress steps */}
          <div style={{ display:'flex', justifyContent:'center', gap:'1rem', marginBottom:'3rem', alignItems:'center' }}>
            {[{n:1,l:'Verify ID'},{n:2,l:'Submit Project'},{n:3,l:'Confirmed'}].map((s,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:32, height:32, borderRadius:'50%', background: (step==='verify'&&s.n===1)||(step==='form'&&s.n===2)||(step==='success'&&s.n===3) ? 'linear-gradient(135deg,#e08840,#b8451c)' : step==='form'&&s.n===1 ? 'rgba(74, 155, 142, .2)' : step==='success'&&s.n<=2 ? 'rgba(74, 155, 142, .2)' : 'rgba(255,255,255,.08)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color: step==='success'&&s.n<=2 ? '#4a9b8e' : '#fff' }}>
                    {(step==='form'&&s.n===1)||(step==='success'&&s.n<=2) ? '✓' : s.n}
                  </div>
                  <span style={{ fontSize:13, color: (step==='verify'&&s.n===1)||(step==='form'&&s.n===2)||(step==='success'&&s.n===3) ? '#f5ede0' : '#a89888', fontWeight: (step==='verify'&&s.n===1)||(step==='form'&&s.n===2)||(step==='success'&&s.n===3) ? 600 : 400 }}>{s.l}</span>
                </div>
                {i < 2 && <div style={{ width:30, height:1, background:'rgba(255,255,255,.1)' }}/>}
              </div>
            ))}
          </div>

          {/* ── STEP 1: VERIFY ── */}
          {step === 'verify' && (
            <div style={S.card}>
              <div style={{ textAlign:'center', marginBottom:'2rem' }}>
                <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🔍</div>
                <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.5rem', fontWeight:700, marginBottom:'.5rem' }}>Verify Your Identity</h2>
                <p style={{ color:'#a89888', fontSize:13, lineHeight:1.6 }}>
                  Enter your Participant ID (e.g. <span style={{ fontFamily:'JetBrains Mono,monospace', color:'#f5c451' }}>BF26-0001</span>) received in your approval email.
                </p>
              </div>
              <label style={S.label}>PARTICIPANT ID *</label>
              <input
                value={pidInput}
                onChange={e => { setPidInput(e.target.value.toUpperCase()); setVerifyError('') }}
                onKeyDown={e => e.key === 'Enter' && handleVerify()}
                placeholder="BF26-0001"
                style={{ ...S.input, textAlign:'center', fontSize:18, fontFamily:'JetBrains Mono,monospace', letterSpacing:3, marginBottom:'1rem' }}
              />
              {verifyError && <p style={{ color:'#f5a623', fontSize:13, marginBottom:'1rem', textAlign:'center' }}>❌ {verifyError}</p>}
              <button onClick={handleVerify} disabled={verifying}
                style={{ width:'100%', padding:15, borderRadius:12, border:'none', background:'linear-gradient(135deg,#e08840,#b8451c)', color:'#fff', fontFamily:'Syne,sans-serif', fontSize:15, fontWeight:700, cursor: verifying ? 'not-allowed':'pointer', opacity: verifying ? .7 : 1 }}>
                {verifying ? '⏳ Verifying...' : 'Verify & Continue →'}
              </button>
              <p style={{ fontSize:12, color:'#a89888', textAlign:'center', marginTop:'1rem' }}>
                Don't have an ID? <Link href="/#register" style={{ color:'#e08840' }}>Register first →</Link>
              </p>
            </div>
          )}

          {/* ── STEP 2: SUBMIT FORM ── */}
          {step === 'form' && reg && (
            <div>
              {/* Participant info */}
              <div style={{ background:'rgba(224, 136, 64, .05)', border:'1px solid rgba(224, 136, 64, .15)', borderRadius:16, padding:'1.2rem 1.5rem', marginBottom:'2rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'.5rem' }}>
                <div>
                  <div style={{ fontWeight:600, fontSize:15 }}>{reg.full_name}</div>
                  <div style={{ fontSize:13, color:'#a89888' }}>{reg.school_name} · Team: {reg.team_name}</div>
                </div>
                <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:13, color:'#f5c451' }}>{reg.participant_id}</div>
              </div>

              <div style={S.card}>
                <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.4rem', fontWeight:700, marginBottom:'1.5rem' }}>Project Details</h2>
                <form onSubmit={handleSubmit}>
                  {/* Title */}
                  <div style={{ marginBottom:'1.2rem' }}>
                    <label style={S.label}>PROJECT TITLE *</label>
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Give your project a catchy name" style={S.input}
                      onFocus={e => (e.target.style.borderColor='#e08840')} onBlur={e => (e.target.style.borderColor='rgba(255,255,255,.1)')} />
                  </div>

                  {/* Description */}
                  <div style={{ marginBottom:'1.2rem' }}>
                    <label style={S.label}>PROJECT DESCRIPTION * (What does it do? What problem does it solve?)</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your project in detail — what it does, what technologies you used, and the problem it solves..." rows={5}
                      style={{ ...S.input, resize:'vertical', minHeight:120 }}
                      onFocus={e => (e.target.style.borderColor='#e08840')} onBlur={e => (e.target.style.borderColor='rgba(255,255,255,.1)')} />
                  </div>

                  {/* URL */}
                  <div style={{ marginBottom:'1.2rem' }}>
                    <label style={S.label}>PROJECT LINK (GitHub / Demo URL — optional)</label>
                    <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://github.com/yourteam/project or https://yourproject.vercel.app" style={S.input} type="url"
                      onFocus={e => (e.target.style.borderColor='#e08840')} onBlur={e => (e.target.style.borderColor='rgba(255,255,255,.1)')} />
                  </div>

                  {/* File upload */}
                  <div style={{ marginBottom:'1.5rem' }}>
                    <label style={S.label}>PROJECT FILE (ZIP, PDF, PPT — optional, max 20MB)</label>
                    <div onClick={() => fileRef.current?.click()}
                      style={{ border:`2px dashed ${file ? 'rgba(245, 196, 81, .4)' : 'rgba(255,255,255,.1)'}`, borderRadius:12, padding:'2rem', textAlign:'center', cursor:'pointer', color: file ? '#f5c451' : '#a89888', fontSize:13, transition:'all .2s' }}>
                      {file ? (
                        <div>
                          <div style={{ fontSize:'1.5rem', marginBottom:'.5rem' }}>✅</div>
                          <div style={{ fontWeight:600 }}>{file.name}</div>
                          <div style={{ fontSize:11, marginTop:4, color:'#a89888' }}>{(file.size / 1024 / 1024).toFixed(2)} MB · Click to change</div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize:'2rem', marginBottom:'.5rem' }}>📁</div>
                          <div>Click to upload project file</div>
                          <div style={{ fontSize:11, marginTop:4 }}>ZIP, PDF, PPT, PPTX (max 20MB)</div>
                        </div>
                      )}
                      <input ref={fileRef} type="file" accept=".zip,.pdf,.ppt,.pptx,.rar,.tar.gz" style={{ display:'none' }} onChange={e => setFile(e.target.files?.[0] || null)} />
                    </div>
                  </div>

                  {/* Guidelines */}
                  <div style={{ background:'rgba(245, 196, 81, .05)', border:'1px solid rgba(245, 196, 81, .15)', borderRadius:12, padding:'1rem', marginBottom:'1.5rem', fontSize:13, color:'#a89888', lineHeight:1.7 }}>
                    <div style={{ color:'#f5c451', fontWeight:600, marginBottom:'.5rem' }}>📋 Submission Guidelines</div>
                    <ul style={{ paddingLeft:'1.2rem' }}>
                      <li>Your project must be built during the hackathon event</li>
                      <li>Include a clear description of what problem your project solves</li>
                      <li>Add a GitHub link or demo URL if available</li>
                      <li>You can only submit once — make sure everything is ready</li>
                    </ul>
                  </div>

                  {submitError && <p style={{ color:'#f5a623', fontSize:13, marginBottom:'1rem' }}>❌ {submitError}</p>}

                  <button type="submit" disabled={submitting}
                    style={{ width:'100%', padding:16, borderRadius:12, border:'none', background:'linear-gradient(135deg,#e08840,#b8451c)', color:'#fff', fontFamily:'Syne,sans-serif', fontSize:15, fontWeight:700, cursor: submitting ? 'not-allowed':'pointer', opacity: submitting ? .7 : 1 }}>
                    {submitting ? '⏳ Submitting Project...' : '🚀 Submit Project'}
                  </button>
                  <p style={{ fontSize:11, color:'#a89888', textAlign:'center', marginTop:'.8rem' }}>Once submitted, your project will be reviewed by our judges.</p>
                </form>
              </div>
            </div>
          )}

          {/* ── STEP 3: SUCCESS ── */}
          {step === 'success' && (
            <div style={{ ...S.card, textAlign:'center' }}>
              <div style={{ fontSize:'5rem', marginBottom:'1.5rem' }}>🎉</div>
              <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:'2rem', fontWeight:800, marginBottom:'1rem', background:'linear-gradient(135deg,#e08840,#b8451c,#f5c451)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                Project Submitted!
              </h2>
              <p style={{ color:'#a89888', fontSize:15, lineHeight:1.7, marginBottom:'2rem' }}>
                Your project has been successfully submitted for judging.<br/>
                Our judges will review it and announce results at the event.
              </p>

              {reg && (
                <div style={{ background:'rgba(245, 196, 81, .05)', border:'1px solid rgba(245, 196, 81, .15)', borderRadius:14, padding:'1.5rem', marginBottom:'2rem', textAlign:'left' }}>
                  <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:11, color:'#a89888', letterSpacing:2, marginBottom:'.8rem' }}>SUBMISSION SUMMARY</div>
                  <div style={{ display:'grid', gap:'.6rem' }}>
                    <div><span style={{ color:'#a89888', fontSize:12 }}>Team: </span><span style={{ fontWeight:600 }}>{reg.team_name}</span></div>
                    <div><span style={{ color:'#a89888', fontSize:12 }}>Project: </span><span style={{ fontWeight:600, color:'#f5c451' }}>{title || reg.project_title}</span></div>
                    <div><span style={{ color:'#a89888', fontSize:12 }}>Participant ID: </span><span style={{ fontFamily:'JetBrains Mono,monospace', color:'#e08840' }}>{reg.participant_id}</span></div>
                    {reg.project_submitted_at && <div><span style={{ color:'#a89888', fontSize:12 }}>Submitted: </span><span style={{ fontSize:13 }}>{formatDate(reg.project_submitted_at)}</span></div>}
                  </div>
                </div>
              )}

              <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
                <Link href="/" style={{ background:'linear-gradient(135deg,#e08840,#b8451c)', color:'#fff', textDecoration:'none', padding:'13px 28px', borderRadius:12, fontSize:14, fontWeight:700, fontFamily:'Syne,sans-serif' }}>
                  ← Back to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
