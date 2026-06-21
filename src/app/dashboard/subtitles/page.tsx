import { DashboardHeader } from '@/components/layout/dashboard-header'
import { SubtitleStudio } from '@/components/dashboard/subtitle-studio'

export default function SubtitlesPage() {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Subtitle Generator" />
      <div className="flex-1 overflow-y-auto p-6">
        <SubtitleStudio />
      </div>
    </div>
  )
}
