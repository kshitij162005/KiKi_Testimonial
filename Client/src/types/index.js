// User types
export const UserPlan = {
  FREE: 'free',
  PRO: 'pro',
  ENTERPRISE: 'enterprise'
}

export const UserRole = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  VIEWER: 'viewer'
}

// Testimonial types
export const TestimonialType = {
  VIDEO: 'video',
  TEXT: 'text'
}

export const TestimonialStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ARCHIVED: 'archived'
}

export const TestimonialSentiment = {
  POSITIVE: 'positive',
  NEUTRAL: 'neutral',
  NEGATIVE: 'negative'
}

// Widget types
export const WidgetType = {
  CAROUSEL: 'carousel',
  GRID: 'grid',
  MASONRY: 'masonry',
  BADGE: 'badge'
}

export const WidgetTheme = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
}

// Analytics types
export const AnalyticsEvent = {
  VIEW: 'view',
  PLAY: 'play',
  CLICK: 'click',
  SHARE: 'share',
  EMBED_VIEW: 'embed_view'
}

// API Response types
export const createApiResponse = (success, data = null, error = null, meta = null) => ({
  success,
  data,
  error,
  meta: {
    ...meta,
    timestamp: new Date().toISOString()
  }
})

export const createApiError = (code, message, details = null) => ({
  code,
  message,
  details,
  timestamp: new Date().toISOString()
})