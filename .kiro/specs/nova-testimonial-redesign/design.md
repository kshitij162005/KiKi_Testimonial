# Design Document

## Overview

This design document outlines the technical architecture and implementation approach for redesigning Nova Testimonial into a modern, high-performance application. The redesign transforms the current React/Express application into a 2026-ready product with a minimal dark UI, optimized performance, and enhanced security.

The design maintains the existing MongoDB database and core business logic while modernizing the frontend with React.js + Vite, implementing a new design system with Tailwind CSS and shadcn/ui, and hardening the backend with security best practices.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   React + Vite  │◄──►│   Express API   │◄──►│   Services      │
│                 │    │   /api/v1       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌────▼────┐             ┌────▼────┐             ┌────▼────┐
    │ Tailwind│             │ MongoDB │             │Cloudinary│
    │shadcn/ui│             │Mongoose │             │ Stripe  │
    │ Framer  │             │  Redis  │             │ SendGrid│
    └─────────┘             └─────────┘             └─────────┘
```

### Frontend Architecture

- **Framework**: React.js 18+ with React Router v6
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom design tokens
- **Components**: shadcn/ui built on Radix primitives
- **State Management**: React Context + useReducer for global state
- **Animations**: Framer Motion (minimal usage for micro-interactions)
- **Performance**: Code-splitting, lazy loading, and bundle optimization

### Backend Architecture

- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM (existing)
- **Caching**: Redis for rate limiting and session management
- **Validation**: Zod schemas for request/response validation
- **Security**: Helmet, CORS, rate limiting, input sanitization
- **Logging**: Pino structured logging with request IDs
- **File Storage**: Cloudinary for media uploads and transformations

## Components and Interfaces

### Design System Components

#### Core Components (shadcn/ui based)

```typescript
// Button variants following design tokens
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger'
  size: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

