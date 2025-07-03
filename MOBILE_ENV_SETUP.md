# Mobile App Environment & API Key Management

## Environment Variables for Production

### Required Environment Variables
```bash
# Database
DATABASE_URL=your_production_database_url
PGHOST=your_pg_host
PGPORT=5432
PGUSER=your_pg_user
PGPASSWORD=your_pg_password
PGDATABASE=your_pg_database

# AI Services (Optional - your custom AI is free)
OPENAI_API_KEY=your_openai_key_if_needed

# Admin Security
SESSION_SECRET=your_secure_session_secret

# App Configuration
NODE_ENV=production
PORT=5000
```

### Android/Capacitor Environment Setup

1. **Create production environment file**:
```javascript
// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourcompany.aicontentgenerator',
  appName: 'AI Content Generator',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // For production, use your deployed backend URL
    url: 'https://your-app-domain.com'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#3b82f6"
    }
  }
};

export default config;
```

2. **Environment-specific configuration**:
```javascript
// src/config/environment.ts
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  CUSTOM_AI_ENDPOINT: import.meta.env.VITE_CUSTOM_AI_ENDPOINT || '/api/my-openai',
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || 'development'
};
```

## Secure API Key Management

### Method 1: Server-Side Only (Recommended)
Your custom AI engine runs on your server, so API keys stay secure:

```javascript
// server/config/secrets.ts
export const secrets = {
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE
  },
  ai: {
    openaiKey: process.env.OPENAI_API_KEY, // Only if using OpenAI as fallback
    customAiEnabled: true // Your free AI engine
  },
  session: {
    secret: process.env.SESSION_SECRET
  }
};
```

### Method 2: Encrypted Storage (If Client-Side APIs Needed)
```javascript
// For any client-side API calls (rare with your setup)
import { Preferences } from '@capacitor/preferences';

class SecureStorage {
  static async setSecureValue(key: string, value: string) {
    await Preferences.set({ key, value });
  }
  
  static async getSecureValue(key: string): Promise<string | null> {
    const { value } = await Preferences.get({ key });
    return value;
  }
  
  static async removeSecureValue(key: string) {
    await Preferences.remove({ key });
  }
}
```

## Deployment Configuration Files

### 1. Production Environment File
```bash
# .env.production
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/database
SESSION_SECRET=your-super-secure-session-secret-here
OPENAI_API_KEY=optional-if-using-openai-fallback
```

### 2. Build Configuration
```javascript
// vite.config.ts - Production build
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable in production
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ai: ['./src/lib/ai-client']
        }
      }
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
});
```

### 3. Android Build Configuration
```json
// android/app/build.gradle (additional security)
android {
    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            
            // Secure network configuration
            networkSecurityConfig = file("src/main/res/xml/network_security_config.xml")
        }
    }
}
```

## Security Best Practices

### 1. API Endpoint Security
```javascript
// server/middleware/security.ts
export const apiSecurity = {
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },
  
  // CORS configuration
  cors: {
    origin: ['https://your-app-domain.com'],
    credentials: true
  },
  
  // Helmet security headers
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"]
      }
    }
  }
};
```

### 2. Client-Side Security
```javascript
// src/lib/secure-api.ts
class SecureAPIClient {
  private baseURL: string;
  
  constructor() {
    this.baseURL = config.API_BASE_URL;
  }
  
  async makeSecureRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      credentials: 'include' // Include session cookies
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    
    return response.json();
  }
}

export const apiClient = new SecureAPIClient();
```

## Play Store Deployment Steps

### 1. Prepare Production Build
```bash
# Install dependencies
npm install

# Build React app
npm run build

# Build Android app
npx cap sync android
npx cap build android --prod
```

### 2. Environment Variables Setup
```bash
# Set production environment variables in your hosting platform
DATABASE_URL=your_production_database
SESSION_SECRET=generate_secure_random_string
NODE_ENV=production
```

### 3. Android App Signing
```bash
# Generate signing key
keytool -genkey -v -keystore my-app-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias my-app-key

# Configure in android/app/build.gradle
android {
    signingConfigs {
        release {
            keyAlias 'my-app-key'
            keyPassword 'your-key-password'
            storeFile file('../my-app-key.keystore')
            storePassword 'your-store-password'
        }
    }
}
```

## Advantages of Your Setup

### Cost Benefits
- **Your Custom AI Engine**: $0/month (no API keys needed)
- **OpenAI Fallback**: Only if specifically needed
- **No Third-Party AI Subscriptions**: Complete independence

### Security Benefits
- **Server-Side AI Processing**: No client-side API keys
- **Custom Backend**: Full control over data handling
- **Zero External Dependencies**: Your AI engine is self-contained

### Deployment Benefits
- **Simple Environment Setup**: Minimal environment variables
- **Self-Hosted AI**: No external AI service dependencies
- **Cost Predictable**: Server hosting only, no per-request charges

## Production Checklist

- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Enable HTTPS on backend server
- [ ] Set up domain for API endpoints
- [ ] Configure CORS for mobile app domain
- [ ] Test custom AI engine in production
- [ ] Generate Android signing key
- [ ] Build and test APK
- [ ] Upload to Google Play Console
- [ ] Submit for review

Your custom AI engine significantly simplifies deployment since you don't need to manage external AI service API keys or worry about usage costs.