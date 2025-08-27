import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Stack,
  Skeleton,
} from '@mui/material';
import {
  EventNote as EventNoteIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Info as InfoIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { LeaveRequest } from './types';
import { formatDateRange, getStatusColor, getStatusIcon } from '../../utils/leaveUtils';

interface LeaveRequestCardProps {
  request: LeaveRequest;
  onEdit?: (request: LeaveRequest) => void;
  onDelete?: (requestId: string) => void;
  isLoading?: boolean;
  showActions?: boolean;
  showEmployeeInfo?: boolean;
  className?: string;
}

export const LeaveRequestCard: React.FC<LeaveRequestCardProps> = ({
  request,
  onEdit,
  onDelete,
  isLoading = false,
  showActions = true,
  showEmployeeInfo = false,
  className = '',
}) => {
  const theme = useTheme();
  const statusColor = getStatusColor(request.status);
  const statusIcon = getStatusIcon(request.status);

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent>
          <Stack spacing={2}>
            <Skeleton variant="text" width="60%" height={32} />
            <Skeleton variant="rectangular" height={20} />
            <Skeleton variant="rectangular" height={20} width="80%" />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={className}
      sx={{
        borderLeft: `4px solid ${statusColor}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Box>
            <Typography variant="h6" component="div" gutterBottom>
              {request.leave_type?.name || 'Leave Request'}
            </Typography>
            
            {showEmployeeInfo && request.employee && (
              <Box display="flex" alignItems="center" mb={1.5}>
                <Avatar 
                  src={request.employee.profile_photo_url} 
                  alt={`${request.employee.first_name} ${request.employee.last_name}`}
                  sx={{ width: 32, height: 32, mr: 1 }}
                >
                  {request.employee.first_name?.[0]}{request.employee.last_name?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.primary">
                    {request.employee.first_name} {request.employee.last_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {request.employee.department} • {request.employee.position}
                  </Typography>
                </Box>
              </Box>
            )}
            
            <Box display="flex" alignItems="center" flexWrap="wrap" gap={1} mb={1.5}>
              <Chip
                icon={<EventNoteIcon />}
                label={formatDateRange(request.start_date, request.end_date, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
                size="small"
                variant="outlined"
              />
              
              {request.start_time && request.end_time && (
                <Chip
                  icon={<TimeIcon />}
                  label={`${request.start_time} - ${request.end_time}`}
                  size="small"
                  variant="outlined"
                />
              )}
              
              <Chip
                label={request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                size="small"
                sx={{
                  backgroundColor: alpha(statusColor, 0.1),
                  color: statusColor,
                  fontWeight: 500,
                }}
                icon={<span style={{ marginRight: 4 }}>{statusIcon}</span>}
              />
              
              {request.emergency_request && (
                <Chip
                  label="Emergency"
                  size="small"
                  color="error"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
          
          {showActions && (
            <Box>
              {onEdit && (
                <Tooltip title="Edit">
                  <IconButton 
                    size="small" 
                    onClick={() => onEdit(request)}
                    color="primary"
                    disabled={request.status !== 'pending'}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              
              {onDelete && (
                <Tooltip title="Delete">
                  <IconButton 
                    size="small" 
                    onClick={() => onDelete(request.id)}
                    color="error"
                    disabled={request.status !== 'pending'}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}
        </Box>
        
        {request.reason && (
          <Box mt={1.5}>
            <Typography variant="body2" color="text.secondary" paragraph>
              {request.reason}
            </Typography>
          </Box>
        )}
        
        {(request.work_handover_completed || request.coverage_arranged) && (
          <Box mt={1.5}>
            <Divider sx={{ my: 1 }} />
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {request.work_handover_completed && (
                <Box display="flex" alignItems="center">
                  <WorkIcon color="action" fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="caption" color="text.secondary">
                    Work handover completed
                  </Typography>
                </Box>
              )}
              
              {request.coverage_arranged && (
                <Box display="flex" alignItems="center">
                  <PersonIcon color="action" fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="caption" color="text.secondary">
                    Coverage arranged
                  </Typography>
                </Box>
              )}
              
              {request.handover_notes && (
                <Tooltip title={request.handover_notes} arrow>
                  <Box display="flex" alignItems="center">
                    <InfoIcon color="info" fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="caption" color="info.main">
                      Handover notes available
                    </Typography>
                  </Box>
                </Tooltip>
              )}
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaveRequestCard;
