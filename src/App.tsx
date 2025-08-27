'use client'

import React, { Suspense, lazy, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Box, CircularProgress, Typography, useTheme, Alert } from '@mui/material'
import ErrorBoundary from './components/common/ErrorBoundary'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeContextProvider } from './contexts/ThemeContext'
import { SimpleAuthGuard as AuthGuard } from './components/auth/SimpleAuthGuard'
import { MainLayout } from './components/layout/MainLayout'
import './styles/globals.css'
import './styles/index.css'

// Lazy load components for better performance
const Dashboard = lazy(() => import('./components/dashboard/LiveDashboard'))
const EmployeeDirectory = lazy(() => import('./components/employees/EmployeeDirectory'))
const AttendanceTracking = lazy(() => import('./components/attendance/ComprehensiveAttendanceSystem'))
const LocationBasedAttendance = lazy(() => import('./components/attendance/LocationBasedAttendance'))
const LeaveManagement = lazy(() => import('./components/leave/ComprehensiveLeaveManagement'))
const PayrollDashboard = lazy(() => import('./components/payroll/PayrollDashboard'))
const AdvancedAnalyticsDashboard = lazy(() => import('./components/analytics/AdvancedAnalyticsDashboard').then(module => ({ default: module.AdvancedAnalyticsDashboard })))
const EmployeeProfile = lazy(() => import('./components/employees/EmployeeProfile'))
const OrganizationChart = lazy(() => import('./components/organization/OrganizationChart').then(module => ({ default: module.OrganizationChart })))
const DocumentManagement = lazy(() => import('./components/documents/DocumentManagement'))
const AdminPanel = lazy(() => import('./components/admin/DatabaseAdminPanel'))
const BenefitsManagement = lazy(() => import('./components/benefits/BenefitsManagement'))
const ProjectManagement = lazy(() => import('./components/projects/ProjectManagement'))
const LoginPage = lazy(() => import('./components/auth/LoginPageSimple'))
const SettingsPage = lazy(() => import('./components/settings/SettingsPage'))
const ReportsPage = lazy(() => import('./components/reports/ReportsPage'))
const EmployeeManagementSystem = lazy(() => import('./components/employee/EmployeeManager'))
const MessagingSystem = lazy(() => import('./components/messaging/MessagingSystem'))
const PasswordChangeDialog = lazy(() => import('./components/auth/PasswordChangeDialog'))
const PerformanceManagement = lazy(() => import('./components/performance/PerformanceManagement'))
const HiringManagement = lazy(() => import('./components/hiring/HiringManagement'))
const InterviewManagement = lazy(() => import('./components/interviews/InterviewManagement'))
const RoleBasedDashboard = lazy(() => import('./components/dashboard/RoleBasedDashboard'))
const TrainingManagement = lazy(() => import('./components/training/TrainingManagement'))
const AnnouncementCenter = lazy(() => import('./components/announcements/AnnouncementCenter'))
const ExpenseManagement = lazy(() => import('./components/expenses/ExpenseManagement'))
const ComplianceManagement = lazy(() => import('./components/compliance/ComplianceManagement'))
const AIResumeAnalyzer = lazy(() => import('./components/ai/AIResumeAnalyzer'))
const AIInsights = lazy(() => import('./components/ai/AIInsights'))
const AIAttendanceAnalyzer = lazy(() => import('./components/ai/AIAttendanceAnalyzer'))
const AILeaveRecommendations = lazy(() => import('./components/ai/AILeaveRecommendations'))
const HRChatbot = lazy(() => import('./components/ai/HRChatbot'))

// Simple loading fallback
function LoadingScreen() {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress />
    </Box>
  )
}

// Route-level loading component
function RouteLoading() {
  const theme = useTheme()
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: 2,
        p: 4
      }}
    >
      <CircularProgress 
        size={40} 
        thickness={3}
        sx={{ color: theme.palette.primary.main }} 
      />
      <Typography variant="body2" color="text.secondary">
        Loading module...
      </Typography>
    </Box>
  )
}

