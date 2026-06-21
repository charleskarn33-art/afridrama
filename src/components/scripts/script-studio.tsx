'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Loader2, Sparkles, RefreshCw, Save, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/auth-context'
import type { Script, SceneBreakdown } from '@/types'

const schema = z.object({
  topic: z.string().min(10, 'Topic must be at least 10 characters'),
  genre: z.string(),
  duration: z.string(),
  country: z.string(),
  language: z.string(),
  project_id: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function ScriptStudio() {
  const { user } = useAuth()
  const supabase = createClient()
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [script, setScript] = useState<Partial<Script> | null>(null)
  const [expandedScene, setExpandedScene] = useState<number | null>(null)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { genre: 'drama', duration: '5min', country: 'ghana', language: 'english' },
  })

  const onGenerate = async (data: FormData) => {
    setGenerating(true)
    try {
      const res = await fetch('/api/scripts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Generation failed')
      const result = await res.json()
      setScript({ ...result, ...data })
      toast.success('Script generated successfully!')
    } catch {
      toast.error('Failed to generate script. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const saveScript = async () => {
    if (!user || !script) return
    setSaving(true)
    try {
      const { error } = await supabase.from('scripts').insert({
        user_id: user.id,
        project_id: watch('project_id') || null,
        title: script.title,
        topic: watch('topic'),
        genre: watch('genre'),
        duration: watch('duration'),
        country: watch('country'),
        characters: script.characters || [],
        story: script.story,
        dialogue: script.dialogue,
        narration: script.narration,
        scene_breakdown: script.scene_breakdown || [],
        raw_content: JSON.stringify(script),
        version: 1,
      })
      if (error) throw error
      toast.success('Script saved to your library!')
    } catch {
      toast.error('Failed to save script')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Script Generator</h2>
          <p className="text-gray-500 mt-1">Generate complete African drama scripts with AI</p>
        </div>
        {script && (
          <Button onClick={saveScript} disabled={saving} className="bg-[#00B86B] hover:bg-[#009A59]">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Script'}
          </Button>
        )}
      </div>

      {/* Generator Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#0057FF]" />
            Script Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onGenerate)} className="space-y-4">
            <div>
              <Label>Story Topic / Premise *</Label>
              <Textarea
                placeholder="e.g., A young woman returns to her village after studying abroad, only to discover her family's secret past threatens to destroy everything..."
                className="mt-1 h-24"
                {...register('topic')}
              />
              {errors.topic && <p className="text-xs text-red-500 mt-1">{errors.topic.message}</p>}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label>Genre</Label>
                <Select defaultValue="drama" onValueChange={(v) => setValue('genre', v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['drama', 'comedy', 'romance', 'historical', 'christian', 'educational', 'action'].map(g => (
                      <SelectItem key={g} value={g} className="capitalize">{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Country</Label>
                <Select defaultValue="ghana" onValueChange={(v) => setValue('country', v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
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
                <Label>Language</Label>
                <Select defaultValue="english" onValueChange={(v) => setValue('language', v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="local">Local Language</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Duration</Label>
                <Select defaultValue="5min" onValueChange={(v) => setValue('duration', v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1min">1 Minute</SelectItem>
                    <SelectItem value="3min">3 Minutes</SelectItem>
                    <SelectItem value="5min">5 Minutes</SelectItem>
                    <SelectItem value="10min">10 Minutes</SelectItem>
                    <SelectItem value="20min">20 Minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={generating} className="bg-[#0057FF] hover:bg-[#0041CC] flex-1 sm:flex-none">
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {generating ? 'Generating Script...' : 'Generate Script'}
              </Button>
              {script && (
                <Button type="submit" variant="outline" disabled={generating}>
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Loading */}
      {generating && (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-[#0057FF] animate-pulse" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Writing Your Script...</h3>
            <p className="text-gray-500 text-sm">AI is crafting an authentic African drama script</p>
          </CardContent>
        </Card>
      )}

      {/* Script Output */}
      <AnimatePresence>
        {script && !generating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Title */}
            <Card className="border-[#0057FF]/20 bg-gradient-to-r from-blue-50 to-green-50">
              <CardContent className="p-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{script.title}</h2>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="info" className="capitalize">{watch('genre')}</Badge>
                  <Badge variant="success" className="capitalize">{watch('country').replace('_', ' ')}</Badge>
                  <Badge variant="outline" className="capitalize">{watch('duration')}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Characters */}
            {script.characters && script.characters.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Characters</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {script.characters.map((char, i) => (
                      <div key={i} className="p-4 bg-gray-50 rounded-xl">
                        <div className="font-bold text-gray-900">{char.name}</div>
                        <div className="text-xs text-[#0057FF] font-medium capitalize mb-1">{char.role}</div>
                        <div className="text-sm text-gray-500">{char.description}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Story */}
            <Card>
              <CardHeader><CardTitle>Story Synopsis</CardTitle></CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{script.story}</p>
              </CardContent>
            </Card>

            {/* Narration */}
            {script.narration && (
              <Card>
                <CardHeader><CardTitle>Narration</CardTitle></CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-xl p-4 italic text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {script.narration}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Dialogue */}
            <Card>
              <CardHeader><CardTitle>Full Dialogue</CardTitle></CardHeader>
              <CardContent>
                <div className="font-mono text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 rounded-xl p-4 max-h-96 overflow-y-auto">
                  {script.dialogue}
                </div>
              </CardContent>
            </Card>

            {/* Scene Breakdown */}
            {script.scene_breakdown && script.scene_breakdown.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Scene Breakdown</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {(script.scene_breakdown as SceneBreakdown[]).map((scene, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                      <button
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                        onClick={() => setExpandedScene(expandedScene === i ? null : i)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#0057FF] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                            {scene.scene_number}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{scene.title}</div>
                            <div className="text-xs text-gray-400">{scene.location} · {scene.duration_seconds}s</div>
                          </div>
                        </div>
                        {expandedScene === i ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </button>
                      {expandedScene === i && (
                        <div className="px-4 pb-4 border-t border-gray-50">
                          <p className="text-sm text-gray-600 mt-3 mb-2">{scene.description}</p>
                          <div className="flex gap-2 flex-wrap mb-3">
                            {scene.characters.map(c => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}
                          </div>
                          {scene.dialogue && (
                            <div className="font-mono text-xs bg-gray-50 rounded-lg p-3 text-gray-600 whitespace-pre-wrap">
                              {scene.dialogue}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
