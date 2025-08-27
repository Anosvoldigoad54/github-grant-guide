import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  LinearProgress,
  Tabs,
  Tab,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as ApproveIcon,
  Close as RejectIcon,
  Visibility as ViewIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { usePermissions } from '../../hooks/usePermissions'
import { toast } from 'sonner'
import { format, differenceInDays, parseISO } from 'date-fns'

interface LeaveRequest {
  id: string
  employee_id: string
  leave_type: string
  start_date: string
  end_date: string
  days_requested: number
  reason: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  applied_date: string
  approved_by?: string
  approved_date?: string
  rejection_reason?: string
  employee?: {
    first_name: string
    last_name: string
    department?: { name: string }
  }
  approver?: {
    first_name: string
    last_name: string
  }
}

interface LeaveBalance {
  id: string
  employee_id: string
  leave_type: string
  total_allocated: number
  used: number
  pending: number
  available: number
  year: number
}

const LEAVE_TYPES = [
  { value: 'annual', label: 'Annual Leave', color: '#4CAF50' },
  { value: 'sick', label: 'Sick Leave', color: '#FF9800' },
  { value: 'maternity', label: 'Maternity Leave', color: '#E91E63' },
  { value: 'paternity', label: 'Paternity Leave', color: '#2196F3' },
  { value: 'emergency', label: 'Emergency Leave', color: '#F44336' },
  { value: 'unpaid', label: 'Unpaid Leave', color: '#9E9E9E' }
]

