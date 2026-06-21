import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { text, voice_type, speed = 1.0, pitch = 1.0, emotion = 'neutral', project_id } = await req.json()

  if (!text) return NextResponse.json({ error: 'Text is required' }, { status: 400 })

  try {
    let audioBuffer: ArrayBuffer | null = null

    // Try OpenAI TTS
    if (process.env.OPENAI_API_KEY) {
      const voiceMap: Record<string, string> = {
        male: 'onyx',
        female: 'nova',
        child: 'shimmer',
        narrator: 'fable',
      }

      const res = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1-hd',
          input: text,
          voice: voiceMap[voice_type] || 'onyx',
          speed: Math.max(0.25, Math.min(4.0, speed)),
        }),
      })

      if (res.ok) {
        audioBuffer = await res.arrayBuffer()
      }
    }

    if (!audioBuffer) {
      return NextResponse.json({ error: 'Voice generation failed. Configure OPENAI_API_KEY.' }, { status: 500 })
    }

    const fileName = `voiceovers/${user.id}/${Date.now()}.mp3`
    const { error: uploadError } = await supabase.storage
      .from('audio')
      .upload(fileName, audioBuffer, { contentType: 'audio/mpeg' })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage.from('audio').getPublicUrl(fileName)

    const { data: record, error: dbError } = await supabase.from('voiceovers').insert({
      user_id: user.id,
      project_id: project_id || null,
      text,
      voice_type,
      speed,
      pitch,
      emotion,
      audio_url: publicUrl,
      duration_seconds: Math.ceil(text.split(' ').length / 2.5),
    }).select().single()

    if (dbError) throw dbError

    return NextResponse.json({ audio_url: publicUrl, id: record.id })
  } catch (error) {
    console.error('Voice generation error:', error)
    return NextResponse.json({ error: 'Failed to generate voice' }, { status: 500 })
  }
}
