import React, { useState, useMemo } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  Stack,
  Chip,
  IconButton,
  Button,
  useTheme,
  alpha,
  Paper,
  Divider,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Badge,
  Tooltip,
  useMediaQuery,
  Skeleton
} from '@mui/material'
import SimpleVirtualList from '../common/SimpleVirtualList'
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  Star as StarIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material'
// Removed framer-motion animations for better performance
import { format, parseISO } from 'date-fns'

interface Employee {
  id: string
  employee_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  profile_photo_url?: string
  position?: string
  department?: string
  location?: string
  hire_date?: string
  salary?: number
  status: 'active' | 'inactive' | 'on_leave' | 'terminated'
  manager?: string
  skills?: string[]
  rating?: number
}

const mockEmployees: Employee[] = [
  {
    id: '1',
    employee_id: 'EMP001',
    first_name: 'John',
    last_name: 'Smith',
    email: 'john.smith@company.com',
    phone: '+1 (555) 123-4567',
    position: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'New York',
    hire_date: '2022-01-15',
    status: 'active',
    manager: 'Sarah Wilson',
    skills: ['React', 'Node.js', 'TypeScript'],
    rating: 4.8
  },
  {
    id: '2',
    employee_id: 'EMP002',
    first_name: 'Sarah',
    last_name: 'Connor',
    email: 'sarah.connor@company.com',
    phone: '+1 (555) 234-5678',
    position: 'Marketing Manager',
    department: 'Marketing',
    location: 'San Francisco',
    hire_date: '2021-08-20',
    status: 'active',
    manager: 'Mike Johnson',
    skills: ['Digital Marketing', 'SEO', 'Analytics'],
    rating: 4.9
  },
  {
    id: '3',
    employee_id: 'EMP003',
    first_name: 'Mike',
    last_name: 'Johnson',
    email: 'mike.johnson@company.com',
    phone: '+1 (555) 345-6789',
    position: 'HR Director',
    department: 'Human Resources',
    location: 'Chicago',
    hire_date: '2020-03-10',
    status: 'active',
    skills: ['Leadership', 'Recruitment', 'Employee Relations'],
    rating: 4.7
  },
  {
    id: '4',
    employee_id: 'EMP004',
    first_name: 'Emma',
    last_name: 'Davis',
    email: 'emma.davis@company.com',
    phone: '+1 (555) 456-7890',
    position: 'UX Designer',
    department: 'Design',
    location: 'Austin',
    hire_date: '2023-02-01',
    status: 'active',
    manager: 'John Smith',
    skills: ['Figma', 'User Research', 'Prototyping'],
    rating: 4.6
  }
]

