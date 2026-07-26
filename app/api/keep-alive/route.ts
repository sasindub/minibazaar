import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Pinged daily by Vercel Cron to keep the free Supabase project from pausing
// after 7 days of inactivity. Does a tiny read.
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { error } = await supabase.from('categories').select('id').limit(1)
    if (error) throw error
    return NextResponse.json({ ok: true, at: new Date().toISOString() })
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : 'unknown' },
      { status: 500 },
    )
  }
}
