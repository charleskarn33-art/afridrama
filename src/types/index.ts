export type UserRole = 'user' | 'creator' | 'admin'

export type Genre =
  | 'drama'
  | 'comedy'
  | 'romance'
  | 'historical'
  | 'christian'
  | 'educational'
  | 'action'

export type Country =
  | 'liberia'
  | 'ghana'
  | 'nigeria'
  | 'sierra_leone'
  | 'kenya'
  | 'south_africa'

export type Language = 'english' | 'french' | 'local'

export type Duration = '1min' | '3min' | '5min' | '10min' | '20min'

export type SubscriptionPlan = 'free' | 'creator' | 'studio' | 'enterprise'

export type ExportFormat = 'mp4' | 'mov'

export type ExportAspectRatio = '16:9' | '9:16' | '1:1'

export type ProjectStatus = 'draft' | 'active' | 'completed' | 'archived'

export type VideoStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface Profile {
  id: string
  user_id: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  subscription_plan: SubscriptionPlan
  subscription_status: 'active' | 'inactive' | 'trial'
  credits_remaining: number
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  genre: Genre
  country: Country
  language: Language
  duration: Duration
  status: ProjectStatus
  thumbnail_url: string | null
  description: string | null
  created_at: string
  updated_at: string
}

export interface Script {
  id: string
  project_id: string
  user_id: string
  title: string
  topic: string
  genre: Genre
  duration: Duration
  country: Country
  characters: ScriptCharacter[]
  story: string
  dialogue: string
  narration: string
  scene_breakdown: SceneBreakdown[]
  raw_content: string
  version: number
  created_at: string
  updated_at: string
}

export interface ScriptCharacter {
  name: string
  role: string
  description: string
}

export interface SceneBreakdown {
  scene_number: number
  title: string
  description: string
  location: string
  characters: string[]
  dialogue: string
  duration_seconds: number
}

export interface Character {
  id: string
  project_id: string
  user_id: string
  name: string
  gender: 'male' | 'female' | 'non_binary'
  age: number
  occupation: string
  appearance: string
  clothing: string
  personality: string
  image_url: string | null
  prompt_used: string | null
  created_at: string
  updated_at: string
}

export interface Scene {
  id: string
  project_id: string
  user_id: string
  title: string
  scene_type:
    | 'village'
    | 'city'
    | 'market'
    | 'school'
    | 'church'
    | 'hospital'
    | 'office'
    | 'house'
    | 'outdoor'
    | 'custom'
  description: string
  prompt_used: string | null
  image_url: string | null
  order_index: number
  created_at: string
  updated_at: string
}

export interface GeneratedImage {
  id: string
  project_id: string | null
  user_id: string
  prompt: string
  image_url: string
  image_type: 'character' | 'background' | 'prop' | 'scene' | 'thumbnail'
  width: number
  height: number
  model_used: string
  created_at: string
}

export interface Video {
  id: string
  project_id: string | null
  user_id: string
  title: string
  status: VideoStatus
  progress: number
  source_type: 'text_to_video' | 'image_to_video'
  prompt: string | null
  source_image_url: string | null
  video_url: string | null
  thumbnail_url: string | null
  duration_seconds: number | null
  job_id: string | null
  error_message: string | null
  created_at: string
  updated_at: string
}

export interface Voiceover {
  id: string
  project_id: string | null
  user_id: string
  text: string
  voice_type: 'male' | 'female' | 'child' | 'narrator'
  speed: number
  pitch: number
  emotion: 'neutral' | 'happy' | 'sad' | 'dramatic' | 'excited'
  audio_url: string | null
  duration_seconds: number | null
  created_at: string
}

export interface Subtitle {
  id: string
  project_id: string | null
  video_id: string | null
  user_id: string
  language: 'english' | 'french'
  content: SubtitleEntry[]
  srt_url: string | null
  vtt_url: string | null
  created_at: string
}

export interface SubtitleEntry {
  index: number
  start_time: string
  end_time: string
  text: string
}

export interface Export {
  id: string
  project_id: string | null
  video_id: string
  user_id: string
  format: ExportFormat
  aspect_ratio: ExportAspectRatio
  platform: 'youtube' | 'tiktok' | 'instagram' | 'facebook' | 'download'
  status: VideoStatus
  output_url: string | null
  file_size_bytes: number | null
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan: SubscriptionPlan
  status: 'active' | 'inactive' | 'cancelled' | 'past_due'
  stripe_subscription_id: string | null
  stripe_customer_id: string | null
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export interface AnalyticsSummary {
  projects_created: number
  videos_created: number
  images_generated: number
  voiceovers_created: number
  minutes_generated: number
  storage_used_mb: number
}

export interface PlanLimits {
  projects: number
  videos_per_month: number
  images_per_month: number
  voiceovers_per_month: number
  storage_gb: number
  export_quality: 'sd' | 'hd' | 'uhd'
}

export const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  free: {
    projects: 3,
    videos_per_month: 5,
    images_per_month: 20,
    voiceovers_per_month: 10,
    storage_gb: 1,
    export_quality: 'sd',
  },
  creator: {
    projects: 20,
    videos_per_month: 50,
    images_per_month: 200,
    voiceovers_per_month: 100,
    storage_gb: 20,
    export_quality: 'hd',
  },
  studio: {
    projects: 100,
    videos_per_month: 200,
    images_per_month: 1000,
    voiceovers_per_month: 500,
    storage_gb: 100,
    export_quality: 'uhd',
  },
  enterprise: {
    projects: -1,
    videos_per_month: -1,
    images_per_month: -1,
    voiceovers_per_month: -1,
    storage_gb: 1000,
    export_quality: 'uhd',
  },
}
