'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Play, Sparkles, Film, Users, Mic } from 'lucide-react'

const stats = [
  { label: 'Content Creators', value: '10,000+' },
  { label: 'Videos Created', value: '50,000+' },
  { label: 'African Countries', value: '6' },
  { label: 'Languages Supported', value: '3+' },
]

const features = [
  { icon: Film, label: 'AI Script Generator' },
  { icon: Users, label: 'Character Studio' },
  { icon: Sparkles, label: 'Video Generation' },
  { icon: Mic, label: 'Voice Studio' },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#0057FF] via-[#003DB2] to-[#00B86B] pt-16">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#00B86B]/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/3 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-white text-sm font-medium">Powered by Claude AI + Gemini</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                Create African
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-green-300">
                  Movies With AI
                </span>
              </h1>

              <p className="text-xl text-white/80 mb-8 leading-relaxed max-w-xl">
                The ultimate AI-powered studio for African drama production. Generate scripts, characters, scenes, voiceovers, and full videos in minutes — tailored for African storytelling.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-[#0057FF] hover:bg-white/90 shadow-2xl text-base font-bold">
                    <Sparkles className="w-5 h-5" />
                    Start Creating Free
                  </Button>
                </Link>
                <Button size="lg" variant="glass" className="text-base font-semibold">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex flex-wrap gap-3">
                {features.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
                    <Icon className="w-3.5 h-3.5 text-green-300" />
                    <span className="text-white/90 text-xs font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Video preview card */}
            <div className="relative rounded-3xl overflow-hidden bg-black/30 backdrop-blur-xl border border-white/20 shadow-2xl aspect-video">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0057FF]/20 to-[#00B86B]/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-white/30 transition-colors">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                  <p className="text-white/80 text-sm">Watch How It Works</p>
                </div>
              </div>
              {/* Floating UI elements */}
              <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md rounded-xl px-3 py-2 border border-white/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-white text-xs font-medium">AI Generating Script...</span>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md rounded-xl px-3 py-2 border border-white/20">
                <span className="text-white text-xs font-medium">Scene 3 of 12 Ready</span>
              </div>
            </div>

            {/* Floating stat cards */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -left-8 top-1/4 bg-white rounded-2xl p-4 shadow-2xl"
            >
              <div className="text-2xl font-bold text-[#0057FF]">50K+</div>
              <div className="text-xs text-gray-500">Videos Created</div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              className="absolute -right-8 bottom-1/4 bg-white rounded-2xl p-4 shadow-2xl"
            >
              <div className="text-2xl font-bold text-[#00B86B]">6</div>
              <div className="text-xs text-gray-500">African Countries</div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-10 border-t border-white/10"
        >
          {stats.map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{value}</div>
              <div className="text-white/60 text-sm">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
