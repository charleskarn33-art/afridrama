import { DashboardHeader } from '@/components/layout/dashboard-header'
import { ScriptStudio } from '@/components/scripts/script-studio'

export default function ScriptsPage() {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Script Studio" />
      <div className="flex-1 overflow-y-auto p-6">
        <ScriptStudio />
      </div>
    </div>
  )
}
