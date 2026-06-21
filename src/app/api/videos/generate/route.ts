import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, prompt, source_type, source_image_url, project_id } = await req.json()

  if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })

  try {
    // Create pending video record
    const { data: video, error: dbError } = await supabase.from('videos').insert({
      user_id: user.id,
      project_id: project_id || null,
      title: title || 'Untitled Video',
      status: 'pending',
      progress: 0,
      source_type: source_type || 'text_to_video',
      prompt,
      source_image_url: source_image_url || null,
    }).select().single()

    if (dbError) throw dbError

    // Trigger Wan 2.1 via Replicate (async job)
    if (process.env.REPLICATE_API_TOKEN) {
      const replicateRes = await fetch('https://api.replicate.com/v1/models/wan-ai/wan2.1-t2v-480p/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: {
            prompt: `${prompt}. African drama film style, cinematic, high quality`,
            num_frames: 81,
            resolution: '480p',
            sample_steps: 30,
          },
          webhook: `${process.env.NEXT_PUBLIC_APP_URL}/api/videos/webhook`,
          webhook_events_filter: ['completed', 'failed'],
        }),
      })

      if (replicateRes.ok) {
        const job = await replicateRes.json()
        await supabase.from('videos').update({
          status: 'processing',
          progress: 10,
          job_id: job.id,
        }).eq('id', video.id)

        return NextResponse.json({ id: video.id, status: 'processing', job_id: job.id })
      }
    }

    // Update status if no provider available
    await supabase.from('videos').update({ status: 'failed', error_message: 'No video provider configured' }).eq('id', video.id)
    return NextResponse.json({ id: video.id, status: 'failed', error: 'Configure REPLICATE_API_TOKEN for video generation' }, { status: 503 })

  } catch (error) {
    console.error('Video generation error:', error)
    return NextResponse.json({ error: 'Failed to create video job' }, { status: 500 })
  }
}
