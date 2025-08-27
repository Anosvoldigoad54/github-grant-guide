import DatabaseService from '../services/databaseService'
import RealDataService from '../services/realDataService'

/**
 * Test the database fixes for count operations
 */
export async function testDatabaseFixes() {
  console.log('🧪 Testing database fixes...')
  
  try {
    // Test 1: Dashboard metrics
    console.log('1️⃣ Testing getDashboardMetrics...')
    const dashboardMetrics = await DatabaseService.getDashboardMetrics()
    console.log('✅ Dashboard metrics result:', dashboardMetrics)
    
    // Test 2: Employee stats
    console.log('2️⃣ Testing getEmployeeStats...')
    const employeeStats = await RealDataService.getEmployeeStats()
    console.log('✅ Employee stats result:', employeeStats)
    
    // Test 3: Individual count methods
    console.log('3️⃣ Testing count methods...')
    const [totalEmp, activeEmp, deptCount] = await Promise.all([
      DatabaseService.getEmployeeCount(),
      DatabaseService.getActiveEmployeeCount(),
      DatabaseService.getDepartmentCount()
    ])
    
    console.log('✅ Count results:', {
      totalEmployees: totalEmp,
      activeEmployees: activeEmp,
      departments: deptCount
    })
    
    console.log('🎉 All database tests passed!')
    return true
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
    return false
  }
}

// Manual test function - call testDatabaseFixes() to verify fixes
// Auto-run disabled to avoid conflicts with other tests

export default testDatabaseFixes
