import React, { useState, useMemo, useCallback, Suspense, lazy } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  alpha,
  IconButton,
  Button,
  Stack,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  LinearProgress,
  CircularProgress,
  Badge,
  Tooltip,
  Fab,
  Alert,
  Skeleton,
  useMediaQuery,
  Tab,
  Tabs
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  PersonAdd as PersonAddIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  AttachMoney as AttachMoneyIcon,
  BarChart as BarChartIcon,
  Analytics as AnalyticsIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  Business as BusinessIcon,
  Group as GroupIcon,
  Assessment as AssessmentIcon,
  EventAvailable as EventAvailableIcon,
  MonetizationOn as MonetizationOnIcon,
  Star as StarIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Timeline as TimelineIcon,
  Psychology as PsychologyIcon,
  AutoAwesome as AutoAwesomeIcon,
  SmartToy as SmartToyIcon,
  Insights as InsightsIcon,
  DataUsage as DataUsageIcon,
  CloudSync as CloudSyncIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  LocalHospital as LocalHospitalIcon,
  School as SchoolIcon,
  EmojiEvents as EmojiEventsIcon
} from '@mui/icons-material'
// Removed framer-motion for performance optimization
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Legend,
  RadialBarChart,
  RadialBar,
  ComposedChart
} from 'recharts'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, parseISO, subDays, addDays } from 'date-fns'
import { useResponsive } from '../../hooks/useResponsive'
import { usePerformanceMonitor, useDebouncedValue, useMemoryManagement } from '../../hooks/usePerformance'

// Mock components - replace with actual implementations
const MetricCard = ({ title, value, change, icon, color, loading }: any) => (
  <Card>
    <CardContent>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ color: `${color}.main` }}>{icon}</Box>
        <Box>
          <Typography variant="h6">{value}</Typography>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
          {change && (
            <Typography variant="caption" color={change > 0 ? 'success.main' : 'error.main'}>
              {change > 0 ? '+' : ''}{change}%
            </Typography>
          )}
        </Box>
      </Stack>
    </CardContent>
  </Card>
)

const CountUp = ({ end, decimals = 0, suffix = '' }: { end: number; decimals?: number; suffix?: string }) => (
  <span>{end.toFixed(decimals)}{suffix}</span>
)

const StatusChip = ({ status, size = 'medium' }: { status: string; size?: 'small' | 'medium' }) => {
  const getColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning'
      case 'approved': return 'success'
      case 'rejected': return 'error'
      case 'completed': return 'success'
      default: return 'default'
    }
  }
  
  return <Chip label={status} size={size} color={getColor(status) as any} />
}

// Mock LazyLoadWrapper and LazySection components
const LazyLoadWrapper = ({ children, ...props }: any) => <div {...props}>{children}</div>
const LazySection = ({ children, ...props }: any) => <div {...props}>{children}</div>

// Lazy load heavy components
const ComprehensiveAttendanceSystem = lazy(() => import('../attendance/ComprehensiveAttendanceSystem'))
const ComprehensiveLeaveManagement = lazy(() => import('../leave/ComprehensiveLeaveManagement'))
const SimpleEmployeeDirectory = lazy(() => import('../employees/SimpleEmployeeDirectory'))

// Enhanced dashboard data types
interface DashboardMetrics {
  totalEmployees: number
  activeEmployees: number
  presentToday: number
  lateToday: number
  onLeaveToday: number
  pendingLeaveRequests: number
  upcomingLeaves: number
  overtimeHours: number
  totalDepartments: number
  avgAttendanceRate: number
  employeeTurnoverRate: number
  avgPerformanceRating: number
  topPerformers: number
  lowPerformers: number
  engagementScore: number
  retentionRisk: number
  newHiresThisMonth: number
  resignationsThisMonth: number
  trainingCompletions: number
  certificationsAwarded: number
  attendanceCorrections: number
  failedLoginAttempts: number
  activeSessions: number
  lastUpdated: string
  loading: boolean
}

