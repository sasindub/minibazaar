'use client'
import { useState } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'

const testimonials = [
  { id: 1, name: 'Dilini Perera', role: 'Regular Customer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dilini&backgroundColor=E8F5ED', rating: 5, review: 'MiniBazaar has the best collection of chocolates I\'ve found in Sri Lanka! The Ferrero Rocher boxes are perfect for gifting. Delivery was super fast and everything was packed beautifully.' },
  { id: 2, name: 'Kasun Fernando', role: 'Verified Buyer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kasun&backgroundColor=FDE8EB', rating: 5, review: 'Ordered Dior Sauvage perfume and it arrived the next day! Authentic product, great price compared to duty-free. Will definitely be my go-to shop for luxury fragrances.' },
  { id: 3, name: 'Sachini Weerasinghe', role: 'Loyal Customer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sachini&backgroundColor=E8F5ED', rating: 5, review: 'I love how they have everything in one place — chocolates, perfumes, snacks! The cash on delivery option makes it so convenient. Best online shop in Sri Lanka!' },
  { id: 4, name: 'Ruwan Silva', role: 'Verified Buyer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ruwan&backgroundColor=FFF3E0', rating: 4, review: 'Amazing service! Ordered mixed nuts and Belgian cookies as a gift. The packaging was gorgeous and my family loved it. The website is also very easy to use.' },
  { id: 5, name: 'Nimesha Jayasekara', role: 'Regular Customer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nimesha&backgroundColor=E8F5FD', rating: 5, review: 'The Chanel perfume I ordered was 100% authentic and the price was amazing! Great customer service too — they responded to my query within minutes on Facebook.' },
]

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent((c) => (c + 1) % testimonials.length)

  return (
    <section className="py-20 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14 reveal">
          <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: '#1B8B3B' }}>Customer Love</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            What Our Customers <span style={{ color: '#C8102E' }}>Say</span>
          </h2>
        </div>

        <div className="relative reveal reveal-d1">
          {/* Featured testimonial */}
          <div className="max-w-3xl mx-auto text-center" key={current}>
            <div className="relative inline-block mb-8">
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto border-4 border-green-100 shadow-xl">
                <img src={testimonials[current].avatar} alt={testimonials[current].name} className="w-full h-full" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#1B8B3B' }}>
                <Star size={12} className="fill-white text-white" />
              </div>
            </div>

            <div className="mb-6">
              <Quote size={40} className="mx-auto mb-4 opacity-10 text-gray-900" />
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium italic">
                "{testimonials[current].review}"
              </p>
            </div>

            <div className="flex justify-center mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className={i < testimonials[current].rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'} />
              ))}
            </div>

            <p className="font-bold text-gray-900 text-lg">{testimonials[current].name}</p>
            <p className="text-sm text-gray-500">{testimonials[current].role}</p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button onClick={prev} className="w-11 h-11 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-green-500 hover:text-green-600 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="rounded-full transition-all duration-300"
                  style={{ width: i === current ? '28px' : '8px', height: '8px', background: i === current ? '#1B8B3B' : '#CBD5E0' }}
                />
              ))}
            </div>
            <button onClick={next} className="w-11 h-11 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-green-500 hover:text-green-600 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Mini cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-16 reveal reveal-d2">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setCurrent(i)}
              className={`p-4 rounded-2xl text-left transition-all border-2 ${i === current ? 'border-green-500 shadow-lg bg-green-50' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full" />
                <div>
                  <p className="text-xs font-bold text-gray-900 leading-tight">{t.name.split(' ')[0]}</p>
                  <div className="flex">
                    {[...Array(t.rating)].map((_, j) => <Star key={j} size={8} className="fill-amber-400 text-amber-400" />)}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">"{t.review.slice(0, 60)}..."</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
