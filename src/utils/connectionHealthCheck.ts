import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

interface HealthCheckResult {
  overall: 'healthy' | 'warning' | 'error'
  database: {
    connected: boolean
    authenticated: boolean
    rlsActive: boolean
    message: string
  }
  environment: {
    hasUrl: boolean
    hasAnonKey: boolean
    message: string
  }
  recommendations: string[]
}

/**
 * Comprehensive health check for database connectivity
 * Provides clear, user-friendly status information
 */
export async function performConnectionHealthCheck(): Promise<HealthCheckResult> {
  console.log('🏥 Running connection health check...')
  
  const result: HealthCheckResult = {
    overall: 'healthy',
    database: {
      connected: false,
      authenticated: false,
      rlsActive: false,
      message: ''
    },
    environment: {
      hasUrl: false,
      hasAnonKey: false,
      message: ''
    },
    recommendations: []
  }

  // Check environment variables
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  result.environment.hasUrl = !!supabaseUrl
  result.environment.hasAnonKey = !!supabaseAnonKey

  if (!supabaseUrl || !supabaseAnonKey) {
    result.overall = 'error'
    result.environment.message = 'Missing required environment variables'
    result.recommendations.push('Check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
    return result
  } else {
    result.environment.message = 'Environment variables configured correctly'
  }

  // Check authentication status
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      result.database.authenticated = false
      console.log('ℹ️ No active authentication session')
    } else if (user) {
      result.database.authenticated = true
      console.log('✅ User authenticated:', user.email)
    } else {
      result.database.authenticated = false
      console.log('ℹ️ Anonymous session')
    }
  } catch (error) {
    console.warn('⚠️ Authentication check failed:', error)
  }

  // Test database connectivity
  try {
    console.log('🔍 Testing database connectivity...')
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1)

    if (error) {
      // Check if it's an RLS/permission error
      const isRLSError = error.message?.toLowerCase().includes('permission denied') ||
                        error.message?.toLowerCase().includes('rls') ||
                        error.message?.toLowerCase().includes('policy')

      if (isRLSError) {
        result.database.connected = true
        result.database.rlsActive = true
        result.database.message = 'Database connected. RLS policies are active (security working correctly)'
        
        if (!result.database.authenticated) {
          result.overall = 'warning'
          result.recommendations.push('Consider signing in for full functionality')
        }
        
        console.log('✅ Database connection successful - RLS is protecting data correctly')
      } else {
        result.database.connected = false
        result.database.message = `Database connection error: ${error.message}`
        result.overall = 'error'
        result.recommendations.push('Check your Supabase project status and network connectivity')
        console.error('❌ Database connection failed:', error.message)
      }
    } else {
      result.database.connected = true
      result.database.message = 'Database connected and accessible'
      console.log('✅ Database connection successful with data access')
    }
  } catch (error: any) {
    result.database.connected = false
    result.database.message = `Connection test failed: ${error.message}`
    result.overall = 'error'
    result.recommendations.push('Check your internet connection and Supabase project status')
    console.error('❌ Database connectivity test failed:', error)
  }

  // Final assessment
  if (result.overall === 'healthy' && result.database.rlsActive && !result.database.authenticated) {
    result.overall = 'warning'
  }

  return result
}

/**
 * Display user-friendly health check results
 */
export function displayHealthCheckResults(result: HealthCheckResult) {
  const { overall, database, environment, recommendations } = result

  console.log('📊 Health Check Results:')
  console.log('Overall Status:', overall)
  console.log('Database:', database.message)
  console.log('Environment:', environment.message)
  
  if (recommendations.length > 0) {
    console.log('💡 Recommendations:')
    recommendations.forEach(rec => console.log(`  • ${rec}`))
  }

  // Show appropriate toast notifications
  switch (overall) {
    case 'healthy':
      toast.success('System Status: Healthy', {
        description: 'All systems are operational'
      })
      break
    case 'warning':
      toast.info('System Status: Functional', {
        description: database.rlsActive 
          ? 'Database security is active. Sign in for full access.'
          : 'System is running with limited functionality'
      })
      break
    case 'error':
      toast.error('System Status: Issues Detected', {
        description: 'Some components need attention. Check console for details.'
      })
      break
  }
}

/**
 * Quick status check for display in UI
 */
export async function getQuickConnectionStatus(): Promise<{
  status: 'connected' | 'rls_protected' | 'disconnected'
  message: string
  authenticated: boolean
}> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1)

    if (error) {
      const isRLSError = error.message?.toLowerCase().includes('permission denied')
      
      if (isRLSError) {
        return {
          status: 'rls_protected',
          message: 'Database secured by RLS policies',
          authenticated: !!user
        }
      } else {
        return {
          status: 'disconnected',
          message: 'Database connection issue',
          authenticated: !!user
        }
      }
    }

    return {
      status: 'connected',
      message: 'Database fully accessible',
      authenticated: !!user
    }
  } catch (error) {
    return {
      status: 'disconnected',
      message: 'Connection test failed',
      authenticated: false
    }
  }
}

// Auto-run health check in development with better messaging
if (import.meta.env.DEV) {
  setTimeout(async () => {
    const result = await performConnectionHealthCheck()
    displayHealthCheckResults(result)
    
    if (result.overall === 'error') {
      console.log('🔧 Need help? Check the documentation or contact support')
    } else if (result.overall === 'warning') {
      console.log('ℹ️ System is functional. Sign in for full features.')
    } else {
      console.log('🎯 All systems operational!')
    }
  }, 1000)
}

export default {
  performConnectionHealthCheck,
  displayHealthCheckResults,
  getQuickConnectionStatus
}
