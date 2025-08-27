import React, { useState, useMemo, useCallback } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
  Autocomplete,
  Switch,
  FormControlLabel,
  Fab,
  Menu,
  ListItemIcon,
  ListItemText,
  Snackbar,
  CircularProgress,
  Badge,
  Stack
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Person,
  Search,
  FilterList,
  Download,
  Upload,
  Save,
  Cancel,
  Close,
  MoreVert,
  Email,
  Phone,
  Work,
  LocationOn,
  CalendarToday,
  TrendingUp,
  Assessment
} from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { usePermissions } from '../../hooks/usePermissions'
import { toast } from 'sonner'
import { format, parseISO } from 'date-fns'

// JSON Configuration for Employee Management
const EMPLOYEE_CONFIG = {
  departments: [
    { id: 'eng', label: 'Engineering', color: 'primary' },
    { id: 'hr', label: 'Human Resources', color: 'secondary' },
    { id: 'sales', label: 'Sales', color: 'success' },
    { id: 'marketing', label: 'Marketing', color: 'info' },
    { id: 'finance', label: 'Finance', color: 'warning' },
    { id: 'operations', label: 'Operations', color: 'error' }
  ],
  positions: [
    { id: 'intern', label: 'Intern', level: 1 },
    { id: 'junior', label: 'Junior', level: 2 },
    { id: 'mid', label: 'Mid-Level', level: 3 },
    { id: 'senior', label: 'Senior', level: 4 },
    { id: 'lead', label: 'Team Lead', level: 5 },
    { id: 'manager', label: 'Manager', level: 6 },
    { id: 'director', label: 'Director', level: 7 }
  ],
  employmentTypes: [
    { id: 'full_time', label: 'Full Time', benefits: true },
    { id: 'part_time', label: 'Part Time', benefits: false },
    { id: 'contract', label: 'Contract', benefits: false },
    { id: 'consultant', label: 'Consultant', benefits: false }
  ],
  statuses: [
    { id: 'active', label: 'Active', color: 'success' },
    { id: 'inactive', label: 'Inactive', color: 'error' },
    { id: 'on_leave', label: 'On Leave', color: 'warning' },
    { id: 'terminated', label: 'Terminated', color: 'error' }
  ],
  skills: [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
    'Project Management', 'Leadership', 'Communication', 'Problem Solving',
    'Data Analysis', 'Marketing Strategy', 'Sales', 'Customer Service'
  ],
  formFields: {
    personal: [
      { key: 'first_name', label: 'First Name', type: 'text', required: true },
      { key: 'last_name', label: 'Last Name', type: 'text', required: true },
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'phone', label: 'Phone', type: 'tel', required: false },
      { key: 'date_of_birth', label: 'Date of Birth', type: 'date', required: false },
      { key: 'address', label: 'Address', type: 'textarea', required: false }
    ],
    employment: [
      { key: 'employee_id', label: 'Employee ID', type: 'text', required: true },
      { key: 'department', label: 'Department', type: 'select', required: true, options: 'departments' },
      { key: 'position', label: 'Position', type: 'select', required: true, options: 'positions' },
      { key: 'employment_type', label: 'Employment Type', type: 'select', required: true, options: 'employmentTypes' },
      { key: 'hire_date', label: 'Hire Date', type: 'date', required: true },
      { key: 'salary', label: 'Salary', type: 'number', required: false },
      { key: 'manager_id', label: 'Manager', type: 'select', required: false, options: 'employees' }
    ],
    additional: [
      { key: 'skills', label: 'Skills', type: 'multiselect', required: false, options: 'skills' },
      { key: 'emergency_contact', label: 'Emergency Contact', type: 'json', required: false },
      { key: 'notes', label: 'Notes', type: 'textarea', required: false }
    ]
  },
  validation: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[1-9][\d]{0,15}$/,
    employee_id: /^[A-Z]{2,3}\d{3,6}$/
  },
  defaultValues: {
    status: 'active',
    employment_type: 'full_time',
    department: 'eng',
    position: 'junior',
    skills: [],
    emergency_contact: {
      name: '',
      relationship: '',
      phone: '',
      email: ''
    }
  }
}

interface Employee {
  id: string
  employee_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  date_of_birth?: string
  address?: string
  department: string
  position: string
  employment_type: string
  hire_date: string
  salary?: number
  manager_id?: string
  status: string
  skills: string[]
  emergency_contact?: {
    name: string
    relationship: string
    phone: string
    email: string
  }
  notes?: string
  created_at: string
  updated_at: string
}

