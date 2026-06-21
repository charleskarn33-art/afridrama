'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Amara Kofi',
    role: 'YouTube Creator',
    country: 'Ghana',
    avatar: 'AK',
    content: 'African Drama Studio transformed my content creation. I generated a full 10-minute drama script, characters, and video clips in under 30 minutes. My channel grew 300% in 2 months!',
    rating: 5,
  },
  {
    name: 'Pastor Emmanuel',
    role: 'Church Media Director',
    country: 'Nigeria',
    avatar: 'PE',
    content: 'We use this platform to create Christian drama productions for our congregation. The quality is incredible and it captures authentic African church culture perfectly.',
    rating: 5,
  },
  {
    name: 'Fatou Diallo',
    role: 'Film Producer',
    country: 'Sierra Leone',
    avatar: 'FD',
    content: 'As a film producer, I was skeptical about AI. But African Drama Studio gets our culture right. The scripts feel authentic, the characters look real, and the voiceovers are natural.',
    rating: 5,
  },
  {
    name: 'James Mwangi',
    role: 'School Principal',
    country: 'Kenya',
    avatar: 'JM',
    content: 'We create educational dramas for our students. The platform is easy enough for our teachers to use, and the content quality rivals professional productions.',
    rating: 5,
  },
  {
    name: 'Zainab Kamara',
    role: 'Content Creator',
    country: 'Liberia',
    avatar: 'ZK',
    content: 'I went from zero to 50,000 subscribers in 6 months using African Drama Studio. The AI understands Liberian culture and creates content that resonates with my audience.',
    rating: 5,
  },
  {
    name: 'Thabo Ndlovu',
    role: 'Broadcast Director',
    country: 'South Africa',
    avatar: 'TN',
    content: 'We use the Studio plan for our entire production pipeline. The quality of AI-generated content is broadcast-ready. It has cut our production costs by 70%.',
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block bg-yellow-50 text-yellow-600 text-sm font-semibold px-4 py-2 rounded-full mb-4">
              Creator Stories
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Loved by African
              <span className="text-[#0057FF]"> Creators</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Join thousands of creators, churches, schools, and studios already using African Drama Studio.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map(({ name, role, country, avatar, content, rating }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">"{content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0057FF] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{name}</div>
                  <div className="text-xs text-gray-400">{role} · {country}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
