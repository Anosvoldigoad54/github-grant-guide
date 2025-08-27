import { LeaveType } from '../../components/leave/types';

export const mockLeaveTypes: LeaveType[] = [
  {
    id: '1',
    name: 'Annual Leave',
    code: 'AL',
    description: 'Paid time off for vacation and personal matters',
    category: 'Paid Time Off',
    max_days_per_year: 20,
    max_days_per_period: 20,
    accrual_method: 'monthly',
    accrual_rate: 1.67,
    accrual_frequency: 'monthly',
    accrual_cap: 30,
    is_active: true,
    color_code: '#4CAF50',
    icon: 'beach_access',
    display_order: 1,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    metadata: {
      allow_half_day: true,
      allow_hourly: true,
      requires_approval: true,
      approval_workflow: ['manager']
    }
  },
  {
    id: '2',
    name: 'Sick Leave',
    code: 'SL',
    description: 'Paid time off for illness or medical appointments',
    category: 'Paid Time Off',
    max_days_per_year: 10,
    max_days_per_period: 10,
    accrual_method: 'monthly',
    accrual_rate: 0.83,
    accrual_frequency: 'monthly',
    accrual_cap: 15,
    is_active: true,
    color_code: '#2196F3',
    icon: 'sick',
    display_order: 2,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    metadata: {
      allow_half_day: true,
      allow_hourly: true,
      requires_medical_certificate: true,
      medical_certificate_required_after: 3,
      requires_approval: false
    }
  },
  {
    id: '3',
    name: 'Personal Leave',
    code: 'PL',
    description: 'Paid time off for personal matters',
    category: 'Paid Time Off',
    max_days_per_year: 5,
    max_days_per_period: 5,
    accrual_method: 'annually',
    accrual_rate: 5,
    accrual_frequency: 'annually',
    is_active: true,
    color_code: '#9C27B0',
    icon: 'person',
    display_order: 3,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    metadata: {
      allow_half_day: true,
      requires_approval: true,
      approval_workflow: ['manager']
    }
  },
  {
    id: '4',
    name: 'Unpaid Leave',
    code: 'UL',
    description: 'Unpaid time off',
    category: 'Unpaid Time Off',
    is_active: true,
    color_code: '#9E9E9E',
    icon: 'money_off',
    display_order: 4,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    metadata: {
      allow_half_day: true,
      requires_approval: true,
      approval_workflow: ['manager', 'hr']
    }
  }
];
