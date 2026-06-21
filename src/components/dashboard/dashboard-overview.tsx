'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FolderOpen, Video, Image, Mic, TrendingUp, Plus, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/auth-context'
import Link from 'next/link'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { PLAN_LIMITS } from '@/types'
import type { Project } from '@/types'

const chartData = [
  { date: 'Mon', projects: 1, videos: 2 },
  { date: 'Tue', projects: 2, videos: 3 },
  { date: 'Wed', projects: 1, videos: 5 },
  { date: 'Thu', projects: 3, videos: 4 },
  { date: 'Fri', projects: 2, videos: 7 },
  { date: 'Sat', projects: 4, videos: 6 },
  { date: 'Sun', projects: 3, videos: 8 },
]

export function DashboardOverview() {
  const { user, profile } = useAuth()
  const supabase = createClient()
  const [stats, setStats] = useState({ projects: 0, videos: 0, images: 0, voiceovers: 0 })
  const [recentProjects, setRecentProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const fetchData = async () => {
      const [p, v, img, vo, rp] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('videos').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('images').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('voiceovers').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('projects').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
      ])
      setStats({
        projects: p.count || 0,
        videos: v.count || 0,
        images: img.count || 0,
        voiceovers: vo.count || 0,
      })
      setRecentProjects((rp.data || []) as Project[])
      setLoading(false)
    }
    fetchData()
  }, [user])

  const plan = profile?.subscription_plan || 'free'
  const limits = PLAN_LIMITS[plan]

  const statCards = [
    { label: 'Projects', value: stats.projects, icon: FolderOpen, color: 'text-blue-600', bg: 'bg-blue-50', limit: limits.projects },
    { label: 'Videos', value: stats.videos, icon: Video, color: 'text-purple-600', bg: 'bg-purple-50', limit: limits.videos_per_month },
    { label: 'Images Generated', value: stats.images, icon: Image, color: 'text-green-600', bg: 'bg-green-50', limit: limits.images_per_month },
    { label: 'Voiceovers', value: stats.voiceovers, icon: Mic, color: 'text-orange-600', bg: 'bg-orange-50', limit: limits.voiceovers_per_month },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'Creator'}! 👋
          </h2>
          <p className="text-gray-500 mt-1">Here's what's happening with your productions.</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button className="bg-[#0057FF] hover:bg-[#0041CC]">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg, limit }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardContent className="p-5">
                {loading ? (
                  <Skeleton className="h-16" />
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                      </div>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
                    <div className="text-sm text-gray-500 mb-2">{label}</div>
                    {limit > 0 && (
                      <Progress value={(value / limit) * 100} className="h-1.5" />
                    )}
                    {limit > 0 && (
                      <div className="text-xs text-gray-400 mt-1">{value} / {limit} limit</div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="videos" stroke="#0057FF" fill="#EFF6FF" strokeWidth={2} name="Videos" />
                <Area type="monotone" dataKey="projects" stroke="#00B86B" fill="#F0FDF4" strokeWidth={2} name="Projects" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Plan Usage */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Plan Usage</CardTitle>
              <Badge variant="info" className="capitalize">{plan}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Projects', used: stats.projects, limit: limits.projects },
              { label: 'Videos/mo', used: stats.videos, limit: limits.videos_per_month },
              { label: 'Images/mo', used: stats.images, limit: limits.images_per_month },
              { label: 'Voice/mo', used: stats.voiceovers, limit: limits.voiceovers_per_month },
            ].map(({ label, used, limit }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{label}</span>
                  <span className="text-gray-900 font-medium">{used}/{limit < 0 ? '∞' : limit}</span>
                </div>
                <Progress value={limit < 0 ? 10 : Math.min((used / limit) * 100, 100)} className="h-1.5" />
              </div>
            ))}
            <Link href="/dashboard/billing">
              <Button variant="outline" className="w-full mt-4 border-[#0057FF] text-[#0057FF]" size="sm">
                Upgrade Plan <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Projects</CardTitle>
            <Link href="/dashboard/projects" className="text-sm text-[#0057FF] hover:underline font-medium">
              View all
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-14" />)}
            </div>
          ) : recentProjects.length === 0 ? (
            <div className="text-center py-10">
              <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm mb-4">No projects yet. Create your first African drama!</p>
              <Link href="/dashboard/projects/new">
                <Button size="sm" className="bg-[#0057FF]">
                  <Plus className="w-4 h-4" />
                  Create Project
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentProjects.map((project) => (
                <Link key={project.id} href={`/dashboard/projects/${project.id}`} className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-2 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0057FF] to-[#00B86B] flex items-center justify-center">
                      <FolderOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{project.name}</div>
                      <div className="text-xs text-gray-400 capitalize">{project.genre} · {project.country.replace('_', ' ')}</div>
                    </div>
                  </div>
                  <Badge variant={project.status === 'active' ? 'success' : project.status === 'completed' ? 'info' : 'outline'} className="capitalize text-xs">
                    {project.status}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
