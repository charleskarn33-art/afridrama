import { DashboardHeader } from '@/components/layout/dashboard-header'
import { SceneStudio } from '@/components/scenes/scene-studio'

export default function ScenesPage() {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Scene Studio" />
      <div className="flex-1 overflow-y-auto p-6">
        <SceneStudio />
      </div>
    </div>
  )
}
