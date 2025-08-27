import React, { useState, useEffect, useMemo } from 'react'
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
  LinearProgress,
  CircularProgress,
  Paper,
  Badge,
  Tooltip,
  useMediaQuery,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Container
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
  ArrowUpward,
  ArrowDownward,
  CheckCircle,
  Warning,
  Info,
  Business,
  PersonAdd,
  EventNote,
  Analytics,
  Add,
  Menu,
  Close,
  Dashboard,
  Assessment,
  Settings
} from '@mui/icons-material'
// Removed framer-motion for better performance
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
  Legend
} from 'recharts'
import { format, startOfMonth, endOfMonth, subMonths, addDays } from 'date-fns'
import SimplePerformanceMonitor from '../performance/SimplePerformanceMonitor'

// Enhanced metric card component with better responsive design
const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = 'primary', 
  loading = false,
  trend,
  subtitle,
  onClick
}: {
  title: string
  value: string | number
  change?: string | number
  icon: React.ReactNode
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  loading?: boolean
  trend?: 'up' | 'down' | 'stable'
  subtitle?: string
  onClick?: () => void
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  // Type guard to ensure color is a valid palette key
  const isValidColor = (c: string): c is 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' => {
    return ['primary', 'secondary', 'success', 'warning', 'error', 'info'].includes(c)
  }
  
  const safeColor = isValidColor(color) ? color : 'primary'
  
  return (
    <div style={{ height: '100%' }}>
      <Card
        sx={{
          height: '100%',
          background: `linear-gradient(135deg, ${theme.palette[color].main}15 0%, ${theme.palette[color].main}05 100%)`,
          border: `1px solid ${alpha(theme.palette[color].main, 0.1)}`,
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${theme.palette[safeColor].main}, ${theme.palette[safeColor].dark})`,
          },
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 12px 40px ${alpha(theme.palette[color].main, 0.25)}`,
            borderColor: alpha(theme.palette[color].main, 0.4)
          }
        }}
        onClick={onClick}
      >
        <CardContent sx={{ 
          p: { xs: 2, sm: 3 }, 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          {/* Header with icon and actions */}
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
            <Box
              sx={{
                width: { xs: 40, sm: 48 },
                height: { xs: 40, sm: 48 },
                borderRadius: { xs: 1.5, sm: 2 },
                background: `linear-gradient(135deg, ${theme.palette[color].main} 0%, ${theme.palette[color].dark} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: `0 4px 16px ${alpha(theme.palette[color].main, 0.4)}`,
                flexShrink: 0
              }}
            >
              {icon}
            </Box>
            
            {/* Action button - only show on larger screens */}
            {!isMobile && (
              <IconButton 
                size="small" 
                sx={{ 
                  opacity: 0.7,
                  '&:hover': { opacity: 1, transform: 'scale(1.1)' }
                }}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            )}
          </Stack>
          
          {/* Content */}
          <Box sx={{ flex: 1, mt: 2 }}>
            <Typography 
              variant={isMobile ? "body2" : "body1"} 
              color="text.secondary" 
              sx={{ 
                mb: 1,
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              {title}
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={isMobile ? 20 : 24} />
              </Box>
            ) : (
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                fontWeight={700} 
                sx={{ 
                  mb: 1,
                  fontSize: { xs: '1.5rem', sm: '2rem' }
                }}
              >
                {typeof value === 'number' ? value.toLocaleString() : value}
              </Typography>
            )}
            
            {subtitle && (
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          
          {/* Trend indicator */}
          {(change || trend) && (
            <Box sx={{ mt: 2 }}>
              <Stack 
                direction="row" 
                alignItems="center" 
                spacing={1}
                sx={{ 
                  flexWrap: 'wrap',
                  gap: { xs: 0.5, sm: 1 }
                }}
              >
                {change && (
                  <>
                    {change > 0 ? (
                      <ArrowUpward sx={{ 
                        fontSize: { xs: 14, sm: 16 }, 
                        color: 'success.main' 
                      }} />
                    ) : (
                      <ArrowDownward sx={{ 
                        fontSize: { xs: 14, sm: 16 }, 
                        color: 'error.main' 
                      }} />
                    )}
                    <Typography
                      variant="body2"
                      color={change > 0 ? 'success.main' : 'error.main'}
                      fontWeight={600}
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                      {Math.abs(change)}%
                    </Typography>
                  </>
                )}
                {trend && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                  >
                    {trend}
                  </Typography>
                )}
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Enhanced quick stats with better mobile layout
const QuickStats = ({ stats }: any) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}10 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        borderRadius: { xs: 2, sm: 3 }
      }}
    >
      <Typography 
        variant={isMobile ? "h6" : "h5"} 
        gutterBottom 
        fontWeight={600}
        sx={{ mb: { xs: 2, sm: 3 } }}
      >
        Today's Overview
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: { xs: 1, sm: 2, md: 3 } }}>
        {stats.map((stat: any, index: number) => (
          <Box key={index}>
            <div>
              <Stack 
                alignItems="center" 
                spacing={1}
                sx={{
                  p: { xs: 1, sm: 1.5 },
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.background.paper, 0.5),
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Box
                  sx={{
                    width: { xs: 32, sm: 40 },
                    height: { xs: 32, sm: 40 },
                    borderRadius: '50%',
                    bgcolor: `${stat.color}.main`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    boxShadow: `0 2px 8px ${alpha(theme.palette[stat.color].main, 0.3)}`
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography 
                  variant={isMobile ? "h6" : "h5"} 
                  fontWeight={700}
                  sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                >
                  {stat.value}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  textAlign="center"
                  sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                >
                  {stat.label}
                </Typography>
              </Stack>
            </div>
          </Box>
        ))}
      </Box>
    </Paper>
  )
}

// Enhanced recent activity with better mobile layout
const RecentActivity = ({ activities }: any) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack 
          direction="row" 
          alignItems="center" 
          justifyContent="space-between" 
          sx={{ mb: { xs: 2, sm: 3 } }}
        >
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            fontWeight={600}
          >
            Recent Activity
          </Typography>
          <Button 
            size={isMobile ? "small" : "medium"} 
            variant="outlined"
            sx={{ 
              minWidth: { xs: 'auto', sm: '100px' },
              px: { xs: 1, sm: 2 }
            }}
          >
            View All
          </Button>
        </Stack>
        
        <Stack spacing={isMobile ? 1.5 : 2}>
          {activities.map((activity: any, index: number) => (
            <div key={index}>
              <Stack 
                direction="row" 
                spacing={2} 
                alignItems="center"
                sx={{
                  p: { xs: 1, sm: 1.5 },
                  borderRadius: 1.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.action.hover, 0.1),
                    transform: 'translateX(4px)'
                  }
                }}
              >
                <Avatar
                  sx={{
                    width: { xs: 28, sm: 36 },
                    height: { xs: 28, sm: 36 },
                    bgcolor: `${activity.color}.main`
                  }}
                >
                  {activity.icon}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography 
                    variant={isMobile ? "body2" : "body1"} 
                    fontWeight={500}
                    sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                  >
                    {activity.title}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                  >
                    {activity.description}
                  </Typography>
                </Box>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                    flexShrink: 0
                  }}
                >
                  {activity.time}
                </Typography>
              </Stack>
            </div>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}

// Enhanced chart component with better responsive design
const DashboardChart = ({ title, data, type = 'line', height = 300 }: any) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  const renderChart = () => {
    const chartHeight = isMobile ? Math.min(height, 250) : height
    
    switch (type) {
      case 'area':
        return (
          <AreaChart data={data} height={chartHeight}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.secondary, 0.1)} />
            <XAxis 
              dataKey="name" 
              stroke={theme.palette.text.secondary}
              fontSize={isMobile ? 10 : 12}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              fontSize={isMobile ? 10 : 12}
            />
            <RechartsTooltip 
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: 8,
                fontSize: isMobile ? 12 : 14
              }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={theme.palette.primary.main}
              fillOpacity={1}
              fill="url(#colorGradient)"
              strokeWidth={isMobile ? 2 : 3}
            />
          </AreaChart>
        )
      case 'bar':
        return (
          <BarChart data={data} height={chartHeight}>
            <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.secondary, 0.1)} />
            <XAxis 
              dataKey="name" 
              stroke={theme.palette.text.secondary}
              fontSize={isMobile ? 10 : 12}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              fontSize={isMobile ? 10 : 12}
            />
            <RechartsTooltip 
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: 8,
                fontSize: isMobile ? 12 : 14
              }}
            />
            <Bar 
              dataKey="value" 
              fill={theme.palette.primary.main} 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        )
      default:
        return (
          <LineChart data={data} height={chartHeight}>
            <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.secondary, 0.1)} />
            <XAxis 
              dataKey="name" 
              stroke={theme.palette.text.secondary}
              fontSize={isMobile ? 10 : 12}
            />
            <YAxis 
              stroke={theme.palette.text.secondary}
              fontSize={isMobile ? 10 : 12}
            />
            <RechartsTooltip 
              contentStyle={{
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                borderRadius: 8,
                fontSize: isMobile ? 12 : 14
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={theme.palette.primary.main} 
              strokeWidth={isMobile ? 2 : 3}
              dot={{ 
                fill: theme.palette.primary.main, 
                strokeWidth: 2, 
                r: isMobile ? 3 : 4 
              }}
            />
          </LineChart>
        )
    }
  }
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          gutterBottom 
          fontWeight={600}
          sx={{ mb: 2 }}
        >
          {title}
        </Typography>
        <Box sx={{ 
          height: isMobile ? Math.min(height, 250) : height, 
          mt: 2,
          overflow: 'hidden'
        }}>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}

// Mobile action drawer component
const MobileActionDrawer = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const theme = useTheme()
  
  const actions = [
    { icon: <PersonAdd />, name: 'Add Employee', color: 'primary' },
    { icon: <Analytics />, name: 'View Reports', color: 'secondary' },
    { icon: <Settings />, name: 'Settings', color: 'info' },
    { icon: <Assessment />, name: 'Analytics', color: 'success' }
  ]
  
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxHeight: '60vh'
        }
      }}
    >
      <Box sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Quick Actions
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          {actions.map((action, index) => (
            <Box key={index}>
              <div>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={action.icon}
                  sx={{
                    py: 2,
                    borderRadius: 2,
                    borderColor: `${action.color}.main`,
                    color: `${action.color}.main`,
                    '&:hover': {
                      borderColor: `${action.color}.dark`,
                      backgroundColor: alpha(theme.palette[action.color].main, 0.1)
                    }
                  }}
                >
                  {action.name}
                </Button>
              </div>
            </Box>
          ))}
        </Box>
      </Box>
    </Drawer>
  )
}

export const ModernDashboard: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  // Mobile drawer state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  
  // Mock data
  const metrics = [
    {
      title: 'Total Employees',
      value: 1247,
      change: 8.2,
      icon: <People />,
      color: 'primary',
      trend: 'vs last month',
      subtitle: '12 new this week'
    },
    {
      title: 'Present Today',
      value: 1180,
      change: 2.1,
      icon: <CheckCircle />,
      color: 'success',
      trend: 'attendance rate',
      subtitle: '94.6% attendance'
    },
    {
      title: 'Pending Leaves',
      value: 23,
      change: -15.3,
      icon: <Schedule />,
      color: 'warning',
      trend: 'vs last week',
      subtitle: '5 urgent approvals'
    },
    {
      title: 'Open Positions',
      value: 18,
      change: 12.5,
      icon: <PersonAdd />,
      color: 'info',
      trend: 'active hiring',
      subtitle: '8 interviews today'
    }
  ]
  
  const quickStats = [
    { label: 'On Time', value: '1,156', icon: <CheckCircle fontSize="small" />, color: 'success' },
    { label: 'Late', value: '24', icon: <Warning fontSize="small" />, color: 'warning' },
    { label: 'Absent', value: '67', icon: <Info fontSize="small" />, color: 'error' },
    { label: 'Remote', value: '89', icon: <Business fontSize="small" />, color: 'info' }
  ]
  
  const recentActivities = [
    {
      title: 'New Employee Onboarded',
      description: 'Sarah Johnson joined Marketing Team',
      time: '2 min ago',
      icon: <PersonAdd fontSize="small" />,
      color: 'success'
    },
    {
      title: 'Leave Request Approved',
      description: 'Mike Chen - Vacation Leave (5 days)',
      time: '15 min ago',
      icon: <EventNote fontSize="small" />,
      color: 'primary'
    },
    {
      title: 'Performance Review Due',
      description: '12 reviews pending for Q4',
      time: '1 hour ago',
      icon: <Analytics fontSize="small" />,
      color: 'warning'
    },
    {
      title: 'Payroll Processing',
      description: 'Monthly payroll completed successfully',
      time: '2 hours ago',
      icon: <AttachMoney fontSize="small" />,
      color: 'info'
    }
  ]
  
  const attendanceData = Array.from({ length: 7 }, (_, i) => ({
    name: format(addDays(new Date(), i - 6), 'EEE'),
    value: Math.floor(Math.random() * 100) + 850
  }))
  
  const departmentData = [
    { name: 'Engineering', value: 320 },
    { name: 'Marketing', value: 180 },
    { name: 'Sales', value: 240 },
    { name: 'HR', value: 95 },
    { name: 'Finance', value: 120 }
  ]
  
  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`
    }}>
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            borderRadius: { xs: 0, sm: '0 0 20px 20px' }
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight={700} color="white">
              Dashboard
            </Typography>
            <IconButton 
              color="inherit" 
              onClick={() => setMobileDrawerOpen(true)}
              sx={{ 
                backgroundColor: alpha(theme.palette.common.white, 0.1),
                '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.2) }
              }}
            >
              <Menu />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}
      
      <Container maxWidth="xl" sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header Section */}
        <div>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="space-between" 
            alignItems={{ xs: 'flex-start', sm: 'center' }} 
            spacing={{ xs: 2, sm: 0 }}
            sx={{ mb: { xs: 3, sm: 4 } }}
          >
            <Box>
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                fontWeight={700} 
                sx={{ 
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                }}
              >
                Welcome back, Admin! 👋
              </Typography>
              <Typography 
                variant={isMobile ? "body2" : "body1"} 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                Here's what's happening with your team today
              </Typography>
            </Box>
            
            {/* Desktop Action Buttons */}
            {!isMobile && (
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="outlined" 
                  startIcon={<Analytics />}
                  sx={{ 
                    borderRadius: 2,
                    px: 3,
                    py: 1.5
                  }}
                >
                  View Reports
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<PersonAdd />}
                  sx={{ 
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
                  }}
                >
                  Add Employee
                </Button>
              </Stack>
            )}
          </Stack>
        </div>
        
        {/* Quick Stats Section */}
        <div>
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <QuickStats stats={quickStats} />
          </Box>
        </div>
        
        {/* Main Metrics Grid */}
        <div>
          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
              gap: { xs: 2, sm: 3 },
              mb: { xs: 3, sm: 4 }
            }}
          >
            {metrics.map((metric, index) => (
              <Box key={index}>
                <MetricCard {...metric} />
              </Box>
            ))}
          </Box>
        </div>
        
        {/* Performance Dashboard Section */}
        <div>
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Card 
              sx={{ 
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                borderRadius: 3,
                overflow: 'hidden'
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography 
                  variant="h6" 
                  fontWeight={600} 
                  sx={{ 
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: theme.palette.primary.main
                  }}
                >
                  <Analytics fontSize="small" />
                  System Performance Monitor
                </Typography>
                <Box sx={{ height: 'auto' }}>
                  <SimplePerformanceMonitor />
                </Box>
              </CardContent>
            </Card>
          </Box>
        </div>
        
        {/* Charts and Activity Section */}
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, 
            gap: { xs: 2, sm: 3 },
            mb: { xs: 2, sm: 3 }
          }}
        >
          {/* Main Charts */}
          <Box>
            <Stack spacing={{ xs: 2, sm: 3 }}>
              <div>
                <DashboardChart 
                  title="Attendance Trends (Last 7 Days)"
                  data={attendanceData}
                  type="area"
                  height={isMobile ? 250 : 300}
                />
              </div>
              
              <div>
                <DashboardChart 
                  title="Department Distribution"
                  data={departmentData}
                  type="bar"
                  height={isMobile ? 200 : 250}
                />
              </div>
            </Stack>
          </Box>
          
          {/* Recent Activity Sidebar */}
          <Box>
            <div>
              <RecentActivity activities={recentActivities} />
            </div>
          </Box>
        </Box>
      </Container>
      
      {/* Mobile Action Drawer */}
      <MobileActionDrawer 
        open={mobileDrawerOpen} 
        onClose={() => setMobileDrawerOpen(false)} 
      />
      
      {/* Mobile Floating Action Button */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="Quick Actions"
          onClick={() => setMobileDrawerOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.6)}`
            }
          }}
        >
          <Add />
        </Fab>
      )}
    </Box>
  )
}

export default ModernDashboard
