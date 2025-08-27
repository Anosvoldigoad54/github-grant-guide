import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  IconButton,
  Collapse,
  Alert,
  Stack,
  Button,
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
  Tooltip,
  Badge,
  Divider
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  NetworkCheck as NetworkIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Timeline as TimelineIcon,
  Storage as StorageIcon,
  DeviceHub as DeviceHubIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  SignalCellular4Bar as SignalIcon,
  SignalCellular0Bar as NoSignalIcon
} from '@mui/icons-material';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { usePerformance } from '../../hooks/usePerformance';
import { useMemoryUsage } from '../../hooks/usePerformance';
import { useNetworkStatus } from '../../hooks/usePerformance';
import { usePerformanceMetrics } from '../../hooks/usePerformance';
import { useBundleOptimization } from '../../hooks/usePerformance';
import { PerformanceBudget } from '../../utils/performanceUtils';

interface PerformanceData {
  timestamp: number;
  fps: number;
  memory: number;
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
}

const PerformanceDashboard: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [budget] = useState(new PerformanceBudget({
    fps: 30,
    memory: 100 * 1024 * 1024, // 100MB
    fcp: 1800,
    lcp: 2500,
    fid: 100,
    cls: 0.1
  }));
  
  const { fps, isLowPerformance } = usePerformance();
  const { memoryUsage, memoryLimit } = useMemoryUsage();
  const { isOnline, connectionType } = useNetworkStatus();
  const { fcp, lcp, fid, cls, ttfb } = usePerformanceMetrics();
  const { loadedModules, totalModules } = useBundleOptimization();

  // Collect performance data over time
  useEffect(() => {
    const interval = setInterval(() => {
      const newData: PerformanceData = {
        timestamp: Date.now(),
        fps,
        memory: memoryUsage / 1024 / 1024, // Convert to MB
        fcp,
        lcp,
        fid,
        cls
      };
      
      setPerformanceData(prev => {
        const updated = [...prev, newData];
        // Keep only last 50 data points
        return updated.slice(-50);
      });
      
      // Measure against budget
      budget.measure('fps', fps);
      budget.measure('memory', memoryUsage);
      budget.measure('fcp', fcp);
      budget.measure('lcp', lcp);
      budget.measure('fid', fid);
      budget.measure('cls', cls);
    }, 2000);

    return () => clearInterval(interval);
  }, [fps, memoryUsage, fcp, lcp, fid, cls, budget]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircleIcon />;
      case 'warning': return <WarningIcon />;
      case 'error': return <ErrorIcon />;
      default: return null;
    }
  };

  const getPerformanceStatus = (metric: string, value: number): { status: string; color: string } => {
    switch (metric) {
      case 'fps':
        if (value >= 50) return { status: 'good', color: 'success.main' };
        if (value >= 30) return { status: 'warning', color: 'warning.main' };
        return { status: 'error', color: 'error.main' };
      case 'memory':
        const percentage = (value / (memoryLimit / 1024 / 1024)) * 100;
        if (percentage < 70) return { status: 'good', color: 'success.main' };
        if (percentage < 90) return { status: 'warning', color: 'warning.main' };
        return { status: 'error', color: 'error.main' };
      case 'fcp':
        if (value < 1800) return { status: 'good', color: 'success.main' };
        if (value < 3000) return { status: 'warning', color: 'warning.main' };
        return { status: 'error', color: 'error.main' };
      case 'lcp':
        if (value < 2500) return { status: 'good', color: 'success.main' };
        if (value < 4000) return { status: 'warning', color: 'warning.main' };
        return { status: 'error', color: 'error.main' };
      case 'fid':
        if (value < 100) return { status: 'good', color: 'success.main' };
        if (value < 300) return { status: 'warning', color: 'warning.main' };
        return { status: 'error', color: 'error.main' };
      case 'cls':
        if (value < 0.1) return { status: 'good', color: 'success.main' };
        if (value < 0.25) return { status: 'warning', color: 'warning.main' };
        return { status: 'error', color: 'error.main' };
      default:
        return { status: 'unknown', color: 'text.secondary' };
    }
  };

  const getOptimizationSuggestions = () => {
    const suggestions = [];
    
    if (fps < 30) suggestions.push('Reduce animation complexity or disable non-essential animations');
    if (memoryUsage > memoryLimit * 0.8) suggestions.push('Implement virtual scrolling or lazy loading for large lists');
    if (fcp > 3000) suggestions.push('Optimize critical rendering path and reduce blocking resources');
    if (lcp > 4000) suggestions.push('Optimize images and reduce layout shifts during page load');
    if (fid > 300) suggestions.push('Reduce JavaScript execution time and split long tasks');
    if (cls > 0.25) suggestions.push('Avoid layout shifts by setting explicit dimensions for images and ads');
    
    return suggestions;
  };

  const chartData = performanceData.map(data => ({
    time: new Date(data.timestamp).toLocaleTimeString(),
    FPS: data.fps,
    Memory: data.memory,
    FCP: data.fcp,
    LCP: data.lcp,
    FID: data.fid,
    CLS: data.cls
  }));

  const budgetReport = budget.getReport();

  return (
    <div>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <SpeedIcon color="primary" />
              <Typography variant="h6" component="h2">
                Performance Dashboard
              </Typography>
              <Badge 
                badgeContent={Object.values(budgetReport).filter(r => r.status === 'exceeded').length} 
                color="error"
                sx={{ ml: 1 }}
              />
            </Box>
            <Box display="flex" gap={1}>
              <Tooltip title="Performance Settings">
                <IconButton onClick={() => setShowSettings(true)} size="small">
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
              <IconButton onClick={() => setExpanded(!expanded)} size="small">
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
          </Box>

          {/* Quick Status Overview */}
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color={getPerformanceStatus('fps', fps).color}>
                  {fps}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  FPS
                </Typography>
                <Chip 
                  label={getPerformanceStatus('fps', fps).status.toUpperCase()} 
                  color={getStatusColor(getPerformanceStatus('fps', fps).status) as any}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color={getPerformanceStatus('memory', memoryUsage / 1024 / 1024).color}>
                  {Math.round(memoryUsage / 1024 / 1024)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Memory (MB)
                </Typography>
                <Chip 
                  label={getPerformanceStatus('memory', memoryUsage / 1024 / 1024).status.toUpperCase()} 
                  color={getStatusColor(getPerformanceStatus('memory', memoryUsage / 1024 / 1024).status) as any}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                  {isOnline ? <WifiIcon color="success" /> : <WifiOffIcon color="error" />}
                  <Typography variant="h6" color={isOnline ? 'success.main' : 'error.main'}>
                    {isOnline ? 'ON' : 'OFF'}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Network
                </Typography>
                {connectionType && (
                  <Chip 
                    label={connectionType.toUpperCase()} 
                    color="primary"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color={isLowPerformance ? 'warning.main' : 'success.main'}>
                  {isLowPerformance ? '!' : '✓'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>
                <Chip 
                  label={isLowPerformance ? 'OPTIMIZED' : 'NORMAL'} 
                  color={isLowPerformance ? 'warning' : 'success'}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Grid>
          </Grid>

          {/* Performance Charts */}
          <Collapse in={expanded}>
            <Box mt={3}>
              <Typography variant="h6" gutterBottom>
                Performance Trends
              </Typography>
              
              <Grid container spacing={2} mb={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>
                        FPS & Memory Usage
                      </Typography>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Line type="monotone" dataKey="FPS" stroke="#8884d8" strokeWidth={2} />
                          <Line type="monotone" dataKey="Memory" stroke="#82ca9d" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>
                        Core Web Vitals
                      </Typography>
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Area type="monotone" dataKey="FCP" stackId="1" stroke="#8884d8" fill="#8884d8" />
                          <Area type="monotone" dataKey="LCP" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                          <Area type="monotone" dataKey="FID" stackId="3" stroke="#ffc658" fill="#ffc658" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Core Web Vitals Details */}
              <Typography variant="h6" gutterBottom>
                Core Web Vitals & Performance Metrics
              </Typography>
              
              <Grid container spacing={2} mb={3}>
                {[
                  { key: 'fcp', label: 'First Contentful Paint', value: fcp, unit: 'ms' },
                  { key: 'lcp', label: 'Largest Contentful Paint', value: lcp, unit: 'ms' },
                  { key: 'fid', label: 'First Input Delay', value: fid, unit: 'ms' },
                  { key: 'cls', label: 'Cumulative Layout Shift', value: cls, unit: '' },
                  { key: 'ttfb', label: 'Time to First Byte', value: ttfb, unit: 'ms' }
                ].map((metric) => {
                  const status = getPerformanceStatus(metric.key, metric.value);
                  return (
                    <Grid item xs={12} sm={6} md={4} key={metric.key}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="body2" color="text.secondary">
                              {metric.label}
                            </Typography>
                            {getStatusIcon(status.status)}
                          </Box>
                          <Typography variant="h4" color={status.color} gutterBottom>
                            {metric.value.toFixed(2)}{metric.unit}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min((metric.value / (metric.key === 'cls' ? 0.5 : 5000)) * 100, 100)}
                            color={getStatusColor(status.status) as any}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>

              {/* Bundle Optimization */}
              <Typography variant="h6" gutterBottom>
                Bundle & Module Loading
              </Typography>
              
              <Grid container spacing={2} mb={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>
                        Module Loading Progress
                      </Typography>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <StorageIcon color="primary" />
                        <Box flex={1}>
                          <Typography variant="body2">
                            {loadedModules} / {totalModules} modules loaded
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(loadedModules / totalModules) * 100}
                            sx={{ mt: 1 }}
                          />
                        </Box>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Bundle optimization: {((loadedModules / totalModules) * 100).toFixed(1)}% complete
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>
                        Performance Budget Status
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Metric</TableCell>
                              <TableCell>Budget</TableCell>
                              <TableCell>Average</TableCell>
                              <TableCell>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {Object.entries(budgetReport).map(([metric, data]) => (
                              <TableRow key={metric}>
                                <TableCell>{metric.toUpperCase()}</TableCell>
                                <TableCell>{data.budget}</TableCell>
                                <TableCell>{data.average.toFixed(2)}</TableCell>
                                <TableCell>
                                  <Chip 
                                    label={data.status} 
                                    color={data.status === 'within-budget' ? 'success' : 'error'}
                                    size="small"
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Optimization Suggestions */}
              {getOptimizationSuggestions().length > 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Optimization Suggestions:
                  </Typography>
                  <Stack spacing={1}>
                    {getOptimizationSuggestions().map((suggestion, index) => (
                      <Typography key={index} variant="body2">
                        • {suggestion}
                      </Typography>
                    ))}
                  </Stack>
                </Alert>
              )}
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      {/* Performance Settings Dialog */}
      <Dialog open={showSettings} onClose={() => setShowSettings(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <SettingsIcon />
            Performance Settings
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Configure performance monitoring and optimization settings for the HRM system.
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Monitoring Frequency
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current: Every 2 seconds
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Performance Budgets
              </Typography>
              <Typography variant="body2" color="text.secondary">
                FPS: 30, Memory: 100MB, FCP: 1.8s
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Active Optimizations
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label="Lazy Loading" color="success" size="small" />
                <Chip label="Virtual Scrolling" color="success" size="small" />
                <Chip label="Image Optimization" color="success" size="small" />
                <Chip label="Service Worker" color="success" size="small" />
                <Chip label="Bundle Splitting" color="success" size="small" />
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>Close</Button>
          <Button variant="contained" onClick={() => setShowSettings(false)}>
            Apply Settings
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PerformanceDashboard;
