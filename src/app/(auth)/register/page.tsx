import { RegisterForm } from '@/components/auth/register-form'
import Link from 'next/link'
import { Clapperboard } from 'lucide-react'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0057FF]/5 via-white to-[#00B86B]/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#0057FF] flex items-center justify-center">
              <Clapperboard className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-xl">African Drama Studio</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-500">Start creating African dramas with AI today — free</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <RegisterForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="text-[#0057FF] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
