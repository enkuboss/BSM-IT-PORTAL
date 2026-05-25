import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://yehnzwgacsvtlgfvdqan.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllaG56d2dhY3N2dGxnZnZkcWFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0MzQ4NzQsImV4cCI6MjA5NTAxMDg3NH0.N4jarZbPuNLV14H-tvrabFngtTQjOj2Oy-yVhSrBg-w'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)