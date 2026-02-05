import type { User } from '@supabase/supabase-js'
import type { Profile } from './useSupabase'

const user = ref<User | null>(null)
const profile = ref<Profile | null>(null)
const isLoading = ref(true)

export function useAuth() {
  const supabase = useSupabase()

  async function init() {
    isLoading.value = true

    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user ?? null

    if (user.value) {
      await fetchProfile()
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
      user.value = session?.user ?? null
      if (user.value) {
        await fetchProfile()
      } else {
        profile.value = null
      }
    })

    isLoading.value = false
  }

  async function fetchProfile() {
    if (!user.value) return

    try {
      const data = await $fetch('/api/profile', {
        query: {
          userId: user.value.id,
          email: user.value.email
        }
      })
      console.log('Fetched profile:', data)
      profile.value = data
    } catch (error) {
      console.error('Error fetching profile:', error)
      profile.value = null
    }
  }

  async function signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: window.location.origin
      }
    })

    if (error) {
      if (error.message.includes('invalid')) {
        throw new Error('請使用有效的電子郵件地址 (如 xxx@gmail.com)')
      }
      throw error
    }

    // 註冊成功後建立profile
    if (data.user) {
      try {
        const profileData = await $fetch('/api/profile', {
          method: 'POST',
          body: {
            id: data.user.id,
            email: data.user.email,
            name: name || email.split('@')[0]
          }
        })
        console.log('Profile created:', profileData)
        profile.value = profileData
      } catch (profileError) {
        console.error('Error creating profile:', profileError)
      }
    }

    return data
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    console.log(email,password)
    console.log(data)
    if (error) throw error
    return data
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    user.value = null
    profile.value = null
  }

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => profile.value?.role === 'admin')

  return {
    user,
    profile,
    isLoading,
    isLoggedIn,
    isAdmin,
    init,
    signUp,
    signIn,
    signOut
  }
}
