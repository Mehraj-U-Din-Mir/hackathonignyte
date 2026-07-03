'use client'
import { useEffect, useState, useCallback } from 'react'
import {
  supabase, Registration, getAllRegistrations,
  approveRegistration, rejectRegistration, markAttended,
  formatDate, exportToCSV,
} from '@/lib/supabase'
import QRCode from 'react-qr-code'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'ignyte2026admin'

type Tab = 'overview' | 'registrations' | 'scanner' | 'analytics'
type Filter = 'all' | 'pending' | 'approved' | 'rejected'

function Badge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    approved: { bg:'rgba(74, 155, 142, .12)', color:'#4a9b8e' },
    rejected: { bg:'rgba(245, 166, 35, .12)', color:'#f5a623' },
    pending:  { bg:'rgba(245, 196, 81, .12)',  color:'#f5c451' },
  }
  const s = map[status] || map.pending
  return (
    <span style={{ padding:'3px 12px', borderRadius:50, fontSize:11, fontWeight:700, background:s.bg, color:s.color, display:'inline-block', fontFamily:'JetBrains Mono,monospace', letterSpacing:1, textTransform:'uppercase' }}>
      {status}
    </span>
  )
}

function Card({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div style={{ background:'rgba(255,255,255,.04)', border:`1px solid ${color}22`, borderRadius:18, padding:'1.5rem', textAlign:'center' }}>
      <div style={{ fontFamily:'Syne,sans-serif', fontSize:'2.5rem', fontWeight:800, color, marginBottom:4 }}>{value}</div>
      <div style={{ fontSize:12, color:'#a89888' }}>{label}</div>
    </div>
  )
}

