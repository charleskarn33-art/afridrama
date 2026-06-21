'use client'

import { motion } from 'framer-motion'
import { FileText, Users, Layers, Video, Mic, Subtitles, Music, Download, BarChart3, Shield } from 'lucide-react'

const features = [
  {
    icon: FileText,
    title: 'AI Script Generator',
    description: 'Generate complete drama scripts with characters, dialogue, narration, and scene breakdowns tailored to African storytelling.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Users,
    title: 'Character Studio',
    description: 'Create detailed African characters with AI-generated portraits. Customize appearance, clothing, personality, and more.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Layers,
    title: 'Scene Studio',
    description: 'Generate authentic African scenes — villages, markets, churches, schools, hospitals — with stunning AI imagery.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Video,
    title: 'Video Generation',
    description: 'Turn your scripts and images into cinematic video clips using Wan 2.1 AI. Text-to-video and image-to-video.',
    color: 'bg-red-50 text-red-600',
  },
  {
    icon: Mic,
    title: 'Voice Studio',
    description: 'Generate authentic African voices with emotion control. Male, female, child, and narrator options with speed and pitch controls.',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: Subtitles,
    title: 'Subtitle Generator',
    description: 'Auto-generate subtitles in English and French. Download in SRT and VTT formats for any platform.',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    icon: Music,
    title: 'Music Studio',
    description: 'Generate authentic African drama music — suspense, romance, action, church music, African drums.',
    color: 'bg-pink-50 text-pink-600',
  },
  {
    icon: Download,
    title: 'Multi-Platform Export',
    description: 'Export in YouTube 16:9, TikTok 9:16, Instagram Reels, and Facebook formats. MP4 and MOV supported.',
    color: 'bg-cyan-50 text-cyan-600',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track your projects, video creation stats, storage usage, and audience engagement in real-time.',
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Row-level security, role-based access, API protection, and enterprise-grade data encryption.',
    color: 'bg-gray-50 text-gray-600',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block bg-blue-50 text-[#0057FF] text-sm font-semibold px-4 py-2 rounded-full mb-4">
              Everything You Need
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              A Complete AI Studio for
              <span className="text-[#0057FF]"> African Drama</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              From script to final video — every tool you need to create world-class African content, all in one platform.
            </p>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, description, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group p-6 rounded-2xl border border-gray-100 hover:border-[#0057FF]/20 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300 cursor-default"
            >
              <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
