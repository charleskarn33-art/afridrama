import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { topic, genre, duration, country, language } = body

  if (!topic || !genre || !duration || !country) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const durationMap: Record<string, string> = {
    '1min': '1 minute (approximately 150 words of dialogue)',
    '3min': '3 minutes (approximately 450 words)',
    '5min': '5 minutes (approximately 750 words)',
    '10min': '10 minutes (approximately 1500 words)',
    '20min': '20 minutes (approximately 3000 words)',
  }

  const countryMap: Record<string, string> = {
    liberia: 'Liberia',
    ghana: 'Ghana',
    nigeria: 'Nigeria',
    sierra_leone: 'Sierra Leone',
    kenya: 'Kenya',
    south_africa: 'South Africa',
  }

  const systemPrompt = `You are an expert African drama screenwriter with deep knowledge of African cultures, traditions, and storytelling. You specialize in creating authentic, emotionally compelling drama scripts that resonate with African audiences. Your scripts blend modern themes with traditional values, using culturally appropriate language and references.`

  const userPrompt = `Create a complete ${genre} drama script set in ${countryMap[country] || country}.

Story Topic/Premise: ${topic}
Duration: ${durationMap[duration] || duration}
Language Style: ${language === 'local' ? 'Mix of English with local expressions and proverbs' : language}

Return ONLY a valid JSON object with this exact structure (no markdown, no extra text):
{
  "title": "Compelling drama title",
  "characters": [
    {
      "name": "Full character name",
      "role": "protagonist/antagonist/supporting/comic_relief",
      "description": "Physical appearance, personality, and background in 2-3 sentences"
    }
  ],
  "story": "Detailed story synopsis covering beginning, middle, and end. Should be 3-4 paragraphs.",
  "dialogue": "Complete formatted script with character names in CAPS followed by colon and their lines. Include stage directions in parentheses. This is the full production script.",
  "narration": "Opening narration introducing the story and setting, plus closing narration.",
  "scene_breakdown": [
    {
      "scene_number": 1,
      "title": "Scene title",
      "description": "Detailed description of what happens",
      "location": "Specific location (e.g., 'Kofi's family compound in Accra')",
      "characters": ["character names in this scene"],
      "dialogue": "Key dialogue excerpt for this scene",
      "duration_seconds": 45
    }
  ]
}

Requirements:
- Make it authentically African with cultural references, proverbs, and local expressions
- Include 3-6 well-developed characters
- Create 4-8 scenes with clear progression
- The dialogue should feel natural and conversational
- Include both moments of tension and humanity
- Ensure the total scene durations roughly match the requested length
- The story should have a clear moral or message relevant to African values`

  try {
    // Try Claude first
    if (process.env.ANTHROPIC_API_KEY) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-opus-4-8',
          max_tokens: 8000,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const content = data.content[0].text
        const parsed = JSON.parse(content)
        return NextResponse.json(parsed)
      }
    }

    // Try OpenAI
    if (process.env.OPENAI_API_KEY) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          max_tokens: 8000,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const content = data.choices[0].message.content
        const parsed = JSON.parse(content)
        return NextResponse.json(parsed)
      }
    }

    // Try Gemini
    if (process.env.GEMINI_API_KEY) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              maxOutputTokens: 8000,
            },
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        const content = data.candidates[0].content.parts[0].text
        const parsed = JSON.parse(content)
        return NextResponse.json(parsed)
      }
    }

    return NextResponse.json({ error: 'No AI provider configured' }, { status: 503 })
  } catch (error) {
    console.error('Script generation error:', error)
    return NextResponse.json({ error: 'Failed to generate script' }, { status: 500 })
  }
}
