# SocialBooster - Complete Project Tree Structure

```
SocialBooster/
├── android/                                    # Android Mobile App (Capacitor)
│   ├── app/
│   │   ├── build/                             # Build output directory
│   │   ├── build.gradle                       # Android app build config
│   │   ├── capacitor.build.gradle             # Capacitor build settings
│   │   └── src/
│   │       ├── androidTest/
│   │       │   └── java/com/getcapacitor/myapp/
│   │       ├── main/
│   │       │   ├── AndroidManifest.xml        # App permissions & config
│   │       │   ├── assets/
│   │       │   │   ├── capacitor.config.json  # Capacitor config
│   │       │   │   ├── capacitor.plugins.json # Plugin configurations
│   │       │   │   └── public/                # Mobile web assets
│   │       │   │       ├── cordova.js         # Cordova bridge
│   │       │   │       ├── cordova_plugins.js # Plugin loader
│   │       │   │       ├── index.html         # Mobile app interface
│   │       │   │       ├── index.js           # Bundled mobile app
│   │       │   │       └── public/assets/
│   │       │   │           ├── index-CoET0Lb4.js
│   │       │   │           ├── index-DXwYDVs5.css
│   │       │   │           └── index.html
│   │       │   ├── java/com/aicontentgenerator/app/
│   │       │   └── res/
│   │       │       ├── drawable/
│   │       │       ├── drawable-v24/
│   │       │       ├── layout/
│   │       │       │   └── activity_main.xml
│   │       │       ├── mipmap-anydpi-v26/
│   │       │       │   ├── ic_launcher.xml
│   │       │       │   └── ic_launcher_round.xml
│   │       │       ├── mipmap-hdpi/
│   │       │       ├── mipmap-mdpi/
│   │       │       ├── mipmap-xhdpi/
│   │       │       ├── mipmap-xxhdpi/
│   │       │       ├── mipmap-xxxhdpi/
│   │       │       ├── values/
│   │       │       │   ├── ic_launcher_background.xml
│   │       │       │   ├── strings.xml
│   │       │       │   └── styles.xml
│   │       │       └── xml/
│   │       │           ├── config.xml
│   │       │           ├── file_paths.xml
│   │       │           └── network_security_config.xml
│   │       └── test/
│   │           └── java/com/getcapacitor/myapp/
│   ├── build.gradle                           # Project build config
│   ├── capacitor-cordova-android-plugins/
│   │   └── src/main/
│   ├── capacitor.settings.gradle
│   ├── gradle/
│   │   └── wrapper/
│   ├── gradlew                                # Gradle wrapper (Linux/Mac)
│   ├── gradlew.bat                            # Gradle wrapper (Windows)
│   ├── settings.gradle
│   └── variables.gradle
│
├── attached_assets/                           # User uploads & screenshots
│   ├── Pasted-apply-plugin-*.txt
│   ├── Pasted-yasela-*.txt
│   └── Screenshot_*.jpg
│
├── backups/                                   # Project backups
│   └── backup-*.tar.gz
│
├── client/                                    # React Frontend Application
│   ├── dist/                                 # Built frontend (production)
│   │   └── index.html
│   ├── index.html                            # Development HTML template
│   └── src/
│       ├── App.tsx                           # Main React app component
│       ├── main.tsx                          # React entry point
│       ├── index.css                         # Global styles
│       ├── vite-env.d.ts                     # Vite type definitions
│       ├── components/                       # React Components
│       │   ├── account-manager.tsx           # Social media accounts
│       │   ├── age-verification.tsx          # Age verification modal
│       │   ├── ai-analytics-dashboard.tsx    # AI analytics overview
│       │   ├── ai-assistant.tsx              # AI chat interface
│       │   ├── ai-generator-panel.tsx        # AI content generator
│       │   ├── ai-insights.tsx               # Content insights
│       │   ├── ai-strategy-engine.tsx        # Strategy recommendations
│       │   ├── ai-tools-dashboard.tsx        # AI tools collection
│       │   ├── auth-system.tsx               # User authentication
│       │   ├── brand-header.tsx              # Brand header component
│       │   ├── bulk-content-generator.tsx    # Batch content creation
│       │   ├── content-calendar.tsx          # Content scheduling calendar
│       │   ├── cost-breakdown.tsx            # Cost analysis display
│       │   ├── growth-comparison.tsx         # Growth metrics comparison
│       │   ├── mobile-nav.tsx                # Mobile navigation
│       │   ├── multilingual-translator.tsx   # Multi-language support
│       │   ├── multi-platform-generator.tsx  # Multi-platform content
│       │   ├── platform-performance.tsx      # Platform analytics
│       │   ├── recent-content.tsx            # Recent content display
│       │   ├── sidebar.tsx                   # Desktop sidebar
│       │   ├── smart-scheduler.tsx           # Auto-posting scheduler
│       │   ├── stats-card.tsx                # Statistics cards
│       │   ├── trend-analyzer.tsx            # Trend analysis
│       │   ├── tutorial-walkthrough.tsx      # User onboarding
│       │   ├── video-generator.tsx           # Video content creation
│       │   └── ui/                           # shadcn/ui Components
│       │       ├── accordion.tsx
│       │       ├── alert-dialog.tsx
│       │       ├── alert.tsx
│       │       ├── aspect-ratio.tsx
│       │       ├── avatar.tsx
│       │       ├── badge.tsx
│       │       ├── breadcrumb.tsx
│       │       ├── button.tsx
│       │       ├── calendar.tsx
│       │       ├── card.tsx
│       │       ├── carousel.tsx
│       │       ├── chart.tsx
│       │       ├── checkbox.tsx
│       │       ├── collapsible.tsx
│       │       ├── command.tsx
│       │       ├── context-menu.tsx
│       │       ├── dialog.tsx
│       │       ├── drawer.tsx
│       │       ├── dropdown-menu.tsx
│       │       ├── form.tsx
│       │       ├── hover-card.tsx
│       │       ├── input-otp.tsx
│       │       ├── input.tsx
│       │       ├── label.tsx
│       │       ├── menubar.tsx
│       │       ├── navigation-menu.tsx
│       │       ├── pagination.tsx
│       │       ├── popover.tsx
│       │       ├── progress.tsx
│       │       ├── radio-group.tsx
│       │       ├── resizable.tsx
│       │       ├── scroll-area.tsx
│       │       ├── select.tsx
│       │       ├── separator.tsx
│       │       ├── sheet.tsx
│       │       ├── skeleton.tsx
│       │       ├── slider.tsx
│       │       ├── sonner.tsx
│       │       ├── switch.tsx
│       │       ├── table.tsx
│       │       ├── tabs.tsx
│       │       ├── textarea.tsx
│       │       ├── toast.tsx
│       │       ├── toggle-group.tsx
│       │       ├── toggle.tsx
│       │       └── tooltip.tsx
│       ├── contexts/                         # React Contexts
│       │   └── auth-context.tsx              # Authentication state
│       ├── hooks/                            # Custom React Hooks
│       │   ├── use-mobile.ts                 # Mobile detection
│       │   └── use-toast.ts                  # Toast notifications
│       ├── lib/                              # Utility Libraries
│       │   ├── authUtils.ts                  # Authentication helpers
│       │   ├── queryClient.ts                # API client configuration
│       │   └── utils.ts                      # General utilities
│       └── pages/                            # Application Pages
│           ├── admin-login-basic.tsx         # Basic admin login
│           ├── admin-login.tsx               # Admin authentication
│           ├── admin.tsx                     # Admin dashboard
│           ├── content-generator.tsx         # Main content creation
│           ├── dashboard.tsx                 # User dashboard
│           ├── landing.tsx                   # Landing page
│           ├── pricing.tsx                   # Pricing page
│           ├── simple-admin-login.tsx        # Simple admin login
│           └── test-admin.tsx                # Admin testing page
│
├── dist/                                      # Production Build Output
│   ├── index.html                            # Built frontend entry
│   ├── index.js                              # Bundled application
│   └── public/
│       ├── assets/
│       └── index.html
│
├── node_modules/                              # NPM Dependencies (auto-generated)
│   └── [80+ packages including React, Express, PostgreSQL, etc.]
│
├── server/                                    # Express.js Backend
│   ├── admin-auth.ts                         # Admin authentication system
│   ├── advanced-ai.ts                        # Advanced AI features
│   ├── ai-agent-service.ts                   # AI automation agents
│   ├── app-landing.ts                        # Landing page service
│   ├── auto-post-scheduler.ts                # Automatic posting system
│   ├── auto-update-service.ts                # Self-updating system
│   ├── custom-ai.ts                          # Custom AI content generation
│   ├── db.ts                                 # Database connection (PostgreSQL)
│   ├── image-service.ts                      # Image processing & uploads
│   ├── index.ts                              # Main server entry point
│   ├── my-ai-engine.ts                       # Custom AI engine (saves $200-500/month)
│   ├── my-openai-api.ts                      # OpenAI-compatible API
│   ├── my-openai-client.ts                   # AI client wrapper
│   ├── openai.ts                             # OpenAI integration (fallback)
│   ├── optimized-openai.ts                   # Optimized AI calls
│   ├── routes.ts                             # API routes & endpoints
│   ├── security-service.ts                   # Security & threat detection
│   ├── storage.ts                            # Data storage interface
│   ├── translation-service.ts                # Multi-language support
│   ├── video-ai.ts                           # AI video generation
│   └── vite.ts                               # Vite development server
│
├── shared/                                    # Shared Code (Client + Server)
│   └── schema.ts                             # Database schemas & TypeScript types
│
├── viral-ai-backup/                          # Complete Project Backup
│   ├── attached_assets/
│   ├── client/src/                           # Backup of entire client folder
│   ├── server/                               # Backup of entire server folder
│   ├── shared/                               # Backup of shared schemas
│   └── [200+ backup files including all documentation]
│
├── .cache/                                    # Replit Cache (auto-generated)
│   ├── replit/
│   └── typescript/
│
├── .config/                                   # Configuration cache
│   └── npm/
│
├── .git/                                      # Git repository (auto-generated)
│   ├── objects/
│   ├── refs/
│   └── [Git metadata]
│
├── .local/                                    # Local state
│   └── state/
│
├── .upm/                                      # UPM cache
│
├── Configuration Files:
├── .env.local                                # Local environment variables
├── .env.production                           # Production environment
├── .gitignore                                # Git ignore rules
├── .replit                                   # Replit configuration
├── capacitor.config.json                     # Capacitor mobile config
├── capacitor.config.ts                       # TypeScript Capacitor config
├── components.json                           # shadcn/ui configuration
├── drizzle.config.ts                         # Database ORM configuration
├── package.json                              # Dependencies & scripts
├── package-lock.json                         # Locked dependency versions
├── postcss.config.js                         # PostCSS configuration
├── tailwind.config.ts                        # Tailwind CSS configuration
├── tsconfig.json                             # TypeScript configuration
├── vite.config.ts                            # Vite build configuration
│
├── Documentation (45+ files):
├── replit.md                                 # Project overview & architecture
├── ADMIN_SETUP.md                            # Admin system setup guide
├── BACKEND_CONNECTION_DIAGNOSTIC.md          # Backend connection testing
├── CLEAN_BUILD_INSTRUCTIONS.md               # Clean build process
├── CLIENT_URL_UPDATES_COMPLETE.md            # Network fix documentation
├── COMPLETE_FILE_STRUCTURE.md                # Complete file structure
├── COMPLETE_LOCAL_SETUP.md                   # Local development setup
├── COMPLETE_REBUILD_STEPS.md                 # Complete rebuild guide
├── DEPLOYMENT_GUIDE.md                       # Production deployment
├── DOWNLOAD_GUIDE.md                         # App download guide
├── EXACT_BUILD_STEPS.md                      # Precise build instructions
├── FINAL_APK_BUILD_READY.md                  # APK build readiness
├── GITHUB_SYNC_OPTIONS.md                    # GitHub integration
├── LAUNCH_CHECKLIST.md                       # Pre-launch checklist
├── LOCAL_SETUP_GUIDE.md                      # Local setup instructions
├── LOCAL_SETUP_INSTRUCTIONS.md               # Detailed local setup
├── MOBILE_DEPLOYMENT_GUIDE.md                # Mobile app deployment
├── MOBILE_ENV_SETUP.md                       # Mobile environment setup
├── MY_AI_GUIDE.md                            # Custom AI engine guide
├── NETWORK_FIX_BUILD_STEPS.md                # Network connectivity fixes
├── PLAY_STORE_SETUP.md                       # Google Play Store guide
├── PRIVACY_POLICY.md                         # Privacy policy
├── PRODUCTION_DATABASE_SETUP.md              # Database setup guide
├── PROJECT_TREE_STRUCTURE.md                 # This file
├── QUICK_START.md                            # Quick start guide
├── REPLIT_FOLDER_STRUCTURE.md                # Replit structure overview
├── SECURITY_OVERVIEW.md                      # Security features guide
├── SUCCESS_MOBILE_BUILD_READY.md             # Mobile build success guide
├── TERMS_OF_SERVICE.md                       # Terms of service
├── VPS_FOLDER_STRUCTURE.md                   # Server folder structure
├── WHITE_SCREEN_DEBUG_GUIDE.md               # Debug guide
├── android-build-guide.md                    # Android build documentation
├── app-store-assets.md                       # App store assets guide
├── deployment-checklist.md                   # Deployment checklist
├── production-checklist.md                   # Production checklist
│
├── Build & Deployment Scripts:
├── build-android.sh                          # Android build script
├── create-web-package.js                     # Web deployment packager
├── deploy.js                                 # One-click deployment script
├── download-app.js                           # App download packager
├── production-config.js                      # Production configuration
├── quick-deploy.sh                           # Quick deployment script
├── verify-deployment.js                      # Deployment verification
│
├── Assets & Archives:
├── generated-icon.png                        # App icon
├── mobile-deployment-config.json             # Mobile deployment config
├── mobile-deployment.json                    # Mobile config
├── mobile-test.html                          # Mobile testing page
├── viral-ai-app.tar.gz                      # Packaged app archive
└── viral-ai-complete-app.tar.gz             # Complete app package
```

## Project Summary
- **Total Files**: 432 files
- **Custom AI Engine**: Saves $200-500/month vs competitors
- **Full-Stack**: React frontend + Express backend + PostgreSQL
- **Mobile Ready**: Android APK for Google Play Store
- **Production Deployed**: Backend running on srv885171.hstgr.cloud
- **Cost Effective**: $4-10/month vs $245-650/month competitors