const EmployeeCard = ({ employee, viewMode = 'grid' }: { employee: Employee; viewMode: 'grid' | 'list' }) => {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  
  const getStatusColor = (status: Employee['status']) => {
    switch (status) {
      case 'active': return 'success'
      case 'inactive': return 'default'
      case 'on_leave': return 'warning'
      case 'terminated': return 'error'
      default: return 'default'
    }
  }
  
  const getDepartmentColor = (department?: string) => {
    const colors = ['primary', 'secondary', 'info', 'warning', 'success']
    return colors[department?.length ? department.length % colors.length : 0]
  }
  
  if (viewMode === 'list') {
    return (
      <div>
        <Paper
          sx={{
            p: 3,
            mb: 2,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            '&:hover': {
              boxShadow: theme.shadows[4],
              borderColor: alpha(theme.palette.primary.main, 0.3)
            }
          }}
        >
          <Stack direction="row" alignItems="center" spacing={3}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: employee.status === 'active' ? 'success.main' : 'grey.400',
                    border: `2px solid ${theme.palette.background.paper}`
                  }}
                />
              }
            >
              <Avatar
                src={employee.profile_photo_url}
                sx={{ 
                  width: 64, 
                  height: 64,
                  bgcolor: theme.palette.primary.main,
                  fontSize: '1.5rem',
                  fontWeight: 600
                }}
              >
                {employee.first_name[0]}{employee.last_name[0]}
              </Avatar>
            </Badge>
            
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                <Typography variant="h6" fontWeight={600} noWrap>
                  {employee.first_name} {employee.last_name}
                </Typography>
                <Chip 
                  label={employee.status} 
                  size="small" 
                  color={getStatusColor(employee.status) as any}
                />
                {employee.rating && (
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                    <Typography variant="body2" fontWeight={500}>
                      {employee.rating}
                    </Typography>
                  </Stack>
                )}
              </Stack>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {employee.position} • {employee.employee_id}
              </Typography>
              
              <Stack direction="row" alignItems="center" spacing={3} flexWrap="wrap">
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <BusinessIcon fontSize="small" color="action" />
                  <Typography variant="body2">{employee.department}</Typography>
                </Stack>
                
                {employee.location && (
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <LocationOnIcon fontSize="small" color="action" />
                    <Typography variant="body2">{employee.location}</Typography>
                  </Stack>
                )}
                
                {employee.hire_date && (
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <CalendarTodayIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {format(parseISO(employee.hire_date), 'MMM yyyy')}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Box>
            
            <Stack direction="row" spacing={1}>
              <Tooltip title="Email">
                <IconButton size="small" color="primary">
                  <EmailIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Phone">
                <IconButton size="small" color="primary">
                  <PhoneIcon />
                </IconButton>
              </Tooltip>
              <IconButton 
                size="small" 
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                <MoreVertIcon />
              </IconButton>
            </Stack>
          </Stack>
          
          {employee.skills && employee.skills.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {employee.skills.slice(0, 3).map((skill, index) => (
                  <Chip 
                    key={index}
                    label={skill} 
                    size="small" 
                    variant="outlined"
                    sx={{ fontSize: '0.75rem' }}
                  />
                ))}
                {employee.skills.length > 3 && (
                  <Chip 
                    label={`+${employee.skills.length - 3} more`} 
                    size="small" 
                    variant="outlined"
                    color="primary"
                    sx={{ fontSize: '0.75rem' }}
                  />
                )}
              </Stack>
            </Box>
          )}
        </Paper>
      </div>
    )
  }
  
  return (
    <div>
      <Card
        sx={{
          height: '100%',
          transition: 'all 0.2s ease',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          '&:hover': {
            boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
            borderColor: alpha(theme.palette.primary.main, 0.3)
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2} height="100%">
            {/* Header */}
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: employee.status === 'active' ? 'success.main' : 'grey.400',
                      border: `2px solid ${theme.palette.background.paper}`
                    }}
                  />
                }
              >
                <Avatar
                  src={employee.profile_photo_url}
                  sx={{ 
                    width: 56, 
                    height: 56,
                    bgcolor: theme.palette.primary.main,
                    fontSize: '1.25rem',
                    fontWeight: 600
                  }}
                >
                  {employee.first_name[0]}{employee.last_name[0]}
                </Avatar>
              </Badge>
              
              <IconButton 
                size="small" 
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                <MoreVertIcon />
              </IconButton>
            </Stack>
            
            {/* Name and Status */}
            <Box>
              <Typography variant="h6" fontWeight={600} noWrap sx={{ mb: 0.5 }}>
                {employee.first_name} {employee.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1 }}>
                {employee.position}
              </Typography>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Chip 
                  label={employee.status} 
                  size="small" 
                  color={getStatusColor(employee.status) as any}
                />
                {employee.rating && (
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                    <Typography variant="body2" fontWeight={500}>
                      {employee.rating}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Box>
            
            {/* Details */}
            <Stack spacing={1} sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <BusinessIcon fontSize="small" color="action" />
                <Typography variant="body2" noWrap>
                  {employee.department}
                </Typography>
              </Stack>
              
              {employee.location && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography variant="body2" noWrap>
                    {employee.location}
                  </Typography>
                </Stack>
              )}
              
              <Stack direction="row" alignItems="center" spacing={1}>
                <EmailIcon fontSize="small" color="action" />
                <Typography variant="body2" noWrap sx={{ fontSize: '0.75rem' }}>
                  {employee.email}
                </Typography>
              </Stack>
            </Stack>
            
            {/* Skills */}
            {employee.skills && employee.skills.length > 0 && (
              <Box>
                <Divider sx={{ mb: 1 }} />
                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                  {employee.skills.slice(0, 2).map((skill, index) => (
                    <Chip 
                      key={index}
                      label={skill} 
                      size="small" 
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', height: 20 }}
                    />
                  ))}
                  {employee.skills.length > 2 && (
                    <Chip 
                      label={`+${employee.skills.length - 2}`} 
                      size="small" 
                      variant="outlined"
                      color="primary"
                      sx={{ fontSize: '0.7rem', height: 20 }}
                    />
                  )}
                </Stack>
              </Box>
            )}
            
            {/* Actions */}
            <Stack direction="row" spacing={1} justifyContent="center">
              <Tooltip title="Email">
                <IconButton size="small" color="primary">
                  <EmailIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Phone">
                <IconButton size="small" color="primary">
                  <PhoneIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Profile">
                <IconButton size="small" color="primary">
                  <PersonIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </CardContent>
        
        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => setAnchorEl(null)}>View Profile</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>Edit</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>Send Message</MenuItem>
        </Menu>
      </Card>
    </div>
  )
}