export default function AdminPage() {
  const [authed,     setAuthed]     = useState(false)
  const [password,   setPassword]   = useState('')
  const [loginError, setLoginError] = useState('')
  const [tab,        setTab]        = useState<Tab>('overview')
  const [regs,       setRegs]       = useState<Registration[]>([])
  const [loading,    setLoading]    = useState(false)
  const [search,     setSearch]     = useState('')
  const [filter,     setFilter]     = useState<Filter>('all')
  const [selected,   setSelected]   = useState<Registration | null>(null)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)
  const [toast,      setToast]      = useState<{ msg: string; type: 'success'|'error' } | null>(null)
  const [qrInput,    setQrInput]    = useState('')
  const [scanResult, setScanResult] = useState<{ ok: boolean; msg: string; reg?: Registration } | null>(null)
  const [scanning,   setScanning]   = useState(false)

  const showToast = (msg: string, type: 'success'|'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const fetchRegs = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getAllRegistrations()
      setRegs(data)
    } catch (e: any) {
      showToast('Failed to load: ' + e.message, 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { if (authed) fetchRegs() }, [authed, fetchRegs])

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
      setLoginError('')
    } else {
      setLoginError('Incorrect password. Try again.')
    }
  }

  const handleApprove = async (reg: Registration) => {
    if (!confirm(`Approve registration for ${reg.full_name}?`)) return
    setActionLoadingId(reg.id)
    try {
      const result = await approveRegistration(reg.id)
      if (!result.success) throw new Error(result.error || 'Unknown error')

      setRegs(prev => prev.map(r =>
        r.id === reg.id
          ? { ...r, status: 'approved', approved_at: new Date().toISOString() }
          : r
      ))
      showToast(`✅ ${reg.full_name} approved successfully!`)
      setSelected(null)
      await fetchRegs()
    } catch (e: any) {
      showToast(`❌ Failed to approve: ${e.message}`, 'error')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleReject = async (reg: Registration) => {
    const notes = prompt(`Reason for rejecting ${reg.full_name}? (optional)`)
    if (notes === null) return
    setActionLoadingId(reg.id)
    try {
      const result = await rejectRegistration(reg.id, notes)
      if (!result.success) throw new Error(result.error || 'Unknown error')

      setRegs(prev => prev.map(r =>
        r.id === reg.id ? { ...r, status: 'rejected', admin_notes: notes } : r
      ))
      showToast(`${reg.full_name} rejected.`)
      setSelected(null)
      await fetchRegs()
    } catch (e: any) {
      showToast(`❌ Failed to reject: ${e.message}`, 'error')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleQRScan = async () => {
    const pid = qrInput.trim().toUpperCase()
    if (!pid) return
    setScanning(true)
    setScanResult(null)
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('participant_id', pid)
        .maybeSingle()

      if (error) {
        setScanResult({ ok: false, msg: `❌ Lookup error: ${error.message}` })
        setScanning(false)
        return
      }
      if (!data) {
        setScanResult({ ok: false, msg: `❌ Participant "${pid}" not found.` })
        setScanning(false)
        return
      }

      const reg = data as Registration

      if (reg.status !== 'approved') {
        setScanResult({ ok: false, msg: `⛔ Registration is "${reg.status}" — entry not allowed.`, reg })
        setScanning(false)
        return
      }
      if (reg.attended) {
        setScanResult({ ok: false, msg: `⚠️ Already checked in at ${formatDate(reg.attended_at)}`, reg })
        setScanning(false)
        return
      }

      const result = await markAttended(reg.participant_id)
      if (result.success) {
        setScanResult({ ok: true, msg: `✅ Welcome, ${reg.full_name}!`, reg: result.data })
        setRegs(prev => prev.map(r =>
          r.participant_id === pid ? { ...r, attended: true, attended_at: new Date().toISOString() } : r
        ))
      } else {
        setScanResult({ ok: false, msg: `❌ Check-in failed: ${result.error}` })
      }
    } catch (e: any) {
      setScanResult({ ok: false, msg: `❌ Error: ${e.message}` })
    } finally {
      setScanning(false)
    }
  }

  const filtered = regs
    .filter(r => filter === 'all' || r.status === filter)
    .filter(r => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        r.full_name?.toLowerCase().includes(q) ||
        r.school_name?.toLowerCase().includes(q) ||
        r.team_name?.toLowerCase().includes(q) ||
        r.participant_id?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q)
      )
    })

  const stats = {
    total:    regs.length,
    pending:  regs.filter(r => r.status === 'pending').length,
    approved: regs.filter(r => r.status === 'approved').length,
    rejected: regs.filter(r => r.status === 'rejected').length,
    attended: regs.filter(r => r.attended).length,
    projects: regs.filter(r => r.project_submitted).length,
  }

  const schools = Array.from(new Set(regs.map(r => r.school_name)))
    .map(s => ({
      name:     s,
      total:    regs.filter(r => r.school_name === s).length,
      approved: regs.filter(r => r.school_name === s && r.status === 'approved').length,
      teams:    Array.from(new Set(regs.filter(r => r.school_name === s).map(r => r.team_name))).length,
    }))
    .sort((a,b) => b.total - a.total)

  const S = {
    page:     { minHeight:'100vh', background:'#1a1410', color:'#f5ede0', fontFamily:'Space Grotesk,sans-serif', padding:'2rem' },
    input:    { width:'100%', background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', borderRadius:10, padding:'11px 14px', color:'#f5ede0', fontSize:13, outline:'none', fontFamily:'Space Grotesk,sans-serif' },
    tabBtn:   (active: boolean): React.CSSProperties => ({ padding:'10px 20px', borderRadius:10, border:'none', cursor:'pointer', fontFamily:'Space Grotesk,sans-serif', fontSize:13, fontWeight:600, background: active ? 'linear-gradient(135deg,#e08840,#b8451c)' : 'rgba(255,255,255,.05)', color: active ? '#fff' : '#a89888', transition:'all .2s' }),
    approveBtn: { padding:'10px 20px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#4a9b8e,#4a9b8e)', color:'#000', cursor:'pointer', fontSize:13, fontWeight:700, fontFamily:'Syne,sans-serif', transition:'all .2s' } as React.CSSProperties,
    rejectBtn:  { padding:'10px 20px', borderRadius:10, border:'1px solid rgba(245, 166, 35, .3)', background:'rgba(245, 166, 35, .1)', color:'#f5a623', cursor:'pointer', fontSize:13, fontWeight:700, fontFamily:'Syne,sans-serif', transition:'all .2s' } as React.CSSProperties,
    row:      { borderBottom:'1px solid rgba(255,255,255,.04)', transition:'background .15s' } as React.CSSProperties,
    th:       { padding:'10px 12px', textAlign:'left' as const, color:'#a89888', fontWeight:500, fontFamily:'JetBrains Mono,monospace', fontSize:11, letterSpacing:1, whiteSpace:'nowrap' as const },
    td:       { padding:'12px', fontSize:13 } as React.CSSProperties,
  }

  if (!authed) {
    return (
      <div style={{ ...S.page, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', borderRadius:24, padding:'3rem', width:'100%', maxWidth:420, textAlign:'center' }}>
          <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🔐</div>
          <h2 style={{ fontFamily:'Consolas, monospace', fontSize:'1.8rem', fontWeight:800, marginBottom:'.5rem' }}>Admin Login</h2>
          <p style={{ color:'#a89888', fontSize:13, marginBottom:'2rem' }}>ignyte 2026 Dashboard</p>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            style={{ ...S.input, marginBottom:'1rem', textAlign:'center', fontSize:15, letterSpacing:2 }}
          />
          {loginError && <p style={{ color:'#f5a623', fontSize:13, marginBottom:'1rem' }}>{loginError}</p>}
          <button onClick={login} style={{ width:'100%', padding:14, borderRadius:12, border:'none', background:'linear-gradient(135deg,#e08840,#b8451c)', color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:'Syne,sans-serif' }}>
            Login →
          </button>
          <p style={{ fontSize:12, color:'#a89888', marginTop:'1rem' }}>🔐Admin Only</p>
        </div>
      </div>
    )
  }

  return (
    <div style={S.page}>
      {toast && (
        <div style={{ position:'fixed', top:20, right:20, zIndex:9999, background: toast.type === 'success' ? 'rgba(74, 155, 142, .15)' : 'rgba(245, 166, 35, .15)', border:`1px solid ${toast.type === 'success' ? 'rgba(74, 155, 142, .3)' : 'rgba(245, 166, 35, .3)'}`, borderRadius:12, padding:'14px 24px', fontSize:14, fontWeight:600, color: toast.type === 'success' ? '#4a9b8e' : '#f5a623', maxWidth:400 }}>
          {toast.msg}
        </div>
      )}

      <div style={{ maxWidth:1400, margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:'1.5rem', fontWeight:800, background:'linear-gradient(135deg,#e08840,#f5c451)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>⬡ ignyte 2026</div>
            <div style={{ fontSize:11, color:'#a89888', fontFamily:'JetBrains Mono,monospace', marginTop:2 }}>Admin Dashboard</div>
          </div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <button onClick={fetchRegs} disabled={loading} style={{ padding:'8px 18px', borderRadius:9, border:'1px solid rgba(255,255,255,.1)', background:'transparent', color:'#a89888', cursor:'pointer', fontSize:13 }}>
              {loading ? '⟳ Loading...' : '↻ Refresh'}
            </button>
            <button onClick={() => exportToCSV(regs as any, 'ignyte-registrations')} style={{ padding:'8px 18px', borderRadius:9, border:'1px solid rgba(245, 196, 81, .2)', background:'rgba(245, 196, 81, .05)', color:'#f5c451', cursor:'pointer', fontSize:13, fontWeight:600 }}>
              ⬇ Export CSV
            </button>
            <button onClick={() => { setAuthed(false); setPassword('') }} style={{ padding:'8px 18px', borderRadius:9, border:'1px solid rgba(245, 166, 35, .2)', background:'rgba(245, 166, 35, .05)', color:'#f5a623', cursor:'pointer', fontSize:13 }}>
              Logout
            </button>
          </div>
        </div>

        <div style={{ display:'flex', gap:10, marginBottom:'2rem', flexWrap:'wrap' }}>
          {([['overview','📊 Overview'],['registrations','📋 Registrations'],['scanner','📱 QR Scanner'],['analytics','📈 Analytics']] as [Tab,string][]).map(([t,l]) => (
            <button key={t} style={S.tabBtn(tab === t)} onClick={() => setTab(t)}>{l}</button>
          ))}
        </div>

        {tab === 'overview' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:'1.2rem', marginBottom:'3rem' }}>
              <Card label="Total"     value={stats.total}    color="#e08840" />
              <Card label="Pending"   value={stats.pending}  color="#f5c451" />
              <Card label="Approved"  value={stats.approved} color="#4a9b8e" />
              <Card label="Rejected"  value={stats.rejected} color="#f5a623" />
              <Card label="Attended"  value={stats.attended} color="#b8451c" />
              <Card label="Projects"  value={stats.projects} color="#f5c451" />
            </div>

            <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'1.1rem', marginBottom:'1.2rem', color:'#f5c451' }}>
              ⏳ Pending Approvals ({stats.pending})
            </h3>

            {regs.filter(r => r.status === 'pending').length === 0 ? (
              <p style={{ color:'#a89888', fontSize:13 }}>No pending approvals. All caught up! ✅</p>
            ) : (
              regs.filter(r => r.status === 'pending').map(r => (
                <div key={r.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(245, 196, 81, .04)', border:'1px solid rgba(245, 196, 81, .15)', borderRadius:14, padding:'1rem 1.5rem', marginBottom:'.75rem', flexWrap:'wrap', gap:'1rem' }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:15 }}>
                      {r.full_name}
                      <span style={{ fontSize:12, color:'#f5c451', fontFamily:'JetBrains Mono,monospace', marginLeft:10 }}>{r.participant_id}</span>
                    </div>
                    <div style={{ fontSize:12, color:'#a89888', marginTop:3 }}>{r.school_name} · Team: {r.team_name} · Class {r.class} · {r.email}</div>
                  </div>
                  <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                    <button onClick={() => setSelected(r)} style={{ padding:'7px 16px', borderRadius:9, border:'1px solid rgba(224, 136, 64, .2)', background:'rgba(224, 136, 64, .08)', color:'#e08840', cursor:'pointer', fontSize:12 }}>
                      👁 View Details
                    </button>
                    <button onClick={() => handleApprove(r)} disabled={actionLoadingId === r.id} style={S.approveBtn}>
                      {actionLoadingId === r.id ? '...' : '✓ Approve'}
                    </button>
                    <button onClick={() => handleReject(r)} disabled={actionLoadingId === r.id} style={S.rejectBtn}>
                      {actionLoadingId === r.id ? '...' : '✕ Reject'}
                    </button>
                  </div>
                </div>
              ))
            )}

            <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'1.1rem', marginBottom:'1.2rem', marginTop:'2.5rem', color:'#f5c451' }}>
              📦 Recent Project Submissions ({stats.projects})
            </h3>
            {regs.filter(r => r.project_submitted).length === 0 ? (
              <p style={{ color:'#a89888', fontSize:13 }}>No project submissions yet.</p>
            ) : (
              regs.filter(r => r.project_submitted).slice(0,5).map(r => (
                <div key={r.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(245, 196, 81, .04)', border:'1px solid rgba(245, 196, 81, .15)', borderRadius:14, padding:'1rem 1.5rem', marginBottom:'.75rem', flexWrap:'wrap', gap:'1rem' }}>
                  <div>
                    <div style={{ fontWeight:600 }}>{r.full_name} <span style={{ fontSize:12, color:'#a89888', marginLeft:8 }}>— {r.project_title || 'Untitled Project'}</span></div>
                    <div style={{ fontSize:12, color:'#a89888', marginTop:3 }}>{r.school_name} · {formatDate(r.project_submitted_at)}</div>
                  </div>
                  <button onClick={() => setSelected(r)} style={{ padding:'7px 16px', borderRadius:9, border:'1px solid rgba(245, 196, 81, .2)', background:'rgba(245, 196, 81, .08)', color:'#f5c451', cursor:'pointer', fontSize:12 }}>
                    View Project
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'registrations' && (
          <div>
            <div style={{ display:'flex', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
              <input placeholder="Search name, school, team, ID, email..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...S.input, flex:1, minWidth:240 }} />
              <div style={{ display:'flex', gap:8 }}>
                {(['all','pending','approved','rejected'] as Filter[]).map(f => (
                  <button key={f} onClick={() => setFilter(f)} style={{ padding:'10px 18px', borderRadius:10, border:'none', cursor:'pointer', fontSize:13, fontWeight:600, background: filter === f ? 'rgba(224, 136, 64, .15)' : 'rgba(255,255,255,.05)', color: filter === f ? '#e08840' : '#a89888', transition:'all .2s', textTransform:'capitalize' }}>
                    {f} {f !== 'all' ? `(${regs.filter(r => r.status === f).length})` : `(${regs.length})`}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ fontSize:13, color:'#a89888', marginBottom:'1rem' }}>Showing {filtered.length} of {regs.length} registrations</div>

            {loading ? (
              <p style={{ color:'#a89888' }}>Loading registrations...</p>
            ) : (
              <div style={{ overflowX:'auto', borderRadius:16, border:'1px solid rgba(255,255,255,.06)' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                  <thead>
                    <tr style={{ borderBottom:'1px solid rgba(255,255,255,.08)', background:'rgba(255,255,255,.03)' }}>
                      {['ID','Name','School','Team','Class','Email','Status','Project','Date','Actions'].map(h => (
                        <th key={h} style={S.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(r => (
                      <tr key={r.id} style={S.row}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,.025)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <td style={{ ...S.td, fontFamily:'JetBrains Mono,monospace', fontSize:11, color:'#f5c451' }}>{r.participant_id}</td>
                        <td style={{ ...S.td, fontWeight:600, whiteSpace:'nowrap' }}>{r.full_name}</td>
                        <td style={{ ...S.td, color:'#a89888', maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.school_name}</td>
                        <td style={{ ...S.td, color:'#a89888' }}>{r.team_name}</td>
                        <td style={{ ...S.td, color:'#a89888', textAlign:'center' }}>{r.class}</td>
                        <td style={{ ...S.td, color:'#a89888', fontSize:11 }}>{r.email}</td>
                        <td style={S.td}><Badge status={r.status} /></td>
                        <td style={{ ...S.td, textAlign:'center' }}>
                          {r.project_submitted ? <span style={{ color:'#f5c451', fontSize:16 }}>✅</span> : <span style={{ color:'#a89888', fontSize:12 }}>—</span>}
                        </td>
                        <td style={{ ...S.td, color:'#a89888', fontSize:11, whiteSpace:'nowrap' }}>{formatDate(r.created_at)}</td>
                        <td style={S.td}>
                          <div style={{ display:'flex', gap:6, flexWrap:'nowrap' }}>
                            <button onClick={() => setSelected(r)} style={{ padding:'5px 10px', borderRadius:7, border:'1px solid rgba(224, 136, 64, .2)', background:'rgba(224, 136, 64, .08)', color:'#e08840', cursor:'pointer', fontSize:11, whiteSpace:'nowrap' }}>View</button>
                            {r.status === 'pending' && <>
                              <button onClick={() => handleApprove(r)} disabled={actionLoadingId === r.id} style={{ padding:'5px 10px', borderRadius:7, border:'none', background:'rgba(74, 155, 142, .15)', color:'#4a9b8e', cursor:'pointer', fontSize:11, fontWeight:700 }}>
                                {actionLoadingId === r.id ? '...' : '✓'}
                              </button>
                              <button onClick={() => handleReject(r)} disabled={actionLoadingId === r.id} style={{ padding:'5px 10px', borderRadius:7, border:'none', background:'rgba(245, 166, 35, .12)', color:'#f5a623', cursor:'pointer', fontSize:11, fontWeight:700 }}>
                                {actionLoadingId === r.id ? '...' : '✕'}
                              </button>
                            </>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && <p style={{ color:'#a89888', fontSize:13, padding:'2rem', textAlign:'center' }}>No registrations found.</p>}
              </div>
            )}
          </div>
        )}

        {tab === 'scanner' && (
          <div style={{ maxWidth:600, margin:'0 auto' }}>
            <div style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:24, padding:'2.5rem', textAlign:'center' }}>
              <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>📱</div>
              <h3 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.5rem', fontWeight:700, marginBottom:'.5rem' }}>QR Check-In</h3>
              <p style={{ color:'#a89888', fontSize:13, marginBottom:'2rem' }}>Enter participant ID from their QR code to check them in</p>
              <div style={{ display:'flex', gap:'1rem', marginBottom:'1.5rem' }}>
                <input
                  placeholder="BF26-0001"
                  value={qrInput}
                  onChange={e => { setQrInput(e.target.value.toUpperCase()); setScanResult(null) }}
                  onKeyDown={e => e.key === 'Enter' && handleQRScan()}
                  style={{ ...S.input, textAlign:'center', fontSize:16, fontFamily:'JetBrains Mono,monospace', letterSpacing:3, flex:1 }}
                />
                <button onClick={handleQRScan} disabled={scanning} style={{ padding:'12px 24px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#e08840,#b8451c)', color:'#fff', cursor:scanning ? 'not-allowed':'pointer', fontSize:14, fontWeight:700, fontFamily:'Syne,sans-serif', whiteSpace:'nowrap' }}>
                  {scanning ? '...' : 'Check In'}
                </button>
              </div>
              {scanResult && (
                <div style={{ padding:'1.5rem', borderRadius:14, background: scanResult.ok ? 'rgba(74, 155, 142, .08)' : 'rgba(245, 166, 35, .08)', border:`1px solid ${scanResult.ok ? 'rgba(74, 155, 142, .25)' : 'rgba(245, 166, 35, .25)'}` }}>
                  <div style={{ fontSize:'2rem', marginBottom:'.5rem' }}>{scanResult.ok ? '✅' : '❌'}</div>
                  <div style={{ fontWeight:700, fontSize:16, color: scanResult.ok ? '#4a9b8e' : '#f5a623', marginBottom:'.5rem' }}>{scanResult.msg}</div>
                  {scanResult.reg && <div style={{ fontSize:12, color:'#a89888' }}>{scanResult.reg.school_name} · {scanResult.reg.team_name}</div>}
                </div>
              )}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem', marginTop:'2rem' }}>
                <div style={{ background:'rgba(224, 136, 64, .05)', border:'1px solid rgba(224, 136, 64, .15)', borderRadius:12, padding:'1rem' }}>
                  <div style={{ fontFamily:'Syne,sans-serif', fontSize:'2rem', fontWeight:800, color:'#e08840' }}>{stats.approved}</div>
                  <div style={{ fontSize:11, color:'#a89888' }}>Expected</div>
                </div>
                <div style={{ background:'rgba(74, 155, 142, .05)', border:'1px solid rgba(74, 155, 142, .15)', borderRadius:12, padding:'1rem' }}>
                  <div style={{ fontFamily:'Syne,sans-serif', fontSize:'2rem', fontWeight:800, color:'#4a9b8e' }}>{stats.attended}</div>
                  <div style={{ fontSize:11, color:'#a89888' }}>Checked In</div>
                </div>
                <div style={{ background:'rgba(245, 196, 81, .05)', border:'1px solid rgba(245, 196, 81, .15)', borderRadius:12, padding:'1rem' }}>
                  <div style={{ fontFamily:'Syne,sans-serif', fontSize:'2rem', fontWeight:800, color:'#f5c451' }}>{stats.approved - stats.attended}</div>
                  <div style={{ fontSize:11, color:'#a89888' }}>Remaining</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'analytics' && (
          <div>
            <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'1.2rem', marginBottom:'1.5rem' }}>School-wise Breakdown</h3>
            {schools.length === 0 ? <p style={{ color:'#a89888' }}>No data yet.</p> : (
              <div style={{ display:'grid', gap:'1rem' }}>
                {schools.map((s,i) => (
                  <div key={i} style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderRadius:14, padding:'1.2rem 1.5rem' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'.75rem', flexWrap:'wrap', gap:'.5rem' }}>
                      <span style={{ fontWeight:600, fontSize:15 }}>{s.name}</span>
                      <div style={{ display:'flex', gap:'1.5rem', fontSize:12 }}>
                        <span style={{ color:'#e08840' }}>{s.total} registered</span>
                        <span style={{ color:'#4a9b8e' }}>{s.approved} approved</span>
                        <span style={{ color:'#b8451c' }}>{s.teams} teams</span>
                      </div>
                    </div>
                    <div style={{ height:6, background:'rgba(255,255,255,.06)', borderRadius:3, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${Math.min(100,(s.total / Math.max(1,stats.total)) * 100 * 4)}%`, background:'linear-gradient(90deg,#e08840,#b8451c)', borderRadius:3, transition:'width .6s ease' }}/>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {selected && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.85)', zIndex:9000, display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }} onClick={() => setSelected(null)}>
          <div style={{ background:'#241a10', border:'1px solid rgba(255,255,255,.12)', borderRadius:24, padding:'2rem', maxWidth:640, width:'100%', maxHeight:'90vh', overflowY:'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
              <h3 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.2rem', fontWeight:700 }}>Registration Details</h3>
              <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', color:'#a89888', cursor:'pointer', fontSize:'1.5rem' }}>×</button>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1.5rem' }}>
              {[
                ['Participant ID', selected.participant_id],
                ['Full Name',      selected.full_name],
                ['Parentage',      selected.parentage],
                ['Class',          selected.class],
                ['School',         selected.school_name],
                ['City',           selected.city],
                ['Email',          selected.email],
                ['Phone',          selected.contact_number],
                ['Team Name',      selected.team_name],
                ['UPI Txn ID',     selected.upi_transaction_id],
                ['Laptop',         selected.laptop_available ? 'Yes' : 'No'],
                ['Status',         selected.status],
              ].map(([k,v]) => (
                <div key={k} style={{ background:'rgba(255,255,255,.03)', borderRadius:10, padding:'12px' }}>
                  <div style={{ fontSize:10, color:'#a89888', fontFamily:'JetBrains Mono,monospace', letterSpacing:1, marginBottom:4 }}>{k}</div>
                  <div style={{ fontSize:13, fontWeight:600 }}>{v || '—'}</div>
                </div>
              ))}
            </div>

            <div style={{ background:'rgba(255,255,255,.03)', borderRadius:10, padding:'12px', marginBottom:'1rem' }}>
              <div style={{ fontSize:10, color:'#a89888', fontFamily:'JetBrains Mono,monospace', letterSpacing:1, marginBottom:4 }}>TEAM MEMBERS</div>
              <div style={{ fontSize:13 }}>{selected.team_members?.join(', ') || '—'}</div>
            </div>

            {selected.payment_screenshot_url && (
              <a href={selected.payment_screenshot_url} target="_blank" rel="noreferrer" style={{ display:'block', padding:'10px', borderRadius:10, border:'1px solid rgba(224, 136, 64, .2)', color:'#e08840', textDecoration:'none', textAlign:'center', fontSize:13, marginBottom:'1rem' }}>
                🧾 View Payment Screenshot ↗
              </a>
            )}

            {selected.project_submitted && (
              <div style={{ background:'rgba(245, 196, 81, .05)', border:'1px solid rgba(245, 196, 81, .2)', borderRadius:14, padding:'1.2rem', marginBottom:'1rem' }}>
                <div style={{ fontSize:11, color:'#f5c451', fontFamily:'JetBrains Mono,monospace', letterSpacing:2, marginBottom:'.8rem' }}>PROJECT SUBMISSION</div>
                <div style={{ fontWeight:700, fontSize:16, marginBottom:'.4rem' }}>{selected.project_title}</div>
                <div style={{ fontSize:13, color:'#a89888', lineHeight:1.6, marginBottom:'.8rem' }}>{selected.project_description}</div>
                {selected.project_url && <a href={selected.project_url} target="_blank" rel="noreferrer" style={{ color:'#e08840', fontSize:13 }}>🔗 {selected.project_url}</a>}
                {selected.project_file_url && <div style={{ marginTop:'.5rem' }}><a href={selected.project_file_url} target="_blank" rel="noreferrer" style={{ color:'#f5c451', fontSize:13 }}>📁 Download Project File</a></div>}
              </div>
            )}

            {selected.status === 'approved' && (
              <div style={{ textAlign:'center', padding:'1.5rem', background:'rgba(255,255,255,.03)', borderRadius:14, marginBottom:'1.5rem' }}>
                <div style={{ fontSize:11, color:'#a89888', marginBottom:'1rem', fontFamily:'JetBrains Mono,monospace' }}>QR CODE</div>
                <QRCode value={selected.participant_id} size={140} bgColor="transparent" fgColor="#f5c451" />
                <div style={{ fontSize:12, color:'#f5c451', fontFamily:'JetBrains Mono,monospace', marginTop:'.75rem' }}>{selected.participant_id}</div>
              </div>
            )}

            {selected.status === 'pending' && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <button onClick={() => handleApprove(selected)} disabled={actionLoadingId === selected.id}
                  style={{ padding:16, borderRadius:12, border:'none', background:'linear-gradient(135deg,#4a9b8e,#4a9b8e)', color:'#000', cursor: actionLoadingId === selected.id ? 'not-allowed':'pointer', fontWeight:700, fontSize:15, fontFamily:'Syne,sans-serif', opacity: actionLoadingId === selected.id ? .6 : 1 }}>
                  {actionLoadingId === selected.id ? '⏳ Processing...' : '✓ Approve & Send QR'}
                </button>
                <button onClick={() => handleReject(selected)} disabled={actionLoadingId === selected.id}
                  style={{ padding:16, borderRadius:12, border:'none', background:'rgba(245, 166, 35, .15)', color:'#f5a623', cursor: actionLoadingId === selected.id ? 'not-allowed':'pointer', fontWeight:700, fontSize:15, fontFamily:'Syne,sans-serif', opacity: actionLoadingId === selected.id ? .6 : 1 }}>
                  {actionLoadingId === selected.id ? '⏳ Processing...' : '✕ Reject'}
                </button>
              </div>
            )}
            {selected.status !== 'pending' && (
              <div style={{ textAlign:'center', padding:'1rem', background:'rgba(255,255,255,.03)', borderRadius:12 }}>
                <Badge status={selected.status} />
                {selected.approved_at && <div style={{ fontSize:12, color:'#a89888', marginTop:'.5rem' }}>Approved: {formatDate(selected.approved_at)}</div>}
                {selected.admin_notes && <div style={{ fontSize:12, color:'#f5a623', marginTop:'.5rem' }}>Note: {selected.admin_notes}</div>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}