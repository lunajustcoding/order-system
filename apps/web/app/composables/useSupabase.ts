import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

export const useSupabase = () => {
  const config = useRuntimeConfig()

  if (!supabaseInstance) {
    supabaseInstance = createClient(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey
    )
  }

  return supabaseInstance
}

// Type
export interface Menu {
  id: string
  name: string
  price: number
  category: string
  description: string | null
  image: string | null
  sizes: string[]
  is_active: boolean
  created_at: string
}

export interface Order {
  id: string
  user_id: string | null
  user_name: string | null
  status: 'pending' | 'cooking' | 'ready' | 'completed' | 'cancelled'
  total: number
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  menu_id: string | null
  menu_name: string
  menu_image: string | null
  price: number
  size: string | null
  quantity: number
}

export interface Profile {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  created_at: string
}
