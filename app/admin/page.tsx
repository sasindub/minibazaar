'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, ShoppingBag, TrendingUp, Settings, BarChart3, Clock, CheckCircle2, XCircle, Truck, LogOut, Eye, X, MapPin, Phone, Mail } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { logout, updateOrderStatus, updatePaymentStatus } from './actions'

const paymentStatusColors: Record<string, string> = {
  pending: '#F59E0B',
  paid: '#10B981',
  failed: '#EF4444',
  refunded: '#6B7280',
}

const statusColors: Record<string, string> = {
  pending: '#F59E0B',
  confirmed: '#3B82F6',
  processing: '#8B5CF6',
  shipped: '#F97316',
  delivered: '#10B981',
  cancelled: '#EF4444',
}

const statusIcons: Record<string, React.ElementType> = {
  pending: Clock,
  confirmed: CheckCircle2,
  processing: Settings,
  shipped: Truck,
  delivered: CheckCircle2,
  cancelled: XCircle,
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, today: 0, revenue: 0, products: 0 })
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: orderData } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }).limit(20)
      const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true })
      // Revenue = sum of DELIVERED orders only, across all orders (not just recent 20)
      const { data: deliveredData } = await supabase.from('orders').select('total').eq('order_status', 'delivered')

      if (orderData) {
        setOrders(orderData)
        const today = new Date().toISOString().slice(0, 10)
        const todayOrders = orderData.filter((o: any) => o.created_at?.slice(0, 10) === today)
        const revenue = (deliveredData || []).reduce((s: number, o: any) => s + Number(o.total || 0), 0)
        setStats({ total: orderData.length, today: todayOrders.length, revenue, products: productCount || 0 })
      }
    } catch {}
    setLoading(false)
  }

  const changeOrderStatus = async (orderId: string, status: string) => {
    const prev = orders
    setOrders((p) => p.map((o) => o.id === orderId ? { ...o, order_status: status } : o))
    const res = await updateOrderStatus(orderId, status)
    if (res?.error) { setOrders(prev); alert('Failed: ' + res.error) }
  }

  const changePaymentStatus = async (orderId: string, status: string) => {
    const prev = orders
    setOrders((p) => p.map((o) => o.id === orderId ? { ...o, payment_status: status } : o))
    const res = await updatePaymentStatus(orderId, status)
    if (res?.error) { setOrders(prev); alert('Failed: ' + res.error) }
  }

  const statCards = [
    { icon: ShoppingBag, label: 'Total Orders', value: stats.total, color: '#1B8B3B', bg: '#E8F5ED' },
    { icon: TrendingUp, label: 'Today\'s Orders', value: stats.today, color: '#3B82F6', bg: '#EFF6FF' },
    { icon: BarChart3, label: 'Revenue (Delivered)', value: `Rs. ${stats.revenue.toLocaleString()}`, color: '#8B5CF6', bg: '#F5F3FF' },
    { icon: Package, label: 'Products', value: stats.products, color: '#F59E0B', bg: '#FFFBEB' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin navbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#1B8B3B' }}>
              <Settings size={16} className="text-white" />
            </div>
            <h1 className="font-black text-gray-900">MiniBazaar Admin</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-sm font-semibold text-gray-700 hover:text-green-700 transition-colors px-3 py-2">Dashboard</Link>
            <Link href="/admin/products" className="flex items-center gap-1.5 text-sm font-bold text-white px-4 py-2 rounded-xl hover:opacity-90 transition-all" style={{ background: '#1B8B3B' }}>
              <Package size={15} /> Manage Products
            </Link>
            <button
              onClick={() => logout()}
              className="flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors px-3 py-2"
            >
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                  <s.icon size={20} style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900">{loading ? '...' : s.value}</p>
              <p className="text-xs text-gray-500 font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Orders table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <button onClick={loadData} className="text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:opacity-90 text-white" style={{ background: '#1B8B3B' }}>
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-500">No orders yet. Orders will appear here once customers start purchasing.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    {['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const StatusIcon = statusIcons[order.order_status] || Clock
                    return (
                      <tr key={order.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-bold text-gray-900">{order.order_number}</td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-semibold text-gray-900">{order.customer_name}</p>
                          <p className="text-xs text-gray-400">{order.customer_phone}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{order.order_items?.length || 0} item(s)</td>
                        <td className="px-4 py-3 text-sm font-bold" style={{ color: '#1B8B3B' }}>Rs. {order.total?.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${order.payment_method === 'cash_on_delivery' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                            {order.payment_method === 'cash_on_delivery' ? 'COD' : 'Bank Transfer'}
                          </span>
                          <select
                            value={order.payment_status || 'pending'}
                            onChange={(e) => changePaymentStatus(order.id, e.target.value)}
                            className="mt-1.5 block text-xs rounded-lg border px-2 py-1 focus:outline-none cursor-pointer font-semibold"
                            style={{ color: paymentStatusColors[order.payment_status] || '#F59E0B', borderColor: '#e5e7eb' }}
                          >
                            <option value="pending">Payment pending</option>
                            <option value="paid">Payment complete</option>
                            <option value="refunded">Payment return</option>
                            <option value="failed">Payment failed</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full w-fit"
                            style={{ background: `${statusColors[order.order_status]}15`, color: statusColors[order.order_status] }}>
                            <StatusIcon size={10} /> {order.order_status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400">
                          {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelected(order)}
                            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:border-green-500 hover:text-green-700 transition-colors"
                          >
                            <Eye size={13} /> View
                          </button>
                          <select
                            value={order.order_status}
                            onChange={(e) => changeOrderStatus(order.id, e.target.value)}
                            className="text-xs rounded-lg border border-gray-200 px-2 py-1.5 focus:outline-none cursor-pointer"
                          >
                            {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order details modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center overflow-y-auto p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl my-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-black text-gray-900">Order {selected.order_number}</h2>
                <p className="text-xs text-gray-400">
                  {new Date(selected.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-gray-100"><X size={18} /></button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status badges */}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: `${statusColors[selected.order_status]}15`, color: statusColors[selected.order_status] }}>
                  Order: {selected.order_status}
                </span>
                <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: `${paymentStatusColors[selected.payment_status] || '#F59E0B'}15`, color: paymentStatusColors[selected.payment_status] || '#F59E0B' }}>
                  Payment: {selected.payment_status || 'pending'}
                </span>
                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-gray-100 text-gray-700">
                  {selected.payment_method === 'cash_on_delivery' ? 'Cash on Delivery' : 'Bank Transfer'}
                </span>
              </div>

              {/* Customer + shipping */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Customer</p>
                  <p className="text-sm font-bold text-gray-900">{selected.customer_name}</p>
                  <a href={`tel:${selected.customer_phone}`} className="flex items-center gap-1.5 text-sm text-gray-600 mt-1 hover:text-green-700"><Phone size={13} /> {selected.customer_phone}</a>
                  <a href={`mailto:${selected.customer_email}`} className="flex items-center gap-1.5 text-sm text-gray-600 mt-1 hover:text-green-700 break-all"><Mail size={13} /> {selected.customer_email}</a>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Shipping Address</p>
                  <div className="flex items-start gap-1.5 text-sm text-gray-700">
                    <MapPin size={14} className="mt-0.5 flex-shrink-0 text-gray-400" />
                    <div>
                      {(() => {
                        const a = selected.shipping_address || {}
                        return (
                          <>
                            {a.address && <p>{a.address}</p>}
                            {(a.city || a.postal_code) && <p>{[a.city, a.postal_code].filter(Boolean).join(', ')}</p>}
                            {a.province && <p>{a.province}</p>}
                            {!a.address && !a.city && <p className="text-gray-400">No address provided</p>}
                          </>
                        )
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Items ({selected.order_items?.length || 0})</p>
                <div className="border border-gray-100 rounded-2xl divide-y divide-gray-50">
                  {(selected.order_items || []).map((it: any) => (
                    <div key={it.id} className="flex items-center justify-between px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{it.product_name}</p>
                        <p className="text-xs text-gray-400">Rs. {it.price?.toLocaleString()} × {it.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900 ml-3">Rs. {(it.price * it.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>Rs. {selected.subtotal?.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{selected.shipping_fee ? `Rs. ${selected.shipping_fee.toLocaleString()}` : 'Free'}</span></div>
                <div className="flex justify-between font-black text-gray-900 text-base pt-1.5 border-t border-gray-200"><span>Total</span><span style={{ color: '#1B8B3B' }}>Rs. {selected.total?.toLocaleString()}</span></div>
              </div>

              {/* Notes */}
              {selected.notes && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Notes</p>
                  <p className="text-sm text-gray-700 bg-amber-50 rounded-xl px-3 py-2">{selected.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