const EmployeeManager: React.FC = () => {
  const { profile } = useAuth()
  const { canView, canEdit } = usePermissions()
  const queryClient = useQueryClient()

  // State management using JSON structures
  const [filters, setFilters] = useState({
    search: '',
    department: 'all',
    position: 'all',
    status: 'all',
    employment_type: 'all'
  })

  const [dialog, setDialog] = useState({
    open: false,
    mode: 'create' as 'create' | 'edit' | 'view',
    employee: null as Employee | null
  })

  const [formData, setFormData] = useState<Partial<Employee>>(EMPLOYEE_CONFIG.defaultValues)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // JSON-based data fetching
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          manager:user_profiles!manager_id(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      return data.map(emp => ({
        ...emp,
        skills: emp.skills || [],
        emergency_contact: emp.emergency_contact || EMPLOYEE_CONFIG.defaultValues.emergency_contact
      }))
    }
  })

  // JSON-based filtering and sorting
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = `${emp.first_name} ${emp.last_name} ${emp.email} ${emp.employee_id}`
        .toLowerCase()
        .includes(filters.search.toLowerCase())
      
      const matchesDepartment = filters.department === 'all' || emp.department === filters.department
      const matchesPosition = filters.position === 'all' || emp.position === filters.position
      const matchesStatus = filters.status === 'all' || emp.status === filters.status
      const matchesEmploymentType = filters.employment_type === 'all' || emp.employment_type === filters.employment_type

      return matchesSearch && matchesDepartment && matchesPosition && matchesStatus && matchesEmploymentType
    })
  }, [employees, filters])

  // JSON-based form validation
  const validateForm = (data: Partial<Employee>): Record<string, string> => {
    const errors: Record<string, string> = {}
    
    EMPLOYEE_CONFIG.formFields.personal.forEach(field => {
      if (field.required && !data[field.key as keyof Employee]) {
        errors[field.key] = `${field.label} is required`
      }
      
      if (data[field.key as keyof Employee] && EMPLOYEE_CONFIG.validation[field.key as keyof typeof EMPLOYEE_CONFIG.validation]) {
        const regex = EMPLOYEE_CONFIG.validation[field.key as keyof typeof EMPLOYEE_CONFIG.validation]
        if (!regex.test(data[field.key as keyof Employee] as string)) {
          errors[field.key] = `Invalid ${field.label.toLowerCase()} format`
        }
      }
    })

    EMPLOYEE_CONFIG.formFields.employment.forEach(field => {
      if (field.required && !data[field.key as keyof Employee]) {
        errors[field.key] = `${field.label} is required`
      }
    })

    return errors
  }

  // CRUD Mutations with JSON operations
  const createEmployeeMutation = useMutation({
    mutationFn: async (employeeData: Partial<Employee>) => {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          ...employeeData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: profile?.id
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      setDialog({ open: false, mode: 'create', employee: null })
      setFormData(EMPLOYEE_CONFIG.defaultValues)
      setFormErrors({})
      toast.success('Employee created successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create employee')
    }
  })

  const updateEmployeeMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Employee> }) => {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      setDialog({ open: false, mode: 'edit', employee: null })
      toast.success('Employee updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update employee')
    }
  })

  const deleteEmployeeMutation = useMutation({
    mutationFn: async (employeeId: string) => {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', employeeId)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      toast.success('Employee deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete employee')
    }
  })

  // JSON-based form handlers
  const handleFormSubmit = () => {
    const errors = validateForm(formData)
    setFormErrors(errors)
    
    if (Object.keys(errors).length > 0) {
      toast.error('Please fix form errors before submitting')
      return
    }

    if (dialog.mode === 'create') {
      createEmployeeMutation.mutate(formData)
    } else if (dialog.mode === 'edit' && dialog.employee) {
      updateEmployeeMutation.mutate({ id: dialog.employee.id, updates: formData })
    }
  }

  const handleDelete = (employee: Employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.first_name} ${employee.last_name}?`)) {
      deleteEmployeeMutation.mutate(employee.id)
    }
  }

  const handleEdit = (employee: Employee) => {
    setFormData(employee)
    setDialog({ open: true, mode: 'edit', employee })
  }

  const handleView = (employee: Employee) => {
    setDialog({ open: true, mode: 'view', employee })
  }

  const handleCreate = () => {
    setFormData(EMPLOYEE_CONFIG.defaultValues)
    setFormErrors({})
    setDialog({ open: true, mode: 'create', employee: null })
  }

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  if (!canView('employees')) {
    return (
      <Alert severity="error">
        You don't have permission to view employees.
      </Alert>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Person color="primary" />
        Employee Management
        <Badge badgeContent={filteredEmployees.length} color="primary" sx={{ ml: 2 }} />
      </Typography>

      {/* Action Bar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search employees..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ minWidth: 300 }}
        />
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Department</InputLabel>
          <Select
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            label="Department"
          >
            <MenuItem value="all">All Departments</MenuItem>
            {EMPLOYEE_CONFIG.departments.map(dept => (
              <MenuItem key={dept.id} value={dept.id}>{dept.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            label="Status"
          >
            <MenuItem value="all">All Status</MenuItem>
            {EMPLOYEE_CONFIG.statuses.map(status => (
              <MenuItem key={status.id} value={status.id}>{status.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {canEdit('employees') && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
            sx={{ ml: 'auto' }}
          >
            Add Employee
          </Button>
        )}
      </Box>

      {/* Employee Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Hire Date</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {employee.first_name[0]}{employee.last_name[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="medium">
                              {employee.first_name} {employee.last_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {employee.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={EMPLOYEE_CONFIG.departments.find(d => d.id === employee.department)?.label || employee.department}
                          color={EMPLOYEE_CONFIG.departments.find(d => d.id === employee.department)?.color as any || 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {EMPLOYEE_CONFIG.positions.find(p => p.id === employee.position)?.label || employee.position}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={EMPLOYEE_CONFIG.statuses.find(s => s.id === employee.status)?.label || employee.status}
                          color={EMPLOYEE_CONFIG.statuses.find(s => s.id === employee.status)?.color as any || 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {format(parseISO(employee.hire_date), 'MMM dd, yyyy')}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="View Details">
                            <IconButton size="small" onClick={() => handleView(employee)}>
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          {canEdit('employees') && (
                            <>
                              <Tooltip title="Edit Employee">
                                <IconButton size="small" onClick={() => handleEdit(employee)}>
                                  <Edit />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete Employee">
                                <IconButton size="small" color="error" onClick={() => handleDelete(employee)}>
                                  <Delete />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Employee Form Dialog */}
      <Dialog
        open={dialog.open}
        onClose={() => setDialog({ open: false, mode: 'create', employee: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {dialog.mode === 'create' ? 'Add New Employee' : 
               dialog.mode === 'edit' ? 'Edit Employee' : 'Employee Details'}
            </Typography>
            <IconButton onClick={() => setDialog({ open: false, mode: 'create', employee: null })}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* Personal Information */}
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Personal Information
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, mb: 3 }}>
            {EMPLOYEE_CONFIG.formFields.personal.map(field => (
              <TextField
                key={field.key}
                label={field.label}
                type={field.type}
                required={field.required}
                value={formData[field.key as keyof Employee] || ''}
                onChange={(e) => handleFormChange(field.key, e.target.value)}
                error={!!formErrors[field.key]}
                helperText={formErrors[field.key]}
                disabled={dialog.mode === 'view'}
                multiline={field.type === 'textarea'}
                rows={field.type === 'textarea' ? 3 : 1}
              />
            ))}
          </Box>

          {/* Employment Information */}
          <Typography variant="h6" gutterBottom>
            Employment Information
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, mb: 3 }}>
            {EMPLOYEE_CONFIG.formFields.employment.map(field => (
              field.type === 'select' ? (
                <FormControl key={field.key} error={!!formErrors[field.key]}>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    value={formData[field.key as keyof Employee] || ''}
                    onChange={(e) => handleFormChange(field.key, e.target.value)}
                    label={field.label}
                    disabled={dialog.mode === 'view'}
                  >
                    {field.options && EMPLOYEE_CONFIG[field.options as keyof typeof EMPLOYEE_CONFIG]?.map((option: any) => (
                      <MenuItem key={option.id} value={option.id}>{option.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  key={field.key}
                  label={field.label}
                  type={field.type}
                  required={field.required}
                  value={formData[field.key as keyof Employee] || ''}
                  onChange={(e) => handleFormChange(field.key, e.target.value)}
                  error={!!formErrors[field.key]}
                  helperText={formErrors[field.key]}
                  disabled={dialog.mode === 'view'}
                />
              )
            ))}
          </Box>

          {/* Skills */}
          <Typography variant="h6" gutterBottom>
            Skills & Additional Information
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
            <Autocomplete
              multiple
              options={EMPLOYEE_CONFIG.skills}
              value={formData.skills || []}
              onChange={(_, newValue) => handleFormChange('skills', newValue)}
              disabled={dialog.mode === 'view'}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Skills"
                  placeholder="Select skills"
                />
              )}
            />
            <TextField
              label="Notes"
              multiline
              rows={3}
              value={formData.notes || ''}
              onChange={(e) => handleFormChange('notes', e.target.value)}
              disabled={dialog.mode === 'view'}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ open: false, mode: 'create', employee: null })}>
            Cancel
          </Button>
          {dialog.mode !== 'view' && (
            <Button
              variant="contained"
              onClick={handleFormSubmit}
              disabled={createEmployeeMutation.isPending || updateEmployeeMutation.isPending}
            >
              {createEmployeeMutation.isPending || updateEmployeeMutation.isPending ? (
                <CircularProgress size={20} />
              ) : (
                dialog.mode === 'create' ? 'Create Employee' : 'Update Employee'
              )}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default EmployeeManager

