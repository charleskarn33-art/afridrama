'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started with African drama creation.',
    features: [
      '3 Projects',
      '5 Videos/month',
      '20 AI Images/month',
      '10 Voiceovers/month',
      '1GB Storage',
      'SD Export Quality',
      'Basic Support',
    ],
    cta: 'Start Free',
    href: '/register',
    highlighted: false,
  },
  {
    name: 'Creator',
    price: '$19',
    period: '/month',
    description: 'For content creators building their African drama channel.',
    features: [
      '20 Projects',
      '50 Videos/month',
      '200 AI Images/month',
      '100 Voiceovers/month',
      '20GB Storage',
      'HD Export Quality',
      'Priority Support',
      'YouTube Auto-upload',
      'Custom Templates',
    ],
    cta: 'Start Creator',
    href: '/register?plan=creator',
    highlighted: true,
  },
  {
    name: 'Studio',
    price: '$49',
    period: '/month',
    description: 'For production studios and serious content teams.',
    features: [
      '100 Projects',
      '200 Videos/month',
      '1,000 AI Images/month',
      '500 Voiceovers/month',
      '100GB Storage',
      '4K Export Quality',
      'Dedicated Support',
      'All Creator Features',
      'Team Collaboration',
      'API Access',
    ],
    cta: 'Start Studio',
    href: '/register?plan=studio',
    highlighted: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For broadcasters, studios, and large organizations.',
    features: [
      'Unlimited Projects',
      'Unlimited Videos',
      'Unlimited Images',
      'Unlimited Voiceovers',
      '1TB+ Storage',
      '4K Export Quality',
      'SLA Support',
      'Custom AI Training',
      'White-label Option',
      'On-premise Deploy',
    ],
    cta: 'Contact Sales',
    href: '/contact',
    highlighted: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block bg-blue-50 text-[#0057FF] text-sm font-semibold px-4 py-2 rounded-full mb-4">
              Simple Pricing
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Plans for Every
              <span className="text-[#0057FF]"> Creator</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Start free and scale as your production grows. Cancel anytime.
            </p>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {plans.map(({ name, price, period, description, features, cta, href, highlighted }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-3xl p-8 flex flex-col ${
                highlighted
                  ? 'bg-gradient-to-b from-[#0057FF] to-[#0041CC] text-white shadow-2xl shadow-blue-500/30 scale-105'
                  : 'bg-white border-2 border-gray-100 hover:border-[#0057FF]/30 hover:shadow-lg transition-all'
              }`}
            >
              {highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className={`font-bold text-lg mb-1 ${highlighted ? 'text-white' : 'text-gray-900'}`}>{name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-4xl font-bold ${highlighted ? 'text-white' : 'text-gray-900'}`}>{price}</span>
                  <span className={`text-sm ${highlighted ? 'text-blue-200' : 'text-gray-500'}`}>{period}</span>
                </div>
                <p className={`text-sm ${highlighted ? 'text-blue-200' : 'text-gray-500'}`}>{description}</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${highlighted ? 'bg-white/20' : 'bg-blue-50'}`}>
                      <Check className={`w-3 h-3 ${highlighted ? 'text-white' : 'text-[#0057FF]'}`} />
                    </div>
                    <span className={`text-sm ${highlighted ? 'text-blue-100' : 'text-gray-600'}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={href}>
                <Button
                  className={`w-full ${highlighted ? 'bg-white text-[#0057FF] hover:bg-blue-50' : 'bg-[#0057FF] text-white hover:bg-[#0041CC]'}`}
                >
                  {cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
