import 'server-only'
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const SUPERADMIN_EMAIL = 'angelicavarella@amajac.org.br'

export const verifySession = cache(async () => {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/admin/login')
  }

  return {
    user,
    isSuperadmin: user.email === SUPERADMIN_EMAIL,
  }
})
