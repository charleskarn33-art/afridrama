import { DashboardHeader } from '@/components/layout/dashboard-header'
import { ProjectsList } from '@/components/projects/projects-list'

export default function ProjectsPage() {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Projects" />
      <div className="flex-1 overflow-y-auto p-6">
        <ProjectsList />
      </div>
    </div>
  )
}
