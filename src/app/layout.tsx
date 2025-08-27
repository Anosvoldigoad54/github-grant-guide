'use client'

import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { PrimeReactProvider } from 'primereact/api'
import { theme } from '@/theme'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'sonner'

// PrimeReact CSS
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

// Rewind-UI CSS
import '@rewind-ui/core/dist/css/styles.css'

// Custom global styles
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <PrimeReactProvider>
            <AuthProvider>
              {children}
              <Toaster 
                position="top-right"
                richColors
                closeButton
                duration={4000}
                theme="light"
              />
            </AuthProvider>
          </PrimeReactProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
