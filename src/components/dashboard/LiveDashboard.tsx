import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Chip,
  IconButton,
  Button,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  Paper,
  useTheme,
  alpha
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  People,
  Schedule,
  Assignment,
  AttachMoney,
  Notifications,
  MoreVert,
  Add,
  CheckCircle,
  Warning,
  Error,
  Info,
  Business,
  PersonAdd,
  Today,
  Event,
  Message
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

interface DashboardStats {
  totalEmployees: number
  activeEmployees: number
  pendingLeaves: number
  attendanceRate: number
  payrollPending: number
  newHires: number
  upcomingEvents: number
  unreadMessages: number
}

interface RecentActivity {
  id: string
  type: 'leave' | 'attendance' | 'employee' | 'payroll' | 'message'
  title: string
  description: string
  timestamp: string
  status: 'success' | 'warning' | 'error' | 'info'
  user?: {
    name: string
    avatar?: string
  }
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  path: string
  badge?: number
}

const LiveDashboard: React.FC = () => {
  const { user, profile } = useAuth()
  const theme = useTheme()
  const navigate = useNavigate()
  
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    activeEmployees: 0,
    pendingLeaves: 0,
    attendanceRate: 0,
    payrollPending: 0,
    newHires: 0,
    upcomingEvents: 0,
    unreadMessages: 0
  })
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  const quickActions: QuickAction[] = [
    {
      id: 'add-employee',
      title: 'Add Employee',
      description: 'Register new employee',
      icon: <PersonAdd />,
      color: theme.palette.primary.main,
      path: '/hr/employee-management',
      badge: 0
    },
    {
      id: 'attendance',
      title: 'Mark Attendance',
      description: 'Record daily attendance',
      icon: <Schedule />,
      color: theme.palette.success.main,
      path: '/attendance'
    },
    {
      id: 'leave-request',
      title: 'Leave Requests',
      description: 'Review pending requests',
      icon: <Assignment />,
      color: theme.palette.warning.main,
      path: '/leave',
      badge: stats.pendingLeaves
    },
    {
      id: 'payroll',
      title: 'Process Payroll',
      description: 'Manage employee payroll',
      icon: <AttachMoney />,
      color: theme.palette.info.main,
      path: '/payroll',
      badge: stats.payrollPending
    },
    {
      id: 'messages',
      title: 'Messages',
      description: 'Team communications',
      icon: <Message />,
      color: theme.palette.secondary.main,
      path: '/messages',
      badge: stats.unreadMessages
    },
    {
      id: 'reports',
      title: 'Generate Reports',
      description: 'Analytics & insights',
      icon: <TrendingUp />,
      color: theme.palette.error.main,
      path: '/reports'
    }
  ]

  // Fetch live dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch employees count
      const { data: employees, error: empError } = await supabase
        .from('employees')
        .select('id, status, created_at')
      
      if (empError) throw empError

      // Fetch leave requests
      const { data: leaves, error: leaveError } = await supabase
        .from('leave_requests')
        .select('id, status, created_at')
        .eq('status', 'pending')
      
      if (leaveError) throw leaveError

      // Fetch attendance for today
      const today = new Date().toISOString().split('T')[0]
      const { data: attendance, error: attError } = await supabase
        .from('attendance')
        .select('id, employee_id')
        .eq('date', today)
      
      if (attError) throw attError

      // Calculate stats
      const totalEmployees = employees?.length || 0
      const activeEmployees = employees?.filter(emp => emp.status === 'active').length || 0
      const pendingLeaves = leaves?.length || 0
      const attendanceRate = totalEmployees > 0 ? Math.round((attendance?.length || 0) / totalEmployees * 100) : 0
      const newHires = employees?.filter(emp => {
        const createdDate = new Date(emp.created_at)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return createdDate > thirtyDaysAgo
      }).length || 0

      setStats({
        totalEmployees,
        activeEmployees,
        pendingLeaves,
        attendanceRate,
        payrollPending: 5, // Mock data
        newHires,
        upcomingEvents: 3, // Mock data
        unreadMessages: 12 // Mock data
      })

      // Fetch recent activity
      const activities: RecentActivity[] = [
        {
          id: '1',
          type: 'employee',
          title: 'New Employee Added',
          description: 'Sarah Johnson joined Engineering team',
          timestamp: '2 hours ago',
          status: 'success',
          user: { name: 'HR Admin' }
        },
        {
          id: '2',
          type: 'leave',
          title: 'Leave Request Approved',
          description: 'John Smith - Vacation Leave (3 days)',
          timestamp: '4 hours ago',
          status: 'info',
          user: { name: 'Mike Wilson' }
        },
        {
          id: '3',
          type: 'attendance',
          title: 'Late Check-in Alert',
          description: '5 employees checked in after 9:30 AM',
          timestamp: '6 hours ago',
          status: 'warning'
        },
        {
          id: '4',
          type: 'payroll',
          title: 'Payroll Processed',
          description: 'Monthly payroll for 247 employees completed',
          timestamp: '1 day ago',
          status: 'success'
        }
      ]
      
      setRecentActivity(activities)
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    
    // Set up real-time updates
    const interval = setInterval(fetchDashboardData, 30000) // Refresh every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle color="success" />
      case 'warning': return <Warning color="warning" />
      case 'error': return <Error color="error" />
      default: return <Info color="info" />
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome back, {profile?.first_name || 'Admin'}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening in your organization today
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
        <Card>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Total Employees
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalEmployees}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                  <TrendingUp color="success" fontSize="small" />
                  <Typography variant="body2" color="success.main">
                    +{stats.newHires} this month
                  </Typography>
                </Stack>
              </Box>
              <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
                <People />
              </Avatar>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Attendance Rate
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.attendanceRate}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.attendanceRate} 
                  sx={{ mt: 1, height: 6, borderRadius: 3 }}
                />
              </Box>
              <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main' }}>
                <Schedule />
              </Avatar>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Pending Leaves
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.pendingLeaves}
                </Typography>
                <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                  Requires attention
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main' }}>
                <Assignment />
              </Avatar>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="text.secondary" gutterBottom>
                  Active Employees
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.activeEmployees}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Currently working
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), color: 'info.main' }}>
                <Business />
              </Avatar>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        {/* Quick Actions */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
              {quickActions.map((action) => (
                <Paper
                  key={action.id}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: `1px solid ${alpha(action.color, 0.2)}`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[4],
                      borderColor: action.color
                    }
                  }}
                  onClick={() => navigate(action.path)}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Badge badgeContent={action.badge} color="error">
                      <Avatar sx={{ bgcolor: alpha(action.color, 0.1), color: action.color }}>
                        {action.icon}
                      </Avatar>
                    </Badge>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle2" fontWeight="bold" noWrap>
                        {action.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {action.description}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card sx={{ height: 'fit-content' }}>
          <CardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                Recent Activity
              </Typography>
              <IconButton size="small">
                <MoreVert />
              </IconButton>
            </Stack>
            <List sx={{ p: 0 }}>
              {recentActivity.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {getStatusIcon(activity.status)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={500}>
                          {activity.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {activity.description}
                          </Typography>
                          <Typography variant="caption" display="block" color="text.secondary">
                            {activity.timestamp}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentActivity.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default LiveDashboard
