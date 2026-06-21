import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { audio_url, video_id, project_id, language = 'english' } = await req.json()

  if (!audio_url) return NextResponse.json({ error: 'Audio URL is required' }, { status: 400 })

  try {
    // Try OpenAI Whisper
    if (process.env.OPENAI_API_KEY) {
      const audioRes = await fetch(audio_url)
      const audioBuffer = await audioRes.arrayBuffer()
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' })

      const formData = new FormData()
      formData.append('file', audioBlob, 'audio.mp3')
      formData.append('model', 'whisper-1')
      formData.append('response_format', 'srt')
      formData.append('language', language === 'french' ? 'fr' : 'en')

      const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
        body: formData,
      })

      if (whisperRes.ok) {
        const srtContent = await whisperRes.text()

        // Parse SRT to our format
        const entries = parseSRT(srtContent)

        // Generate SRT file
        const srtFileName = `subtitles/${user.id}/${Date.now()}.srt`
        const vttFileName = `subtitles/${user.id}/${Date.now()}.vtt`
        const vttContent = srtToVTT(srtContent)

        await Promise.all([
          supabase.storage.from('subtitles').upload(srtFileName, new TextEncoder().encode(srtContent), { contentType: 'text/plain' }),
          supabase.storage.from('subtitles').upload(vttFileName, new TextEncoder().encode(vttContent), { contentType: 'text/vtt' }),
        ])

        const [{ data: { publicUrl: srtUrl } }, { data: { publicUrl: vttUrl } }] = [
          supabase.storage.from('subtitles').getPublicUrl(srtFileName),
          supabase.storage.from('subtitles').getPublicUrl(vttFileName),
        ]

        const { data: record } = await supabase.from('subtitles').insert({
          user_id: user.id,
          project_id: project_id || null,
          video_id: video_id || null,
          language,
          content: entries,
          srt_url: srtUrl,
          vtt_url: vttUrl,
        }).select().single()

        return NextResponse.json({ id: record?.id, srt_url: srtUrl, vtt_url: vttUrl, entries })
      }
    }

    return NextResponse.json({ error: 'Configure OPENAI_API_KEY for subtitle generation' }, { status: 503 })
  } catch (error) {
    console.error('Subtitle error:', error)
    return NextResponse.json({ error: 'Failed to generate subtitles' }, { status: 500 })
  }
}

function parseSRT(srt: string) {
  const blocks = srt.trim().split(/\n\n/)
  return blocks.map((block) => {
    const lines = block.split('\n')
    const index = parseInt(lines[0])
    const times = lines[1]?.split(' --> ')
    return {
      index,
      start_time: times?.[0] || '',
      end_time: times?.[1] || '',
      text: lines.slice(2).join('\n'),
    }
  })
}

function srtToVTT(srt: string) {
  return 'WEBVTT\n\n' + srt.replace(/,(\d{3})/g, '.$1')
}
