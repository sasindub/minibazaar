'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, ShoppingBag, TrendingUp, Users, Eye, Settings, BarChart3, Clock, CheckCircle2, XCircle, Truck } from 'lucide-react'
import { supabase } from '@/lib/supabase'

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
  const [pin, setPin] = useState('')
  const [authenticated, setAuthenticated] = useState(false)

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#E8F5ED' }}>
              <Settings size={28} style={{ color: '#1B8B3B' }} />
            </div>
            <h1 className="text-2xl font-black text-gray-900">Admin Access</h1>
            <p className="text-gray-500 text-sm mt-1">Enter admin PIN to continue</p>
          </div>
          <input
            type="password"
            placeholder="Enter PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && pin === '1234') setAuthenticated(true) }}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-center text-2xl tracking-widest mb-4 focus:outline-none focus:border-green-500"
          />
          <button
            onClick={() => { if (pin === '1234') setAuthenticated(true) }}
            className="w-full py-3.5 rounded-2xl text-white font-bold transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #1B8B3B, #156B2E)' }}
          >
            Login
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">Default PIN: 1234</p>
        </div>
      </div>
    )
  }

  return <AdminContent />
}

function AdminContent() {
  const [orders, setOrders] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, today: 0, revenue: 0, products: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: orderData } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }).limit(20)
      const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true })

      if (orderData) {
        setOrders(orderData)
        const today = new Date().toISOString().slice(0, 10)
        const todayOrders = orderData.filter((o: any) => o.created_at?.slice(0, 10) === today)
        const revenue = orderData.reduce((s: number, o: any) => s + (o.total || 0), 0)
        setStats({ total: orderData.length, today: todayOrders.length, revenue, products: productCount || 0 })
      }
    } catch {}
    setLoading(false)
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('orders') as any).update({ order_status: status }).eq('id', orderId)
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, order_status: status } : o))
  }

  const statCards = [
    { icon: ShoppingBag, label: 'Total Orders', value: stats.total, color: '#1B8B3B', bg: '#E8F5ED' },
    { icon: TrendingUp, label: 'Today\'s Orders', value: stats.today, color: '#3B82F6', bg: '#EFF6FF' },
    { icon: BarChart3, label: 'Total Revenue', value: `Rs. ${stats.revenue.toLocaleString()}`, color: '#8B5CF6', bg: '#F5F3FF' },
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
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">← View Store</Link>
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
                          <select
                            value={order.order_status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="text-xs rounded-lg border border-gray-200 px-2 py-1.5 focus:outline-none cursor-pointer"
                          >
                            {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
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
    </div>
  )
}