// Card component for consistent layouts
interface CardProps {
  variant: 'default' | 'hover' | 'interactive'
  padding: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

// Input components with validation states
interface InputProps {
  variant: 'default' | 'error' | 'success'
  label?: string
  error?: string
  required?: boolean
}
```

#### Navigation Components

```typescript
// Top navigation with command menu integration
interface TopNavProps {
  user?: User
  onCommandMenuOpen: () => void
}

// Side navigation for app pages
interface SideNavProps {
  currentPath: string
  spaces: Space[]
  collapsed?: boolean
}

// Command menu for quick navigation (⌘K)
interface CommandMenuProps {
  isOpen: boolean
  onClose: () => void
  commands: Command[]
}
```

#### Testimonial Components

```typescript
// Testimonial card for displaying feedback
interface TestimonialCardProps {
  testimonial: Testimonial
  variant: 'compact' | 'detailed' | 'widget'
  actions?: TestimonialAction[]
}

// Widget configurator for embed generation
interface EmbedConfiguratorProps {
  spaceId: string
  widgetType: 'carousel' | 'grid' | 'masonry' | 'badge'
  onConfigChange: (config: WidgetConfig) => void
}

// Masonry grid for testimonial library
interface MasonryGridProps {
  testimonials: Testimonial[]
  columns: number
  gap: number
  onTestimonialClick: (testimonial: Testimonial) => void
}

// Star rating component for feedback collection
interface StarRatingProps {
  rating: number
  onRatingChange: (rating: number) => void
  size?: 'sm' | 'md' | 'lg'
  readonly?: boolean
  showLabel?: boolean
}

// Enhanced feedback collection form
interface FeedbackFormProps {
  spaceData: Space
  onSubmit: (feedback: FeedbackSubmission) => void
  loading?: boolean
}

// Feedback submission interface
interface FeedbackSubmission {
  name: string
  email: string
  rating?: number
  responses: string[]
  feedbackType: 'text' | 'video'
}
```

### Page Components Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── layout/            # Navigation, headers, footers
│   ├── testimonial/       # Testimonial-specific components
│   ├── forms/             # Form components with validation
│   └── charts/            # Analytics visualization
├── pages/
│   ├── marketing/         # Landing, pricing, templates
│   ├── auth/              # Login, signup, reset
│   ├── dashboard/         # Main dashboard
│   ├── spaces/            # Space management
│   └── settings/          # User settings
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configurations
├── styles/                # Tailwind config and globals
└── types/                 # TypeScript definitions
```

## Data Models

### Enhanced User Model

```typescript
interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  phoneNum?: string
  password: string
  avatar?: string
  plan: 'free' | 'pro' | 'enterprise'
  quotas: {
    spaces: number
    testimonials: number
    storage: number // in MB
  }
  preferences: {
    theme: 'dark' // Only dark theme supported
    notifications: NotificationSettings
    privacy: PrivacySettings
  }
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}
```

### Enhanced Space Model

```typescript
interface Space {
  _id: string
  name: string
  slug: string // URL-friendly identifier
  publicUrl: string // Legacy field for backward compatibility
  description?: string
  brand: {
    logo?: string
    primaryColor: string
    secondaryColor: string
    fontFamily: string
  }
  settings: {
    collectText: boolean
    collectVideo: boolean
    requireApproval: boolean
    allowRatings: boolean
    maxVideoLength: number // seconds
    customQuestions: string[]
  }
  integrations: {
    webhook?: string
    zapier?: boolean
    slack?: string
  }
  quotas: {
    testimonials: number
    storage: number // in MB
  }
  owners: string[] // User IDs
  members: SpaceMember[]
  createdAt: Date
  updatedAt: Date
}

interface SpaceMember {
  userId: string
  role: 'admin' | 'moderator' | 'viewer'
  addedAt: Date
}
```

### Enhanced Testimonial Model

```typescript
interface Testimonial {
  _id: string
  spaceId: string
  type: 'video' | 'text'
  
  // Content
  text?: string
  videoUrl?: string
  posterUrl?: string // Auto-generated for videos
  duration?: number // For videos, in seconds
  
  // Author information
  author: {
    name: string
    email: string
    avatar?: string
    title?: string
    company?: string
  }
  
  // Metadata
  rating?: number // 1-5 stars
  tags: string[]
  sentiment?: 'positive' | 'neutral' | 'negative'
  transcript?: string // AI-generated for videos
  
  // Status and moderation
  status: 'pending' | 'approved' | 'rejected' | 'archived'
  featured: boolean
  moderatedBy?: string // User ID
  moderatedAt?: Date
  
  // Analytics
  views: number
  plays: number // For videos
  watchThrough: number // Percentage for videos
  
  // Responses to custom questions
  responses: {
    question: string
    answer: string
  }[]
  
  // Timestamps
  submittedAt: Date
  createdAt: Date
  updatedAt: Date
}

### Enhanced Feedback Collection Model

```typescript
interface FeedbackSchema {
  name: string
  email: string
  rating?: number // 1-5 star rating when enabled
  responses: {
    question: string
    answer: string
  }[]
  feedbackType: 'text' | 'video'
  video?: string // Cloudinary URL for video testimonials
  submittedAt: Date
}

interface Space {
  _id: string
  spacename: string
  publicUrl: string
  headerTitle: string
  customMessage: string
  questions: string[]
  starRatings: boolean // Enable/disable star ratings
  
  // Enhanced branding options
  branding: {
    logo?: string
    primaryColor: string
    backgroundColor: string
    textColor: string
    accentColor: string
  }
  
  // Collection settings
  settings: {
    requireEmail: boolean
    requireName: boolean
    allowVideo: boolean
    maxVideoLength: number // seconds
    autoApprove: boolean
  }
  
  feedback: FeedbackSchema[]
  user_Id: string
  createdAt: Date
  updatedAt: Date
}
```

### Widget Model

```typescript
interface Widget {
  _id: string
  spaceId: string
  name: string
  type: 'carousel' | 'grid' | 'masonry' | 'badge'
  
  config: {
    // Display settings
    maxItems: number
    showRatings: boolean
    showAvatars: boolean
    showCompany: boolean
    autoplay?: boolean // For carousel
    
    // Filtering
    tags: string[]
    minRating?: number
    featuredOnly: boolean
    
    // Styling
    theme: 'light' | 'dark' | 'auto'
    primaryColor: string
    borderRadius: number
    spacing: number
  }
  
  // Generated embed code
  embedCode: string
  
  // Analytics
  views: number
  clicks: number
  
  createdAt: Date
  updatedAt: Date
}
```

### Analytics Model

```typescript
interface AnalyticsEvent {
  _id: string
  spaceId: string
  testimonialId?: string
  widgetId?: string
  
  event: 'view' | 'play' | 'click' | 'share' | 'embed_view'
  
  // Context
  source: {
    url: string
    referrer?: string
    userAgent: string
    ip: string // Hashed for privacy
  }
  
  // Additional data
  metadata: Record<string, any>
  
  timestamp: Date
}

interface AnalyticsAggregate {
  _id: string
  spaceId: string
  date: Date // Daily aggregates
  
