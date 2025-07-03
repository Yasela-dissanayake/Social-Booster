import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { generateOptimizedContent } from './optimized-openai';

export interface SecurityThreat {
  type: 'sql_injection' | 'xss' | 'brute_force' | 'data_breach' | 'malicious_content' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: Date;
  userId?: number;
  ipAddress?: string;
  blocked: boolean;
}

export interface AISecurityConfig {
  contentModeration: boolean;
  realTimeMonitoring: boolean;
  behaviorAnalysis: boolean;
  threatDetection: boolean;
  autoResponse: boolean;
}

class AISecurityService {
  private threats: SecurityThreat[] = [];
  private suspiciousIPs: Set<string> = new Set();
  private failedAttempts: Map<string, number> = new Map();

  // Rate limiting configurations
  public createRateLimiters() {
    return {
      // General API rate limiting
      generalLimiter: rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: {
          error: 'Too many requests from this IP, please try again later.',
          retryAfter: '15 minutes'
        },
        standardHeaders: true,
        legacyHeaders: false,
      }),

      // Strict rate limiting for authentication
      authLimiter: rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // limit each IP to 5 login attempts per windowMs
        message: {
          error: 'Too many login attempts, please try again later.',
          retryAfter: '15 minutes'
        },
        skipSuccessfulRequests: true,
      }),

      // AI content generation rate limiting
      aiLimiter: rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: 10, // limit each IP to 10 AI requests per minute
        message: {
          error: 'AI rate limit exceeded. Please wait before generating more content.',
          retryAfter: '1 minute'
        }
      })
    };
  }

  // Helmet security headers configuration
  public getHelmetConfig() {
    return helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:"],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'", "https://api.openai.com"],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginEmbedderPolicy: false, // Allow embedding for social media previews
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    });
  }

  // AI-powered content moderation
  async moderateContent(content: string, userId: number): Promise<{
    approved: boolean;
    issues: string[];
    confidence: number;
    sanitizedContent?: string;
  }> {
    try {
      const moderationPrompt = `
        Analyze this social media content for security and safety issues:
        
        Content: "${content}"
        
        Check for:
        1. Malicious links or phishing attempts
        2. Hate speech or harassment
        3. Spam or excessive promotional content
        4. Privacy violations or doxxing attempts
        5. Misinformation or harmful false claims
        6. Adult content or inappropriate material
        7. Copyright violations
        8. Scam or fraud attempts
        
        Respond in JSON format:
        {
          "approved": true/false,
          "issues": ["list of specific issues found"],
          "confidence": 0-100,
          "sanitizedContent": "cleaned version if fixable",
          "riskLevel": "low/medium/high/critical"
        }
      `;

      const response = await generateOptimizedContent(
        moderationPrompt,
        "moderation"
      );

      const analysis = JSON.parse(response.content);
      
      if (!analysis.approved) {
        this.logSecurityThreat({
          type: 'malicious_content',
          severity: analysis.riskLevel === 'critical' ? 'critical' : 'medium',
          description: `Content blocked: ${analysis.issues.join(', ')}`,
          timestamp: new Date(),
          userId,
          blocked: true
        });
      }

      return {
        approved: analysis.approved,
        issues: analysis.issues || [],
        confidence: analysis.confidence || 85,
        sanitizedContent: analysis.sanitizedContent
      };
    } catch (error) {
      console.error('Content moderation error:', error);
      // Fail safely - allow content but log for manual review
      return {
        approved: true,
        issues: ['Moderation system temporarily unavailable'],
        confidence: 50
      };
    }
  }

  // Real-time behavior analysis
  async analyzeBehavior(userId: number, actions: any[]): Promise<{
    suspicious: boolean;
    riskScore: number;
    recommendations: string[];
  }> {
    try {
      const behaviorPrompt = `
        Analyze user behavior for suspicious activity:
        
        User ID: ${userId}
        Recent Actions: ${JSON.stringify(actions.slice(-20))}
        
        Look for:
        1. Unusual posting patterns (too frequent, bot-like)
        2. Rapid account creation followed by mass actions
        3. Coordinated inauthentic behavior
        4. Excessive API usage patterns
        5. Attempting to bypass rate limits
        6. Suspicious login patterns
        
        Respond in JSON:
        {
          "suspicious": true/false,
          "riskScore": 0-100,
          "patterns": ["identified suspicious patterns"],
          "recommendations": ["security actions to take"]
        }
      `;

      const response = await generateOptimizedContent(
        behaviorPrompt,
        "security"
      );

      const analysis = JSON.parse(response.content);
      
      if (analysis.suspicious && analysis.riskScore > 70) {
        this.logSecurityThreat({
          type: 'suspicious_activity',
          severity: analysis.riskScore > 90 ? 'critical' : 'high',
          description: `Suspicious behavior detected: ${analysis.patterns?.join(', ')}`,
          timestamp: new Date(),
          userId,
          blocked: false
        });
      }

      return {
        suspicious: analysis.suspicious,
        riskScore: analysis.riskScore || 0,
        recommendations: analysis.recommendations || []
      };
    } catch (error) {
      console.error('Behavior analysis error:', error);
      return {
        suspicious: false,
        riskScore: 0,
        recommendations: []
      };
    }
  }

  // Input sanitization and validation
  sanitizeInput(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .replace(/[<>]/g, (match) => match === '<' ? '&lt;' : '&gt;') // Escape HTML
      .trim()
      .substring(0, 5000); // Limit length
  }

  // SQL injection detection
  detectSQLInjection(query: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /((\%27)|(\'))\s*((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
      /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
      /((\%27)|(\'))union/i,
      /exec(\s|\+)+(s|x)p\w+/i
    ];
    
    return sqlPatterns.some(pattern => pattern.test(query));
  }

  // XSS detection
  detectXSS(input: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /eval\s*\(/gi,
      /expression\s*\(/gi,
      /vbscript:/gi,
      /data:text\/html/gi
    ];
    
    return xssPatterns.some(pattern => pattern.test(input));
  }

  // Brute force detection
  checkBruteForce(identifier: string): boolean {
    const attempts = this.failedAttempts.get(identifier) || 0;
    if (attempts >= 5) {
      this.suspiciousIPs.add(identifier);
      this.logSecurityThreat({
        type: 'brute_force',
        severity: 'high',
        description: `Brute force attack detected from ${identifier}`,
        timestamp: new Date(),
        ipAddress: identifier,
        blocked: true
      });
      return true;
    }
    return false;
  }

  // Log failed attempts
  logFailedAttempt(identifier: string): void {
    const current = this.failedAttempts.get(identifier) || 0;
    this.failedAttempts.set(identifier, current + 1);
    
    // Reset after 15 minutes
    setTimeout(() => {
      this.failedAttempts.delete(identifier);
    }, 15 * 60 * 1000);
  }

  // Password security validation
  validatePasswordStrength(password: string): {
    valid: boolean;
    score: number;
    issues: string[];
  } {
    const issues: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 2;
    else issues.push('Password must be at least 8 characters');

    if (/[a-z]/.test(password)) score += 1;
    else issues.push('Password must contain lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else issues.push('Password must contain uppercase letters');

    if (/\d/.test(password)) score += 1;
    else issues.push('Password must contain numbers');

    if (/[^a-zA-Z0-9]/.test(password)) score += 2;
    else issues.push('Password must contain special characters');

    if (password.length >= 12) score += 1;

    return {
      valid: score >= 5,
      score,
      issues
    };
  }

  // Secure password hashing
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  // Verify password
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  // Log security threats
  private logSecurityThreat(threat: SecurityThreat): void {
    this.threats.push(threat);
    console.warn(`🚨 Security Alert: ${threat.type} - ${threat.description}`);
    
    // In production, this would also:
    // - Send alerts to security team
    // - Log to security monitoring system
    // - Update firewall rules if needed
  }

  // Get security dashboard data
  getSecurityDashboard(): {
    totalThreats: number;
    recentThreats: SecurityThreat[];
    threatsByType: Record<string, number>;
    suspiciousIPs: string[];
    securityScore: number;
  } {
    const recentThreats = this.threats.slice(-10);
    const threatsByType = this.threats.reduce((acc, threat) => {
      acc[threat.type] = (acc[threat.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const criticalThreats = this.threats.filter(t => t.severity === 'critical').length;
    const securityScore = Math.max(0, 100 - (criticalThreats * 10) - (this.threats.length * 2));

    return {
      totalThreats: this.threats.length,
      recentThreats,
      threatsByType,
      suspiciousIPs: Array.from(this.suspiciousIPs),
      securityScore
    };
  }

  // AI-powered threat intelligence
  async analyzeThreatIntelligence(): Promise<{
    emergingThreats: string[];
    recommendations: string[];
    riskLevel: string;
  }> {
    try {
      const threatPrompt = `
        Based on current cybersecurity trends and social media platform vulnerabilities, 
        analyze potential threats for an AI-powered social media content creation platform.
        
        Consider:
        1. AI-specific attack vectors
        2. Social media platform vulnerabilities
        3. User data protection risks
        4. Content manipulation threats
        5. API security concerns
        
        Provide JSON response:
        {
          "emergingThreats": ["list of current threat types"],
          "recommendations": ["specific security measures to implement"],
          "riskLevel": "low/medium/high",
          "priorities": ["ordered list of most critical actions"]
        }
      `;

      const response = await generateOptimizedContent(
        threatPrompt,
        "security"
      );

      const analysis = JSON.parse(response.content);
      
      return {
        emergingThreats: analysis.emergingThreats || [],
        recommendations: analysis.recommendations || [],
        riskLevel: analysis.riskLevel || 'medium'
      };
    } catch (error) {
      console.error('Threat intelligence error:', error);
      return {
        emergingThreats: ['Unable to fetch threat intelligence'],
        recommendations: ['Manual security review recommended'],
        riskLevel: 'medium'
      };
    }
  }
}

export const aiSecurity = new AISecurityService();