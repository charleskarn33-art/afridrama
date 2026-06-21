import { DashboardHeader } from '@/components/layout/dashboard-header'
import { CharacterStudio } from '@/components/characters/character-studio'

export default function CharactersPage() {
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Character Studio" />
      <div className="flex-1 overflow-y-auto p-6">
        <CharacterStudio />
      </div>
    </div>
  )
}
