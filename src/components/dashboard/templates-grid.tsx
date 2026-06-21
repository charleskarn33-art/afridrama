'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, LayoutTemplate } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const templates = [
  { id: 1, name: 'Village Love Story', genre: 'Romance', country: 'Ghana', duration: '5min', description: 'A forbidden love between two families in a traditional Ghanaian village.', color: 'from-pink-400 to-rose-600' },
  { id: 2, name: 'The Chief\'s Trial', genre: 'Drama', country: 'Nigeria', duration: '10min', description: 'A chief faces a moral dilemma when justice conflicts with tradition.', color: 'from-blue-400 to-blue-700' },
  { id: 3, name: 'Market Day Miracle', genre: 'Christian', country: 'Liberia', duration: '3min', description: 'A faith story set in a bustling Liberian market place.', color: 'from-purple-400 to-purple-700' },
  { id: 4, name: 'School of Dreams', genre: 'Educational', country: 'Kenya', duration: '5min', description: 'A student overcomes poverty to become a doctor in Nairobi.', color: 'from-green-400 to-green-700' },
  { id: 5, name: 'The Returnee', genre: 'Drama', country: 'Sierra Leone', duration: '10min', description: 'A diaspora professional returns home to face unexpected challenges.', color: 'from-orange-400 to-orange-700' },
  { id: 6, name: 'Cape Town Comedy Night', genre: 'Comedy', country: 'South Africa', duration: '5min', description: 'A hilarious night at a Cape Town comedy club goes delightfully wrong.', color: 'from-yellow-400 to-orange-500' },
  { id: 7, name: 'The Warrior\'s Legacy', genre: 'Historical', country: 'Ghana', duration: '20min', description: 'An epic historical drama set during the Ashanti Empire.', color: 'from-red-400 to-red-700' },
  { id: 8, name: 'City Girls', genre: 'Comedy', country: 'Nigeria', duration: '10min', description: 'Three Lagos girls navigate modern city life with humor and heart.', color: 'from-cyan-400 to-blue-600' },
]

export function TemplatesGrid() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Story Templates</h2>
          <p className="text-gray-500 mt-1">Start with a pre-built African drama template</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {templates.map((tpl, i) => (
          <motion.div
            key={tpl.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-lg transition-all"
          >
            <div className={`h-32 bg-gradient-to-br ${tpl.color} relative flex items-center justify-center`}>
              <LayoutTemplate className="w-12 h-12 text-white/40" />
              <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                <Badge className="bg-black/30 text-white border-0 text-xs">{tpl.genre}</Badge>
                <Badge className="bg-black/30 text-white border-0 text-xs">{tpl.duration}</Badge>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-[#0057FF] transition-colors">{tpl.name}</h3>
              <p className="text-xs text-gray-400 mb-1">{tpl.country}</p>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">{tpl.description}</p>
              <Link href={`/dashboard/projects/new?template=${tpl.id}`}>
                <Button size="sm" className="w-full bg-[#0057FF] text-xs">
                  Use Template <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
