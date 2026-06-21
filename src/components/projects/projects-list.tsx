'use client'

import { useEffect, useState } from 'react'
import { Plus, FolderOpen, MoreVertical, Trash, Edit, Eye } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/auth-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import type { Project } from '@/types'
import { GENRE_LABELS, COUNTRY_LABELS, DURATION_LABELS } from '@/lib/utils'

export function ProjectsList() {
  const { user } = useAuth()
  const supabase = createClient()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const fetchProjects = async () => {
    if (!user) return
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setProjects((data || []) as Project[])
    setLoading(false)
  }

  useEffect(() => { fetchProjects() }, [user])

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete project')
    } else {
      toast.success('Project deleted')
      setProjects(p => p.filter(pr => pr.id !== id))
    }
    setOpenMenu(null)
  }

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-56 rounded-2xl" />)}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">All Projects</h2>
          <p className="text-gray-500 text-sm mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button className="bg-[#0057FF] hover:bg-[#0041CC]">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-gray-200 rounded-3xl">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">Create your first African drama project and start generating AI content.</p>
          <Link href="/dashboard/projects/new">
            <Button className="bg-[#0057FF]">
              <Plus className="w-4 h-4" />
              Create Your First Project
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:border-[#0057FF]/20 transition-all duration-300 overflow-hidden group"
            >
              {/* Thumbnail */}
              <div className="h-36 bg-gradient-to-br from-[#0057FF] via-[#003DB2] to-[#00B86B] relative">
                {project.thumbnail_url ? (
                  <img src={project.thumbnail_url} alt={project.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FolderOpen className="w-12 h-12 text-white/40" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <div className="relative">
                    <button
                      onClick={(e) => { e.preventDefault(); setOpenMenu(openMenu === project.id ? null : project.id) }}
                      className="w-8 h-8 rounded-lg bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {openMenu === project.id && (
                      <div className="absolute right-0 top-10 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-10 min-w-[140px]">
                        <Link href={`/dashboard/projects/${project.id}`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setOpenMenu(null)}>
                          <Eye className="w-4 h-4" /> View
                        </Link>
                        <Link href={`/dashboard/projects/${project.id}/edit`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setOpenMenu(null)}>
                          <Edit className="w-4 h-4" /> Edit
                        </Link>
                        <button onClick={() => deleteProject(project.id)} className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full">
                          <Trash className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute bottom-3 left-3">
                  <Badge variant={project.status === 'active' ? 'success' : project.status === 'completed' ? 'info' : 'warning'} className="capitalize text-xs">
                    {project.status}
                  </Badge>
                </div>
              </div>

              <Link href={`/dashboard/projects/${project.id}`} className="block p-5">
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#0057FF] transition-colors">{project.name}</h3>
                <div className="flex gap-2 flex-wrap mb-3">
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium capitalize">
                    {GENRE_LABELS[project.genre] || project.genre}
                  </span>
                  <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium capitalize">
                    {COUNTRY_LABELS[project.country] || project.country.replace('_', ' ')}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                    {DURATION_LABELS[project.duration] || project.duration}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Created {new Date(project.created_at).toLocaleDateString()}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
