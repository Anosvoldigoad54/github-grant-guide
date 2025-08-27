/**
 * Simple test to verify Supabase connectivity
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export async function testSupabaseConnectivity() {
  console.log('🔧 Simple Supabase connectivity test...')
  
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('⚠️ Skipping connectivity test: missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
    return false
  }

  try {
    // Test basic REST endpoint
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('✅ Basic connectivity test:', {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText
    })
    
    if (response.ok) {
      console.log('🎯 Supabase is reachable!')
      return true
    } else {
      console.log('❌ Supabase responded with error status')
      return false
    }
    
  } catch (error) {
    console.error('❌ Failed to reach Supabase:', error)
    console.log('💡 This suggests a network/CORS/browser extension issue')
    return false
  }
}

// Auto-run
if (import.meta.env.DEV) {
  setTimeout(testSupabaseConnectivity, 500)
}

export default testSupabaseConnectivity
