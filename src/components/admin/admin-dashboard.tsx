'use client'

import { useEffect, useState } from 'react'
import { Users, FolderOpen, Video, Image, Database, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/auth-context'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { Profile } from '@/types'

export function AdminDashboard() {
  const { profile } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [stats, setStats] = useState({ users: 0, projects: 0, videos: 0, images: 0 })
  const [recentUsers, setRecentUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile && profile.role !== 'admin') {
      toast.error('Unauthorized: Admin access required')
      router.push('/dashboard')
      return
    }

    const fetch = async () => {
      const [users, projects, videos, images, latestUsers] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('projects').select('id', { count: 'exact' }),
        supabase.from('videos').select('id', { count: 'exact' }),
        supabase.from('images').select('id', { count: 'exact' }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(10),
      ])
      setStats({ users: users.count || 0, projects: projects.count || 0, videos: videos.count || 0, images: images.count || 0 })
      setRecentUsers((latestUsers.data || []) as Profile[])
      setLoading(false)
    }
    if (profile?.role === 'admin') fetch()
  }, [profile])

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>

  const statCards = [
    { label: 'Total Users', value: stats.users, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Projects', value: stats.projects, icon: FolderOpen, color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Videos', value: stats.videos, icon: Video, color: 'bg-red-50 text-red-600' },
    { label: 'Total Images', value: stats.images, icon: Image, color: 'bg-green-50 text-green-600' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-2">
          <Shield className="w-4 h-4 text-red-600" />
          <span className="text-sm font-medium text-red-700">Admin Panel</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-1">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-50">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0057FF] flex items-center justify-center text-white text-xs font-bold">
                    {(user.full_name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.full_name || 'Unknown'}</div>
                    <div className="text-xs text-gray-400">{new Date(user.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'creator' ? 'info' : 'outline'} className="text-xs capitalize">
                    {user.role}
                  </Badge>
                  <Badge variant={user.subscription_plan === 'free' ? 'outline' : 'success'} className="text-xs capitalize">
                    {user.subscription_plan}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
