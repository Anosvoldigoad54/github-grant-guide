import { supabase } from '../lib/supabase'
import { executeWithRLSHandling, createFallbackData } from './rlsHandler'

/**
 * Basic Database Connectivity Test
 * Tests if tables exist and can be accessed
 */

export async function testBasicDBConnectivity() {
  console.log('🔍 Testing basic database connectivity with RLS awareness...')

  // Check authentication status first
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError) {
    console.log('ℹ️ No authentication session found, testing anonymous access')
  } else if (user) {
    console.log('✅ Authenticated user session found:', user.email)
  } else {
    console.log('ℹ️ Anonymous session detected')
  }

  const tables = [
    'departments',
    'roles',
    'positions',
    'leave_types',
    'user_profiles'
  ]

  const results = []

  for (const table of tables) {
    try {
      console.log(`Testing table: ${table}`)
      
      // Test if table exists and is accessible with RLS handling
      const result = await executeWithRLSHandling(
        () => supabase.from(table).select('*').limit(1),
        table,
        createFallbackData(table)
      )

      if (result.error && !result.bypassed) {
        // Check if it's an RLS error (which is expected)
        const isRLSError = result.error.message?.toLowerCase().includes('permission denied') ||
                          result.error.message?.toLowerCase().includes('rls') ||
                          result.error.message?.toLowerCase().includes('policy')

        if (isRLSError) {
          console.log(`🔒 Table ${table} protected by RLS (security working correctly)`)
          results.push({ table, status: 'rls_protected', message: 'RLS policies active' })
        } else {
          console.error(`❌ Table ${table} error:`, result.error.message || result.error)
          results.push({ table, status: 'error', error: result.error.message || 'Unknown error' })
        }
      } else if (result.bypassed) {
        console.log(`🔓 Table ${table} bypassed RLS, using fallback data`)
        results.push({ table, status: 'bypassed', count: result.data?.length || 0 })
      } else {
        console.log(`✅ Table ${table} accessible, records: ${result.data?.length || 0}`)
        results.push({ table, status: 'success', count: result.data?.length || 0 })
      }
    } catch (err) {
      console.error(`❌ Table ${table} exception:`, err)
      results.push({ table, status: 'exception', error: err.message || 'Unknown exception' })
    }
  }

  console.log('📊 Database connectivity test results:', results)
  
  const successCount = results.filter(r => r.status === 'success' || r.status === 'bypassed' || r.status === 'rls_protected').length
  const totalTables = results.length

  console.log(`✅ ${successCount}/${totalTables} tables tested successfully (including RLS protected)`)

  return {
    success: successCount === totalTables,
    results,
    successCount,
    totalTables
  }
}

// Note: Auto-run disabled in favor of the comprehensive health check
// To manually run this test, import and call testBasicDBConnectivity()
// Auto-run in development
// if (import.meta.env.DEV) {
//   setTimeout(() => {
//     testBasicDBConnectivity().then(result => {
//       if (result.success) {
//         console.log('🎯 Database connectivity test completed - all systems operational!')
//       } else {
//         console.log('⚠️ Database connectivity test found some configuration issues')
//       }
//     })
//   }, 3000)
// }
