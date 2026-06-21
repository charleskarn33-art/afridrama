import { DashboardHeader } from '@/components/layout/dashboard-header'
import { AnalyticsDashboard } from '@/components/dashboard/analytics-dashboard'

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Analytics" />
      <div className="flex-1 overflow-y-auto p-6">
        <AnalyticsDashboard />
      </div>
    </div>
  )
}