const LeaveManagement: React.FC = () => {
  const { profile } = useAuth()
  const { canView, canEdit, canApprove, isManager, isHR } = usePermissions()
  const queryClient = useQueryClient()
  
  const [activeTab, setActiveTab] = useState(0)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)
  const [formData, setFormData] = useState({
    leave_type: '',
    start_date: '',
    end_date: '',
    reason: ''
  })

  // Fetch leave requests based on user permissions
  const { data: leaveRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ['leave-requests', profile?.employee_id],
    queryFn: async () => {
      let query = supabase
        .from('leave_requests')
        .select(`
          *,
          employee:user_profiles!leave_requests_employee_id_fkey (
            first_name,
            last_name,
            department:departments (name)
          ),
          approver:user_profiles!leave_requests_approved_by_fkey (
            first_name,
            last_name
          )
        `)
        .order('applied_date', { ascending: false })

      // Apply filters based on permissions
      if (!isHR && !isManager) {
        query = query.eq('employee_id', profile?.employee_id)
      } else if (isManager && !isHR) {
        // Show team requests for managers
        query = query.or(`employee_id.eq.${profile?.employee_id},employee.manager_employee_id.eq.${profile?.employee_id}`)
      }

      const { data, error } = await query
      if (error) throw error
      return data as LeaveRequest[]
    },
    enabled: !!profile?.employee_id
  })

  // Fetch leave balances
  const { data: leaveBalances, isLoading: balancesLoading } = useQuery({
    queryKey: ['leave-balances', profile?.employee_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_balances')
        .select('*')
        .eq('employee_id', profile?.employee_id)
        .eq('year', new Date().getFullYear())

      if (error) throw error
      return data as LeaveBalance[]
    },
    enabled: !!profile?.employee_id
  })

  // Submit leave request mutation
  const submitRequestMutation = useMutation({
    mutationFn: async (requestData: any) => {
      const days = differenceInDays(parseISO(requestData.end_date), parseISO(requestData.start_date)) + 1
      
      const { data, error } = await supabase
        .from('leave_requests')
        .insert({
          employee_id: profile?.employee_id,
          leave_type: requestData.leave_type,
          start_date: requestData.start_date,
          end_date: requestData.end_date,
          days_requested: days,
          reason: requestData.reason,
          status: 'pending',
          applied_date: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] })
      queryClient.invalidateQueries({ queryKey: ['leave-balances'] })
      setOpenDialog(false)
      setFormData({ leave_type: '', start_date: '', end_date: '', reason: '' })
      toast.success('Leave request submitted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit leave request')
    }
  })

  // Approve/Reject leave request mutation
  const updateRequestMutation = useMutation({
    mutationFn: async ({ id, status, rejection_reason }: { id: string, status: string, rejection_reason?: string }) => {
      const updateData: any = {
        status,
        approved_by: profile?.employee_id,
        approved_date: new Date().toISOString()
      }

      if (rejection_reason) {
        updateData.rejection_reason = rejection_reason
      }

      const { data, error } = await supabase
        .from('leave_requests')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] })
      queryClient.invalidateQueries({ queryKey: ['leave-balances'] })
      toast.success('Leave request updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update leave request')
    }
  })

  const handleSubmitRequest = () => {
    if (!formData.leave_type || !formData.start_date || !formData.end_date || !formData.reason) {
      toast.error('Please fill in all required fields')
      return
    }

    if (new Date(formData.start_date) > new Date(formData.end_date)) {
      toast.error('End date must be after start date')
      return
    }

    submitRequestMutation.mutate(formData)
  }

  const handleApproveRequest = (requestId: string) => {
    updateRequestMutation.mutate({ id: requestId, status: 'approved' })
  }

  const handleRejectRequest = (requestId: string, reason: string) => {
    updateRequestMutation.mutate({ id: requestId, status: 'rejected', rejection_reason: reason })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success'
      case 'rejected': return 'error'
      case 'cancelled': return 'default'
      default: return 'warning'
    }
  }

  const getLeaveTypeColor = (type: string) => {
    const leaveType = LEAVE_TYPES.find(lt => lt.value === type)
    return leaveType?.color || '#9E9E9E'
  }

  if (requestsLoading || balancesLoading) {
    return (
      <Box p={3}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading leave management...</Typography>
      </Box>
    )
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Leave Management
        </Typography>
        {canEdit('leaves') && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Request Leave
          </Button>
        )}
      </Box>

      {/* Leave Balances */}
      <Grid container spacing={3} mb={3}>
        {leaveBalances?.map((balance) => {
          const leaveType = LEAVE_TYPES.find(lt => lt.value === balance.leave_type)
          return (
            <Grid item xs={12} sm={6} md={4} key={balance.id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <CalendarIcon sx={{ color: leaveType?.color, mr: 1 }} />
                    <Typography variant="h6">{leaveType?.label}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="text.secondary">Available</Typography>
                    <Typography variant="h6" color="primary">{balance.available}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="text.secondary">Used</Typography>
                    <Typography variant="body2">{balance.used}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="body2" color="text.secondary">Pending</Typography>
                    <Typography variant="body2" color="warning.main">{balance.pending}</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(balance.used / balance.total_allocated) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Tabs */}
      <Card>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="My Requests" />
          {(isManager || isHR) && <Tab label="Team Requests" />}
          {isHR && <Tab label="All Requests" />}
        </Tabs>

        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {(isManager || isHR) && activeTab > 0 && <TableCell>Employee</TableCell>}
                  <TableCell>Leave Type</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Days</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Applied Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaveRequests?.map((request) => (
                  <TableRow key={request.id}>
                    {(isManager || isHR) && activeTab > 0 && (
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {request.employee?.first_name} {request.employee?.last_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {request.employee?.department?.name}
                          </Typography>
                        </Box>
                      </TableCell>
                    )}
                    <TableCell>
                      <Chip
                        label={LEAVE_TYPES.find(lt => lt.value === request.leave_type)?.label}
                        sx={{ bgcolor: getLeaveTypeColor(request.leave_type), color: 'white' }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{format(parseISO(request.start_date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{format(parseISO(request.end_date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{request.days_requested}</TableCell>
                    <TableCell>
                      <Chip
                        label={request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        color={getStatusColor(request.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{format(parseISO(request.applied_date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => setSelectedRequest(request)}>
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        {canApprove('leaves') && request.status === 'pending' && (
                          <>
                            <Tooltip title="Approve">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleApproveRequest(request.id)}
                              >
                                <ApproveIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRejectRequest(request.id, 'Rejected by manager')}
                              >
                                <RejectIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Leave Request Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Request Leave</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Leave Type</InputLabel>
                <Select
                  value={formData.leave_type}
                  onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                  label="Leave Type"
                >
                  {LEAVE_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Please provide a reason for your leave request..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitRequest}
            disabled={submitRequestMutation.isPending}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default LeaveManagement
