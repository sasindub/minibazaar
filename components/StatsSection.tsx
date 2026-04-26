import { Package, Users, Award, Star } from 'lucide-react'

const stats = [
  { value: '500+', label: 'Products',         icon: Package, color: '#1B8B3B', bg: '#E8F5ED' },
  { value: '10K+', label: 'Happy Customers',  icon: Users,   color: '#C8102E', bg: '#FDE8EB' },
  { value: '50+',  label: 'Brands',           icon: Award,   color: '#1B8B3B', bg: '#E8F5ED' },
  { value: '4.9★', label: 'Rating',           icon: Star,    color: '#D4AF37', bg: '#FFF8E7' },
]

export default function StatsSection() {
  return (
    <section className="relative py-14 md:py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s, i) => {
            const Icon = s.icon
            return (
              <div
                key={s.label}
                className={`group relative p-6 md:p-8 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 reveal reveal-d${i + 1}`}
              >
                {/* Decorative ring */}
                <div
                  className="absolute -top-3 -right-3 w-24 h-24 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none blur-xl"
                  style={{ background: s.color }}
                />

                <div
                  className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
                  style={{ background: s.bg }}
                >
                  <Icon
                    size={24}
                    style={{ color: s.color }}
                    fill={s.label === 'Rating' ? s.color : 'none'}
                  />
                </div>

                <p
                  className="relative text-4xl md:text-5xl font-black mb-2 leading-none tracking-tight"
                  style={{ color: s.color }}
                >
                  {s.value}
                </p>
                <p className="relative text-xs md:text-sm text-gray-500 font-bold uppercase tracking-widest">
                  {s.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