interface ActivityItem {
  id: string
  type: 'attendance' | 'leave_request' | 'performance' | 'training' | 'announcement' | 'birthday' | 'hiring' | 'promotion' | 'correction' | 'security'
  title: string
  description: string
  employee?: {
    id: string
    name: string
    avatar?: string
    department: string
    position: string
  }
  timestamp: string
  status?: 'pending' | 'approved' | 'rejected' | 'completed' | 'in_progress'
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  metadata?: any
}

interface DepartmentAnalytics {
  id: string
  name: string
  code: string
  totalEmployees: number
  presentToday: number
  attendanceRate: number
  avgPerformanceScore: number
  avgEngagement: number
  budget: number
  utilizedBudget: number
  topSkills: string[]
  riskLevel: 'low' | 'medium' | 'high'
  trends: {
    attendance: number
    performance: number
    engagement: number
  }
}

interface AIInsight {
  id: string
  type: 'warning' | 'success' | 'info' | 'error'
  title: string
  message: string
  action?: string
  icon: React.ReactNode
  confidence: number
  impact: 'low' | 'medium' | 'high'
  category: 'attendance' | 'performance' | 'retention' | 'compliance' | 'productivity'
}

// Mock data - in real app this would come from API
const mockMetrics: DashboardMetrics = {
  totalEmployees: 247,
  activeEmployees: 234,
  presentToday: 189,
  lateToday: 8,
  onLeaveToday: 12,
  pendingLeaveRequests: 15,
  upcomingLeaves: 23,
  overtimeHours: 145,
  totalDepartments: 8,
  avgAttendanceRate: 88.5,
  employeeTurnoverRate: 3.2,
  avgPerformanceRating: 4.1,
  topPerformers: 74,
  lowPerformers: 12,
  engagementScore: 78,
  retentionRisk: 8,
  newHiresThisMonth: 6,
  resignationsThisMonth: 2,
  trainingCompletions: 89,
  certificationsAwarded: 23,
  attendanceCorrections: 5,
  failedLoginAttempts: 3,
  activeSessions: 45,
  lastUpdated: new Date().toISOString(),
  loading: false
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'leave_request',
    title: 'Leave Request Submitted',
    description: 'Sarah Johnson submitted sick leave request for 3 days',
    employee: {
      id: 'emp001',
      name: 'Sarah Johnson',
      avatar: '',
      department: 'Engineering',
      position: 'Senior Developer'
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    priority: 'medium'
  },
  {
    id: '2',
    type: 'attendance',
    title: 'Late Check-in Alert',
    description: 'Mike Chen checked in at 9:15 AM - 15 minutes late',
    employee: {
      id: 'emp002',
      name: 'Mike Chen',
      avatar: '',
      department: 'Marketing',
      position: 'Marketing Manager'
    },
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    priority: 'low'
  },
  {
    id: '3',
    type: 'performance',
    title: 'Performance Review Completed',
    description: 'Q4 performance review completed with rating 4.5/5',
    employee: {
      id: 'emp003',
      name: 'Emily Rodriguez',
      avatar: '',
      department: 'Sales',
      position: 'Sales Executive'
    },
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    priority: 'high'
  }
]

const mockDepartments: DepartmentAnalytics[] = [
  {
    id: '1',
    name: 'Engineering',
    code: 'ENG',
    totalEmployees: 45,
    presentToday: 42,
    attendanceRate: 93.3,
    avgPerformanceScore: 4.2,
    avgEngagement: 82,
    budget: 850000,
    utilizedBudget: 637500,
    topSkills: ['React', 'TypeScript', 'Node.js'],
    riskLevel: 'low',
    trends: { attendance: 2.1, performance: 0.3, engagement: 5.2 }
  },
  {
    id: '2',
    name: 'Sales',
    code: 'SAL',
    totalEmployees: 28,
    presentToday: 26,
    attendanceRate: 92.9,
    avgPerformanceScore: 3.9,
    avgEngagement: 76,
    budget: 420000,
    utilizedBudget: 315000,
    topSkills: ['CRM', 'Communication', 'Negotiation'],
    riskLevel: 'medium',
    trends: { attendance: -1.2, performance: 0.1, engagement: -2.3 }
  },
  {
    id: '3',
    name: 'Marketing',
    code: 'MKT',
    totalEmployees: 22,
    presentToday: 19,
    attendanceRate: 86.4,
    avgPerformanceScore: 4.0,
    avgEngagement: 79,
    budget: 320000,
    utilizedBudget: 240000,
    topSkills: ['Digital Marketing', 'Analytics', 'Design'],
    riskLevel: 'high',
    trends: { attendance: -3.1, performance: -0.2, engagement: -4.1 }
  }
]

