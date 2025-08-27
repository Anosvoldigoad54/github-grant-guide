# 🏢 Arise HRM - Advanced Human Resource Management System

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-7.2.0-blue.svg)](https://mui.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.43.4-green.svg)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-7.0.6-purple.svg)](https://vitejs.dev/)

A comprehensive, mobile-first Human Resource Management System built with React, TypeScript, and Supabase. Features advanced authentication, responsive design, real-time data, and complete HR workflow management.

## ✨ Features

### 🔐 **Advanced Authentication & Security**
- Multi-factor authentication with biometric support
- Device fingerprinting and trust management
- Session monitoring and security risk assessment
- Role-based access control (RBAC) with granular permissions
- RLS (Row Level Security) bypass with fallback mechanisms

### 📱 **Mobile-First Responsive Design**
- Optimized for all device sizes (mobile, tablet, desktop)
- Progressive Web App (PWA) capabilities
- Touch-friendly interfaces and gestures
- Adaptive navigation (drawer, sidebar, bottom tabs)
- React Native compatibility preparation

### 👥 **Employee Management**
- Advanced employee directory with smart search
- Complete employee lifecycle management
- Interactive organization chart
- Employee onboarding and offboarding workflows
- Skill tracking and competency mapping

### ⏰ **Smart Attendance System**
- GPS-based location verification
- Photo verification for clock-in/out
- Biometric integration support
- Offline attendance capability
- Automated attendance pattern analysis

### 🗓️ **Leave Management**
- Intelligent leave request system with conflict detection
- Multi-level approval workflows
- Team leave calendar with conflict resolution
- Automated leave balance calculations
- Predictive leave planning

### 💰 **Payroll & Benefits**
- Automated payroll processing
- Tax calculations and compliance
- Benefits enrollment and management
- Expense management system
- Compensation benchmarking tools

### 📊 **Analytics & Reporting**
- Real-time dashboard with customizable widgets
- Advanced HR analytics and insights
- Predictive analytics with ML integration
- Custom report builder
- Data visualization with interactive charts

### ⚙️ **System Administration**
- Comprehensive settings management
- User account creation and management
- Database administration panel
- Backup and recovery systems
- Audit logging and compliance

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Supabase** account ([Sign up](https://supabase.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/arise-hrm.git
   cd arise-hrm
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your Supabase credentials
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   - Create a new Supabase project
   - Run the database migration scripts (see [Database Setup](#database-setup))
   - Configure RLS policies

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

### Default Login Credentials

For demo purposes, you can use:
- **Email**: `admin@arisehrm.com`
- **Password**: `admin123456`

*Note: Change these credentials in production*

## 📁 Project Structure

```
arise-hrm/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── admin/         # Admin panel components
│   │   ├── analytics/     # Analytics & reporting
│   │   ├── attendance/    # Attendance management
│   │   ├── auth/          # Authentication components
│   │   ├── benefits/      # Benefits management
│   │   ├── common/        # Shared/reusable components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── documents/     # Document management
│   │   ├── employees/     # Employee management
│   │   ├── layout/        # Layout components
│   │   ├── leave/         # Leave management
│   │   ├── onboarding/    # Employee onboarding
│   │   ├── organization/  # Org chart & structure
│   │   ├── payroll/       # Payroll management
│   │   ├─�� performance/   # Performance reviews
│   │   ├── recruitment/   # Recruitment & hiring
│   │   ├── selfservice/   # Employee self-service
│   │   ├── settings/      # System settings
│   │   └── training/      # Training & development
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Third-party library configs
│   ├── services/          # API services & data layer
│   ├── styles/            # Global styles & themes
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── App.tsx            # Main application component
├── .env.example           # Environment variables template
├── package.json           # Dependencies & scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite build configuration
```

## 🗄️ Database Setup

### Supabase Configuration

1. **Create Supabase Project**
   - Go to [Supabase Dashboard](https://app.supabase.com/)
   - Create a new project
   - Copy your project URL and anon key

2. **Database Schema**
   The system includes comprehensive database schemas for:
   - User profiles and authentication
   - Employee management
   - Attendance tracking
   - Leave management
   - Payroll and benefits
   - Performance reviews
   - Audit logs and security

3. **RLS Policies**
   Row Level Security policies are implemented for:
   - Data isolation by organization
   - Role-based data access
   - Security audit trails

### Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: Additional Configuration
VITE_APP_NAME=Arise HRM
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=true
```

## 🎨 Theming & Customization

### Theme Configuration

The system supports extensive theming:

```typescript
// src/styles/Theme/tokens.ts
export const designTokens = {
  colors: {
    primary: '#667eea',
    secondary: '#764ba2',
    // ... more colors
  },
  fontFamily: {
    primary: 'Inter, sans-serif',
    // ... more fonts
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    // ... more sizes
  }
}
```

### Responsive Breakpoints

```typescript
// Customizable breakpoints in useResponsive hook
export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
}
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run end-to-end tests

# Utilities
npm run clean        # Clean build artifacts
npm run analyze      # Analyze bundle size
```

### Code Quality

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Husky** for git hooks
- **Conventional Commits** for commit standards

### Testing Strategy

```bash
# Unit Tests (Jest + React Testing Library)
npm run test

# E2E Tests (Playwright)
npm run test:e2e

# Visual Regression Tests
npm run test:visual
```

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# Serve the built application
npm run preview
```

### Deployment Options

#### 1. **Vercel** (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### 2. **Netlify**
```bash
# Build command: npm run build
# Publish directory: dist
```

#### 3. **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Environment Configuration

Production environment variables:

```env
# Production Supabase
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-prod-anon-key

# Analytics & Monitoring
VITE_ANALYTICS_ID=your-analytics-id
VITE_SENTRY_DSN=your-sentry-dsn

# Feature Flags
VITE_ENABLE_BETA_FEATURES=false
VITE_MAINTENANCE_MODE=false
```

## 🔒 Security

### Security Features

- **Authentication**: Multi-factor with biometric support
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Row-level security (RLS)
- **Audit Trails**: Comprehensive logging
- **Device Security**: Fingerprinting and trust management
- **Session Management**: Advanced session monitoring

### Security Best Practices

1. **Never commit secrets** to version control
2. **Use environment variables** for configuration
3. **Implement proper RLS policies** in Supabase
4. **Regular security audits** and updates
5. **Monitor failed login attempts** and suspicious activity

## 📱 Mobile Development

### Progressive Web App (PWA)

The application is PWA-ready with:
- Service worker for offline functionality
- App manifest for installation
- Push notifications support
- Background sync capabilities

### React Native Preparation

Components are designed for React Native compatibility:
- Shared component library structure
- Platform-agnostic styling approach
- Responsive design patterns
- Cross-platform state management

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add employee bulk import functionality
fix: resolve attendance calculation bug
docs: update API documentation
style: format code with prettier
refactor: optimize database queries
test: add unit tests for payroll module
```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Automatic formatting
- **Component Structure**: Functional components with hooks
- **File Naming**: PascalCase for components, camelCase for utilities

## 📊 Performance

### Optimization Features

- **Code Splitting**: Lazy loading of route components
- **Tree Shaking**: Automatic dead code elimination
- **Bundle Analysis**: Webpack bundle analyzer
- **Image Optimization**: Automatic image compression
- **Caching**: Service worker with caching strategies

### Performance Metrics

Target performance benchmarks:
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.0s
- **Bundle Size**: < 500KB gzipped

## 🐛 Troubleshooting

### Common Issues

#### 1. **Database Connection Issues**
```bash
# Check environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Test database connection
npm run test:db
```

#### 2. **Build Errors**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
npm run clean
```

#### 3. **TypeScript Errors**
```bash
# Run type checking
npm run type-check

# Update TypeScript
npm update typescript
```

### Debug Mode

Enable debug mode for detailed logging:

```env
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

## 📞 Support

### Getting Help

- **Documentation**: [Full Documentation](https://docs.arisehrm.com)
- **Issues**: [GitHub Issues](https://github.com/your-org/arise-hrm/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/arise-hrm/discussions)
- **Email**: support@arisehrm.com

### Community

- **Discord**: [Join our Discord](https://discord.gg/arisehrm)
- **Twitter**: [@AriseHRM](https://twitter.com/arisehrm)
- **LinkedIn**: [Arise HRM](https://linkedin.com/company/arisehrm)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Material-UI Team** for the beautiful component library
- **Supabase Team** for the excellent backend-as-a-service
- **Open Source Community** for inspiration and contributions

---

<div align="center">
  <strong>Built with ❤️ by the Arise HRM Team</strong>
  <br>
  <br>
  <a href="https://arisehrm.com">Website</a> •
  <a href="https://docs.arisehrm.com">Documentation</a> •
  <a href="https://demo.arisehrm.com">Live Demo</a>
</div>
