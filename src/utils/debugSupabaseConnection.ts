import { supabase } from '../lib/supabase'

/**
 * Debug Supabase connection issues
 */
export async function debugSupabaseConnection() {
  console.log('🔍 Debugging Supabase connection...')
  
  // Check environment variables
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  console.log('Environment check:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    url: supabaseUrl
  })
  
  // Test 1: Simple connection test
  try {
    console.log('1️⃣ Testing basic connectivity...')
    const response = await fetch(supabaseUrl + '/rest/v1/', {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    })
    
    console.log('Basic fetch response:', {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    })
  } catch (error) {
    console.error('❌ Basic fetch failed:', error)
  }
  
  // Test 2: Auth connection
  try {
    console.log('2️⃣ Testing auth connection...')
    const { data, error } = await supabase.auth.getSession()
    console.log('Auth session:', { data: !!data, error: error?.message })
  } catch (error) {
    console.error('❌ Auth test failed:', error)
  }
  
  // Test 3: Simple table query
  try {
    console.log('3️⃣ Testing simple table query...')
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1)
    
    if (error) {
      console.log('Query error (may be expected due to RLS):', error.message)
    } else {
      console.log('Query successful:', { recordCount: data?.length || 0 })
    }
  } catch (error) {
    console.error('❌ Table query failed:', error)
  }
  
  // Test 4: CORS and browser check
  try {
    console.log('4️⃣ Testing CORS and browser environment...')
    console.log('Browser info:', {
      userAgent: navigator.userAgent,
      protocol: window.location.protocol,
      host: window.location.host,
      origin: window.location.origin
    })

    // Check for common browser extensions that might interfere
    const hasExtensions = Object.keys(window).some(key =>
      key.includes('chrome') || key.includes('extension') || key.includes('webkit')
    )
    console.log('Browser extensions detected:', hasExtensions)

  } catch (error) {
    console.error('❌ Browser check failed:', error)
  }

  // Test 5: Direct Supabase health check
  try {
    console.log('5️⃣ Testing Supabase health...')
    const healthUrl = supabaseUrl + '/rest/v1/'
    const healthResponse = await fetch(healthUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('Supabase health check:', {
      ok: healthResponse.ok,
      status: healthResponse.status,
      statusText: healthResponse.statusText
    })

    if (!healthResponse.ok) {
      const errorText = await healthResponse.text()
      console.log('Health check error body:', errorText)
    }

  } catch (error) {
    console.error('❌ Supabase health check failed:', error)
    console.error('This indicates a network connectivity issue')
  }

  console.log('🏁 Debug complete')
  console.log('💡 If seeing "Failed to fetch" errors, try:')
  console.log('   1. Disable browser extensions temporarily')
  console.log('   2. Check if the Supabase URL is accessible in a new tab')
  console.log('   3. Verify network connectivity')
  console.log('   4. Check for CORS issues in browser dev tools')
}

// Auto-run in development
if (import.meta.env.DEV) {
  setTimeout(() => {
    debugSupabaseConnection()
  }, 1000)
}

export default debugSupabaseConnection
