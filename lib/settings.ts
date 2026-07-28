import { supabase } from './supabase'

/** Read a single site setting value (public, read-only). */
export async function getSetting(key: string): Promise<string | null> {
  const { data } = await supabase.from('site_settings').select('value').eq('key', key).single()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data as any)?.value ?? null
}

/** Whether the homepage Hot Deals section is enabled (defaults to true). */
export async function getHotDealsEnabled(): Promise<boolean> {
  const v = await getSetting('hot_deals_enabled').catch(() => null)
  return v === null ? true : v === 'true'
}
