import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pztyvkhexafesjddhivw.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6dHl2a2hleGFmZXNqZGRoaXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwMzM2MDYsImV4cCI6MjA5NzYwOTYwNn0.rB-Dx5w2zYfQrSrnlwP4aC6KCePYBtUn80HjzNnPYFE'

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}
