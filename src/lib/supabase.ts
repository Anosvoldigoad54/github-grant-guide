import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

// Use import.meta.env for Vite (NOT process.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('VITE_SUPABASE_URL:', supabaseUrl)
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Present' : '❌ Missing')
  throw new Error('Missing environment variables: Check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}

console.log('✅ Supabase client initializing with URL:', supabaseUrl)

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Helper function to get current user's profile  
export const getCurrentUserProfile = async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return null
    }

    // ✅ FIXED: Properly quoted select query with correct foreign key relationships
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select(`
        *,
        departments!department_id(*),
        positions!position_id(*),
        roles!role_id(*)
      `)
      .eq('email', user.email)
      .eq('is_active', true)
      .single()

    if (profileError) {
      console.error('Error fetching user profile:', profileError)
      return null
    }

    return { user, profile }
  } catch (error) {
    console.error('Error in getCurrentUserProfile:', error)
    return null
  }
}

// Helper function to check user permissions
export const checkUserPermission = async (permissionName: string): Promise<boolean> => {
  try {
    const userProfile = await getCurrentUserProfile()
    if (!userProfile?.profile) return false

    // ✅ FIXED: Properly quoted select query
    const { data: hasPermission, error } = await supabase
      .from('role_permissions')
      .select(`
        id,
        permissions!inner(name)
      `)
      .eq('role_id', userProfile.profile.role_id)
      .eq('permissions.name', permissionName)
      .eq('is_active', true)

    if (error) {
      console.error('Error checking permission:', error)  
      return false
    }

    return hasPermission && hasPermission.length > 0
  } catch (error) {
    console.error('Error in checkUserPermission:', error)
    return false
  }
}

// Get user role level
export const getUserRoleLevel = async (): Promise<number> => {
  try {
    const userProfile = await getCurrentUserProfile()
    return userProfile?.profile?.role?.level || 0
  } catch (error) {
    console.error('Error getting user role level:', error)
    return 0
  }
}

// Type definitions for better development experience
export type UserProfile = Awaited<ReturnType<typeof getCurrentUserProfile>>
export type UserProfileData = NonNullable<UserProfile>['profile']

console.log('✅ Supabase helpers loaded successfully')
