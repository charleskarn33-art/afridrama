import { DashboardHeader } from '@/components/layout/dashboard-header'
import { VideoStudio } from '@/components/videos/video-studio'

export default function VideosPage() {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Video Studio" />
      <div className="flex-1 overflow-y-auto p-6">
        <VideoStudio />
      </div>
    </div>
  )
}
