import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY') || ''

const ADMIN_EMAILS: Record<string, string> = {
  'Idris Abdulai':  'idrisabdallah808@gmail.com',
  'Gideon Pomeyi':  'nanaogi.gw@gmail.com',
  'Michael':        'miken0478@yahoo.com',
}

const ALL_ADMIN_EMAILS = Object.values(ADMIN_EMAILS)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

async function sendEmail(to: string | string[], subject: string, html: string) {
  const recipients = Array.isArray(to)
    ? to.map(email => ({ email }))
    : [{ email: to }]

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sender: { name: 'BSM IT Portal', email: 'idrisabdallah808@gmail.com' },
      to: recipients,
      subject,
      htmlContent: html
    })
  })
  return res.json()
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, ticket, assigned_to, employee_name, employee_email } = await req.json()

    if (type === 'new_ticket') {
      const subject = `🎫 New Ticket [${ticket.ticket_number}] — ${ticket.subject}`
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0f0f0e; padding: 20px; border-radius: 10px 10px 0 0;">
            <h2 style="color: #fff; margin: 0;">🎫 New IT Support Ticket</h2>
            <p style="color: #a09e99; margin: 5px 0 0 0;">BSM IT Portal</p>
          </div>
          <div style="background: #f0ede8; padding: 24px; border-radius: 0 0 10px 10px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #6b6860; font-size: 13px; width: 120px;">Ticket ID</td><td style="padding: 8px 0; font-weight: 600;">${ticket.ticket_number}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b6860; font-size: 13px;">From</td><td style="padding: 8px 0; font-weight: 600;">${ticket.name}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b6860; font-size: 13px;">Email</td><td style="padding: 8px 0;">${ticket.email}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b6860; font-size: 13px;">Department</td><td style="padding: 8px 0;">${ticket.dept}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b6860; font-size: 13px;">Type</td><td style="padding: 8px 0;">${ticket.type}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b6860; font-size: 13px;">Priority</td><td style="padding: 8px 0;"><span style="background: ${ticket.priority === 'Critical' ? '#fcebeb' : ticket.priority === 'High' ? '#faeeda' : '#e6f1fb'}; color: ${ticket.priority === 'Critical' ? '#791f1f' : ticket.priority === 'High' ? '#633806' : '#0c447c'}; padding: 3px 10px; border-radius: 99px; font-size: 12px; font-weight: 600;">${ticket.priority}</span></td></tr>
              <tr><td style="padding: 8px 0; color: #6b6860; font-size: 13px;">Subject</td><td style="padding: 8px 0; font-weight: 600;">${ticket.subject}</td></tr>
              ${ticket.description ? `<tr><td style="padding: 8px 0; color: #6b6860; font-size: 13px; vertical-align: top;">Description</td><td style="padding: 8px 0;">${ticket.description}</td></tr>` : ''}
            </table>
            <div style="margin-top: 24px; text-align: center;">
              <a href="https://deluxe-naiad-236c15.netlify.app/admin.html" style="background: #0f0f0e; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 500;">View in Admin Portal →</a>
            </div>
          </div>
        </div>
      `
      await sendEmail(ALL_ADMIN_EMAILS, subject, html)
    }

    if (type === 'account_approved') {
      const subject = `✅ Account Approved — ${employee_name}`
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0f0f0e; padding: 20px; border-radius: 10px 10px 0 0;">
            <h2 style="color: #fff; margin: 0;">✅ New Account Approved</h2>
            <p style="color: #a09e99; margin: 5px 0 0 0;">BSM IT Portal</p>
          </div>
          <div style="background: #f0ede8; padding: 24px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 15px; color: #1a1917;"><strong>${employee_name}</strong> (${employee_email}) has been approved and can now access the portal.</p>
            <p style="font-size: 14px; color: #6b6860; margin-top: 8px;">Please inform them that their account is ready and they can sign in at the link below.</p>
            <div style="margin-top: 24px; text-align: center;">
              <a href="https://deluxe-naiad-236c15.netlify.app/index.html" style="background: #0f0f0e; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 500;">BSM IT Portal →</a>
            </div>
          </div>
        </div>
      `
      await sendEmail(ALL_ADMIN_EMAILS, subject, html)
    }

    if (type === 'assigned') {
      const assignedEmail = ADMIN_EMAILS[assigned_to]
      if (assignedEmail) {
        const subject = `📋 Ticket Assigned to You [${ticket.ticket_number}] — ${ticket.subject}`
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #0f0f0e; padding: 20px; border-radius: 10px 10px 0 0;">
              <h2 style="color: #fff; margin: 0;">📋 Ticket Assigned to You</h2>
              <p style="color: #a09e99; margin: 5px 0 0 0;">BSM IT Portal</p>
            </div>
            <div style="background: #f0ede8; padding: 24px; border-radius: 0 0 10px 10px;">
              <p style="font-size: 15px; color: #1a1917;">Hi <strong>${assigned_to}</strong>, a ticket has been assigned to you.</p>
              <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                <tr><td style="padding: 8px 0; color: #6b6860; font-size: 13px; width: 120px;">Ticket ID</td><td style="padding: 8px 0; font-weight: 600;">${ticket.ticket_number}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b6860; font-size: 13px;">From</td><td style="padding: 8px 0; font-weight: 600;">${ticket.name}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b6860; font-size: 13px;">Subject</td><td style="padding: 8px 0; font-weight: 600;">${ticket.subject}</td></tr>
                <tr><td style="padding: 8px 0; color: #6b6860; font-size: 13px;">Priority</td><td style="padding: 8px 0;"><span style="background: ${ticket.priority === 'Critical' ? '#fcebeb' : ticket.priority === 'High' ? '#faeeda' : '#e6f1fb'}; color: ${ticket.priority === 'Critical' ? '#791f1f' : ticket.priority === 'High' ? '#633806' : '#0c447c'}; padding: 3px 10px; border-radius: 99px; font-size: 12px; font-weight: 600;">${ticket.priority}</span></td></tr>
              </table>
              ${ticket.internal_note ? `
              <div style="margin-top: 16px; padding: 12px 16px; background: #faeeda; border-radius: 8px; border-left: 3px solid #ef9f27;">
                <p style="font-size: 12px; color: #633806; margin: 0 0 4px 0; font-weight: 600;">Internal Note:</p>
                <p style="font-size: 14px; color: #633806; margin: 0;">${ticket.internal_note}</p>
              </div>` : ''}
              <div style="margin-top: 24px; text-align: center;">
                <a href="https://deluxe-naiad-236c15.netlify.app/admin.html" style="background: #0f0f0e; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 500;">View in Admin Portal →</a>
              </div>
            </div>
          </div>
        `
        await sendEmail(assignedEmail, subject, html)
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})