'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/auth-context'

const schema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
  description: z.string().optional(),
  genre: z.enum(['drama', 'comedy', 'romance', 'historical', 'christian', 'educational', 'action']),
  country: z.enum(['liberia', 'ghana', 'nigeria', 'sierra_leone', 'kenya', 'south_africa']),
  language: z.enum(['english', 'french', 'local']),
  duration: z.enum(['1min', '3min', '5min', '10min', '20min']),
})

type FormData = z.infer<typeof schema>

const genres = [
  { value: 'drama', label: 'Drama', emoji: '🎭' },
  { value: 'comedy', label: 'Comedy', emoji: '😂' },
  { value: 'romance', label: 'Romance', emoji: '💕' },
  { value: 'historical', label: 'Historical', emoji: '📜' },
  { value: 'christian', label: 'Christian', emoji: '✝️' },
  { value: 'educational', label: 'Educational', emoji: '📚' },
  { value: 'action', label: 'Action', emoji: '⚡' },
]

const countries = [
  { value: 'liberia', label: 'Liberia', flag: '🇱🇷' },
  { value: 'ghana', label: 'Ghana', flag: '🇬🇭' },
  { value: 'nigeria', label: 'Nigeria', flag: '🇳🇬' },
  { value: 'sierra_leone', label: 'Sierra Leone', flag: '🇸🇱' },
  { value: 'kenya', label: 'Kenya', flag: '🇰🇪' },
  { value: 'south_africa', label: 'South Africa', flag: '🇿🇦' },
]

const languages = [
  { value: 'english', label: 'English' },
  { value: 'french', label: 'French' },
  { value: 'local', label: 'Local Language' },
]

const durations = [
  { value: '1min', label: '1 Minute', desc: 'Short clip' },
  { value: '3min', label: '3 Minutes', desc: 'Short drama' },
  { value: '5min', label: '5 Minutes', desc: 'Standard episode' },
  { value: '10min', label: '10 Minutes', desc: 'Full episode' },
  { value: '20min', label: '20 Minutes', desc: 'Long episode' },
]

const steps = ['Project Info', 'Genre & Country', 'Language & Duration', 'Review']

export function NewProjectWizard() {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { genre: 'drama', country: 'ghana', language: 'english', duration: '5min' },
  })

  const watched = watch()

  const onSubmit = async (data: FormData) => {
    if (!user) return
    setLoading(true)
    try {
      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name: data.name,
          description: data.description || null,
          genre: data.genre,
          country: data.country,
          language: data.language,
          duration: data.duration,
          status: 'draft',
        })
        .select()
        .single()

      if (error) throw error
      toast.success('Project created!')
      router.push(`/dashboard/projects/${project.id}`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create project'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all ${
              i < step ? 'bg-[#00B86B] text-white' : i === step ? 'bg-[#0057FF] text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-sm font-medium hidden sm:block ${i === step ? 'text-gray-900' : 'text-gray-400'}`}>{s}</span>
            {i < steps.length - 1 && <div className={`flex-1 h-px mx-2 ${i < step ? 'bg-[#00B86B]' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Information</h2>
                <p className="text-gray-500 mb-6">Give your African drama project a name and description.</p>

                <div className="space-y-4">
                  <div>
                    <Label>Project Name *</Label>
                    <Input placeholder="e.g., The Chief's Daughter" className="mt-1" {...register('name')} />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Label>Description (optional)</Label>
                    <Textarea placeholder="Brief description of your drama..." className="mt-1 h-28" {...register('description')} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Genre & Country</h2>
                <p className="text-gray-500 mb-6">Choose your drama genre and target country for authentic storytelling.</p>

                <div className="mb-6">
                  <Label className="mb-3 block">Genre</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {genres.map(({ value, label, emoji }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setValue('genre', value as FormData['genre'])}
                        className={`p-4 rounded-2xl border-2 text-center transition-all ${
                          watched.genre === value
                            ? 'border-[#0057FF] bg-blue-50'
                            : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <div className="text-2xl mb-1">{emoji}</div>
                        <div className="text-sm font-medium text-gray-700">{label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Country</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {countries.map(({ value, label, flag }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setValue('country', value as FormData['country'])}
                        className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                          watched.country === value
                            ? 'border-[#0057FF] bg-blue-50'
                            : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <span className="text-xl">{flag}</span>
                        <span className="text-sm font-medium text-gray-700">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Language & Duration</h2>
                <p className="text-gray-500 mb-6">Set the language and length of your production.</p>

                <div className="mb-6">
                  <Label className="mb-3 block">Language</Label>
                  <div className="flex gap-3">
                    {languages.map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setValue('language', value as FormData['language'])}
                        className={`flex-1 py-3 rounded-2xl border-2 text-sm font-medium transition-all ${
                          watched.language === value
                            ? 'border-[#0057FF] bg-blue-50 text-[#0057FF]'
                            : 'border-gray-100 text-gray-600 hover:border-gray-200'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Duration</Label>
                  <div className="space-y-2">
                    {durations.map(({ value, label, desc }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setValue('duration', value as FormData['duration'])}
                        className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                          watched.duration === value
                            ? 'border-[#0057FF] bg-blue-50'
                            : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <span className="font-semibold text-gray-900">{label}</span>
                        <span className="text-sm text-gray-500">{desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="bg-white rounded-3xl border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Create</h2>
                <p className="text-gray-500 mb-6">Confirm your project settings before creating.</p>

                <div className="space-y-3 mb-8">
                  {[
                    { label: 'Project Name', value: watched.name },
                    { label: 'Genre', value: genres.find(g => g.value === watched.genre)?.label },
                    { label: 'Country', value: countries.find(c => c.value === watched.country)?.label },
                    { label: 'Language', value: languages.find(l => l.value === watched.language)?.label },
                    { label: 'Duration', value: durations.find(d => d.value === watched.duration)?.label },
                    ...(watched.description ? [{ label: 'Description', value: watched.description }] : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-3 border-b border-gray-50">
                      <span className="text-gray-500 text-sm">{label}</span>
                      <span className="font-medium text-gray-900 text-sm">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="border-gray-200"
          >
            Back
          </Button>

          {step < steps.length - 1 ? (
            <Button
              type="button"
              onClick={() => setStep(s => s + 1)}
              className="bg-[#0057FF] hover:bg-[#0041CC]"
              disabled={step === 0 && !watched.name}
            >
              Continue
            </Button>
          ) : (
            <Button type="submit" className="bg-[#00B86B] hover:bg-[#009A59]" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Creating...' : 'Create Project'}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
