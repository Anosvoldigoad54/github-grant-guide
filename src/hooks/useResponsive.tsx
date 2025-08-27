'use client'

import { useTheme, useMediaQuery, Breakpoint, Theme } from '@mui/material'
import { useMemo } from 'react'

export interface ResponsiveConfig {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isSmallMobile: boolean
  isLargeMobile: boolean
  isSmallTablet: boolean
  isLargeTablet: boolean
  isSmallDesktop: boolean
  isLargeDesktop: boolean
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  width: number
  height: number
  orientation: 'portrait' | 'landscape'
  isTouch: boolean
}

export interface ResponsiveUtils {
  // Grid system utilities
  getGridColumns: (xs: number, sm?: number, md?: number, lg?: number, xl?: number) => {
    xs: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  
  // Spacing utilities
  getSpacing: (xs: number, sm?: number, md?: number, lg?: number) => number
  getPadding: (xs: number, sm?: number, md?: number, lg?: number) => number | string
  getMargin: (xs: number, sm?: number, md?: number, lg?: number) => number | string
  
  // Typography utilities
  getFontSize: (xs: string, sm?: string, md?: string, lg?: string) => string
  getVariant: (xs: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'button' | 'overline', 
               sm?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'button' | 'overline', 
               md?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'button' | 'overline') => 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'button' | 'overline'
  
  // Layout utilities
  getFlexDirection: (xs: 'row' | 'column', sm?: 'row' | 'column', md?: 'row' | 'column') => 'row' | 'column'
  getDisplayValue: (xs: string, sm?: string, md?: string) => string
  getMaxWidth: (xs?: string | number, sm?: string | number, md?: string | number) => string | number
  
  // Conditional rendering utilities
  showOnMobile: () => boolean
  showOnTablet: () => boolean
  showOnDesktop: () => boolean
  hideOnMobile: () => boolean
  hideOnTablet: () => boolean
  hideOnDesktop: () => boolean
  
  // Content utilities
  getTruncation: (lines: number) => object
  getImageSize: (xs: number, sm?: number, md?: number) => { width: number; height: number }
  
  // Navigation utilities
  getNavigationMode: () => 'drawer' | 'sidebar' | 'bottomNav'
  getSidebarWidth: () => number
  getAppBarHeight: () => number
  
  // Form utilities
  getInputSize: () => 'small' | 'medium'
  getButtonSize: () => 'small' | 'medium' | 'large'
  getDialogMaxWidth: () => 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
  getDialogFullScreen: () => boolean
}

export function useResponsive(): ResponsiveConfig & ResponsiveUtils {
  const theme = useTheme()
  
  // Media queries for all breakpoints
  const isXs = useMediaQuery(theme.breakpoints.only('xs'))
  const isSm = useMediaQuery(theme.breakpoints.only('sm'))
  const isMd = useMediaQuery(theme.breakpoints.only('md'))
  const isLg = useMediaQuery(theme.breakpoints.only('lg'))
  const isXl = useMediaQuery(theme.breakpoints.only('xl'))
  
  // Range queries - Fixed overlapping breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'))
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  
  // Specific size queries
  const isSmallMobile = useMediaQuery('(max-width: 480px)')
  const isLargeMobile = useMediaQuery('(min-width: 481px) and (max-width: 767px)')
  const isSmallTablet = useMediaQuery('(min-width: 768px) and (max-width: 959px)')
  const isLargeTablet = useMediaQuery('(min-width: 960px) and (max-width: 1199px)')
  const isSmallDesktop = useMediaQuery('(min-width: 1200px) and (max-width: 1439px)')
  const isLargeDesktop = useMediaQuery('(min-width: 1440px)')
  
  // Orientation
  const isLandscape = useMediaQuery('(orientation: landscape)')
  const isPortrait = useMediaQuery('(orientation: portrait)')
  
  // Touch detection
  const isTouch = useMediaQuery('(pointer: coarse)')
  
  // Window dimensions
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800

  // Determine current breakpoint
  const breakpoint = useMemo((): 'xs' | 'sm' | 'md' | 'lg' | 'xl' => {
    if (isXs) return 'xs'
    if (isSm) return 'sm'
    if (isMd) return 'md'
    if (isLg) return 'lg'
    return 'xl'
  }, [isXs, isSm, isMd, isLg])

  // Utility functions
  const getGridColumns = (xs: number, sm?: number, md?: number, lg?: number, xl?: number) => {
    const result: any = { xs }
    if (sm !== undefined) result.sm = sm
    if (md !== undefined) result.md = md
    if (lg !== undefined) result.lg = lg
    if (xl !== undefined) result.xl = xl
    return result
  }

  const getSpacing = (xs: number, sm?: number, md?: number, lg?: number): number => {
    if (isLargeDesktop && lg !== undefined) return lg
    if (isDesktop && md !== undefined) return md
    if (isTablet && sm !== undefined) return sm
    return xs
  }

  const getPadding = (xs: number, sm?: number, md?: number, lg?: number) => {
    if (isMobile) return xs
    if (isTablet && sm !== undefined) return sm
    if (isDesktop && md !== undefined) return md
    if (isLargeDesktop && lg !== undefined) return lg
    return xs
  }

  const getMargin = (xs: number, sm?: number, md?: number, lg?: number) => {
    return getPadding(xs, sm, md, lg)
  }

  const getFontSize = (xs: string, sm?: string, md?: string, lg?: string): string => {
    if (typeof window === 'undefined') return xs
    
    if (isMobile) return xs
    if (isTablet && sm) return sm
    if (isDesktop && md) return md
    if (isLargeDesktop && lg) return lg
    return xs
  }

    const getVariant = (xs: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'button' | 'overline', 
                sm?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'button' | 'overline', 
                md?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'button' | 'overline'): 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2' | 'caption' | 'button' | 'overline' => {
    if (isMobile) return xs
    if (isTablet && sm) return sm
    if (isDesktop && md) return md
    return xs
  }

