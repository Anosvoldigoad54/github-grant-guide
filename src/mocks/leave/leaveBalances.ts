import { EmployeeLeaveBalance } from '../../components/leave/types';

export const mockLeaveBalances: EmployeeLeaveBalance[] = [
  {
    id: '1',
    employee_id: 'EMP001',
    leave_type_id: '1',
    current_balance: 15,
    accrued_balance: 10,
    used_balance: 5,
    pending_balance: 2,
    available_balance: 8,
    last_accrual_date: '2023-06-01',
    next_accrual_date: '2023-07-01',
    carry_forward_balance: 3,
    carry_forward_expiry_date: '2024-03-31',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-06-15T10:30:00Z',
    leave_type: {
      id: '1',
      name: 'Annual Leave',
      code: 'AL',
      color_code: '#4CAF50',
      icon: 'beach_access'
    }
  },
  {
    id: '2',
    employee_id: 'EMP001',
    leave_type_id: '2',
    current_balance: 8,
    accrued_balance: 5,
    used_balance: 2,
    pending_balance: 1,
    available_balance: 5,
    last_accrual_date: '2023-06-01',
    next_accrual_date: '2023-07-01',
    carry_forward_balance: 1,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-06-10T14:20:00Z',
    leave_type: {
      id: '2',
      name: 'Sick Leave',
      code: 'SL',
      color_code: '#2196F3',
      icon: 'sick'
    }
  },
  {
    id: '3',
    employee_id: 'EMP001',
    leave_type_id: '3',
    current_balance: 3,
    accrued_balance: 5,
    used_balance: 2,
    pending_balance: 0,
    available_balance: 3,
    last_accrual_date: '2023-01-01',
    next_accrual_date: '2024-01-01',
    carry_forward_balance: 0,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-05-30T09:15:00Z',
    leave_type: {
      id: '3',
      name: 'Personal Leave',
      code: 'PL',
      color_code: '#9C27B0',
      icon: 'person'
    }
  },
  {
    id: '4',
    employee_id: 'EMP002',
    leave_type_id: '1',
    current_balance: 20,
    accrued_balance: 10,
    used_balance: 0,
    pending_balance: 0,
    available_balance: 20,
    last_accrual_date: '2023-06-01',
    next_accrual_date: '2023-07-01',
    carry_forward_balance: 10,
    carry_forward_expiry_date: '2024-03-31',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-06-01T00:00:00Z',
    leave_type: {
      id: '1',
      name: 'Annual Leave',
      code: 'AL',
      color_code: '#4CAF50',
      icon: 'beach_access'
    }
  },
  {
    id: '5',
    employee_id: 'EMP002',
    leave_type_id: '2',
    current_balance: 10,
    accrued_balance: 5,
    used_balance: 0,
    pending_balance: 0,
    available_balance: 10,
    last_accrual_date: '2023-06-01',
    next_accrual_date: '2023-07-01',
    carry_forward_balance: 5,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-06-01T00:00:00Z',
    leave_type: {
      id: '2',
      name: 'Sick Leave',
      code: 'SL',
      color_code: '#2196F3',
      icon: 'sick'
    }
  }
];
