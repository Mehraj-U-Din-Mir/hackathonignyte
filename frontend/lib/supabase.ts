import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnon)

// ── Types ────────────────────────────────────────────
export type RegistrationStatus = 'pending' | 'approved' | 'rejected'

export interface Registration {
  id: string
  participant_id: string
  full_name: string
  parentage: string
  class: string
  school_name: string
  city: string
  contact_number: string
  email: string
  team_name: string
  team_members: string[]
  skills: string
  laptop_available: boolean
  upi_transaction_id: string
  payment_screenshot_url: string
  status: RegistrationStatus
  admin_notes: string
  qr_code_url: string
  attended: boolean
  attended_at: string
  created_at: string
  approved_at: string
  // Project submission fields
  project_title: string
  project_description: string
  project_url: string
  project_file_url: string
  project_submitted: boolean
  project_submitted_at: string
}

// ── Registration Queries ─────────────────────────────
export async function getAllRegistrations(): Promise<Registration[]> {
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Registration[]
}

export async function getRegistrationByParticipantId(pid: string): Promise<Registration | null> {
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .eq('participant_id', pid)
    .single()
  if (error) return null
  return data as Registration
}

// ── Admin Actions ────────────────────────────────────
export async function approveRegistration(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('registrations')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        admin_notes: '',
      })
      .eq('id', id)
    if (error) throw error
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function rejectRegistration(id: string, notes: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('registrations')
      .update({ status: 'rejected', admin_notes: notes })
      .eq('id', id)
    if (error) throw error
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

export async function markAttended(participant_id: string): Promise<{ success: boolean; data?: Registration; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .update({ attended: true, attended_at: new Date().toISOString() })
      .eq('participant_id', participant_id)
      .select()
      .single()
    if (error) throw error
    return { success: true, data: data as Registration }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

// ── Project Submission ───────────────────────────────
export async function submitProject(
  participant_id: string,
  projectData: {
    project_title: string
    project_description: string
    project_url: string
    project_file_url?: string
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('registrations')
      .update({
        ...projectData,
        project_submitted: true,
        project_submitted_at: new Date().toISOString(),
      })
      .eq('participant_id', participant_id)
    if (error) throw error
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

// ── Storage ──────────────────────────────────────────
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string> {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

// ── Utilities ────────────────────────────────────────
export function formatDate(d: string) {
  if (!d) return '—'
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(d))
}

export function exportToCSV(data: any[], filename: string) {
  if (!data.length) return
  const headers = Object.keys(data[0]).join(',')
  const rows = data.map(row =>
    Object.values(row).map((v: any) =>
      typeof v === 'string' && v.includes(',') ? `"${v}"` : String(v ?? '')
    ).join(',')
  )
  const csv = [headers, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = `${filename}.csv`; a.click()
  URL.revokeObjectURL(url)
}
