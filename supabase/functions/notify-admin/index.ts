import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = 're_hZgXw2bn_GCBWA5QDnxv3Z3MRagzdJ5ee'

const ADMIN_EMAILS = [
  'idrisabdallah808@gmail.com',
]

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { ticket } = await req.json()

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0f0f0e; padding: 20px; border-radius: 10px 10px 0 0;">
          <h2 style="color: #fff; margin: 0;">🎫 New IT Support Ticket</h2>
          <p style="color: #a09e99; margin: 5px 0 0 0;">BSM IT Portal</p>
        </div>
        <div style="background: #f0ede8; padding: 24px; border-radius: 0 0 10px 10px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b6860; font-size: 13px; width: 120px;">Ticket ID</td>
              <td style="padding: 8px 0; font-weight: 600;">${ticket.ticket_number}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b6860; font-size: 13px;">From</td>
              <td style="padding: 8px 0; font-weight: 600;">${ticket.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b6860; font-size: 13px;">Email</td>
              <td style="padding: 8px 0;">${ticket.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b6860; font-size: 13px;">Department</td>
              <td style="padding: 8px 0;">${ticket.dept}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b6860; font-size: 13px;">Type</td>
              <td style="padding: 8px 0;">${ticket.type}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b6860; font-size: 13px;">Priority</td>
              <td style="padding: 8px 0;">
                <span style="background: ${ticket.priority === 'Critical' ? '#fcebeb' : ticket.priority === 'High' ? '#faeeda' : '#e6f1fb'}; 
                color: ${ticket.priority === 'Critical' ? '#791f1f' : ticket.priority === 'High' ? '#633806' : '#0c447c'};
                padding: 3px 10px; border-radius: 99px; font-size: 12px; font-weight: 600;">
                  ${ticket.priority}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b6860; font-size: 13px;">Subject</td>
              <td style="padding: 8px 0; font-weight: 600;">${ticket.subject}</td>
            </tr>
            ${ticket.description ? `
            <tr>
              <td style="padding: 8px 0; color: #6b6860; font-size: 13px; vertical-align: top;">Description</td>
              <td style="padding: 8px 0;">${ticket.description}</td>
            </tr>
            ` : ''}
          </table>
          <div style="margin-top: 24px; text-align: center;">
            <a href="https://deluxe-naiad-236c15.netlify.app/admin.html" 
               style="background: #0f0f0e; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 500;">
              View in Admin Portal →
            </a>
          </div>
        </div>
      </div>
    `

    await Promise.all(ADMIN_EMAILS.map(async (adminEmail) => {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'BSM IT Portal <onboarding@resend.dev>',
          to: adminEmail,
          subject: `🎫 New Ticket [${ticket.ticket_number}] — ${ticket.subject}`,
          html: emailHtml
        })
      })
    }))

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