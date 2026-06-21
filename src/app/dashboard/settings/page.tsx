import { DashboardHeader } from '@/components/layout/dashboard-header'
import { SettingsPage } from '@/components/dashboard/settings-page'

export default function Settings() {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Settings" />
      <div className="flex-1 overflow-y-auto p-6">
        <SettingsPage />
      </div>
    </div>
  )
}
