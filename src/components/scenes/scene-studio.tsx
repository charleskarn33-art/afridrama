'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Loader2, Sparkles, Download, Trash, Plus, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/auth-context'
import type { Scene } from '@/types'

const sceneTypes = [
  { value: 'village', label: 'Village', desc: 'Traditional African village' },
  { value: 'city', label: 'City', desc: 'Modern African city' },
  { value: 'market', label: 'Market', desc: 'Vibrant African market' },
  { value: 'school', label: 'School', desc: 'African school/classroom' },
  { value: 'church', label: 'Church', desc: 'African church interior' },
  { value: 'hospital', label: 'Hospital', desc: 'African hospital' },
  { value: 'office', label: 'Office', desc: 'Modern office' },
  { value: 'house', label: 'House', desc: 'Family home interior' },
  { value: 'outdoor', label: 'Outdoor', desc: 'Natural outdoor setting' },
  { value: 'custom', label: 'Custom', desc: 'Custom location' },
]

export function SceneStudio() {
  const { user } = useAuth()
  const supabase = createClient()
  const [scenes, setScenes] = useState<Scene[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [sceneType, setSceneType] = useState('village')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [country, setCountry] = useState('ghana')

  const fetchScenes = async () => {
    if (!user) return
    const { data } = await supabase.from('scenes').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setScenes((data || []) as Scene[])
    setLoading(false)
  }

  useEffect(() => { fetchScenes() }, [user])

  const generateScene = async () => {
    if (!title.trim()) { toast.error('Enter a scene title'); return }
    if (!user) return
    setGenerating(true)
    try {
      const sceneDescs: Record<string, string> = {
        village: 'traditional African village with thatched mud houses, large trees, chickens, and a dusty compound',
        city: 'modern African cityscape with tall buildings, busy streets, colorful signage, and urban life',
        market: 'vibrant African open-air market with colorful fabric stalls, fresh produce, traders and buyers',
        school: 'African school classroom with wooden desks, blackboard with chalk writing, and natural light',
        church: 'rustic African church with wooden pews, colorful stained glass, altar with cross, and candles',
        hospital: 'African hospital ward with metal beds, nurses in white uniforms, clean but modest facility',
        office: 'modern African office with computers, glass partitions, and professional African workers',
        house: 'warm African family living room with patterned fabric sofa, family photos, and local decorations',
        outdoor: 'beautiful African landscape with savanna, baobab trees, red earth, and golden sunset',
        custom: description || 'authentic African setting',
      }

      const prompt = `${sceneDescs[sceneType]} in ${country}. ${description}. Cinematic wide angle shot, dramatic natural lighting, African drama film aesthetic, high quality photorealistic, detailed and immersive environment, warm color palette`

      const res = await fetch('/api/images/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, image_type: 'background', width: 1280, height: 720 }),
      })

      let imageUrl = null
      if (res.ok) {
        const imgData = await res.json()
        imageUrl = imgData.image_url
      }

      const { data: scene, error } = await supabase.from('scenes').insert({
        user_id: user.id,
        title,
        scene_type: sceneType,
        description,
        prompt_used: prompt,
        image_url: imageUrl,
        order_index: scenes.length,
      }).select().single()

      if (error) throw error

      toast.success('Scene generated!')
      setScenes(prev => [scene as Scene, ...prev])
      setDialogOpen(false)
      setTitle('')
      setDescription('')
    } catch {
      toast.error('Failed to generate scene')
    } finally {
      setGenerating(false)
    }
  }

  const deleteScene = async (id: string) => {
    await supabase.from('scenes').delete().eq('id', id)
    setScenes(prev => prev.filter(s => s.id !== id))
    toast.success('Scene deleted')
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Scene Studio</h2>
          <p className="text-gray-500 mt-1">Generate authentic African scene backgrounds</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0057FF] hover:bg-[#0041CC]">
              <Plus className="w-4 h-4" /> Generate Scene
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Generate New Scene</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Scene Title</Label>
                <Input placeholder="e.g., Village Morning Market" className="mt-1" value={title} onChange={e => setTitle(e.target.value)} />
              </div>

              <div>
                <Label>Scene Type</Label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2">
                  {sceneTypes.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setSceneType(value)}
                      className={`py-2 px-3 rounded-xl text-sm font-medium border-2 transition-all ${sceneType === value ? 'border-[#0057FF] bg-blue-50 text-[#0057FF]' : 'border-gray-100 text-gray-600 hover:border-gray-200'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="liberia">🇱🇷 Liberia</SelectItem>
                    <SelectItem value="ghana">🇬🇭 Ghana</SelectItem>
                    <SelectItem value="nigeria">🇳🇬 Nigeria</SelectItem>
                    <SelectItem value="sierra_leone">🇸🇱 Sierra Leone</SelectItem>
                    <SelectItem value="kenya">🇰🇪 Kenya</SelectItem>
                    <SelectItem value="south_africa">🇿🇦 South Africa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Additional Details (optional)</Label>
                <Textarea
                  placeholder="Describe specific details, time of day, weather, mood..."
                  className="mt-1 h-20"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              <Button onClick={generateScene} disabled={generating} className="w-full bg-[#0057FF]">
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {generating ? 'Generating Scene...' : 'Generate Scene with AI'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-56 rounded-2xl" />)}
        </div>
      ) : scenes.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-gray-200 rounded-3xl">
          <Layers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No scenes yet</h3>
          <p className="text-gray-500 mb-6">Generate your first African scene background.</p>
          <Button onClick={() => setDialogOpen(true)} className="bg-[#0057FF]"><Plus className="w-4 h-4" /> Generate Scene</Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenes.map((scene, i) => (
            <motion.div key={scene.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                {scene.image_url ? (
                  <img src={scene.image_url} alt={scene.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Layers className="w-10 h-10 text-gray-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  {scene.image_url && (
                    <a href={scene.image_url} download className="w-9 h-9 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100">
                      <Download className="w-4 h-4 text-gray-700" />
                    </a>
                  )}
                  <button onClick={() => deleteScene(scene.id)} className="w-9 h-9 bg-red-500 rounded-lg flex items-center justify-center hover:bg-red-600">
                    <Trash className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900">{scene.title}</h3>
                <p className="text-sm text-gray-500 capitalize">{scene.scene_type}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
