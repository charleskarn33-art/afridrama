import { DashboardHeader } from '@/components/layout/dashboard-header'
import { ProjectDetail } from '@/components/projects/project-detail'

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Project" />
      <div className="flex-1 overflow-y-auto p-6">
        <ProjectDetail projectId={params.id} />
      </div>
    </div>
  )
}
