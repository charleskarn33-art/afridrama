'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Loader2, Sparkles, Download, Subtitles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/auth-context'
import type { Subtitle } from '@/types'

export function SubtitleStudio() {
  const { user } = useAuth()
  const supabase = createClient()
  const [subtitles, setSubtitles] = useState<Subtitle[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [audioUrl, setAudioUrl] = useState('')
  const [language, setLanguage] = useState('english')

  useEffect(() => {
    if (!user) return
    supabase.from('subtitles').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => { setSubtitles((data || []) as Subtitle[]); setLoading(false) })
  }, [user])

  const generate = async () => {
    if (!audioUrl) { toast.error('Enter an audio URL'); return }
    setGenerating(true)
    try {
      const res = await fetch('/api/subtitles/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio_url: audioUrl, language }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Subtitles generated!')
      const { data: subs } = await supabase.from('subtitles').select('*').eq('user_id', user!.id).order('created_at', { ascending: false })
      setSubtitles((subs || []) as Subtitle[])
      setAudioUrl('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Subtitle generation failed'
      toast.error(message)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Subtitle Generator</h2>
        <p className="text-gray-500 mt-1">Auto-generate subtitles from audio using Whisper AI</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Subtitles className="w-5 h-5 text-[#0057FF]" /> Generate Subtitles</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Audio File URL</Label>
            <Input placeholder="https://... paste the URL of your voiceover or audio file" className="mt-1" value={audioUrl} onChange={e => setAudioUrl(e.target.value)} />
          </div>
          <div>
            <Label>Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="french">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={generate} disabled={generating} className="bg-[#0057FF]">
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? 'Generating Subtitles...' : 'Generate Subtitles'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Generated Subtitles</CardTitle></CardHeader>
        <CardContent>
          {loading ? <div className="text-center py-8 text-gray-400">Loading...</div> : subtitles.length === 0 ? (
            <div className="text-center py-10">
              <Subtitles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No subtitles yet. Generate from an audio file above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {subtitles.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <Badge variant="info" className="capitalize text-xs mb-1">{sub.language}</Badge>
                    <div className="text-sm text-gray-600">{sub.content?.length || 0} subtitle entries</div>
                    <div className="text-xs text-gray-400">{new Date(sub.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="flex gap-2">
                    {sub.srt_url && (
                      <a href={sub.srt_url} download>
                        <Button variant="outline" size="sm"><Download className="w-3 h-3 mr-1" /> SRT</Button>
                      </a>
                    )}
                    {sub.vtt_url && (
                      <a href={sub.vtt_url} download>
                        <Button variant="outline" size="sm"><Download className="w-3 h-3 mr-1" /> VTT</Button>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
