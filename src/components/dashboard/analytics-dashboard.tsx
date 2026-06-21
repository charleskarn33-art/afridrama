'use client'

import { useEffect, useState } from 'react'
import { FolderOpen, Video, Image, Mic, HardDrive, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/auth-context'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#0057FF', '#00B86B', '#F59E0B', '#EF4444', '#8B5CF6']

export function AnalyticsDashboard() {
  const { user } = useAuth()
  const supabase = createClient()
  const [stats, setStats] = useState<Record<string, number>>({})
  const [genreData, setGenreData] = useState<{ name: string; value: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const fetch = async () => {
      const [projects, videos, images, voiceovers] = await Promise.all([
        supabase.from('projects').select('id, genre', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('videos').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('images').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('voiceovers').select('id, duration_seconds', { count: 'exact' }).eq('user_id', user.id),
      ])

      const totalMinutes = Math.ceil(((voiceovers.data || []).reduce((s: number, v: { duration_seconds?: number }) => s + (v.duration_seconds || 0), 0)) / 60)

      setStats({
        projects: projects.count || 0,
        videos: videos.count || 0,
        images: images.count || 0,
        voiceovers: voiceovers.count || 0,
        minutes: totalMinutes,
      })

      // Genre breakdown
      const genreCounts: Record<string, number> = {}
      ;(projects.data || []).forEach((p: { genre?: string }) => {
        if (p.genre) genreCounts[p.genre] = (genreCounts[p.genre] || 0) + 1
      })
      setGenreData(Object.entries(genreCounts).map(([name, value]) => ({ name, value })))
      setLoading(false)
    }
    fetch()
  }, [user])

  const weeklyData = [
    { day: 'Mon', projects: 1, videos: 2, images: 5 },
    { day: 'Tue', projects: 2, videos: 1, images: 8 },
    { day: 'Wed', projects: 0, videos: 3, images: 12 },
    { day: 'Thu', projects: 1, videos: 4, images: 7 },
    { day: 'Fri', projects: 3, videos: 2, images: 15 },
    { day: 'Sat', projects: 2, videos: 5, images: 10 },
    { day: 'Sun', projects: 1, videos: 3, images: 6 },
  ]

  const statCards = [
    { label: 'Total Projects', value: stats.projects || 0, icon: FolderOpen, color: 'bg-blue-50 text-blue-600' },
    { label: 'Videos Created', value: stats.videos || 0, icon: Video, color: 'bg-purple-50 text-purple-600' },
    { label: 'Images Generated', value: stats.images || 0, icon: Image, color: 'bg-green-50 text-green-600' },
    { label: 'Voiceovers', value: stats.voiceovers || 0, icon: Mic, color: 'bg-orange-50 text-orange-600' },
    { label: 'Minutes Generated', value: stats.minutes || 0, icon: TrendingUp, color: 'bg-pink-50 text-pink-600' },
  ]

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
        <p className="text-gray-500 mt-1">Track your production activity and usage</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{value}</div>
              <div className="text-sm text-gray-500 mt-1">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Weekly Activity</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="videos" fill="#0057FF" radius={[4, 4, 0, 0]} name="Videos" />
                <Bar dataKey="images" fill="#00B86B" radius={[4, 4, 0, 0]} name="Images" />
                <Bar dataKey="projects" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Projects" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Projects by Genre</CardTitle></CardHeader>
          <CardContent>
            {genreData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={genreData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                    {genreData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No projects yet</div>
            )}
            <div className="space-y-2 mt-2">
              {genreData.map(({ name, value }, i) => (
                <div key={name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-gray-600 capitalize">{name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
