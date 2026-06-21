'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'What is African Drama Studio?',
    a: 'African Drama Studio is an AI-powered video production platform specifically designed for African storytelling. It lets you create complete drama productions — scripts, characters, scenes, voiceovers, and videos — using advanced AI tools in minutes.',
  },
  {
    q: 'Do I need any video production skills?',
    a: 'No! Our platform is designed for everyone. Whether you\'re a beginner content creator, a church media team, a school teacher, or a professional producer, our AI handles the technical heavy lifting.',
  },
  {
    q: 'Which African countries and languages are supported?',
    a: 'We support content creation for Liberia, Ghana, Nigeria, Sierra Leone, Kenya, and South Africa. Languages include English, French, and local language options. We\'re continuously adding more.',
  },
  {
    q: 'What AI models power the platform?',
    a: 'We use Claude AI and Gemini for script generation, Flux for image generation, Wan 2.1 for video generation, Piper TTS and Whisper for voice and subtitles. You get the best AI models for each specific task.',
  },
  {
    q: 'Can I upload to YouTube directly?',
    a: 'Yes! The Studio and Enterprise plans include YouTube auto-upload with AI-generated titles, descriptions, tags, and thumbnails. Grow your channel automatically.',
  },
  {
    q: 'How long does video generation take?',
    a: 'Script and image generation happens in seconds. Video generation typically takes 1-5 minutes per clip depending on length. Our queue system processes jobs in the background so you can continue working.',
  },
  {
    q: 'Is my content owned by me?',
    a: 'Absolutely. All content you create on African Drama Studio belongs to you. We have no rights to your productions. You can use, sell, broadcast, and distribute your content freely.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. There are no long-term contracts. Cancel your subscription anytime from your billing settings. Your content remains accessible until the end of your billing period.',
  },
]

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block bg-blue-50 text-[#0057FF] text-sm font-semibold px-4 py-2 rounded-full mb-4">
              FAQ
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Common Questions
            </h2>
            <p className="text-xl text-gray-500">
              Everything you need to know about African Drama Studio.
            </p>
          </motion.div>
        </div>

        <div className="space-y-3">
          {faqs.map(({ q, a }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="border border-gray-100 rounded-2xl overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-gray-900 pr-4">{q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-500 text-sm leading-relaxed">{a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
