/**
 * Connection Status Reporter
 * Provides real-time status updates for debugging
 */

export function reportConnectionStatus() {
  console.log('🔍 Connection Status Report')
  console.log('========================')
  
  // Environment check
  console.log('Environment Variables:')
  console.log('- VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing')
  console.log('- VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing')
  
  // Browser status
  console.log('\nBrowser Status:')
  console.log('- Online:', navigator.onLine ? '✅ Yes' : '❌ No')
  console.log('- User Agent:', navigator.userAgent)
  console.log('- Protocol:', window.location.protocol)
  console.log('- Host:', window.location.host)
  
  // Previous errors check
  const hasSupabaseErrors = performance.getEntriesByType('navigation')
    .some((entry: any) => entry.name?.includes('supabase'))
  
  console.log('\nError Indicators:')
  console.log('- Supabase in performance entries:', hasSupabaseErrors ? '⚠️ Yes' : '✅ No')
  
  console.log('\n💡 Recommendations:')
  console.log('1. Check browser dev tools Network tab for failed requests')
  console.log('2. Temporarily disable browser extensions')
  console.log('3. Try opening Supabase URL directly in a new tab')
  console.log('4. Check if corporate firewall is blocking requests')
  
  console.log('========================')
}

// Auto-run after a short delay
setTimeout(reportConnectionStatus, 2000)

export default reportConnectionStatus
