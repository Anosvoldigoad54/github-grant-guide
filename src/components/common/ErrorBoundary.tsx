'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Alert,
  Divider,
  Chip,
  IconButton,
  Collapse,
} from '@mui/material'
import {
  Error as ErrorIcon,
  Refresh,
  Home,
  BugReport,
  ExpandMore,
  ExpandLess,
  ContentCopy,
} from '@mui/icons-material'
import { toast } from 'sonner'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  resetKeys?: Array<string | number>
  resetOnPropsChange?: boolean
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  showDetails: boolean
  retryCount: number
}

export class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: NodeJS.Timeout | null = null

  constructor(props: Props) {
    super(props)

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      retryCount: 0,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // Call onError callback if provided
    this.props.onError?.(error, errorInfo)

    // Report to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      // You can integrate with Sentry, LogRocket, etc. here
      console.error('Production error:', error, errorInfo)
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { resetKeys, resetOnPropsChange } = this.props
    const { hasError } = this.state

    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys?.some((key, idx) => prevProps.resetKeys?.[idx] !== key)) {
        this.resetErrorBoundary()
      }
    }

    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetErrorBoundary()
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId)
    }

    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      retryCount: prevState.retryCount + 1,
    }))
  }

  handleRetry = () => {
    toast.info('Retrying...', { description: 'Attempting to recover from the error' })
    this.resetErrorBoundary()
  }

  handleReportBug = () => {
    const { error, errorInfo } = this.state
    const errorReport = {
      error: error?.toString(),
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    }

    // Copy to clipboard
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2))
    toast.success('Error report copied to clipboard', {
      description: 'You can paste this in a bug report'
    })
  }

  handleGoHome = () => {
    window.location.href = '/dashboard'
  }

  render() {
    const { hasError, error, errorInfo, showDetails, retryCount } = this.state
    const { children, fallback } = this.props

    if (hasError) {
      if (fallback) {
        return fallback
      }

      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            background: theme => theme.palette.background.default,
          }}
        >
          <Card
            sx={{
              maxWidth: 600,
              width: '100%',
              border: theme => `1px solid ${theme.palette.error.light}`,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={3}>
                {/* Header */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <ErrorIcon sx={{ fontSize: 40, color: 'error.main' }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: 'error.main' }}>
                      Something went wrong
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      An unexpected error occurred in the application
                    </Typography>
                  </Box>
                </Stack>

                {/* Error Info */}
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    Error Details:
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                    {error?.message || 'Unknown error occurred'}
                  </Typography>
                </Alert>

                {/* Retry Count */}
                {retryCount > 0 && (
                  <Chip
                    label={`Retry attempts: ${retryCount}`}
                    color="warning"
                    size="small"
                    sx={{ alignSelf: 'flex-start' }}
                  />
                )}

                {/* Actions */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={this.handleRetry}
                    color="primary"
                  >
                    Try Again
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Home />}
                    onClick={this.handleGoHome}
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<BugReport />}
                    onClick={this.handleReportBug}
                    color="error"
                  >
                    Report Bug
                  </Button>
                </Stack>

                <Divider />

                {/* Technical Details (Collapsible) */}
                <Box>
                  <Button
                    startIcon={showDetails ? <ExpandLess /> : <ExpandMore />}
                    onClick={() => this.setState({ showDetails: !showDetails })}
                    size="small"
                    color="inherit"
                  >
                    Technical Details
                  </Button>
                  
                  <Collapse in={showDetails}>
                    <Box sx={{ mt: 2 }}>
                      <Alert severity="info" sx={{ borderRadius: 2 }}>
                        <Stack spacing={2}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                              Error Stack:
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: 'monospace',
                                fontSize: '0.75rem',
                                maxHeight: 200,
                                overflow: 'auto',
                                whiteSpace: 'pre-wrap',
                                backgroundColor: 'rgba(0,0,0,0.05)',
                                p: 2,
                                borderRadius: 1,
                              }}
                            >
                              {error?.stack || 'No stack trace available'}
                            </Typography>
                          </Box>

                          {errorInfo?.componentStack && (
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                Component Stack:
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontFamily: 'monospace',
                                  fontSize: '0.75rem',
                                  maxHeight: 200,
                                  overflow: 'auto',
                                  whiteSpace: 'pre-wrap',
                                  backgroundColor: 'rgba(0,0,0,0.05)',
                                  p: 2,
                                  borderRadius: 1,
                                }}
                              >
                                {errorInfo.componentStack}
                              </Typography>
                            </Box>
                          )}

                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="caption" color="text.secondary">
                              Copy error details to clipboard
                            </Typography>
                            <IconButton size="small" onClick={this.handleReportBug}>
                              <ContentCopy fontSize="small" />
                            </IconButton>
                          </Stack>
                        </Stack>
                      </Alert>
                    </Box>
                  </Collapse>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      )
    }

    return children
  }
}

// Higher-order component for easy wrapping
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}

export default ErrorBoundary
