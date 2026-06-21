'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Loader2, Sparkles, Download, Trash, Plus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/auth-context'
import type { Character } from '@/types'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  gender: z.enum(['male', 'female', 'non_binary']),
  age: z.number().min(1).max(120),
  occupation: z.string().min(2, 'Occupation is required'),
  appearance: z.string().min(10, 'Describe the character appearance'),
  clothing: z.string().min(5, 'Describe the clothing'),
  personality: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function CharacterStudio() {
  const { user } = useAuth()
  const supabase = createClient()
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { gender: 'female', age: 25 },
  })

  const fetchCharacters = async () => {
    if (!user) return
    const { data } = await supabase.from('characters').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setCharacters((data || []) as Character[])
    setLoading(false)
  }

  useEffect(() => { fetchCharacters() }, [user])

  const onSubmit = async (data: FormData) => {
    if (!user) return
    setGenerating(true)
    try {
      const prompt = `A ${data.age}-year-old ${data.gender} African character named ${data.name}, working as a ${data.occupation}. ${data.appearance}. Wearing ${data.clothing}. African drama film character portrait, cinematic lighting, photorealistic, detailed face, warm African skin tone, professional photography style, shallow depth of field`

      const res = await fetch('/api/images/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, image_type: 'character', width: 512, height: 768 }),
      })

      let imageUrl = null
      if (res.ok) {
        const imgData = await res.json()
        imageUrl = imgData.image_url
        setGeneratedImage(imageUrl)
      }

      const { data: char, error } = await supabase.from('characters').insert({
        user_id: user.id,
        name: data.name,
        gender: data.gender,
        age: data.age,
        occupation: data.occupation,
        appearance: data.appearance,
        clothing: data.clothing,
        personality: data.personality || null,
        image_url: imageUrl,
        prompt_used: prompt,
      }).select().single()

      if (error) throw error

      toast.success(`Character "${data.name}" created!`)
      setCharacters(prev => [char as Character, ...prev])
      reset()
      setGeneratedImage(null)
      setDialogOpen(false)
    } catch (err) {
      toast.error('Failed to create character')
    } finally {
      setGenerating(false)
    }
  }

  const deleteCharacter = async (id: string) => {
    await supabase.from('characters').delete().eq('id', id)
    setCharacters(prev => prev.filter(c => c.id !== id))
    toast.success('Character deleted')
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Character Studio</h2>
          <p className="text-gray-500 mt-1">Create AI-generated characters for your productions</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0057FF] hover:bg-[#0041CC]">
              <Plus className="w-4 h-4" />
              Create Character
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Character</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Character Name *</Label>
                  <Input placeholder="e.g., Abena Mensah" className="mt-1" {...register('name')} />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <Label>Gender *</Label>
                  <Select defaultValue="female" onValueChange={(v) => setValue('gender', v as 'male' | 'female' | 'non_binary')}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="non_binary">Non-binary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Age *</Label>
                  <Input type="number" min={1} max={120} className="mt-1" {...register('age', { valueAsNumber: true })} />
                </div>
                <div>
                  <Label>Occupation *</Label>
                  <Input placeholder="e.g., Nurse, Teacher, Farmer" className="mt-1" {...register('occupation')} />
                  {errors.occupation && <p className="text-xs text-red-500 mt-1">{errors.occupation.message}</p>}
                </div>
              </div>

              <div>
                <Label>Physical Appearance *</Label>
                <Textarea
                  placeholder="e.g., Tall, slender build, dark brown skin, high cheekbones, warm expressive eyes, natural afro hair..."
                  className="mt-1 h-20"
                  {...register('appearance')}
                />
                {errors.appearance && <p className="text-xs text-red-500 mt-1">{errors.appearance.message}</p>}
              </div>

              <div>
                <Label>Clothing *</Label>
                <Textarea
                  placeholder="e.g., Traditional Kente cloth dress in gold and red, matching headwrap, gold jewelry..."
                  className="mt-1 h-16"
                  {...register('clothing')}
                />
              </div>

              <div>
                <Label>Personality (optional)</Label>
                <Input placeholder="e.g., Bold, determined, compassionate, with a quick wit" className="mt-1" {...register('personality')} />
              </div>

              {generatedImage && (
                <div className="rounded-xl overflow-hidden border border-gray-100">
                  <img src={generatedImage} alt="Generated character" className="w-full max-h-64 object-contain" />
                </div>
              )}

              <Button type="submit" disabled={generating} className="w-full bg-[#0057FF]">
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {generating ? 'Generating Character...' : 'Generate Character with AI'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-80 rounded-2xl" />)}
        </div>
      ) : characters.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-gray-200 rounded-3xl">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No characters yet</h3>
          <p className="text-gray-500 mb-6">Create your first AI-generated character.</p>
          <Button onClick={() => setDialogOpen(true)} className="bg-[#0057FF]">
            <Plus className="w-4 h-4" /> Create Character
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {characters.map((char, i) => (
            <motion.div
              key={char.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                {char.image_url ? (
                  <img src={char.image_url} alt={char.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 gap-3">
                  {char.image_url && (
                    <a href={char.image_url} download className="w-9 h-9 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100">
                      <Download className="w-4 h-4 text-gray-700" />
                    </a>
                  )}
                  <button
                    onClick={() => deleteCharacter(char.id)}
                    className="w-9 h-9 bg-red-500 rounded-lg flex items-center justify-center hover:bg-red-600"
                  >
                    <Trash className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900">{char.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{char.occupation} · {char.age}yrs</p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{char.appearance}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