const mockAIInsights: AIInsight[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Attendance Pattern Alert',
    message: 'Marketing department shows declining attendance trend (-3.1%) over the last month',
    action: 'Review attendance policies',
    icon: <WarningIcon />,
    confidence: 87,
    impact: 'medium',
    category: 'attendance'
  },
  {
    id: '2',
    type: 'success',
    title: 'High Performance Team',
    message: 'Engineering team maintains 93.3% attendance rate with 4.2/5 performance score',
    action: 'Consider recognition program',
    icon: <StarIcon />,
    confidence: 95,
    impact: 'high',
    category: 'performance'
  },
  {
    id: '3',
    type: 'info',
    title: 'Retention Risk Alert',
    message: '8 employees identified as high retention risk based on engagement patterns',
    action: 'Schedule retention meetings',
    icon: <PsychologyIcon />,
    confidence: 78,
    impact: 'high',
    category: 'retention'
  }
]

// Chart data
const attendanceChartData = Array.from({ length: 7 }, (_, i) => {
  const date = subDays(new Date(), 6 - i)
  return {
    date: format(date, 'MMM dd'),
    present: Math.floor(Math.random() * 50) + 150,
    late: Math.floor(Math.random() * 20) + 5,
    absent: Math.floor(Math.random() * 15) + 2,
    remote: Math.floor(Math.random() * 30) + 20
  }
})

const performanceChartData = mockDepartments.map(dept => ({
  name: dept.name,
  performance: dept.avgPerformanceScore,
  engagement: dept.avgEngagement,
  attendance: dept.attendanceRate
}))

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

interface EnhancedDashboardProps {
  className?: string
}

