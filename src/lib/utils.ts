import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function truncate(str: string, length: number) {
  return str.length > length ? str.slice(0, length) + '...' : str
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const GENRE_LABELS: Record<string, string> = {
  drama: 'Drama',
  comedy: 'Comedy',
  romance: 'Romance',
  historical: 'Historical',
  christian: 'Christian',
  educational: 'Educational',
  action: 'Action',
}

export const COUNTRY_LABELS: Record<string, string> = {
  liberia: 'Liberia',
  ghana: 'Ghana',
  nigeria: 'Nigeria',
  sierra_leone: 'Sierra Leone',
  kenya: 'Kenya',
  south_africa: 'South Africa',
}

export const DURATION_LABELS: Record<string, string> = {
  '1min': '1 Minute',
  '3min': '3 Minutes',
  '5min': '5 Minutes',
  '10min': '10 Minutes',
  '20min': '20 Minutes',
}

export const LANGUAGE_LABELS: Record<string, string> = {
  english: 'English',
  french: 'French',
  local: 'Local Language',
}
