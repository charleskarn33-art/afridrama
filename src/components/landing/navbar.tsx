'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, X, Clapperboard } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0057FF] flex items-center justify-center">
              <Clapperboard className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">African Drama Studio</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-gray-600 hover:text-[#0057FF] transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm text-gray-600 hover:text-[#0057FF] transition-colors">How It Works</Link>
            <Link href="#pricing" className="text-sm text-gray-600 hover:text-[#0057FF] transition-colors">Pricing</Link>
            <Link href="#faq" className="text-sm text-gray-600 hover:text-[#0057FF] transition-colors">FAQ</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-[#0057FF] hover:bg-[#0041CC]">Get Started Free</Button>
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-gray-100 px-4 py-4 space-y-3"
        >
          <Link href="#features" className="block text-gray-600 py-2" onClick={() => setOpen(false)}>Features</Link>
          <Link href="#how-it-works" className="block text-gray-600 py-2" onClick={() => setOpen(false)}>How It Works</Link>
          <Link href="#pricing" className="block text-gray-600 py-2" onClick={() => setOpen(false)}>Pricing</Link>
          <Link href="#faq" className="block text-gray-600 py-2" onClick={() => setOpen(false)}>FAQ</Link>
          <div className="flex gap-3 pt-2">
            <Link href="/login" className="flex-1">
              <Button variant="outline" className="w-full">Sign In</Button>
            </Link>
            <Link href="/register" className="flex-1">
              <Button className="w-full bg-[#0057FF]">Get Started</Button>
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  )
}
