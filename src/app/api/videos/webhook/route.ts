import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const supabase = await createClient()

  const { id: job_id, status, output, error } = body

  if (status === 'succeeded' && output) {
    const videoUrl = Array.isArray(output) ? output[0] : output

    // Download and store in Supabase
    try {
      const videoRes = await fetch(videoUrl)
      const buffer = await videoRes.arrayBuffer()
      const fileName = `videos/${job_id}.mp4`

      await supabase.storage.from('videos').upload(fileName, buffer, { contentType: 'video/mp4' })
      const { data: { publicUrl } } = supabase.storage.from('videos').getPublicUrl(fileName)

      await supabase.from('videos').update({
        status: 'completed',
        progress: 100,
        video_url: publicUrl,
      }).eq('job_id', job_id)
    } catch (e) {
      console.error('Webhook video storage error:', e)
      await supabase.from('videos').update({ status: 'failed', error_message: 'Storage failed' }).eq('job_id', job_id)
    }
  } else if (status === 'failed') {
    await supabase.from('videos').update({
      status: 'failed',
      error_message: error || 'Video generation failed',
    }).eq('job_id', job_id)
  } else if (status === 'processing') {
    await supabase.from('videos').update({ status: 'processing', progress: 50 }).eq('job_id', job_id)
  }

  return NextResponse.json({ received: true })
}
