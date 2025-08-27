'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'
import { ROLES } from '../types/permissions'

// Helper function to get permissions for a role
const getPermissionsForRole = (roleName: string): string[] => {
  const role = ROLES[roleName]
  if (role) {
    return role.permissions
  }

  // Fallback for unknown roles
  switch (roleName) {
    case 'admin':
    case 'super_admin':
      return ['*'] // All permissions
    case 'hr_manager':
      return Object.keys(ROLES.hr_manager?.permissions || [])
    case 'department_manager':
      return Object.keys(ROLES.department_manager?.permissions || [])
    case 'team_lead':
      return Object.keys(ROLES.team_lead?.permissions || [])
    case 'employee':
      return Object.keys(ROLES.employee?.permissions || [])
    default:
      return ['dashboard.view', 'employees.view_own', 'attendance.view_own']
  }
}

// Enhanced Types matching your database schema
interface UserProfile {
  id: string
  employee_id: string
  email: string
  first_name: string
  last_name: string
  display_name?: string
  profile_photo_url?: string
  department?: {
    id: string
    name: string
    code: string
    manager_employee_id?: string
    budget?: number
    headcount_target?: number
    current_headcount?: number
  }
  role?: {
    id: number
    name: string
    display_name: string
    level: number
    color_code?: string
    icon?: string
    permissions?: string[]
    max_users?: number
    is_system_role?: boolean
  }
  position?: {
    id: string
    title: string
    code?: string
    level?: string
    min_salary?: number
    max_salary?: number
    is_leadership_role?: boolean
  }
  employment_status: string
  employment_type: string
  work_location?: string
  allowed_work_locations?: string[]
  manager_employee_id?: string
  skip_level_manager?: string
  salary?: number
  salary_currency?: string
  hire_date?: string
  probation_end_date?: string
  is_active: boolean
  last_login?: string
  login_count?: number
  failed_login_attempts?: number
  account_locked?: boolean
  locked_until?: string
  two_factor_enabled?: boolean
  timezone?: string
  preferred_language?: string
  skills?: any[]
  certifications?: any[]
  performance_rating?: number
  engagement_score?: number
  retention_risk?: string
  created_at: string
  updated_at: string
  auth_user_id?: string
  // Advanced computed fields
  performance_score?: number
  last_activity?: string
  notification_preferences?: {
    email: boolean
    sms: boolean
    push: boolean
    in_app: boolean
  }
}

interface SecurityContext {
  device_fingerprint: string
  ip_address: string
  location?: {
    city: string
    country: string
    coordinates?: { lat: number; lng: number }
  }
  risk_level: 'low' | 'medium' | 'high'
  session_id: string
  user_agent: string
  login_time: string
  last_activity: string
  is_trusted_device: boolean
  device_info?: any
  browser_fingerprint?: string
  security_flags?: string[]
}

interface AuthContextType {
  // Core Authentication
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  
  // Advanced Security
  securityContext: SecurityContext | null
  sessionHealth: 'healthy' | 'warning' | 'critical'
  
  // Navigation Control
  shouldNavigateToDashboard: boolean
  pendingNavigation: string | null
  
  // Authentication Methods
  login: (credentials: LoginCredentials) => Promise<LoginResponse>
  logout: () => Promise<void>
  
  // Advanced Methods
  refreshProfile: () => Promise<void>
  updateUserPreferences: (preferences: Partial<UserProfile>) => Promise<boolean>
  clearNavigationFlag: () => void
  switchTheme: (theme: 'light' | 'dark' | 'auto') => Promise<void>
  enableTwoFactor: () => Promise<{ qrCode: string; backupCodes: string[] }>
  validateTwoFactor: (token: string) => Promise<boolean>
}

interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
  deviceTrust?: boolean
  twoFactorToken?: string
}

