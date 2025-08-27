import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Divider,
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  Group,
  Work,
  AttachMoney,
  Schedule,
  Analytics,
  Close,
  Download,
  Refresh,
  DateRange,
  BarChart,
  PieChart,
  Timeline,
  Assessment,
  Business,
  Person,
  Star,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useResponsive } from '../../hooks/useResponsive'

interface AnalyticsData {
  totalEmployees: number
  activeEmployees: number
  newHiresThisMonth: number
  averageSalary: number
  departmentBreakdown: Array<{
    name: string
    count: number
    percentage: number
  }>
  performanceMetrics: Array<{
    category: string
    score: number
    trend: 'up' | 'down' | 'stable'
  }>
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: string
    status: 'success' | 'warning' | 'error' | 'info'
  }>
}

interface AnalyticsDashboardProps {
  open: boolean
  onClose: () => void
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  open,
  onClose
}) => {
  const responsive = useResponsive()
  const [loading, setLoading] = useState(false)
  const [timeRange, setTimeRange] = useState('30d')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalEmployees: 0,
    activeEmployees: 0,
    newHiresThisMonth: 0,
    averageSalary: 0,
    departmentBreakdown: [],
    performanceMetrics: [],
    recentActivity: []
  })

  useEffect(() => {
    if (open) {
      loadAnalyticsData()
    }
  }, [open, timeRange])

  const loadAnalyticsData = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockData: AnalyticsData = {
        totalEmployees: 247,
        activeEmployees: 234,
        newHiresThisMonth: 12,
        averageSalary: 75000,
        departmentBreakdown: [
          { name: 'Engineering', count: 89, percentage: 36 },
          { name: 'Sales', count: 45, percentage: 18 },
          { name: 'Marketing', count: 32, percentage: 13 },
          { name: 'HR', count: 28, percentage: 11 },
          { name: 'Finance', count: 25, percentage: 10 },
          { name: 'Operations', count: 28, percentage: 12 }
        ],
        performanceMetrics: [
          { category: 'Employee Satisfaction', score: 87, trend: 'up' },
          { category: 'Productivity', score: 92, trend: 'up' },
          { category: 'Retention Rate', score: 94, trend: 'stable' },
          { category: 'Training Completion', score: 78, trend: 'down' },
          { category: 'Goal Achievement', score: 85, trend: 'up' }
        ],
        recentActivity: [
          {
            id: '1',
            type: 'hire',
            description: 'New employee Sarah Johnson joined Engineering',
            timestamp: '2 hours ago',
            status: 'success'
          },
          {
            id: '2',
            type: 'promotion',
            description: 'Michael Chen promoted to Senior Developer',
            timestamp: '5 hours ago',
            status: 'info'
          },
          {
            id: '3',
            type: 'training',
            description: '15 employees completed cybersecurity training',
            timestamp: '1 day ago',
            status: 'success'
          },
          {
            id: '4',
            type: 'alert',
            description: 'Low completion rate for Q4 performance reviews',
            timestamp: '2 days ago',
            status: 'warning'
          }
        ]
      }
      
      setAnalyticsData(mockData)
    } catch (error) {
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const handleExportReport = () => {
    // Simulate export
    toast.success('Analytics report exported successfully')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'success'
      case 'warning': return 'warning'
      case 'error': return 'error'
      case 'info': return 'info'
      default: return 'default'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp color="success" />
      case 'down': return <TrendingDown color="error" />
      default: return <TrendingUp color="disabled" />
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      fullScreen={responsive.isMobile}
      PaperProps={{
        sx: { height: responsive.isMobile ? '100%' : '90vh' }
      }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Analytics />
            <Typography variant="h6">HR Analytics Dashboard</Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                label="Time Range"
              >
                <MenuItem value="7d">Last 7 days</MenuItem>
                <MenuItem value="30d">Last 30 days</MenuItem>
                <MenuItem value="90d">Last 90 days</MenuItem>
                <MenuItem value="1y">Last year</MenuItem>
              </Select>
            </FormControl>
            <Button
              startIcon={<Refresh />}
              onClick={loadAnalyticsData}
              disabled={loading}
              size="small"
            >
              Refresh
            </Button>
            <Button
              startIcon={<Download />}
              onClick={handleExportReport}
              variant="outlined"
              size="small"
            >
              Export
            </Button>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Stack>
        </Stack>
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              {/* Key Metrics */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Key Metrics</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Group color="primary" />
                          <Box>
                            <Typography variant="h4" fontWeight="bold">
                              {analyticsData.totalEmployees}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Total Employees
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Person color="success" />
                          <Box>
                            <Typography variant="h4" fontWeight="bold">
                              {analyticsData.activeEmployees}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Active Employees
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <TrendingUp color="info" />
                          <Box>
                            <Typography variant="h4" fontWeight="bold">
                              {analyticsData.newHiresThisMonth}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              New Hires This Month
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card>
                      <CardContent>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <AttachMoney color="warning" />
                          <Box>
                            <Typography variant="h4" fontWeight="bold">
                              ${analyticsData.averageSalary.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Average Salary
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>

              {/* Department Breakdown */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Department Breakdown
                    </Typography>
                    <List>
                      {analyticsData.departmentBreakdown.map((dept) => (
                        <ListItem key={dept.name} divider>
                          <ListItemIcon>
                            <Business />
                          </ListItemIcon>
                          <ListItemText
                            primary={dept.name}
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Typography variant="body2">
                                    {dept.count} employees
                                  </Typography>
                                  <Chip
                                    label={`${dept.percentage}%`}
                                    size="small"
                                    variant="outlined"
                                  />
                                </Stack>
                                <LinearProgress
                                  variant="determinate"
                                  value={dept.percentage}
                                  sx={{ mt: 1 }}
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Performance Metrics */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Performance Metrics
                    </Typography>
                    <List>
                      {analyticsData.performanceMetrics.map((metric) => (
                        <ListItem key={metric.category} divider>
                          <ListItemIcon>
                            <Assessment />
                          </ListItemIcon>
                          <ListItemText
                            primary={metric.category}
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <Typography variant="h6" fontWeight="bold">
                                    {metric.score}%
                                  </Typography>
                                  {getTrendIcon(metric.trend)}
                                </Stack>
                                <LinearProgress
                                  variant="determinate"
                                  value={metric.score}
                                  color={metric.score > 80 ? 'success' : metric.score > 60 ? 'warning' : 'error'}
                                  sx={{ mt: 1 }}
                                />
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Recent Activity */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recent Activity
                    </Typography>
                    <List>
                      {analyticsData.recentActivity.map((activity) => (
                        <ListItem key={activity.id} divider>
                          <ListItemText
                            primary={activity.description}
                            secondary={activity.timestamp}
                          />
                          <Chip
                            label={activity.type}
                            color={getStatusColor(activity.status) as any}
                            size="small"
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AnalyticsDashboard