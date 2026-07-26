'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase-server'
import { requireAdmin } from '../actions'

const MAX_IMAGE_BYTES = 3 * 1024 * 1024 // 3MB hard limit
const BUCKET = 'product-images'

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

/** Upload a single (already client-compressed) image. Returns its public URL. */
export async function uploadProductImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  await requireAdmin()
  const file = formData.get('file') as File | null
  if (!file) return { error: 'No file provided' }
  if (file.size > MAX_IMAGE_BYTES) return { error: 'Image exceeds 3MB. Please use a smaller image.' }
  if (!file.type.startsWith('image/')) return { error: 'Only image files are allowed' }

  const ext = file.type === 'image/webp' ? 'webp' : (file.name.split('.').pop() || 'jpg').toLowerCase()
  const path = `products/${crypto.randomUUID()}.${ext}`
  const bytes = new Uint8Array(await file.arrayBuffer())

  const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, bytes, {
    contentType: file.type,
    upsert: false,
  })
  if (error) return { error: error.message }

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path)
  return { url: data.publicUrl }
}

/** Delete an image from storage by its public URL (best-effort). */
export async function deleteProductImage(url: string): Promise<void> {
  await requireAdmin()
  const marker = `/${BUCKET}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return
  const path = url.slice(idx + marker.length)
  await supabaseAdmin.storage.from(BUCKET).remove([path])
}

export interface ProductInput {
  id?: string
  name: string
  description: string
  price: number
  compare_price: number | null
  category_id: string | null
  stock: number
  is_featured: boolean
  is_active: boolean
  images: string[]
  tags: string[]
}

export async function saveProduct(input: ProductInput): Promise<{ error?: string; id?: string }> {
  await requireAdmin()
  if (!input.name.trim()) return { error: 'Name is required' }
  if (!(input.price >= 0)) return { error: 'Valid price is required' }

  const row = {
    name: input.name.trim(),
    slug: slugify(input.name) + '-' + Math.random().toString(36).slice(2, 6),
    description: input.description || null,
    price: input.price,
    compare_price: input.compare_price,
    category_id: input.category_id,
    stock: input.stock,
    is_featured: input.is_featured,
    is_active: input.is_active,
    images: input.images,
    tags: input.tags,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabaseAdmin as any
  if (input.id) {
    // Keep existing slug on update
    const { slug, ...updateRow } = row
    void slug
    const { error } = await sb.from('products').update(updateRow).eq('id', input.id)
    if (error) return { error: error.message }
  } else {
    const { error } = await sb.from('products').insert(row)
    if (error) return { error: error.message }
  }

  revalidatePath('/admin/products')
  revalidatePath('/shop')
  revalidatePath('/')
  return {}
}

export async function deleteProduct(id: string): Promise<{ error?: string }> {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabaseAdmin.from('products') as any).delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/products')
  revalidatePath('/shop')
  revalidatePath('/')
  return {}
}
