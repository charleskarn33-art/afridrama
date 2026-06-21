import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/auth-context'
import { QueryProvider } from '@/components/layout/query-provider'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'African Drama Studio — Create African Movies With AI',
  description:
    'The ultimate AI-powered platform for African storytelling, drama production, churches, schools, and content creators.',
  keywords: 'African drama, AI video, African movies, content creation, AI scriptwriter',
  openGraph: {
    title: 'African Drama Studio',
    description: 'Create African Movies With AI',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
