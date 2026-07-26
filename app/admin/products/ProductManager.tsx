'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Star, X, Upload, Loader2 } from 'lucide-react'
import type { Product, Category } from '@/lib/types'
import { saveProduct, deleteProduct, uploadProductImage, deleteProductImage, type ProductInput } from './actions'

const MAX_UPLOAD_MB = 3

/** Resize + compress an image in the browser to WebP under ~3MB before upload. */
async function compressImage(file: File): Promise<File> {
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
    // Still allow; we compress below. But reject absurdly large originals early.
    if (file.size > 15 * 1024 * 1024) throw new Error('Original image is too large (max 15MB).')
  }
  const bitmap = await createImageBitmap(file)
  const maxDim = 1280
  let { width, height } = bitmap
  if (width > maxDim || height > maxDim) {
    const scale = maxDim / Math.max(width, height)
    width = Math.round(width * scale)
    height = Math.round(height * scale)
  }
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(bitmap, 0, 0, width, height)

  // Try decreasing quality until under 3MB
  let quality = 0.82
  let blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), 'image/webp', quality))
  while (blob.size > MAX_UPLOAD_MB * 1024 * 1024 && quality > 0.4) {
    quality -= 0.15
    blob = await new Promise((res) => canvas.toBlob((b) => res(b!), 'image/webp', quality))
  }
  return new File([blob], file.name.replace(/\.\w+$/, '') + '.webp', { type: 'image/webp' })
}

const empty = (): ProductInput => ({
  name: '', description: '', price: 0, compare_price: null,
  category_id: null, stock: 0, is_featured: false, is_active: true,
  images: [], tags: [],
})

export default function ProductManager({ initialProducts, categories }: { initialProducts: Product[]; categories: Category[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [editing, setEditing] = useState<ProductInput | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const openNew = () => { setError(''); setEditing(empty()) }
  const openEdit = (p: Product) => {
    setError('')
    setEditing({
      id: p.id, name: p.name, description: p.description || '', price: p.price,
      compare_price: p.compare_price, category_id: p.category_id, stock: p.stock,
      is_featured: p.is_featured, is_active: p.is_active, images: p.images || [], tags: p.tags || [],
    })
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files || !editing) return
    setError(''); setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const compressed = await compressImage(file)
        const fd = new FormData()
        fd.append('file', compressed)
        const res = await uploadProductImage(fd)
        if (res.error) { setError(res.error); break }
        if (res.url) setEditing((e) => e ? { ...e, images: [...e.images, res.url!] } : e)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const removeImage = async (url: string) => {
    setEditing((e) => e ? { ...e, images: e.images.filter((i) => i !== url) } : e)
    deleteProductImage(url).catch(() => {})
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true); setError('')
    const res = await saveProduct(editing)
    setSaving(false)
    if (res.error) { setError(res.error); return }
    // Refresh from server data
    window.location.reload()
  }

  const handleDelete = async (p: Product) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return
    const res = await deleteProduct(p.id)
    if (res.error) { alert('Failed: ' + res.error); return }
    setProducts((prev) => prev.filter((x) => x.id !== p.id))
  }

  const catName = (id: string | null) => categories.find((c) => c.id === id)?.name || '—'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{products.length} product(s)</p>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold text-sm hover:opacity-90" style={{ background: '#1B8B3B' }}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                {['', 'Name', 'Category', 'Price', 'Stock', 'Featured', 'Active', ''].map((h, i) => (
                  <th key={i} className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="w-11 h-11 rounded-lg bg-gray-100 overflow-hidden relative">
                      {p.images?.[0] && <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="44px" />}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 max-w-xs truncate">{p.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{catName(p.category_id)}</td>
                  <td className="px-4 py-3 text-sm font-bold" style={{ color: '#1B8B3B' }}>Rs. {p.price?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.stock}</td>
                  <td className="px-4 py-3">{p.is_featured ? <Star size={16} className="fill-amber-400 text-amber-400" /> : <span className="text-gray-300">—</span>}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${p.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{p.is_active ? 'Active' : 'Hidden'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(p)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={8} className="text-center py-16 text-gray-400">No products yet. Click “Add Product”.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl my-8 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black text-gray-900">{editing.id ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setEditing(null)} className="p-2 rounded-lg hover:bg-gray-100"><X size={18} /></button>
            </div>

            {error && <p className="mb-4 text-sm text-red-600 font-medium bg-red-50 rounded-lg px-3 py-2">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-1">Name *</label>
                <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Price (Rs.) *</label>
                <input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Compare price (optional)</label>
                <input type="number" value={editing.compare_price ?? ''} onChange={(e) => setEditing({ ...editing, compare_price: e.target.value ? Number(e.target.value) : null })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Category</label>
                <select value={editing.category_id ?? ''} onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500">
                  <option value="">— Select category —</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Stock</label>
                <input type="number" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-green-500" />
              </div>

              {/* Images */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-1">Images (auto-compressed to WebP, max 3MB each)</label>
                <div className="flex flex-wrap gap-3">
                  {editing.images.map((url) => (
                    <div key={url} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                      <Image src={url} alt="" fill className="object-cover" sizes="80px" />
                      <button onClick={() => removeImage(url)} className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 text-white"><X size={12} /></button>
                    </div>
                  ))}
                  <button onClick={() => fileRef.current?.click()} disabled={uploading} className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-green-500 hover:text-green-600 disabled:opacity-50">
                    {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                    <span className="text-[10px] mt-1">{uploading ? '…' : 'Upload'}</span>
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
                </div>
              </div>

              <div className="flex items-center gap-6 md:col-span-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editing.is_featured} onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })} className="w-4 h-4 accent-green-600" />
                  <span className="text-sm font-semibold text-gray-700">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editing.is_active} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} className="w-4 h-4 accent-green-600" />
                  <span className="text-sm font-semibold text-gray-700">Active (visible in shop)</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditing(null)} className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving || uploading} className="flex-1 py-3 rounded-xl text-white font-bold hover:opacity-90 disabled:opacity-60" style={{ background: '#1B8B3B' }}>
                {saving ? 'Saving…' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
