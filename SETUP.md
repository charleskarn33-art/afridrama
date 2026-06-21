# African Drama Studio — Setup Guide

## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/charleskarn33-art/afridrama.git
cd afridrama
npm install
```

### 2. Set up Supabase

1. Create a project at [app.supabase.com](https://app.supabase.com)
2. Go to **SQL Editor** and run the migration file:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
3. Enable **Google OAuth** in Authentication → Providers
4. Create Storage buckets: `images`, `videos`, `audio`, `subtitles`, `exports`

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI - Script Generation (at least one required)
ANTHROPIC_API_KEY=sk-ant-...      # Claude — best quality scripts
OPENAI_API_KEY=sk-...             # GPT-4o + DALL-E 3 + Whisper + TTS
GEMINI_API_KEY=AIza...            # Gemini fallback

# Image & Video Generation
REPLICATE_API_TOKEN=r8_...        # Flux (images) + Wan 2.1 (video)

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run locally
```bash
npm run dev
# Open http://localhost:3000
```

### 5. Deploy to Vercel

```bash
npx vercel deploy
```

Set all environment variables in your Vercel project settings.

## AI Provider Priority

| Feature | Primary | Fallback |
|---------|---------|----------|
| Script Generation | Claude (Anthropic) | OpenAI GPT-4o → Gemini |
| Image Generation | Flux via Replicate | DALL-E 3 (OpenAI) |
| Video Generation | Wan 2.1 via Replicate | — |
| Voice/TTS | OpenAI TTS-1-HD | — |
| Subtitles | OpenAI Whisper | — |

## Architecture

```
src/
├── app/
│   ├── (auth)/          # Login, Register, Forgot Password
│   ├── admin/           # Admin panel
│   ├── api/             # API routes (scripts, images, videos, voice, subtitles)
│   ├── auth/callback/   # OAuth callback handler
│   ├── dashboard/       # All dashboard pages
│   └── page.tsx         # Landing page
├── components/
│   ├── admin/           # Admin components
│   ├── auth/            # Auth forms
│   ├── characters/      # Character Studio
│   ├── dashboard/       # Dashboard overview, analytics, billing, settings
│   ├── landing/         # Landing page sections
│   ├── layout/          # Sidebar, header, providers
│   ├── projects/        # Project creation wizard & detail
│   ├── scenes/          # Scene Studio
│   ├── scripts/         # Script Generator
│   ├── ui/              # UI primitives (Radix-based)
│   ├── videos/          # Video Studio
│   └── voice/           # Voice Studio
├── context/             # AuthContext
├── lib/
│   ├── ai.ts            # AI helper functions
│   ├── supabase/        # Supabase client, server, middleware
│   └── utils.ts         # Utilities
└── types/               # TypeScript types & plan limits
```

## Database Schema

13 tables with full RLS and auto-triggers:

- `profiles` — user profiles and subscription info
- `projects` — drama projects
- `scripts` — AI-generated scripts
- `characters` — character definitions and images
- `scenes` — scene backgrounds
- `images` — all generated images
- `videos` — video generation jobs
- `voiceovers` — generated audio
- `subtitles` — subtitle files (SRT/VTT)
- `exports` — video exports
- `subscriptions` — subscription management
- `payments` — payment history
- `notifications` — user notifications

## Subscription Plans

| Plan | Projects | Videos/mo | Images/mo | Storage |
|------|----------|-----------|-----------|---------|
| Free | 3 | 5 | 20 | 1GB |
| Creator ($19) | 20 | 50 | 200 | 20GB |
| Studio ($49) | 100 | 200 | 1,000 | 100GB |
| Enterprise | ∞ | ∞ | ∞ | 1TB+ |
