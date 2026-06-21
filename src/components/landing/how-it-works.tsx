'use client'

import { motion } from 'framer-motion'
import { FileText, Users, Video, Download } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: FileText,
    title: 'Create Your Project',
    description: 'Choose your genre, country, language, and duration. Set the stage for your African drama production.',
    color: 'bg-[#0057FF]',
  },
  {
    step: '02',
    icon: Users,
    title: 'Generate Script & Characters',
    description: 'Our AI writes a complete script with characters and dialogue. Generate AI portraits for each character.',
    color: 'bg-[#00B86B]',
  },
  {
    step: '03',
    icon: Video,
    title: 'Create Scenes & Videos',
    description: 'Generate scene backgrounds, add voiceovers, music, and create video clips — all with AI.',
    color: 'bg-purple-600',
  },
  {
    step: '04',
    icon: Download,
    title: 'Export & Share',
    description: 'Export your finished drama in multiple formats for YouTube, TikTok, Instagram, or direct download.',
    color: 'bg-orange-500',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block bg-green-50 text-[#00B86B] text-sm font-semibold px-4 py-2 rounded-full mb-4">
              Simple Process
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              From Idea to Film in
              <span className="text-[#0057FF]"> Minutes</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Our streamlined workflow takes you from concept to finished production with zero technical skills required.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map(({ step, icon: Icon, title, description, color }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-gray-200 to-transparent z-0" />
              )}

              <div className="relative z-10 text-center">
                <div className="relative inline-flex">
                  <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center mb-6 shadow-lg mx-auto`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </div>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
