import { DashboardHeader } from '@/components/layout/dashboard-header'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

export default function AdminPage() {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Admin Dashboard" />
      <div className="flex-1 overflow-y-auto p-6">
        <AdminDashboard />
      </div>
    </div>
  )
}