export const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({ className }) => {
  const theme = useTheme()
  const { isMobile, isTablet, getGridColumns, getPadding } = useResponsive()
  const performanceMetrics = usePerformanceMonitor()
  const memoryInfo = useMemoryManagement()
  
  // State management
  const [selectedTab, setSelectedTab] = useState(0)
  const [metrics] = useState<DashboardMetrics>(mockMetrics)
  const [activities] = useState<ActivityItem[]>(mockActivities)
  const [departments] = useState<DepartmentAnalytics[]>(mockDepartments)
  const [aiInsights] = useState<AIInsight[]>(mockAIInsights)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedDateRange, setSelectedDateRange] = useState<'week' | 'month' | 'quarter'>('week')
  
  // Debounced search for better performance
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebouncedValue(searchQuery, 300)

  // Calculate derived metrics
  const derivedMetrics = useMemo(() => {
    const attendanceRate = (metrics.presentToday / metrics.activeEmployees) * 100
    const leaveUtilization = (metrics.onLeaveToday / metrics.activeEmployees) * 100
    const pendingApprovalRate = (metrics.pendingLeaveRequests / metrics.totalEmployees) * 100
    
    return {
      attendanceRate,
      leaveUtilization,
      pendingApprovalRate,
      productivityScore: 85.2, // Mock calculation
      teamHealthScore: 78.5 // Mock calculation
    }
  }, [metrics])

  // Event handlers
  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }, [])

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setRefreshing(false)
  }, [])

  const getActivityIcon = useCallback((type: ActivityItem['type']) => {
    switch (type) {
      case 'leave_request': return <AssignmentIcon color="primary" />
      case 'attendance': return <ScheduleIcon color="success" />
      case 'performance': return <AssessmentIcon color="info" />
      case 'training': return <SchoolIcon color="secondary" />
      case 'announcement': return <NotificationsIcon color="warning" />
      case 'birthday': return <CalendarTodayIcon color="error" />
      case 'hiring': return <PersonAddIcon color="success" />
      case 'promotion': return <TrendingUpIcon color="primary" />
      case 'correction': return <EditIcon color="warning" />
      case 'security': return <SecurityIcon color="error" />
      default: return <AnalyticsIcon />
    }
  }, [])

  const formatTimeAgo = useCallback((timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))
    
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  }

  return (
    <Box
      className={className}
    >
      <Box sx={{ p: getPadding(2, 3, 4) }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography 
              variant="h4" 
              fontWeight={700} 
              sx={{ 
                background: theme.palette.mode === 'dark' 
                  ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                  : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Executive Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Real-time workforce insights and analytics
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={1}>
            {!isMobile && (
              <Chip 
                icon={<SpeedIcon />}
                label={`${performanceMetrics.renderCount} renders`}
                size="small"
                variant="outlined"
              />
            )}
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={refreshing}
              size={isMobile ? 'small' : 'medium'}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </Stack>
        </Stack>

        {/* AI Insights Banner */}
        <LazySection fadeIn stagger>
          {aiInsights.slice(0, 1).map((insight) => (
            <Box
              key={insight.id}
              sx={{
                mb: 3,
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: theme => theme.shadows[4]
              }}
            >
              <Alert
                severity={insight.severity}
                icon={<TrendingUpIcon />}
                sx={{
                  '& .MuiAlert-message': {
                    width: '100%'
                  }
                }}
              >
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {insight.title}
                </Typography>
                <Typography variant="body2">
                  {insight.description}
                </Typography>
              </Alert>
            </Box>
          ))}
        </LazySection>

        {/* Key Metrics */}
        <LazySection height={200} fadeIn stagger staggerDelay={50}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
{{ ... }}
            <Grid item {...getGridColumns(6, 4, 3, 2)}>
              <MetricCard
                title="Total Employees"
                value={<CountUp end={metrics.totalEmployees} />}
                change={5.2}
                icon={<PeopleIcon />}
                color="primary"
                loading={metrics.loading}
              />
            </Grid>
            <Grid item {...getGridColumns(6, 4, 3, 2)}>
              <MetricCard
                title="Present Today"
                value={<CountUp end={metrics.presentToday} />}
                subtitle={`${derivedMetrics.attendanceRate.toFixed(1)}% attendance rate`}
                change={2.1}
                icon={<CheckCircleIcon />}
                color="success"
                loading={metrics.loading}
              />
            </Grid>
            <Grid item {...getGridColumns(6, 4, 3, 2)}>
              <MetricCard
                title="On Leave"
                value={<CountUp end={metrics.onLeaveToday} />}
                subtitle={`${metrics.pendingLeaveRequests} pending requests`}
                change={-8.3}
                icon={<AssignmentIcon />}
                color="warning"
                loading={metrics.loading}
              />
            </Grid>
            <Grid item {...getGridColumns(6, 4, 3, 2)}>
              <MetricCard
                title="Late Arrivals"
                value={<CountUp end={metrics.lateToday} />}
                change={-12.5}
                icon={<WarningIcon />}
                color="error"
                loading={metrics.loading}
              />
            </Grid>
            <Grid item {...getGridColumns(6, 4, 3, 2)}>
              <MetricCard
                title="Performance Score"
                value={<CountUp end={metrics.avgPerformanceRating} decimals={1} suffix="/5" />}
                change={3.2}
                icon={<EmojiEventsIcon />}
                color="info"
                loading={metrics.loading}
              />
            </Grid>
            <Grid item {...getGridColumns(6, 4, 3, 2)}>
              <MetricCard
                title="Engagement Score"
                value={<CountUp end={metrics.engagementScore} suffix="%" />}
                change={1.8}
                icon={<PsychologyIcon />}
                color="secondary"
                loading={metrics.loading}
              />
            </Grid>
          </Grid>
        </LazySection>

        {/* Main Content Tabs */}
        <Card sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              variant={isMobile ? 'scrollable' : 'fullWidth'}
              scrollButtons="auto"
            >
              <Tab 
                label="Overview" 
                icon={<DashboardIcon />}
                iconPosition="start"
              />
              <Tab 
                label="Analytics" 
                icon={<AnalyticsIcon />}
                iconPosition="start"
              />
              <Tab 
                label="Departments" 
                icon={<BusinessIcon />}
                iconPosition="start"
              />
              <Tab 
                label="Activities" 
                icon={<TimelineIcon />}
                iconPosition="start"
              />
            </Tabs>
          </Box>

          <CardContent sx={{ p: 3 }}>
              {selectedTab === 0 && (
                <Box>
                  <Grid container spacing={3}>
                    {/* Attendance Trends Chart */}
                    <Grid item xs={12} lg={8}>
                      <LazyLoadWrapper placeholder="skeleton" height={350}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                              Attendance Trends
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                              <ComposedChart data={attendanceChartData}>
                                <defs>
                                  <linearGradient id="presentGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <RechartsTooltip />
                                <Legend />
                                <Area
                                  type="monotone"
                                  dataKey="present"
                                  stroke={theme.palette.success.main}
                                  fillOpacity={1}
                                  fill="url(#presentGradient)"
                                  name="Present"
                                />
                                <Bar dataKey="late" fill={theme.palette.warning.main} name="Late" />
                                <Line
                                  type="monotone"
                                  dataKey="remote"
                                  stroke={theme.palette.info.main}
                                  strokeWidth={2}
                                  name="Remote"
                                />
                              </ComposedChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>
                      </LazyLoadWrapper>
                    </Grid>

                    {/* Quick Stats */}
                    <Grid item xs={12} lg={4}>
                      <Stack spacing={3}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                              Today's Overview
                            </Typography>
                            <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                              <CircularProgress
                                variant="determinate"
                                value={derivedMetrics.attendanceRate}
                                size={120}
                                thickness={4}
                                sx={{ color: theme.palette.success.main }}
                              />
                              <Box
                                sx={{
                                  top: 0,
                                  left: 0,
                                  bottom: 0,
                                  right: 0,
                                  position: 'absolute',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexDirection: 'column'
                                }}
                              >
                                <Typography variant="h5" component="div" fontWeight={600}>
                                  {derivedMetrics.attendanceRate.toFixed(1)}%
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Attendance
                                </Typography>
                              </Box>
                            </Box>
                            <Stack spacing={1}>
                              <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2">Present</Typography>
                                <Typography variant="body2" fontWeight={600} color="success.main">
                                  {metrics.presentToday}
                                </Typography>
                              </Stack>
                              <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2">Late</Typography>
                                <Typography variant="body2" fontWeight={600} color="warning.main">
                                  {metrics.lateToday}
                                </Typography>
                              </Stack>
                              <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2">On Leave</Typography>
                                <Typography variant="body2" fontWeight={600} color="info.main">
                                  {metrics.onLeaveToday}
                                </Typography>
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                              AI Insights
                            </Typography>
                            <Stack spacing={2}>
                              {aiInsights.slice(0, 3).map((insight) => (
                                <Alert key={insight.id} severity={insight.type}>
                                  <Typography variant="caption">
                                    <strong>{insight.title}</strong><br />
                                    {insight.message.slice(0, 60)}...
                                  </Typography>
                                </Alert>
                              ))}
                            </Stack>
                          </CardContent>
                        </Card>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {selectedTab === 1 && (
                <Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 2 }}>
                            Department Performance
                          </Typography>
                          <ResponsiveContainer width="100%" height={300}>
                            <RadialBarChart data={performanceChartData} innerRadius="20%" outerRadius="90%">
                              <RadialBar dataKey="performance" cornerRadius={10} fill={theme.palette.primary.main} />
                              <Legend />
                              <RechartsTooltip />
                            </RadialBarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 2 }}>
                            Employee Distribution
                          </Typography>
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={departments}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                dataKey="totalEmployees"
                                nameKey="name"
                                label={({ name, value }) => `${name}: ${value}`}
                              >
                                {departments.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <RechartsTooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 2 }}>
                            Performance vs Engagement
                          </Typography>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={performanceChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <RechartsTooltip />
                              <Legend />
                              <Bar dataKey="performance" fill={theme.palette.primary.main} name="Performance Score" />
                              <Bar dataKey="engagement" fill={theme.palette.secondary.main} name="Engagement %" />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {selectedTab === 2 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Department Analytics
                  </Typography>
                  <Grid container spacing={3}>
                    {departments.map((dept) => (
                      <Grid item xs={12} md={6} lg={4} key={dept.id}>
                        <Card
                          sx={{
                            height: '100%',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: theme.shadows[4],
                            }
                          }}
                        >
                          <CardContent>
                            <Stack spacing={2}>
                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6" fontWeight={600}>
                                  {dept.name}
                                </Typography>
                                <Chip 
                                  label={dept.riskLevel} 
                                  size="small" 
                                  color={dept.riskLevel === 'low' ? 'success' : dept.riskLevel === 'medium' ? 'warning' : 'error'}
                                />
                              </Stack>

                              <Divider />

                              <Stack spacing={1}>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography variant="body2">Employees</Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    {dept.totalEmployees}
                                  </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography variant="body2">Present Today</Typography>
                                  <Typography variant="body2" fontWeight={600} color="success.main">
                                    {dept.presentToday}
                                  </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography variant="body2">Attendance Rate</Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    {dept.attendanceRate.toFixed(1)}%
                                  </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography variant="body2">Performance</Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    {dept.avgPerformanceScore.toFixed(1)}/5
                                  </Typography>
                                </Stack>
                              </Stack>

                              <LinearProgress
                                variant="determinate"
                                value={(dept.utilizedBudget / dept.budget) * 100}
                                sx={{ height: 8, borderRadius: 4 }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                Budget: ${(dept.utilizedBudget / 1000).toFixed(0)}K / ${(dept.budget / 1000).toFixed(0)}K
                              </Typography>

                              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.5 }}>
                                {dept.topSkills.slice(0, 3).map((skill) => (
                                  <Chip key={skill} label={skill} size="small" variant="outlined" />
                                ))}
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {selectedTab === 3 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Recent Activities
                  </Typography>
                  <List>
                    {activities.map((activity, index) => (
                      <Box
                        key={activity.id}
                      >
                        <ListItem
                          divider={index < activities.length - 1}
                          sx={{
                            borderRadius: 2,
                            mb: 1,
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.05)
                            }
                          }}
                        >
                          <ListItemAvatar>
                            <Badge
                              overlap="circular"
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                              badgeContent={
                                activity.priority === 'urgent' ? (
                                  <ErrorIcon sx={{ width: 16, height: 16, color: 'error.main' }} />
                                ) : activity.priority === 'high' ? (
                                  <WarningIcon sx={{ width: 16, height: 16, color: 'warning.main' }} />
                                ) : null
                              }
                            >
                              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                                {getActivityIcon(activity.type)}
                              </Avatar>
                            </Badge>
                          </ListItemAvatar>
                          
                          <ListItemText
                            primary={activity.title}
                            secondary={
                              <Stack spacing={0.5}>
                                <Typography variant="body2" color="text.secondary">
                                  {activity.description}
                                </Typography>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Typography variant="caption">
                                    {formatTimeAgo(activity.timestamp)}
                                  </Typography>
                                  {activity.employee && (
                                    <>
                                      <Typography variant="caption">•</Typography>
                                      <Typography variant="caption">
                                        {activity.employee.name}
                                      </Typography>
                                      <Typography variant="caption">•</Typography>
                                      <Typography variant="caption">
                                        {activity.employee.department}
                                      </Typography>
                                    </>
                                  )}
                                </Stack>
                              </Stack>
                            }
                          />
                          
                          <ListItemSecondaryAction>
                            {activity.status && (
                              <StatusChip status={activity.status} size="small" />
                            )}
                          </ListItemSecondaryAction>
                        </ListItem>
                      </Box>
                    ))}
                  </List>
                </Box>
              )}
          </CardContent>
        </Card>

        {/* Performance Monitor (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <Card sx={{ mt: 3, opacity: 0.7 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Performance Monitor
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption">Render Count</Typography>
                  <Typography variant="h6">{performanceMetrics.renderCount}</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption">Last Render</Typography>
                  <Typography variant="h6">{performanceMetrics.lastRenderTime.toFixed(1)}ms</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption">Avg Render</Typography>
                  <Typography variant="h6">{performanceMetrics.averageRenderTime.toFixed(1)}ms</Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption">Memory</Typography>
                  <Typography variant="h6">{(memoryInfo.used / 1024 / 1024).toFixed(1)}MB</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}


      </Box>
    </Box>
  )
}

export default EnhancedDashboard