// Simple route wrapper
function SimpleRoute({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<RouteLoading />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <AuthGuard>
            <MainLayout>
              <Routes>
                {/* Dashboard Routes */}
                <Route 
                  path="dashboard" 
                  element={
                    <SimpleRoute>
                      <RoleBasedDashboard />
                    </SimpleRoute>
                  } 
                />
                <Route 
                  path="dashboard/live" 
                  element={
                    <SimpleRoute>
                      <Dashboard />
                    </SimpleRoute>
                  } 
                />

                {/* HR Routes */}
                <Route 
                  path="hr/employees" 
                  element={
                    <SimpleRoute>
                      <EmployeeDirectory />
                    </SimpleRoute>
                  } 
                />
                <Route 
                  path="hr/employee-management" 
                  element={
                    <SimpleRoute>
                      <Navigate to="/hr/employees" replace />
                    </SimpleRoute>
                  } 
                />
                <Route 
                  path="hr/organization-chart" 
                  element={
                    <SimpleRoute>
                      <OrganizationChart />
                    </SimpleRoute>
                  } 
                />
                <Route 
                  path="hr/recruitment" 
                  element={
                    <SimpleRoute>
                      <EmployeeDirectory />
                    </SimpleRoute>
                  } 
                />
                <Route 
                  path="hr/performance" 
                  element={
                    <SimpleRoute>
                      <PerformanceManagement />
                    </SimpleRoute>
                  } 
                />
                <Route 
                  path="hr/hiring" 
                  element={
                    <SimpleRoute>
                      <HiringManagement />
                    </SimpleRoute>
                  } 
                />
                <Route 
                  path="hr/interviews" 
                  element={
                    <SimpleRoute>
                      <InterviewManagement />
                    </SimpleRoute>
                  } 
                />
                <Route 
                  path="hr/training" 
                  element={
                    <SimpleRoute>
                      <TrainingManagement />
                    </SimpleRoute>
                  } 
                />
                <Route 
                  path="hr/onboarding" 
                  element={
                    <SimpleRoute>
                      <HiringManagement />
                    </SimpleRoute>
                  } 
                />
                <Route 
                  path="hr/documents" 
                  element={
                    <SimpleRoute>
                      <DocumentManagement />
                    </SimpleRoute>
                  } 
                />
                <Route 
                  path="hr/benefits" 
                  element={
                    <SimpleRoute>
                      <BenefitsManagement />
                    </SimpleRoute>
                  } 
                />
                <Route 
                  path="hr/announcements" 
                  element={
                    <SimpleRoute>
                      <AnnouncementCenter />
                    </SimpleRoute>
                  } 
                />
                <Route 
                  path="hr/compliance" 
                  element={
                    <SimpleRoute>
                      <ComplianceManagement />
                    </SimpleRoute>
                  } 
                />
                <Route 
                  path="hr/expenses" 
                  element={
                    <SimpleRoute>
                      <ExpenseManagement />
                    </SimpleRoute>
                  } 
                />

                {/* AI Routes */}
                <Route 
                  path="ai/resume-analyzer" 
                  element={
                    <SimpleRoute>
                      <AIResumeAnalyzer />
                    </SimpleRoute>
                  } 
                />
                <Route 
                  path="ai/insights" 
                  element={
                    <SimpleRoute>
                      <AIInsights />
                    </SimpleRoute>
                  } 
                />
                <Route 
                  path="ai/attendance-analyzer" 
                  element={
                    <SimpleRoute>
                      <AIAttendanceAnalyzer />
                    </SimpleRoute>
                  } 
                />
                <Route 
                  path="ai/leave-recommendations" 
                  element={
                    <SimpleRoute>
                      <AILeaveRecommendations />
                    </SimpleRoute>
                  } 
                />
                <Route 
                  path="ai/chatbot" 
                  element={
                    <SimpleRoute>
                      <HRChatbot />
                    </SimpleRoute>
                  } 
                />

                {/* Attendance Routes */}
                <Route 
                  path="attendance" 
                  element={
                    <SimpleRoute>
                      <AttendanceTracking />
                    </SimpleRoute>
                  } 
                />
                <Route 
                  path="attendance/location" 
                  element={
                    <SimpleRoute>
                      <LocationBasedAttendance />
                    </SimpleRoute>
                  } 
                />
                {/* Leave Management Routes */}
                <Route 
                  path="leave" 
                  element={
                    <SimpleRoute>
                      <LeaveManagement />
                    </SimpleRoute>
                  } 
                />
                <Route 
                  path="leave/dashboard" 
                  element={
                    <SimpleRoute>
                      <LeaveManagement />
                    </SimpleRoute>
                  } 
                />

                {/* Payroll Routes */}
                <Route 
                  path="payroll" 
                  element={
                    <SimpleRoute>
                      <PayrollDashboard />
                    </SimpleRoute>
                  } 
                />

                {/* Projects Routes */}
                <Route 
                  path="projects" 
                  element={
                    <SimpleRoute>
                      <ProjectManagement />
                    </SimpleRoute>
                  } 
                />

                {/* Reports Routes */}
                <Route 
                  path="reports" 
                  element={
                    <SimpleRoute>
                      <ReportsPage />
                    </SimpleRoute>
                  } 
                />

                {/* Self-Service Routes */}
                <Route 
                  path="self-service" 
                  element={
                    <SimpleRoute>
                      <Dashboard />
                    </SimpleRoute>
                  } 
                />

                {/* Settings Routes */}
                <Route 
                  path="settings" 
                  element={
                    <SimpleRoute>
                      <SettingsPage />
                    </SimpleRoute>
                  } 
                />

                {/* Default Routes */}
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </MainLayout>
          </AuthGuard>
        }
      />
    </Routes>
  )
}

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeContextProvider>
          <AuthProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Router>
                <AppRoutes />
                <Toaster
                  position="top-right"
                  richColors
                  closeButton
                  duration={4000}
                  toastOptions={{
                    style: {
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 500,
                    },
                  }}
                />
              </Router>
            </LocalizationProvider>
          </AuthProvider>
        </ThemeContextProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
