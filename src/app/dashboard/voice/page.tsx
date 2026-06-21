import { DashboardHeader } from '@/components/layout/dashboard-header'
import { VoiceStudio } from '@/components/voice/voice-studio'

export default function VoicePage() {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Voice Studio" />
      <div className="flex-1 overflow-y-auto p-6">
        <VoiceStudio />
      </div>
    </div>
  )
}
