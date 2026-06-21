'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Loader2, User, Lock, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/context/auth-context'
import { getInitials } from '@/lib/utils'

export function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const { register, handleSubmit } = useForm({
    defaultValues: {
      full_name: profile?.full_name || '',
    },
  })

  const updateProfile = async (data: { full_name: string }) => {
    if (!user) return
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: data.full_name })
        .eq('user_id', user.id)
      if (error) throw error
      await refreshProfile()
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const updatePassword = async () => {
    if (!user?.email) return
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) toast.error(error.message)
    else toast.success('Password reset email sent!')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-500 mt-1">Manage your account preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Profile Information</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-[#0057FF] text-white text-xl">
                    {getInitials(profile?.full_name || user?.email || 'U')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-900">{profile?.full_name}</div>
                  <div className="text-sm text-gray-400">{user?.email}</div>
                </div>
              </div>

              <form onSubmit={handleSubmit(updateProfile)} className="space-y-4">
                <div>
                  <Label>Full Name</Label>
                  <Input className="mt-1" {...register('full_name')} />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input className="mt-1" value={user?.email || ''} disabled />
                </div>
                <Button type="submit" disabled={saving} className="bg-[#0057FF]">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Lock className="w-5 h-5" /> Security</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Change Password</h4>
                <p className="text-sm text-gray-500 mb-3">We'll send you an email to reset your password.</p>
                <Button onClick={updatePassword} variant="outline">Send Password Reset Email</Button>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-semibold text-red-600 mb-1">Danger Zone</h4>
                <p className="text-sm text-gray-500 mb-3">Permanently delete your account and all data.</p>
                <Button variant="destructive" size="sm" onClick={() => toast.error('Contact support to delete your account.')}>Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5" /> Notifications</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Video generation complete', desc: 'Get notified when your AI video is ready' },
                  { label: 'Script generated', desc: 'Notification when AI finishes writing your script' },
                  { label: 'Storage alerts', desc: 'Alert when you reach 80% storage usage' },
                  { label: 'Product updates', desc: 'New features and platform announcements' },
                ].map(({ label, desc }) => (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-gray-50">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{label}</div>
                      <div className="text-xs text-gray-400">{desc}</div>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#0057FF]" />
                  </div>
                ))}
              </div>
              <Button className="mt-4 bg-[#0057FF]" onClick={() => toast.success('Notification preferences saved!')}>
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
