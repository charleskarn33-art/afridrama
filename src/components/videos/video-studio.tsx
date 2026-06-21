'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Loader2, Sparkles, Play, Download, Trash, Plus, Video, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/auth-context'
import type { Video as VideoType } from '@/types'

export function VideoStudio() {
  const { user } = useAuth()
  const supabase = createClient()
  const [videos, setVideos] = useState<VideoType[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [title, setTitle] = useState('')
  const [sourceImageUrl, setSourceImageUrl] = useState('')
  const [activeTab, setActiveTab] = useState('text')

  const fetchVideos = useCallback(async () => {
    if (!user) return
    const { data } = await supabase.from('videos').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setVideos((data || []) as VideoType[])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchVideos() }, [fetchVideos])

  // Poll for processing videos
  useEffect(() => {
    const processingVideos = videos.filter(v => v.status === 'processing' || v.status === 'pending')
    if (processingVideos.length === 0) return
    const interval = setInterval(fetchVideos, 10000)
    return () => clearInterval(interval)
  }, [videos, fetchVideos])

  const generateVideo = async () => {
    if (!prompt.trim()) { toast.error('Enter a description'); return }
    if (!user) return
    setGenerating(true)
    try {
      const res = await fetch('/api/videos/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || 'African Drama Clip',
          prompt,
          source_type: activeTab === 'image' ? 'image_to_video' : 'text_to_video',
          source_image_url: activeTab === 'image' ? sourceImageUrl : null,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      toast.success('Video job started! Processing in background.')
      await fetchVideos()
      setDialogOpen(false)
      setPrompt('')
      setTitle('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate video'
      toast.error(message)
    } finally {
      setGenerating(false)
    }
  }

  const deleteVideo = async (id: string) => {
    await supabase.from('videos').delete().eq('id', id)
    setVideos(prev => prev.filter(v => v.id !== id))
    toast.success('Video deleted')
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Video Studio</h2>
          <p className="text-gray-500 mt-1">Generate AI videos from text or images</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchVideos} size="sm"><RefreshCw className="w-4 h-4" /></Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#0057FF] hover:bg-[#0041CC]"><Plus className="w-4 h-4" /> Generate Video</Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader><DialogTitle>Generate New Video</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Video Title</Label>
                  <Input placeholder="e.g., Opening Scene" className="mt-1" value={title} onChange={e => setTitle(e.target.value)} />
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full">
                    <TabsTrigger value="text" className="flex-1">Text to Video</TabsTrigger>
                    <TabsTrigger value="image" className="flex-1">Image to Video</TabsTrigger>
                  </TabsList>
                  <TabsContent value="text" className="mt-4">
                    <Label>Scene Description</Label>
                    <Textarea
                      placeholder="Describe your scene... e.g., A woman walks through a busy African market at golden hour, colorful fabrics blowing in the wind, traders calling out..."
                      className="mt-1 h-32"
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                    />
                  </TabsContent>
                  <TabsContent value="image" className="mt-4 space-y-3">
                    <div>
                      <Label>Source Image URL</Label>
                      <Input placeholder="https://... or paste image URL" className="mt-1" value={sourceImageUrl} onChange={e => setSourceImageUrl(e.target.value)} />
                    </div>
                    <div>
                      <Label>Animation Description</Label>
                      <Textarea
                        placeholder="Describe how the image should animate... e.g., Camera slowly zooms in, wind blows the character's dress..."
                        className="mt-1 h-24"
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
                  <strong>Note:</strong> Video generation takes 2-5 minutes and runs in the background. You'll see the result when complete.
                </div>

                <Button onClick={generateVideo} disabled={generating} className="w-full bg-[#0057FF]">
                  {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {generating ? 'Creating Video Job...' : 'Generate Video'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-gray-200 rounded-3xl">
          <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No videos yet</h3>
          <p className="text-gray-500 mb-6">Generate your first AI video clip.</p>
          <Button onClick={() => setDialogOpen(true)} className="bg-[#0057FF]"><Plus className="w-4 h-4" /> Generate Video</Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, i) => (
            <motion.div key={video.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-900 relative overflow-hidden">
                {video.video_url ? (
                  <video src={video.video_url} className="w-full h-full object-cover" />
                ) : video.thumbnail_url ? (
                  <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="w-10 h-10 text-gray-600" />
                  </div>
                )}

                {video.status === 'processing' || video.status === 'pending' ? (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-white animate-spin mb-3" />
                    <p className="text-white text-sm font-medium">Generating...</p>
                    <Progress value={video.progress} className="w-24 mt-2 h-1" />
                  </div>
                ) : video.status === 'completed' && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100">
                      <Play className="w-5 h-5 text-gray-800 ml-0.5" />
                    </button>
                    {video.video_url && (
                      <a href={video.video_url} download className="w-9 h-9 bg-white rounded-lg flex items-center justify-center hover:bg-gray-100">
                        <Download className="w-4 h-4 text-gray-700" />
                      </a>
                    )}
                  </div>
                )}
              </div>
              <div className="p-4 flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-900 truncate">{video.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={video.status === 'completed' ? 'success' : video.status === 'failed' ? 'destructive' : 'warning'} className="text-xs capitalize">
                      {video.status}
                    </Badge>
                    <span className="text-xs text-gray-400 capitalize">{video.source_type.replace('_', ' ')}</span>
                  </div>
                </div>
                <button onClick={() => deleteVideo(video.id)} className="ml-2 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0">
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
