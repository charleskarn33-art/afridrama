'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Loader2, Sparkles, Play, Download, Trash, Plus, Mic, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/auth-context'
import type { Voiceover } from '@/types'

export function VoiceStudio() {
  const { user } = useAuth()
  const supabase = createClient()
  const [voiceovers, setVoiceovers] = useState<Voiceover[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [playing, setPlaying] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [voiceType, setVoiceType] = useState('female')
  const [speed, setSpeed] = useState(1.0)
  const [emotion, setEmotion] = useState('neutral')
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!user) return
    supabase.from('voiceovers').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => {
      setVoiceovers((data || []) as Voiceover[])
      setLoading(false)
    })
  }, [user])

  const generateVoice = async () => {
    if (!text.trim()) { toast.error('Enter text to convert'); return }
    if (!user) return
    setGenerating(true)
    try {
      const res = await fetch('/api/voice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice_type: voiceType, speed, emotion }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      toast.success('Voice generated!')
      const { data: vos } = await supabase.from('voiceovers').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      setVoiceovers((vos || []) as Voiceover[])
      setText('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Voice generation failed'
      toast.error(message)
    } finally {
      setGenerating(false)
    }
  }

  const playAudio = (url: string, id: string) => {
    if (audioRef) { audioRef.pause(); audioRef.src = '' }
    if (playing === id) { setPlaying(null); return }
    const audio = new Audio(url)
    audio.play()
    audio.onended = () => setPlaying(null)
    setAudioRef(audio)
    setPlaying(id)
  }

  const deleteVoiceover = async (id: string) => {
    await supabase.from('voiceovers').delete().eq('id', id)
    setVoiceovers(prev => prev.filter(v => v.id !== id))
    toast.success('Voiceover deleted')
  }

  const voiceOptions = [
    { value: 'male', label: 'Male', desc: 'Deep, authoritative voice' },
    { value: 'female', label: 'Female', desc: 'Warm, expressive voice' },
    { value: 'child', label: 'Child', desc: 'Young, light voice' },
    { value: 'narrator', label: 'Narrator', desc: 'Professional narration voice' },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Voice Studio</h2>
        <p className="text-gray-500 mt-1">Generate natural African voices for your drama productions</p>
      </div>

      {/* Generator */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Mic className="w-5 h-5 text-[#0057FF]" /> Generate Voiceover</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Script / Text to Speak *</Label>
            <Textarea
              placeholder="Enter the dialogue or narration text here... e.g., 'My daughter, you have brought shame upon this family. The ancestors are watching.'"
              className="mt-1 h-32"
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <div className="text-xs text-gray-400 mt-1 text-right">{text.length} chars · ~{Math.ceil(text.split(' ').length / 2.5)}s</div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {voiceOptions.map(({ value, label, desc }) => (
              <button
                key={value}
                onClick={() => setVoiceType(value)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${voiceType === value ? 'border-[#0057FF] bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <div className="font-semibold text-sm text-gray-900">{label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Emotion</Label>
              <Select value={emotion} onValueChange={setEmotion}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="happy">Happy / Joyful</SelectItem>
                  <SelectItem value="sad">Sad / Tearful</SelectItem>
                  <SelectItem value="dramatic">Dramatic / Intense</SelectItem>
                  <SelectItem value="excited">Excited / Energetic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Speed: {speed}x</Label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={speed}
                onChange={e => setSpeed(parseFloat(e.target.value))}
                className="mt-2 w-full accent-[#0057FF]"
              />
            </div>
          </div>

          <Button onClick={generateVoice} disabled={generating} className="w-full sm:w-auto bg-[#0057FF]">
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? 'Generating Voice...' : 'Generate Voice'}
          </Button>
        </CardContent>
      </Card>

      {/* Voiceovers Library */}
      <Card>
        <CardHeader><CardTitle>Your Voiceovers</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16" />)}</div>
          ) : voiceovers.length === 0 ? (
            <div className="text-center py-10">
              <Mic className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No voiceovers yet. Generate your first voice above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {voiceovers.map((vo, i) => (
                <motion.div key={vo.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <button
                    onClick={() => vo.audio_url && playAudio(vo.audio_url, vo.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${playing === vo.id ? 'bg-[#0057FF] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#0057FF] hover:text-[#0057FF]'}`}
                  >
                    {playing === vo.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{vo.text.slice(0, 80)}{vo.text.length > 80 ? '...' : ''}</div>
                    <div className="text-xs text-gray-400 capitalize">{vo.voice_type} · {vo.emotion} · {vo.duration_seconds}s</div>
                  </div>
                  <div className="flex gap-2">
                    {vo.audio_url && (
                      <a href={vo.audio_url} download className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-[#0057FF] transition-colors">
                        <Download className="w-3.5 h-3.5 text-gray-600" />
                      </a>
                    )}
                    <button onClick={() => deleteVoiceover(vo.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
