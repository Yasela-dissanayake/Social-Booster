// Production Configuration for AI Social Media Generator
// Optimizes performance, security, and user experience

const productionConfig = {
  // App Information
  app: {
    name: "AI Social Media Generator",
    version: "1.0.0",
    description: "AI-powered social media content creation platform"
  },

  // Performance Optimizations
  performance: {
    // Enable compression for faster loading
    compression: true,
    // Cache static assets for 1 year
    staticCacheTime: 31536000,
    // Enable service worker for offline functionality
    serviceWorker: true,
    // Optimize images and assets
    assetOptimization: true
  },

  // Security Settings
  security: {
    // HTTPS enforcement
    forceHTTPS: true,
    // Content Security Policy
    csp: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.openai.com", "https://api.stripe.com"]
    },
    // Rate limiting for API endpoints
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }
  },

  // Database Configuration
  database: {
    // Connection pooling for better performance
    pool: {
      min: 2,
      max: 10,
      acquire: 30000,
      idle: 10000
    },
    // Enable query optimization
    logging: false,
    // Backup configuration
    backup: {
      enabled: true,
      frequency: 'daily',
      retention: '30 days'
    }
  },

  // API Configuration
  apis: {
    // OpenAI settings for content generation
    openai: {
      model: "gpt-4o", // Latest model for best results
      maxTokens: 1000,
      temperature: 0.7,
      timeout: 30000
    },
    // Stripe payment processing
    stripe: {
      currency: "gbp", // UK currency
      timeout: 10000
    }
  },

  // Mobile App Settings
  mobile: {
    // Splash screen duration
    splashDuration: 2000,
    // Theme configuration
    theme: {
      primary: "#6366f1",
      secondary: "#8b5cf6",
      background: "#ffffff"
    },
    // Push notification settings
    notifications: {
      enabled: true,
      categories: ["content_ready", "analytics_update", "tips"]
    }
  },

  // Analytics and Monitoring
  monitoring: {
    // Error tracking
    errorTracking: true,
    // Performance monitoring
    performance: true,
    // User analytics (privacy-compliant)
    userAnalytics: {
      enabled: true,
      anonymized: true
    }
  },

  // Feature Flags
  features: {
    // Tutorial system
    tutorialWalkthrough: true,
    // AI assistant
    aiAssistant: true,
    // Multi-platform support
    multiPlatform: true,
    // Cost savings tracking
    costTracking: true,
    // Advanced analytics
    advancedAnalytics: true
  }
};

// Environment-specific overrides
const environmentConfig = {
  development: {
    security: {
      forceHTTPS: false
    },
    database: {
      logging: true
    },
    monitoring: {
      errorTracking: false
    }
  },
  
  production: {
    // All settings from productionConfig apply
    performance: {
      ...productionConfig.performance,
      // Additional production optimizations
      minifyCode: true,
      treeshaking: true,
      imageOptimization: true
    }
  }
};

// Export configuration based on environment
const env = process.env.NODE_ENV || 'development';
const config = {
  ...productionConfig,
  ...environmentConfig[env]
};

module.exports = config;