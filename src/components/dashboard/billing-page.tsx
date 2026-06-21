'use client'

import { Check, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/context/auth-context'
import { toast } from 'sonner'

const plans = [
  {
    name: 'Free',
    price: '$0',
    features: ['3 Projects', '5 Videos/mo', '20 Images/mo', '10 Voiceovers/mo', '1GB Storage', 'SD Quality'],
    plan: 'free',
  },
  {
    name: 'Creator',
    price: '$19/mo',
    features: ['20 Projects', '50 Videos/mo', '200 Images/mo', '100 Voiceovers/mo', '20GB Storage', 'HD Quality', 'Priority Support'],
    plan: 'creator',
    popular: true,
  },
  {
    name: 'Studio',
    price: '$49/mo',
    features: ['100 Projects', '200 Videos/mo', '1,000 Images/mo', '500 Voiceovers/mo', '100GB Storage', '4K Quality', 'API Access', 'Team Features'],
    plan: 'studio',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: ['Unlimited Everything', '1TB+ Storage', '4K Quality', 'Dedicated Support', 'White-label', 'Custom AI Training'],
    plan: 'enterprise',
  },
]

export function BillingPage() {
  const { profile } = useAuth()

  const handleUpgrade = (plan: string) => {
    if (plan === 'enterprise') {
      toast.info('Contact sales@africandramastudio.com for enterprise pricing.')
      return
    }
    toast.info('Stripe integration coming soon! Contact support to upgrade.')
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Billing & Plans</h2>
        <p className="text-gray-500 mt-1">Manage your subscription and upgrade your plan</p>
      </div>

      {/* Current plan */}
      <Card className="border-[#0057FF]/30 bg-gradient-to-r from-blue-50 to-green-50">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0057FF] flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Current Plan</div>
              <div className="text-2xl font-bold text-gray-900 capitalize">{profile?.subscription_plan || 'Free'}</div>
              <Badge variant="success" className="mt-1">Active</Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-gray-500 text-sm">Next billing date</div>
            <div className="font-semibold text-gray-900">—</div>
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map(({ name, price, features, plan, popular }, i) => {
          const isCurrent = profile?.subscription_plan === plan
          return (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl p-6 flex flex-col relative ${popular ? 'bg-gradient-to-b from-[#0057FF] to-[#0041CC] text-white' : 'bg-white border border-gray-100'}`}
            >
              {popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">Most Popular</div>}
              {isCurrent && <div className="absolute -top-3 right-4 bg-[#00B86B] text-white text-xs font-bold px-3 py-1 rounded-full">Current</div>}

              <div className="mb-4">
                <h3 className={`font-bold text-lg ${popular ? 'text-white' : 'text-gray-900'}`}>{name}</h3>
                <div className={`text-2xl font-bold mt-1 ${popular ? 'text-white' : 'text-gray-900'}`}>{price}</div>
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className={`w-4 h-4 flex-shrink-0 ${popular ? 'text-blue-200' : 'text-[#00B86B]'}`} />
                    <span className={popular ? 'text-blue-100' : 'text-gray-600'}>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleUpgrade(plan)}
                disabled={isCurrent}
                className={popular ? 'bg-white text-[#0057FF] hover:bg-blue-50' : 'bg-[#0057FF] text-white hover:bg-[#0041CC]'}
              >
                {isCurrent ? 'Current Plan' : plan === 'enterprise' ? 'Contact Sales' : 'Upgrade'}
              </Button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
