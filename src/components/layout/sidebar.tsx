'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Users,
  Layers,
  Video,
  Mic,
  Subtitles,
  LayoutTemplate,
  BarChart3,
  CreditCard,
  Settings,
  Clapperboard,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/auth-context'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/projects', label: 'Projects', icon: FolderOpen },
  { href: '/dashboard/scripts', label: 'Scripts', icon: FileText },
  { href: '/dashboard/characters', label: 'Characters', icon: Users },
  { href: '/dashboard/scenes', label: 'Scenes', icon: Layers },
  { href: '/dashboard/videos', label: 'Videos', icon: Video },
  { href: '/dashboard/voice', label: 'Voiceovers', icon: Mic },
  { href: '/dashboard/subtitles', label: 'Subtitles', icon: Subtitles },
  { href: '/dashboard/templates', label: 'Templates', icon: LayoutTemplate },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { profile, user, signOut } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.2 }}
      className="fixed left-0 top-0 h-full bg-gray-900 text-white flex flex-col z-40 overflow-hidden"
    >
      {/* Logo */}
      <div className={cn('flex items-center gap-3 p-4 h-16 border-b border-white/10 flex-shrink-0', collapsed && 'justify-center')}>
        <div className="w-8 h-8 rounded-lg bg-[#0057FF] flex items-center justify-center flex-shrink-0">
          <Clapperboard className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="font-bold text-sm text-white leading-tight">African Drama</div>
            <div className="text-xs text-gray-400">Studio</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all duration-150 group',
                active
                  ? 'bg-[#0057FF] text-white shadow-lg shadow-blue-500/20'
                  : 'text-gray-400 hover:bg-white/10 hover:text-white',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="border-t border-white/10 p-3">
        <div className={cn('flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/10 transition-colors mb-2', collapsed && 'justify-center')}>
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-[#0057FF] text-xs">
              {getInitials(profile?.full_name || user?.email || 'U')}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-white truncate">{profile?.full_name || 'User'}</div>
              <div className="text-xs text-gray-400 truncate">{user?.email}</div>
            </div>
          )}
        </div>

        <button
          onClick={signOut}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? 'Sign out' : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center hover:bg-gray-600 transition-colors z-10"
      >
        {collapsed ? <ChevronRight className="w-3 h-3 text-gray-300" /> : <ChevronLeft className="w-3 h-3 text-gray-300" />}
      </button>
    </motion.aside>
  )
}
