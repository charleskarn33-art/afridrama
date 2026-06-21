import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { prompt, image_type, project_id, width = 1024, height = 1024 } = await req.json()

  if (!prompt) return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })

  try {
    let imageUrl: string | null = null

    // Try Flux API (Replicate)
    if (process.env.REPLICATE_API_TOKEN) {
      const res = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
          'Prefer': 'wait',
        },
        body: JSON.stringify({
          input: {
            prompt: `${prompt}, cinematic, high quality, photorealistic, African drama film aesthetic, detailed`,
            width,
            height,
            num_outputs: 1,
            output_format: 'webp',
            output_quality: 90,
          },
        }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.output && data.output[0]) {
          imageUrl = data.output[0]
        }
      }
    }

    // Try DALL-E 3 as fallback
    if (!imageUrl && process.env.OPENAI_API_KEY) {
      const res = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: `${prompt}. Cinematic, photorealistic, high quality.`,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
        }),
      })

      if (res.ok) {
        const data = await res.json()
        imageUrl = data.data[0]?.url || null
      }
    }

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image generation failed' }, { status: 500 })
    }

    // Download the image and store in Supabase Storage
    const imageRes = await fetch(imageUrl)
    const imageBuffer = await imageRes.arrayBuffer()
    const fileName = `${user.id}/${Date.now()}.webp`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, imageBuffer, { contentType: 'image/webp' })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName)

    // Save to database
    const { data: imageRecord, error: dbError } = await supabase.from('images').insert({
      user_id: user.id,
      project_id: project_id || null,
      prompt,
      image_url: publicUrl,
      image_type: image_type || 'character',
      width,
      height,
      model_used: process.env.REPLICATE_API_TOKEN ? 'flux-schnell' : 'dall-e-3',
    }).select().single()

    if (dbError) throw dbError

    return NextResponse.json({ image_url: publicUrl, id: imageRecord.id })
  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 })
  }
}
