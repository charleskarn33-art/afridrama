import { DashboardHeader } from '@/components/layout/dashboard-header'
import { DashboardOverview } from '@/components/dashboard/dashboard-overview'

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Dashboard" />
      <div className="flex-1 overflow-y-auto p-6">
        <DashboardOverview />
      </div>
    </div>
  )
}
