export async function generateScript(params: {
  topic: string
  genre: string
  duration: string
  country: string
  language: string
}) {
  const durationMap: Record<string, string> = {
    '1min': '1 minute (about 150 words of dialogue)',
    '3min': '3 minutes (about 450 words)',
    '5min': '5 minutes (about 750 words)',
    '10min': '10 minutes (about 1500 words)',
    '20min': '20 minutes (about 3000 words)',
  }

  const prompt = `You are an expert African drama screenwriter. Create a complete script for a ${params.genre} drama set in ${params.country}.

Topic: ${params.topic}
Genre: ${params.genre}
Duration: ${durationMap[params.duration] || params.duration}
Country: ${params.country}
Language: ${params.language}

Return a JSON object with exactly this structure:
{
  "title": "Story title",
  "characters": [
    {"name": "Character Name", "role": "protagonist/antagonist/supporting", "description": "Brief character description"}
  ],
  "story": "Full story synopsis in 2-3 paragraphs",
  "dialogue": "Complete formatted dialogue with character names and lines",
  "narration": "Opening and closing narration text",
  "scene_breakdown": [
    {
      "scene_number": 1,
      "title": "Scene title",
      "description": "What happens in this scene",
      "location": "Where the scene takes place",
      "characters": ["Character names in this scene"],
      "dialogue": "Dialogue for this scene",
      "duration_seconds": 30
    }
  ]
}

Make it authentically African, culturally rich, emotionally compelling, and appropriate for the ${params.country} context. Use local expressions and cultural references.`

  const response = await fetch('/api/scripts/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, params }),
  })

  if (!response.ok) {
    throw new Error('Failed to generate script')
  }

  return response.json()
}

export async function generateCharacterPrompt(params: {
  name: string
  gender: string
  age: number
  occupation: string
  appearance: string
  clothing: string
  country: string
}) {
  return `A ${params.age}-year-old ${params.gender} ${params.occupation} from ${params.country} named ${params.name}. ${params.appearance}. Wearing ${params.clothing}. African drama film character portrait, cinematic lighting, photorealistic, high quality, detailed face, professional photography style`
}

export async function generateScenePrompt(
  sceneType: string,
  country: string,
  description: string
) {
  const sceneDescriptions: Record<string, string> = {
    village: 'traditional African village with mud houses, trees, and dusty paths',
    city: 'modern African city with buildings, streets, and urban life',
    market: 'vibrant African market with colorful stalls, traders, and goods',
    school: 'African school with classrooms, blackboard, and students',
    church: 'African church with wooden benches, altar, and congregation',
    hospital: 'African hospital ward with beds and medical staff',
    office: 'modern African office with desks and computers',
    house: 'typical African family home interior with furniture',
  }

  const base = sceneDescriptions[sceneType] || sceneType
  return `${base} in ${country}. ${description}. Cinematic wide shot, dramatic lighting, African drama film aesthetic, high quality, photorealistic, detailed environment`
}
