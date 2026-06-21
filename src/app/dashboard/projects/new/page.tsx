import { DashboardHeader } from '@/components/layout/dashboard-header'
import { NewProjectWizard } from '@/components/projects/new-project-wizard'

export default function NewProjectPage() {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Create New Project" />
      <div className="flex-1 overflow-y-auto p-6">
        <NewProjectWizard />
      </div>
    </div>
  )
}
