// ============================================================
//  app.js  —  Shared logic for BSM IT Portal
//  Now powered by Supabase instead of localStorage
// ============================================================

import { supabase } from './supabase.js'

// ===== AUTH =====
window.logout = async function() {
  await supabase.auth.signOut()
  window.location.href = 'index.html'
}

// ===== GET CURRENT USER PROFILE =====
window.getCurrentProfile = async function() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    window.location.href = 'index.html'
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (!profile || !profile.approved) {
    window.location.href = 'index.html'
    return null
  }

  return profile
}

// ===== TICKETS =====
window.getTickets = async function(emailFilter = null) {
  let query = supabase.from('tickets').select('*').order('created_at', { ascending: false })
  if (emailFilter) {
    query = query.eq('email', emailFilter)
  }
  const { data, error } = await query
  if (error) { console.error(error); return [] }
  return data
}

window.addTicket = async function(data) {
  const { data: { session } } = await supabase.auth.getSession()
  const { count } = await supabase.from('tickets').select('id', { count: 'exact', head: true })
  const num = String((count || 0) + 1).padStart(3, '0')

  const { data: ticket, error } = await supabase.from('tickets').insert([{
    ticket_number: 'TK-' + num,
    name:          data.name,
    email:         session.user.email,
    dept:          data.dept,
    type:          data.type,
    priority:      data.priority,
    subject:       data.subject,
    description:   data.desc || ''
  }]).select().single()

  if (error) { console.error(error); return null }
  return ticket
}

window.updateTicket = async function(id, changes) {
  const { error } = await supabase.from('tickets').update(changes).eq('id', id)
  if (error) console.error(error)
}

// ===== BADGE HELPERS =====
window.statusBadgeClass = function(status) {
  if (status === 'Open')        return 'badge-open'
  if (status === 'In Progress') return 'badge-progress'
  if (status === 'Resolved')    return 'badge-resolved'
  return ''
}

window.priorityBadgeClass = function(priority) {
  if (priority === 'Critical') return 'badge-critical'
  if (priority === 'High')     return 'badge-high'
  if (priority === 'Medium')   return 'badge-medium'
  return 'badge-low'
}

// ===== SECURITY HELPER =====
window.escapeHtml = function(str) {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}