const ModernEmployeeDirectory: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  const [searchQuery, setSearchQuery] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [employees] = useState<Employee[]>(mockEmployees)
  
  const departments = useMemo(() => 
    [...new Set(employees.map(emp => emp.department).filter(Boolean))],
    [employees]
  )
  
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = !searchQuery.trim() || 
        emp.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.position?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesDepartment = !departmentFilter || emp.department === departmentFilter
      const matchesStatus = !statusFilter || emp.status === statusFilter
      
      return matchesSearch && matchesDepartment && matchesStatus
    })
  }, [employees, searchQuery, departmentFilter, statusFilter])
  
  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <div>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography 
              variant="h4" 
              fontWeight={700} 
              sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}
            >
              Employee Directory
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {filteredEmployees.length} employees found
            </Typography>
          </Box>
          
          <Button variant="contained" startIcon={<AddIcon />}>
            Add Employee
          </Button>
        </Stack>
      </div>
      
      {/* Filters and Search */}
      <div>
        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  label="Department"
                >
                  <MenuItem value="">All Departments</MenuItem>
                  {departments.map(dept => (
                    <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="on_leave">On Leave</MenuItem>
                  <MenuItem value="terminated">Terminated</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Stack direction="row" spacing={0}>
                  <IconButton
                    onClick={() => setViewMode('grid')}
                    color={viewMode === 'grid' ? 'primary' : 'default'}
                  >
                    <ViewModuleIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => setViewMode('list')}
                    color={viewMode === 'list' ? 'primary' : 'default'}
                  >
                    <ViewListIcon />
                  </IconButton>
                </Stack>
                <Button variant="outlined" startIcon={<FilterListIcon />}>
                  More Filters
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </div>
      
      {/* Employee Grid/List */}
      <div>
        {viewMode === 'grid' ? (
          <Grid container spacing={3}>
            {filteredEmployees.map((employee) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={employee.id}>
                <EmployeeCard employee={employee} viewMode="grid" />
              </Grid>
            ))}
          </Grid>
        ) : (
          <SimpleVirtualList
            items={filteredEmployees}
            height={600}
            itemHeight={120}
            renderItem={(employee) => (
              <EmployeeCard key={employee.id} employee={employee} viewMode="list" />
            )}
            emptyMessage="No employees found matching your criteria"
          />
        )}
      </div>
      
      {/* Empty State */}
      {filteredEmployees.length === 0 && (
        <div>
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              color: 'text.secondary'
            }}
          >
            <PersonIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" gutterBottom>
              No employees found
            </Typography>
            <Typography variant="body2">
              {searchQuery || departmentFilter || statusFilter 
                ? 'Try adjusting your search criteria' 
                : 'No employees in the directory'}
            </Typography>
          </Box>
        </div>
      )}
    </Box>
  )
}

export default ModernEmployeeDirectory
