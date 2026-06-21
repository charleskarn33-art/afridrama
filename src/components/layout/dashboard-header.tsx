'use client'

import { Bell, Search, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/context/auth-context'
import Link from 'next/link'

export function DashboardHeader({ title }: { title: string }) {
  const { profile } = useAuth()

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {profile?.subscription_plan && (
          <Badge variant="info" className="text-xs capitalize">
            {profile.subscription_plan}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search projects..." className="pl-9 w-64 h-9 text-sm" />
        </div>

        <button className="relative w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <Bell className="w-4 h-4 text-gray-600" />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>

        <Link href="/dashboard/projects/new">
          <Button size="sm" className="bg-[#0057FF] hover:bg-[#0041CC]">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </Link>
      </div>
    </header>
  )
}
