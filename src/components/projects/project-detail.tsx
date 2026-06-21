'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FileText, Users, Layers, Video, Mic, ArrowRight, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { Project } from '@/types'
import { GENRE_LABELS, COUNTRY_LABELS, DURATION_LABELS } from '@/lib/utils'

interface Props {
  projectId: string
}

const quickActions = [
  { label: 'Generate Script', icon: FileText, href: (id: string) => `/dashboard/scripts?project=${id}`, color: 'bg-blue-50 text-blue-600', desc: 'AI-powered script generation' },
  { label: 'Create Characters', icon: Users, href: (id: string) => `/dashboard/characters?project=${id}`, color: 'bg-purple-50 text-purple-600', desc: 'Design your cast' },
  { label: 'Build Scenes', icon: Layers, href: (id: string) => `/dashboard/scenes?project=${id}`, color: 'bg-green-50 text-green-600', desc: 'Generate scene backgrounds' },
  { label: 'Create Videos', icon: Video, href: (id: string) => `/dashboard/videos?project=${id}`, color: 'bg-red-50 text-red-600', desc: 'AI video generation' },
  { label: 'Add Voiceovers', icon: Mic, href: (id: string) => `/dashboard/voice?project=${id}`, color: 'bg-orange-50 text-orange-600', desc: 'Generate character voices' },
]

export function ProjectDetail({ projectId }: Props) {
  const supabase = createClient()
  const [project, setProject] = useState<Project | null>(null)
  const [counts, setCounts] = useState({ scripts: 0, characters: 0, scenes: 0, videos: 0, voiceovers: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const [proj, sc, ch, scenes, vid, vo] = await Promise.all([
        supabase.from('projects').select('*').eq('id', projectId).single(),
        supabase.from('scripts').select('id', { count: 'exact' }).eq('project_id', projectId),
        supabase.from('characters').select('id', { count: 'exact' }).eq('project_id', projectId),
        supabase.from('scenes').select('id', { count: 'exact' }).eq('project_id', projectId),
        supabase.from('videos').select('id', { count: 'exact' }).eq('project_id', projectId),
        supabase.from('voiceovers').select('id', { count: 'exact' }).eq('project_id', projectId),
      ])
      setProject(proj.data as Project)
      setCounts({ scripts: sc.count || 0, characters: ch.count || 0, scenes: scenes.count || 0, videos: vid.count || 0, voiceovers: vo.count || 0 })
      setLoading(false)
    }
    fetch()
  }, [projectId])

  if (loading) return <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>
  if (!project) return <div className="text-center py-20 text-gray-500">Project not found.</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0057FF] to-[#00B86B] rounded-3xl p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-white/20 text-white border-0 capitalize">{project.status}</Badge>
              <Badge className="bg-white/20 text-white border-0 capitalize">{GENRE_LABELS[project.genre]}</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
            {project.description && <p className="text-blue-100 max-w-2xl">{project.description}</p>}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-6">
          {[
            { label: 'Country', value: COUNTRY_LABELS[project.country] || project.country },
            { label: 'Language', value: project.language },
            { label: 'Duration', value: DURATION_LABELS[project.duration] },
            { label: 'Scripts', value: counts.scripts },
            { label: 'Characters', value: counts.characters },
            { label: 'Videos', value: counts.videos },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/10 rounded-2xl px-4 py-2">
              <div className="text-xs text-blue-200">{label}</div>
              <div className="font-bold capitalize">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Production Tools</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {quickActions.map(({ label, icon: Icon, href, color, desc }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Link href={href(projectId)} className="block p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:border-[#0057FF]/20 transition-all group">
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{label}</h3>
                <p className="text-xs text-gray-500">{desc}</p>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#0057FF] mt-2 transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
