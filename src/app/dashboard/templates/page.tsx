import { DashboardHeader } from '@/components/layout/dashboard-header'
import { TemplatesGrid } from '@/components/dashboard/templates-grid'

export default function TemplatesPage() {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Templates" />
      <div className="flex-1 overflow-y-auto p-6">
        <TemplatesGrid />
      </div>
    </div>
  )
}