  metrics: {
    views: number
    plays: number
    clicks: number
    shares: number
    avgWatchThrough: number
    topSources: { url: string; count: number }[]
    topTestimonials: { testimonialId: string; views: number }[]
  }
}
```

## Error Handling

### Frontend Error Boundaries

```typescript
// Global error boundary for unhandled errors
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

// API error handling with user-friendly messages
interface APIError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: Date
}

// Form validation errors
interface ValidationError {
  field: string
  message: string
  code: string
}
```

### Backend Error Handling

```typescript
// Structured error responses
interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: Record<string, any>
    requestId: string
  }
  meta?: {
    pagination?: PaginationMeta
    timestamp: Date
  }
}

// Error middleware with proper logging
class AppError extends Error {
  statusCode: number
  code: string
  isOperational: boolean
  
  constructor(message: string, statusCode: number, code: string) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = true
  }
}
```

## Testing Strategy

### Frontend Testing

1. **Unit Tests**: Jest + React Testing Library
   - Component rendering and behavior
   - Custom hooks functionality
   - Utility functions
   - Form validation logic

2. **Integration Tests**: 
   - API integration with MSW (Mock Service Worker)
   - User workflows (auth, space creation, testimonial management)
   - Navigation and routing

3. **E2E Tests**: Playwright
   - Critical user journeys
   - Cross-browser compatibility
   - Performance testing
   - Accessibility testing

### Backend Testing

1. **Unit Tests**: Jest + Supertest
   - API endpoint functionality
   - Database operations
   - Validation schemas
   - Utility functions

2. **Integration Tests**:
   - Database integration
   - External service integration (Cloudinary, Stripe)
   - Authentication and authorization
   - Rate limiting

3. **Load Testing**: Artillery
   - API performance under load
   - Database query optimization
   - Memory usage and leaks

### Performance Testing

1. **Lighthouse CI**: Automated performance audits
2. **Bundle Analysis**: Webpack Bundle Analyzer for Vite
3. **Core Web Vitals**: Real User Monitoring with web-vitals
4. **Database Performance**: Query analysis and optimization

## Security Considerations

### Frontend Security

1. **Content Security Policy**: Strict CSP headers
2. **XSS Prevention**: Sanitized user inputs and outputs
3. **CSRF Protection**: SameSite cookies and CSRF tokens
4. **Secure Storage**: Encrypted localStorage for sensitive data

### Backend Security

1. **Input Validation**: Zod schemas for all endpoints
2. **Rate Limiting**: Redis-backed rate limiting per IP/user
3. **Authentication**: JWT with refresh tokens and secure storage
4. **Authorization**: Role-based access control (RBAC)
5. **Data Encryption**: Encrypted sensitive fields in database
6. **Audit Logging**: Comprehensive audit trail for sensitive operations

### Infrastructure Security

1. **HTTPS Only**: Force HTTPS in production
2. **Security Headers**: Helmet.js for security headers
3. **Environment Variables**: Secure secret management
4. **Database Security**: Connection encryption and access controls

## Performance Optimizations

### Frontend Optimizations

1. **Code Splitting**: Route-based and component-based splitting
2. **Lazy Loading**: Images, components, and routes
3. **Bundle Optimization**: Tree-shaking and dead code elimination
4. **Caching Strategy**: Service worker for static assets
5. **Image Optimization**: WebP format with fallbacks
6. **Font Optimization**: Preload critical fonts

### Backend Optimizations

1. **Database Indexing**: Optimized indexes for common queries
2. **Query Optimization**: Aggregation pipelines and efficient queries
3. **Caching**: Redis for frequently accessed data
4. **CDN Integration**: Cloudinary for media delivery
5. **Compression**: Gzip/Brotli compression for responses
6. **Connection Pooling**: Optimized database connections

### Monitoring and Analytics

1. **Application Monitoring**: Error tracking and performance monitoring
2. **Database Monitoring**: Query performance and resource usage
3. **User Analytics**: Privacy-compliant usage analytics
4. **Performance Metrics**: Core Web Vitals and custom metrics

## Enhanced Feedback Collection Interface Design

### Modern UI Components

The feedback collection page will feature a completely redesigned interface using the established design system:

#### Layout Structure
```
┌─────────────────────────────────────────┐
│              Header Section             │
│         Logo + Space Branding           │
├─────────────────────────────────────────┤
│              Hero Section               │
│        Title + Custom Message           │
├─────────────────────────────────────────┤
│            Feedback Form                │
│  ┌─────────────────────────────────┐    │
│  │     Personal Information        │    │
│  │   Name + Email (with icons)     │    │
│  ├─────────────────────────────────┤    │
│  │       Star Rating Section       │    │
│  │    ⭐⭐⭐⭐⭐ (interactive)      │    │
│  ├─────────────────────────────────┤    │
│  │      Custom Questions           │    │
│  │  Dynamic textarea components    │    │
│  ├─────────────────────────────────┤    │
│  │      Submit Button              │    │
│  │   (with loading states)         │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