  const getFlexDirection = (xs: 'row' | 'column', sm?: 'row' | 'column', md?: 'row' | 'column'): 'row' | 'column' => {
    if (isMobile) return xs
    if (isTablet && sm) return sm
    if (isDesktop && md) return md
    return xs
  }

  const getDisplayValue = (xs: string, sm?: string, md?: string): string => {
    if (isMobile) return xs
    if (isTablet && sm) return sm
    if (isDesktop && md) return md
    return xs
  }

  const getMaxWidth = (xs?: string | number, sm?: string | number, md?: string | number): string | number => {
    if (isMobile && xs !== undefined) return xs
    if (isTablet && sm !== undefined) return sm
    if (isDesktop && md !== undefined) return md
    return xs || sm || md || '100%'
  }

  // Conditional rendering utilities
  const showOnMobile = () => isMobile
  const showOnTablet = () => isTablet
  const showOnDesktop = () => isDesktop
  const hideOnMobile = () => !isMobile
  const hideOnTablet = () => !isTablet
  const hideOnDesktop = () => !isDesktop

  // Content utilities
  const getTruncation = (lines: number = 1) => ({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical' as const,
    lineClamp: lines
  })

  const getImageSize = (xs: number, sm?: number, md?: number) => {
    const size = getSpacing(xs, sm, md)
    return { width: size, height: size }
  }

  // Navigation utilities
  const getNavigationMode = (): 'drawer' | 'sidebar' | 'bottomNav' => {
    if (isSmallMobile) return 'bottomNav'
    if (isMobile) return 'drawer'
    return 'sidebar'
  }

  const getSidebarWidth = (): number => {
    if (isMobile) return 280
    if (isTablet) return 300
    return 320
  }

  const getAppBarHeight = (): number => {
    if (isMobile) return 56
    return 64
  }

  // Form utilities
  const getInputSize = (): 'small' | 'medium' => {
    return isMobile ? 'small' : 'medium'
  }

  const getButtonSize = (): 'small' | 'medium' | 'large' => {
    if (isSmallMobile) return 'small'
    if (isMobile) return 'medium'
    return 'large'
  }

  const getDialogMaxWidth = (): 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false => {
    if (isSmallMobile) return 'xs'
    if (isMobile) return 'sm'
    if (isTablet) return 'md'
    return 'lg'
  }

  const getDialogFullScreen = (): boolean => {
    return isSmallMobile
  }

  return {
    // Configuration
    isMobile,
    isTablet,
    isDesktop,
    isSmallMobile,
    isLargeMobile,
    isSmallTablet,
    isLargeTablet,
    isSmallDesktop,
    isLargeDesktop,
    breakpoint,
    width: windowWidth,
    height: windowHeight,
    orientation: isLandscape ? 'landscape' : 'portrait',
    isTouch,
    
    // Utilities
    getGridColumns,
    getSpacing,
    getPadding,
    getMargin,
    getFontSize,
    getVariant,
    getFlexDirection,
    getDisplayValue,
    getMaxWidth,
    showOnMobile,
    showOnTablet,
    showOnDesktop,
    hideOnMobile,
    hideOnTablet,
    hideOnDesktop,
    getTruncation,
    getImageSize,
    getNavigationMode,
    getSidebarWidth,
    getAppBarHeight,
    getInputSize,
    getButtonSize,
    getDialogMaxWidth,
    getDialogFullScreen,
  }
}

// Higher-order component for responsive behavior
export function withResponsive<P extends object>(
  Component: React.ComponentType<P & { responsive: ResponsiveConfig & ResponsiveUtils }>
) {
  return function ResponsiveComponent(props: P) {
    const responsive = useResponsive()
    return <Component {...props} responsive={responsive} />
  }
}

// Responsive breakpoint constants
export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
} as const

// Common responsive patterns
export const RESPONSIVE_PATTERNS = {
  // Grid columns for common layouts
  GRID_COLUMNS: {
    cards: { xs: 12, sm: 6, md: 4, lg: 3 },
    split: { xs: 12, md: 6 },
    sidebar: { xs: 12, md: 4, lg: 3 },
    main: { xs: 12, md: 8, lg: 9 },
    full: { xs: 12 },
  },
  
  // Common spacing values
  SPACING: {
    section: { xs: 2, sm: 3, md: 4 },
    component: { xs: 1, sm: 2, md: 3 },
    card: { xs: 2, sm: 3, md: 4 },
    dialog: { xs: 2, sm: 3, md: 4 },
  },
  
  // Typography variants by device
  TYPOGRAPHY: {
    hero: { xs: 'h4', sm: 'h3', md: 'h2' },
    title: { xs: 'h5', sm: 'h4', md: 'h3' },
    subtitle: { xs: 'h6', sm: 'h5', md: 'h4' },
    body: { xs: 'body2', sm: 'body1' },
  },
  
  // Button sizes
  BUTTON_SIZE: {
    primary: { xs: 'medium', md: 'large' },
    secondary: { xs: 'small', md: 'medium' },
    icon: { xs: 'small', md: 'medium' },
  },
} as const

export default useResponsive