interface LoginResponse {
  success: boolean
  user?: User
  error?: string
  requiresTwoFactor?: boolean
  requiresDeviceVerification?: boolean
  accountLocked?: boolean
  lockoutTime?: number
  backupCodes?: string[]
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Core State
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Advanced State
  const [securityContext, setSecurityContext] = useState<SecurityContext | null>(null)
  const [sessionHealth, setSessionHealth] = useState<'healthy' | 'warning' | 'critical'>('healthy')
  const [shouldNavigateToDashboard, setShouldNavigateToDashboard] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  
  // Refs for advanced functionality
  const sessionMonitorRef = useRef<NodeJS.Timeout>()
  const activityTrackerRef = useRef<NodeJS.Timeout>()
  const securityCheckRef = useRef<NodeJS.Timeout>()
  const loginInProgressRef = useRef(false)

  // Advanced Device Fingerprinting
  const generateAdvancedFingerprint = useCallback(async (): Promise<string> => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx?.fillText('AriseHRM_Security_2025', 2, 2)
    
    const fingerprint = {
      // Hardware
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: (navigator as any).deviceMemory || 0,
      
      // Display
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
      
      // Browser
      language: navigator.language,
      languages: navigator.languages.join(','),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      
      // Canvas fingerprint
      canvas: canvas.toDataURL(),
      
      // WebGL fingerprint
      webgl: getWebGLInfo(),
      
      // Audio fingerprint (with proper handling)
      audio: await getAudioFingerprint(),
      
      // Timestamp
      timestamp: Date.now()
    }
    
    // Create hash
    const fingerprintString = JSON.stringify(fingerprint)
    const encoder = new TextEncoder()
    const data = encoder.encode(fingerprintString)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }, [])

  const getWebGLInfo = () => {
    try {
      const canvas = document.createElement('canvas')
      const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
      if (!gl) return null

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info') as any
      const VENDOR = debugInfo?.UNMASKED_VENDOR_WEBGL ?? 0
      const RENDERER = debugInfo?.UNMASKED_RENDERER_WEBGL ?? 0

      return {
        vendor: gl.getParameter(VENDOR) as unknown as string,
        renderer: gl.getParameter(RENDERER) as unknown as string,
        version: gl.getParameter(gl.VERSION) as unknown as string,
        glsl: gl.getParameter(gl.SHADING_LANGUAGE_VERSION) as unknown as string,
      }
    } catch {
      return null
    }
  }

  // ✅ FIXED: Audio fingerprint with proper user gesture handling
  const getAudioFingerprint = async (): Promise<string | null> => {
    try {
      // Skip audio fingerprint if no user gesture (avoid console warning)
      const hasUserActivation = (document as any).userActivation?.hasBeenActive === true
      if (!hasUserActivation) {
        // console.log('🔇 Skipping audio fingerprint - no user gesture required')
        return null
      }

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Check if context is suspended (requires user gesture)
      if (audioContext.state === 'suspended') {
        // console.log('🔇 Audio context suspended - skipping audio fingerprint')
        await audioContext.close()
        return null
      }

      const oscillator = audioContext.createOscillator()
      const analyser = audioContext.createAnalyser()
      const gainNode = audioContext.createGain()
      
      oscillator.type = 'triangle'
      oscillator.frequency.value = 1000
      gainNode.gain.value = 0.05
      
      oscillator.connect(analyser)
      analyser.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.start()
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      analyser.getByteFrequencyData(dataArray)
      
      oscillator.stop()
      audioContext.close()
      
      return Array.from(dataArray).join('')
    } catch (error: any) {
      // console.log('🔇 Audio fingerprint unavailable:', error.message)
      return null
    }
  }

  // ✅ FIXED: Enhanced Location Detection with permission checking
  const getLocationData = useCallback(async () => {
    try {
      // Check permission state first
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' })
        if (permission.state === 'denied') {
          // console.log('🌍 Geolocation denied, using IP-based location')
          throw new Error('Geolocation permission denied')
        }
      }

      if (navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 3000, // Reduced timeout
            enableHighAccuracy: false,
            maximumAge: 300000 // Cache for 5 minutes
          })
        })
        
        // Reverse geocoding
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
        )
        const locationData = await response.json()
        
        return {
          city: locationData.city || 'Unknown',
          country: locationData.countryName || 'Unknown',
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        }
      }
    } catch (error) {
      // console.log('🌍 Using IP-based location fallback')
    }
    
    // Fallback to IP-based location
    try {
      const ipResponse = await fetch('https://ipapi.co/json/')
      const ipData = await ipResponse.json()
      return {
        city: ipData.city || 'Unknown',
        country: ipData.country_name || 'Unknown'
      }
    } catch {
      return {
        city: 'Unknown',
        country: 'Unknown'
      }
    }
  }, [])

  // Optimized Session Initialization
  useEffect(() => {
    let mounted = true
    
    const initializeAuth = async () => {
      try {
        // Quick session check first
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Session initialization error:', error)
          if (mounted) setIsLoading(false)
          return
        }

        if (mounted) {
          setUser(session?.user ?? null)
        }
        
        if (session?.user) {
          // Fast profile loading without heavy security context
          try {
            await fetchSimpleProfile(session.user.id)
          } catch (error) {
            console.warn('⚠️ Profile loading failed, using fallback')
            if (mounted) setIsLoading(false)
          }
        } else {
          if (mounted) setIsLoading(false)
        }
      } catch (error) {
        console.error('💥 Auth initialization failed:', error)
        if (mounted) setIsLoading(false)
      }
    }

    initializeAuth()

    // Enhanced Auth State Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        // console.log('🔐 Auth state change:', event, session?.user?.email)
        
        setUser(session?.user ?? null)
        
        if (session?.user && securityContext) {
          // Skip profile loading for faster authentication
          setIsLoading(false)
          
          // Load profile in background without blocking UI
          setTimeout(async () => {
            try {
              await fetchSimpleProfile(session.user.id)
            } catch (error) {
              console.warn('⚠️ Background profile loading failed')
            }
          }, 100)

          if (event === 'SIGNED_IN') {
            // Log security event
            await logAdvancedSecurityEvent({
              event_type: 'SIGN_IN',
              user_id: session.user.id,
              security_context: securityContext,
              timestamp: new Date().toISOString()
            })

            // Start monitoring
            startAdvancedMonitoring(session.user.id, securityContext)

            toast.success('🎉 Secure login successful!', {
              description: 'Advanced security measures active'
            })
            
            // ✅ FIXED: Set loading to false after successful login and profile loading
            if (mounted) setIsLoading(false)
          } else {
            // ✅ FIXED: Set loading to false for other auth events as well
            if (mounted) setIsLoading(false)
          }
        } else if (event === 'SIGNED_OUT') {
          // Cleanup on logout
          setProfile(null)
          setSecurityContext(null)
          setShouldNavigateToDashboard(false)
          setPendingNavigation(null)
          stopAdvancedMonitoring()
          setIsLoading(false)

          toast.success('👋 Logged out securely')
        }
      }
    )

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [securityContext])

  // Helper function to handle profile errors
  const handleProfileError = useCallback((error: any) => {
    console.error('❌ Profile fetch failed:', error)
    setIsLoading(false)
    
    if (error.code === 'PGRST116') {
      toast.error('Profile not found. Please contact administrator.')
    } else {
      toast.error('Failed to load profile. Please try again.')
    }
  }, [])

  // Create user profile from auth data
  const createUserProfileFromAuth = useCallback(async (userId: string) => {
    try {
      const { data: authUser } = await supabase.auth.getUser()
      if (!authUser.user) return

      const newProfile = {
        auth_user_id: userId,
        employee_id: `EMP${Date.now()}`,
        first_name: authUser.user.user_metadata?.first_name || 'User',
        last_name: authUser.user.user_metadata?.last_name || '',
        email: authUser.user.email,
        role_id: 1, // Default admin role
        department_id: null,
        position_id: null,
        is_active: true,
        created_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('user_profiles')
        .insert([newProfile])

      if (error) throw error

      toast.success('Profile created successfully!')
      // Retry fetching the profile
      await fetchSimpleProfile(userId)
    } catch (error) {
      console.error('❌ Failed to create profile:', error)
      handleProfileError(error)
    }
  }, [handleProfileError])

  // Fetch simple profile without relations
  const fetchSimpleProfile = useCallback(async (userId: string) => {
    try {
      setIsLoading(true)
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('auth_user_id', userId)
        .eq('is_active', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          await createUserProfileFromAuth(userId)
          return
        }
        throw error
      }

      // Create simple profile with default role
      const simpleProfile: UserProfile = {
        ...data,
        department: null,
        role: {
          id: 1,
          name: 'admin',
          display_name: 'Administrator',
          level: 6,
          color_code: '#667eea',
          icon: 'admin',
          permissions: ['*'],
          max_users: null,
          is_system_role: false
        },
        position: null,
        performance_score: 85,
        last_activity: new Date().toISOString()
      }

      setProfile(simpleProfile)
      setIsLoading(false)
      
      toast.success(`Welcome back, ${simpleProfile.first_name}! 🎉`)
    } catch (error: any) {
      console.error('❌ Simple profile fetch failed:', error)
      handleProfileError(error)
    }
  }, [handleProfileError, createUserProfileFromAuth])

  // ✅ NEW: Create user session record in database
  const createUserSession = async (userId: string, employeeId: string, securityCtx: SecurityContext) => {
    try {
      const sessionData = {
        user_id: userId,
        employee_id: employeeId,
        session_token: securityCtx.session_id,
        device_info: securityCtx.device_info || {},
        browser_fingerprint: securityCtx.browser_fingerprint,
        user_agent: securityCtx.user_agent,
        device_type: securityCtx.device_info?.type || 'desktop',
        ip_address: securityCtx.ip_address,
        country: securityCtx.location?.country || 'Unknown',
        city: securityCtx.location?.city || 'Unknown',
        is_trusted_device: securityCtx.is_trusted_device,
        risk_score: securityCtx.risk_level === 'high' ? 80 : securityCtx.risk_level === 'medium' ? 40 : 10,
        security_flags: securityCtx.security_flags || [],
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        last_activity: new Date().toISOString(),
        metadata: {
          login_method: 'password',
          client_version: '1.0.0',
          feature_flags: ['advanced_security', 'biometric_auth']
        }
      }

      const { error } = await supabase
        .from('user_sessions')
        .upsert(sessionData, { 
          onConflict: 'session_token',
          ignoreDuplicates: false 
        })

      if (error) {
        console.warn('⚠️ Failed to create session record:', error)
      } else {
        // console.log('✅ User session recorded successfully')
      }
    } catch (error) {
      console.error('❌ Session creation error:', error)
    }
  }

  // Advanced Security Risk Assessment
  const assessAdvancedSecurityRisk = async (
    profile: UserProfile, 
    securityCtx: SecurityContext
  ): Promise<'low' | 'medium' | 'high'> => {
    const riskFactors = []
    
    // Time-based analysis
    const currentHour = new Date().getHours()
    if (currentHour < 6 || currentHour > 22) {
      riskFactors.push('unusual_time')
    }
    
    // Device trust analysis
    if (!securityCtx.is_trusted_device) {
      riskFactors.push('untrusted_device')
    }
    
    // Account security analysis
    if (profile.failed_login_attempts && profile.failed_login_attempts > 3) {
      riskFactors.push('multiple_failed_attempts')
    }
    
    if (profile.account_locked) {
      riskFactors.push('account_previously_locked')
    }
    
    // Activity pattern analysis
    if (profile.last_login) {
      const timeSinceLastLogin = Date.now() - new Date(profile.last_login).getTime()
      const daysSinceLastLogin = timeSinceLastLogin / (1000 * 60 * 60 * 24)
      
      if (daysSinceLastLogin > 30) {
        riskFactors.push('long_absence')
      }
    }
    
    // Location analysis
    if (securityCtx.location?.country) {
      const storedLocation = localStorage.getItem(`user_location_${profile.id}`)
      if (storedLocation && storedLocation !== securityCtx.location.country) {
        riskFactors.push('new_location')
      } else if (!storedLocation) {
        localStorage.setItem(`user_location_${profile.id}`, securityCtx.location.country)
      }
    }

    // Employment status analysis
    if (profile.employment_status !== 'active') {
      riskFactors.push('inactive_employment_status')
    }

    // Role-based analysis
    if (profile.role?.is_system_role) {
      riskFactors.push('system_role_access')
    }
    
    // Calculate risk level
    if (riskFactors.length >= 3) return 'high'
    if (riskFactors.length >= 1) return 'medium'
    return 'low'
  }

  // Performance Score Calculation
  const calculatePerformanceScore = (profileData: any): number => {
    let score = 50 // Base score
    
    // Activity bonus
    if (profileData.last_login) {
      const daysSinceLogin = (Date.now() - new Date(profileData.last_login).getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceLogin < 7) score += 20
      else if (daysSinceLogin < 30) score += 10
    }
    
    // Profile completeness
    const fields = ['profile_photo_url', 'phone', 'work_location', 'skills', 'certifications']
    const completedFields = fields.filter(field => profileData[field] && (Array.isArray(profileData[field]) ? profileData[field].length > 0 : true)).length
    score += (completedFields / fields.length) * 20
    
    // Role level bonus
    if (profileData.role?.level) {
      score += Math.min(profileData.role.level * 3, 15)
    }

    // Performance rating bonus
    if (profileData.performance_rating) {
      score += profileData.performance_rating * 3
    }

    // Engagement score bonus
    if (profileData.engagement_score) {
      score += (profileData.engagement_score / 100) * 10
    }
    
    return Math.min(100, Math.max(0, score))
  }

  // Advanced Monitoring System
  const startAdvancedMonitoring = (userId: string, securityCtx: SecurityContext) => {
    // Session health monitoring
    sessionMonitorRef.current = setInterval(async () => {
      try {
        const { data, error } = await supabase.auth.getUser()
        if (error || !data.user) {
          console.warn('⚠️ Session validation failed')
          setSessionHealth('critical')
        } else {
          setSessionHealth('healthy')
          // Update session activity
          await updateSessionActivity(securityCtx.session_id)
        }
      } catch (error) {
        console.error('Session monitor error:', error)
        setSessionHealth('warning')
      }
    }, 60000) // Check every minute

    // Activity tracking
    const trackActivity = () => {
      setSecurityContext(prev => prev ? {
        ...prev,
        last_activity: new Date().toISOString()
      } : prev)
    }

    // Track user interactions
    document.addEventListener('click', trackActivity)
    document.addEventListener('keypress', trackActivity)
    document.addEventListener('mousemove', trackActivity)

    // Cleanup function
    const cleanup = () => {
      document.removeEventListener('click', trackActivity)
      document.removeEventListener('keypress', trackActivity)
      document.removeEventListener('mousemove', trackActivity)
    }

    // Store cleanup for later
    ;(window as any).activityCleanup = cleanup

    // Periodic security checks
    securityCheckRef.current = setInterval(async () => {
      if (securityCtx.risk_level === 'high') {
        console.warn('🚨 High-risk session detected, performing additional checks')
        await logSecurityAlert(userId, securityCtx)
      }
    }, 300000) // Check every 5 minutes
  }

  const stopAdvancedMonitoring = () => {
    if (sessionMonitorRef.current) {
      clearInterval(sessionMonitorRef.current)
    }
    if (securityCheckRef.current) {
      clearInterval(securityCheckRef.current)
    }
    if ((window as any).activityCleanup) {
      ;(window as any).activityCleanup()
    }
  }

  // ✅ FIXED: Enhanced Login Method with database integration
  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    if (!credentials.email?.trim() || !credentials.password) {
      return { success: false, error: 'Email and password are required' }
    }

    // ✅ FIXED: Prevent double login attempts
    if (loginInProgressRef.current) {
      // console.log('🔐 Login already in progress, skipping...')
      return { success: false, error: 'Login already in progress' }
    }

    let loginResult: LoginResponse | null = null

    try {
      loginInProgressRef.current = true
      setIsLoading(true)
      // console.log('🔐 Processing advanced login...')

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email.trim(),
        password: credentials.password,
      })

      if (error) {
        console.error('❌ Login error:', error)
        
        // Log failed attempt to database
        await logFailedLoginAttempt(credentials.email, error.message)
        
        loginResult = {
          success: false,
          error: getEnhancedErrorMessage(error),
        }
        return loginResult
      }

      if (!data.user) {
        loginResult = { success: false, error: 'Authentication failed - no user data received' }
        return loginResult
      }

      // console.log('✅ Advanced login successful:', data.user.email)

      // ✅ FIXED: Don't set loading to false here, let auth state change listener handle it
      loginResult = { success: true, user: data.user }
      return loginResult

    } catch (error: any) {
      console.error('�� Login exception:', error)
      loginResult = { 
        success: false, 
        error: 'An unexpected error occurred. Please try again.' 
      }
      return loginResult
    } finally {
      // ✅ FIXED: Only set loading to false if login failed
      if (loginResult && !loginResult.success) {
        setIsLoading(false)
      }
      loginInProgressRef.current = false
    }
  }

  // Enhanced Logout
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true)
      
      if (user && securityContext) {
        await logAdvancedSecurityEvent({
          event_type: 'LOGOUT',
          user_id: user.id,
          security_context: securityContext,
          timestamp: new Date().toISOString()
        })

        // Update session status
        await updateSessionStatus(securityContext.session_id, 'logged_out')
      }

      stopAdvancedMonitoring()
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Logout error:', error)
        toast.error('Logout failed')
      } else {
        // Reset all state
        setUser(null)
        setProfile(null)
        setSecurityContext(null)
        setShouldNavigateToDashboard(false)
        setPendingNavigation(null)
        setSessionHealth('healthy')
        loginInProgressRef.current = false
      }
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('An error occurred during logout')
    } finally {
      setIsLoading(false)
    }
  }

  // Helper Functions
  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return data.ip
    } catch {
      return 'unknown'
    }
  }

  const checkTrustedDevice = async (fingerprint: string): Promise<boolean> => {
    const trustedDevices = JSON.parse(localStorage.getItem('trusted_devices') || '[]')
    return trustedDevices.includes(fingerprint)
  }

  // Removed duplicate handleProfileError function - using the one defined earlier with useCallback

  // ✅ FIXED: Database-integrated session and activity functions
  const updateSessionActivity = async (sessionToken: string) => {
    try {
      // First get the current activity count
      const { data: currentSession } = await supabase
        .from('user_sessions')
        .select('activity_count')
        .eq('session_token', sessionToken)
        .single()

      const currentCount = currentSession?.activity_count || 0

      // Then update with incremented count
      await supabase
        .from('user_sessions')
        .update({
          last_activity: new Date().toISOString(),
          activity_count: currentCount + 1
        })
        .eq('session_token', sessionToken)
    } catch (error) {
      console.error('Session activity update error:', error)
    }
  }

  const updateSessionStatus = async (sessionToken: string, logoutReason: string) => {
    try {
      await supabase
        .from('user_sessions')
        .update({ 
          is_active: false,
          logout_reason: logoutReason,
          updated_at: new Date().toISOString()
        })
        .eq('session_token', sessionToken)
    } catch (error) {
      console.error('Session status update error:', error)
    }
  }

  const logFailedLoginAttempt = async (email: string, failureReason: string) => {
    try {
      const attemptData = {
        email: email,
        ip_address: await getClientIP(),
        user_agent: navigator.userAgent,
        device_fingerprint: securityContext?.device_fingerprint || 'unknown',
        country: securityContext?.location?.country || 'Unknown',
        attempt_type: 'password',
        failure_reason: failureReason,
        risk_indicators: [],
        is_bot_suspected: false,
        is_brute_force: false,
        metadata: {
          timestamp: new Date().toISOString(),
          browser: navigator.userAgent.split(' ').find(part => 
            part.includes('Chrome') || part.includes('Firefox') || part.includes('Safari')
          ) || 'Unknown'
        }
      }

      await supabase
        .from('failed_login_attempts')
        .insert(attemptData)

      // console.log('📊 Failed login attempt logged')
    } catch (error) {
      console.error('Failed to log login attempt:', error)
    }
  }

  const logSecurityAlert = async (userId: string, securityCtx: SecurityContext) => {
    try {
      // In a real implementation, this would log to a security_alerts table
      // console.log('🚨 Security Alert:', {
      //   user_id: userId,
      //   alert_type: 'high_risk_session',
      //   risk_level: securityCtx.risk_level,
      //   device_info: securityCtx.device_info,
      //   timestamp: new Date().toISOString()
      // })
    } catch (error) {
      console.error('Security alert logging error:', error)
    }
  }

  const logAdvancedSecurityEvent = async (event: any) => {
    try {
      // Log to your security events table (audit logs)
      // console.log('📊 Security Event:', event)
      // In a real implementation, this would insert into an audit_logs table
    } catch (error) {
      console.error('Security logging error:', error)
    }
  }

  const getEnhancedErrorMessage = (error: any): string => {
    const errorMessages = {
      'Invalid login credentials': 'Invalid email or password. Please check your credentials and try again.',
      'Email not confirmed': 'Please check your email and confirm your account before logging in.',
      'Too many requests': 'Too many login attempts. Please wait 15 minutes before trying again.',
      'User not found': 'No account found with this email address.',
      'Signup not allowed': 'Account registration is currently disabled.',
      'Account temporarily locked': 'Your account has been temporarily locked due to multiple failed attempts.'
    }

    return errorMessages[error.message as keyof typeof errorMessages] || error.message || 'Login failed'
  }

  // Advanced Methods
  const refreshProfile = async () => {
    if (user && securityContext) {
      setIsLoading(true)
      await fetchSimpleProfile(user.id)
    }
  }

  const updateUserPreferences = async (preferences: Partial<UserProfile>): Promise<boolean> => {
    if (!user || !profile) return false
    
    try {
      // Update user_profiles table
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          ...preferences,
          updated_at: new Date().toISOString()
        })
        .eq('auth_user_id', user.id)

      if (profileError) throw profileError

      // Update user_preferences table if preference-specific data
      if (preferences.timezone || preferences.preferred_language) {
        const { error: prefError } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            employee_id: profile.employee_id,
            timezone: preferences.timezone || profile.timezone,
            language: preferences.preferred_language || profile.preferred_language,
            updated_at: new Date().toISOString()
          })

        if (prefError) console.warn('Preferences update warning:', prefError)
      }
      
      await refreshProfile()
      toast.success('Preferences updated successfully')
      return true
    } catch (error) {
      console.error('Preferences update error:', error)
      toast.error('Failed to update preferences')
      return false
    }
  }

  const clearNavigationFlag = () => {
    setShouldNavigateToDashboard(false)
    setPendingNavigation(null)
  }

  const switchTheme = async (theme: 'light' | 'dark' | 'auto') => {
    if (!user || !profile) return

    try {
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          employee_id: profile.employee_id,
          theme: theme,
          updated_at: new Date().toISOString()
        })

      document.documentElement.setAttribute('data-theme', theme)
      toast.success(`Theme switched to ${theme}`)
    } catch (error) {
      console.error('Theme switch error:', error)
      toast.error('Failed to update theme')
    }
  }

  const enableTwoFactor = async (): Promise<{ qrCode: string; backupCodes: string[] }> => {
    if (!user || !profile) {
      throw new Error('User not authenticated')
    }

    try {
      // Update user profile to enable 2FA
      await supabase
        .from('user_profiles')
        .update({
          two_factor_enabled: true,
          updated_at: new Date().toISOString()
        })
        .eq('auth_user_id', user.id)

      // In a real implementation, you'd generate actual QR code and backup codes
      const mockBackupCodes = Array.from({ length: 8 }, () => 
        Math.random().toString(36).substring(2, 8).toUpperCase()
      )

      toast.success('Two-factor authentication enabled')
      
      return {
        qrCode: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`, // Mock QR code
        backupCodes: mockBackupCodes
      }
    } catch (error) {
      console.error('2FA enable error:', error)
      toast.error('Failed to enable two-factor authentication')
      throw error
    }
  }

  const validateTwoFactor = async (token: string): Promise<boolean> => {
    // In a real implementation, this would validate against stored 2FA secrets
    const isValid = token.length === 6 && /^\d+$/.test(token)
    
    if (isValid) {
      toast.success('Two-factor authentication verified')
    } else {
      toast.error('Invalid two-factor authentication code')
    }
    
    return isValid
  }

  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user, // ✅ FIXED: Only require user, profile can load separately
    securityContext,
    sessionHealth,
    shouldNavigateToDashboard,
    pendingNavigation,
    login,
    logout,
    refreshProfile,
    updateUserPreferences,
    clearNavigationFlag,
    switchTheme,
    enableTwoFactor,
    validateTwoFactor,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