#### Star Rating Component Design

```typescript
// Interactive star rating with hover effects
const StarRating = ({ rating, onRatingChange, readonly = false }) => {
  const [hoverRating, setHoverRating] = useState(0)
  
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={`
            w-8 h-8 transition-all duration-200 ease-out
            ${(hoverRating || rating) >= star 
              ? 'text-yellow-400 scale-110' 
              : 'text-gray-600 hover:text-yellow-300'
            }
            ${!readonly && 'hover:scale-125 cursor-pointer'}
          `}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          onClick={() => !readonly && onRatingChange(star)}
        >
          ⭐
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-400">
        {rating ? `${rating}/5` : 'Rate your experience'}
      </span>
    </div>
  )
}
```

#### Form Validation and UX

- **Real-time validation**: Email format, required fields
- **Progressive disclosure**: Questions appear with smooth animations
- **Loading states**: Button shows spinner during submission
- **Success feedback**: Animated checkmark with success message
- **Error handling**: Clear error messages with retry options

#### Responsive Design

- **Mobile-first**: Optimized for touch interactions
- **Tablet**: Larger form elements, better spacing
- **Desktop**: Centered layout with optimal reading width

### Backend API Enhancements

#### Enhanced Feedback Endpoint

```javascript
// POST /api/v1/space/:publicUrl/feedback
{
  name: string,
  email: string,
  rating?: number, // 1-5 stars (optional based on space settings)
  responses: string[],
  feedbackType: 'text' | 'video'
}

// Response includes validation and success confirmation
{
  success: boolean,
  message: string,
  feedback: {
    id: string,
    submittedAt: Date,
    rating?: number
  }
}
```

#### Star Rating Analytics

```javascript
// GET /api/v1/space/:publicUrl/analytics/ratings
{
  averageRating: number,
  totalRatings: number,
  ratingDistribution: {
    1: number,
    2: number,
    3: number,
    4: number,
    5: number
  },
  trendData: {
    date: string,
    averageRating: number,
    count: number
  }[]
}
```

## Migration Strategy

### Phase 1: Foundation (Weeks 1-2)
- Set up new React + Vite project structure
- Implement design system with Tailwind and shadcn/ui
- Create core components and layouts
- Set up development environment and tooling

### Phase 2: Backend Hardening (Weeks 3-4)
- Implement API versioning (/api/v1)
- Add Zod validation and error handling
- Implement security middleware and rate limiting
- Set up structured logging and monitoring

### Phase 3: Core Features (Weeks 5-8)
- Migrate authentication and user management
- Implement space management with new features
- Build testimonial collection and moderation
- Create widget system with live preview

### Phase 4: Advanced Features (Weeks 9-10)
- Implement analytics dashboard
- Add team collaboration features
- Build billing and subscription management
- Optimize performance and accessibility

### Phase 5: Testing and Deployment (Weeks 11-12)
- Comprehensive testing suite
- Performance optimization
- Security audit and penetration testing
- Production deployment and monitoring setup

## Deployment Architecture

### Production Environment

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/Edge      │    │   Load Balancer │    │   App Servers   │
│   (Cloudflare)  │◄──►│   (Nginx)       │◄──►│   (Node.js)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                │                       │
                       ┌────────▼────────┐     ┌────────▼────────┐
                       │   Database      │     │   Cache/Queue   │
                       │   (MongoDB)     │     │   (Redis)       │
                       └─────────────────┘     └─────────────────┘
```

### Monitoring and Observability

1. **Application Monitoring**: Error tracking and performance monitoring
2. **Infrastructure Monitoring**: Server metrics and health checks
3. **Log Aggregation**: Centralized logging with structured data
4. **Alerting**: Automated alerts for critical issues
5. **Analytics**: User behavior and business metrics

This design provides a solid foundation for building a modern, scalable, and secure testimonial management platform that meets all the specified requirements while maintaining excellent performance and user experience.