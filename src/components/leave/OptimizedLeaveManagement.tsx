import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { usePermissions } from '../../hooks/usePermissions'
import { toast } from 'sonner'
import { format, differenceInDays, parseISO } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Progress } from '../ui/progress'
import { CalendarDays, Plus, Check, X, Eye } from 'lucide-react'

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
  { value: 'annual', label: 'Annual Leave', color: 'bg-green-500' },
  { value: 'sick', label: 'Sick Leave', color: 'bg-orange-500' },
  { value: 'maternity', label: 'Maternity Leave', color: 'bg-pink-500' },
  { value: 'paternity', label: 'Paternity Leave', color: 'bg-blue-500' },
  { value: 'emergency', label: 'Emergency Leave', color: 'bg-red-500' },
  { value: 'unpaid', label: 'Unpaid Leave', color: 'bg-gray-500' }
]

const OptimizedLeaveManagement: React.FC = () => {
  const { profile } = useAuth()
  const { canView, canEdit, canApprove, isManager, isHR } = usePermissions()
  const queryClient = useQueryClient()
  
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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default'
      case 'rejected': return 'destructive'
      case 'cancelled': return 'secondary'
      default: return 'outline'
    }
  }

  const getLeaveTypeInfo = (type: string) => {
    return LEAVE_TYPES.find(lt => lt.value === type) || LEAVE_TYPES[0]
  }

  if (requestsLoading || balancesLoading) {
    return (
      <div className="space-y-4 p-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Leave Management</h1>
        {canEdit('leaves') && (
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Request Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Request Leave</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="leave_type">Leave Type</Label>
                  <Select value={formData.leave_type} onValueChange={(value) => setFormData({ ...formData, leave_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAVE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Please provide a reason for your leave request..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                  <Button onClick={handleSubmitRequest} disabled={submitRequestMutation.isPending}>
                    Submit Request
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Leave Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leaveBalances?.map((balance) => {
          const leaveType = getLeaveTypeInfo(balance.leave_type)
          const usedPercentage = (balance.used / balance.total_allocated) * 100
          
          return (
            <Card key={balance.id}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <CalendarDays className="w-4 h-4" />
                  {leaveType.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Available</span>
                    <span className="font-semibold text-lg">{balance.available}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Used</span>
                    <span>{balance.used}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Pending</span>
                    <span className="text-orange-600">{balance.pending}</span>
                  </div>
                  <Progress value={usedPercentage} className="mt-2" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Leave Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="my-requests" className="w-full">
            <TabsList>
              <TabsTrigger value="my-requests">My Requests</TabsTrigger>
              {(isManager || isHR) && <TabsTrigger value="team-requests">Team Requests</TabsTrigger>}
              {isHR && <TabsTrigger value="all-requests">All Requests</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="my-requests" className="space-y-4">
              {leaveRequests?.filter(req => req.employee_id === profile?.employee_id).map((request) => (
                <RequestCard 
                  key={request.id} 
                  request={request} 
                  canApprove={false}
                  onApprove={handleApproveRequest}
                  onReject={handleRejectRequest}
                />
              ))}
            </TabsContent>
            
            {(isManager || isHR) && (
              <TabsContent value="team-requests" className="space-y-4">
                {leaveRequests?.filter(req => req.employee_id !== profile?.employee_id).map((request) => (
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    canApprove={canApprove('leaves')}
                    onApprove={handleApproveRequest}
                    onReject={handleRejectRequest}
                    showEmployee
                  />
                ))}
              </TabsContent>
            )}
            
            {isHR && (
              <TabsContent value="all-requests" className="space-y-4">
                {leaveRequests?.map((request) => (
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    canApprove={canApprove('leaves')}
                    onApprove={handleApproveRequest}
                    onReject={handleRejectRequest}
                    showEmployee
                  />
                ))}
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

interface RequestCardProps {
  request: LeaveRequest
  canApprove: boolean
  onApprove: (id: string) => void
  onReject: (id: string, reason: string) => void
  showEmployee?: boolean
}

const RequestCard: React.FC<RequestCardProps> = ({ 
  request, 
  canApprove, 
  onApprove, 
  onReject, 
  showEmployee 
}) => {
  const leaveType = LEAVE_TYPES.find(lt => lt.value === request.leave_type)
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            {showEmployee && request.employee && (
              <div>
                <p className="font-medium">
                  {request.employee.first_name} {request.employee.last_name}
                </p>
                {request.employee.department && (
                  <p className="text-sm text-muted-foreground">{request.employee.department.name}</p>
                )}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Badge variant="outline">{leaveType?.label}</Badge>
              <Badge variant={getStatusVariant(request.status)}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>{format(parseISO(request.start_date), 'MMM dd, yyyy')} - {format(parseISO(request.end_date), 'MMM dd, yyyy')}</p>
              <p>{request.days_requested} days</p>
              <p>Applied: {format(parseISO(request.applied_date), 'MMM dd, yyyy')}</p>
            </div>
            {request.reason && (
              <p className="text-sm">{request.reason}</p>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
            {canApprove && request.status === 'pending' && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onApprove(request.id)}
                  className="text-green-600 hover:text-green-700"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onReject(request.id, 'Rejected by manager')}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default OptimizedLeaveManagement