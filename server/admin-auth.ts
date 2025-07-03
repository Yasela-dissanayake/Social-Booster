import { aiSecurity } from "./security-service";

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  passwordHash: string;
  lastLogin: Date | null;
  createdAt: Date;
  isActive: boolean;
}

export interface AdminSession {
  adminId: number;
  token: string;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
}

class AdminAuthService {
  private sessions: Map<string, AdminSession> = new Map();
  private adminUsers: AdminUser[] = [];
  private currentPassword: string = '';

  constructor() {
    this.initializeDefaultAdmin();
  }

  // Initialize default admin user
  private async initializeDefaultAdmin() {
    const defaultPassword = this.generateSecurePassword();
    const passwordHash = await aiSecurity.hashPassword(defaultPassword);
    
    const defaultAdmin: AdminUser = {
      id: 1,
      username: 'admin',
      email: 'admin@viralai.app',
      role: 'super_admin',
      passwordHash,
      lastLogin: null,
      createdAt: new Date(),
      isActive: true
    };

    this.adminUsers.push(defaultAdmin);
    this.currentPassword = defaultPassword; // Store for access
    
    console.log('🔐 Admin account created:');
    console.log(`Username: admin`);
    console.log(`Password: ${defaultPassword}`);
    console.log('⚠️  Please change this password immediately after first login!');
  }

  // Generate secure random password
  private generateSecurePassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // Admin login
  async adminLogin(
    username: string, 
    password: string, 
    ipAddress: string, 
    userAgent: string
  ): Promise<{ success: boolean; token?: string; error?: string; admin?: AdminUser }> {
    try {
      // Check for brute force attempts
      if (aiSecurity.checkBruteForce(ipAddress)) {
        return { 
          success: false, 
          error: 'Too many failed attempts. IP temporarily blocked.' 
        };
      }

      // Find admin user
      const admin = this.adminUsers.find(a => 
        a.username === username && a.isActive
      );

      if (!admin) {
        aiSecurity.logFailedAttempt(ipAddress);
        return { 
          success: false, 
          error: 'Invalid credentials' 
        };
      }

      // Verify password
      const isValidPassword = await aiSecurity.verifyPassword(password, admin.passwordHash);
      
      if (!isValidPassword) {
        aiSecurity.logFailedAttempt(ipAddress);
        return { 
          success: false, 
          error: 'Invalid credentials' 
        };
      }

      // Create session token
      const token = this.generateSessionToken();
      const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours

      const session: AdminSession = {
        adminId: admin.id,
        token,
        expiresAt,
        ipAddress,
        userAgent
      };

      this.sessions.set(token, session);

      // Update last login
      admin.lastLogin = new Date();

      console.log(`🔐 Admin login successful: ${admin.username} from ${ipAddress}`);

      return { 
        success: true, 
        token,
        admin: {
          ...admin,
          passwordHash: '' // Never return password hash
        }
      };
    } catch (error) {
      console.error('Admin login error:', error);
      return { 
        success: false, 
        error: 'Authentication system error' 
      };
    }
  }

  // Generate session token
  private generateSessionToken(): string {
    return 'admin_' + Math.random().toString(36).substr(2, 9) + 
           Date.now().toString(36) + 
           Math.random().toString(36).substr(2, 9);
  }

  // Verify admin session
  verifyAdminSession(token: string): AdminUser | null {
    const session = this.sessions.get(token);
    
    if (!session) {
      return null;
    }

    // Check if session expired
    if (new Date() > session.expiresAt) {
      this.sessions.delete(token);
      return null;
    }

    // Find admin user
    const admin = this.adminUsers.find(a => a.id === session.adminId);
    
    if (!admin || !admin.isActive) {
      this.sessions.delete(token);
      return null;
    }

    return {
      ...admin,
      passwordHash: '' // Never return password hash
    };
  }

  // Admin logout
  adminLogout(token: string): boolean {
    const session = this.sessions.get(token);
    if (session) {
      this.sessions.delete(token);
      console.log(`🔐 Admin logout: ${session.adminId}`);
      return true;
    }
    return false;
  }

  // Change admin password
  async changeAdminPassword(
    adminId: number, 
    currentPassword: string, 
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const admin = this.adminUsers.find(a => a.id === adminId);
      
      if (!admin) {
        return { success: false, error: 'Admin not found' };
      }

      // Verify current password
      const isValidPassword = await aiSecurity.verifyPassword(currentPassword, admin.passwordHash);
      
      if (!isValidPassword) {
        return { success: false, error: 'Current password is incorrect' };
      }

      // Validate new password strength
      const passwordValidation = aiSecurity.validatePasswordStrength(newPassword);
      
      if (!passwordValidation.valid) {
        return { 
          success: false, 
          error: `Password too weak: ${passwordValidation.issues.join(', ')}` 
        };
      }

      // Hash new password
      admin.passwordHash = await aiSecurity.hashPassword(newPassword);
      
      console.log(`🔐 Password changed for admin: ${admin.username}`);
      
      return { success: true };
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, error: 'Password change failed' };
    }
  }

  // Create new admin user
  async createAdminUser(
    username: string,
    email: string,
    password: string,
    role: 'admin' | 'moderator',
    createdBy: number
  ): Promise<{ success: boolean; admin?: AdminUser; error?: string }> {
    try {
      // Check if username exists
      const existingAdmin = this.adminUsers.find(a => a.username === username);
      if (existingAdmin) {
        return { success: false, error: 'Username already exists' };
      }

      // Validate password
      const passwordValidation = aiSecurity.validatePasswordStrength(password);
      if (!passwordValidation.valid) {
        return { 
          success: false, 
          error: `Password too weak: ${passwordValidation.issues.join(', ')}` 
        };
      }

      // Hash password
      const passwordHash = await aiSecurity.hashPassword(password);

      const newAdmin: AdminUser = {
        id: this.adminUsers.length + 1,
        username,
        email,
        role,
        passwordHash,
        lastLogin: null,
        createdAt: new Date(),
        isActive: true
      };

      this.adminUsers.push(newAdmin);

      console.log(`🔐 New admin created: ${username} by admin ${createdBy}`);

      return { 
        success: true, 
        admin: {
          ...newAdmin,
          passwordHash: '' // Never return password hash
        }
      };
    } catch (error) {
      console.error('Admin creation error:', error);
      return { success: false, error: 'Admin creation failed' };
    }
  }

  // Get all admin users (for super admin only)
  getAllAdmins(): AdminUser[] {
    return this.adminUsers.map(admin => ({
      ...admin,
      passwordHash: '' // Never return password hashes
    }));
  }

  // Deactivate admin user
  deactivateAdmin(adminId: number, deactivatedBy: number): boolean {
    const admin = this.adminUsers.find(a => a.id === adminId);
    
    if (!admin) {
      return false;
    }

    // Don't allow deactivating super admin
    if (admin.role === 'super_admin') {
      return false;
    }

    admin.isActive = false;
    
    // Invalidate all sessions for this admin
    for (const [token, session] of this.sessions.entries()) {
      if (session.adminId === adminId) {
        this.sessions.delete(token);
      }
    }

    console.log(`🔐 Admin deactivated: ${admin.username} by admin ${deactivatedBy}`);
    
    return true;
  }

  // Get admin session info
  getAdminSessions(): Array<{
    token: string;
    adminId: number;
    username: string;
    ipAddress: string;
    userAgent: string;
    expiresAt: Date;
  }> {
    const sessions = [];
    
    for (const [token, session] of this.sessions.entries()) {
      const admin = this.adminUsers.find(a => a.id === session.adminId);
      if (admin) {
        sessions.push({
          token,
          adminId: session.adminId,
          username: admin.username,
          ipAddress: session.ipAddress,
          userAgent: session.userAgent,
          expiresAt: session.expiresAt
        });
      }
    }
    
    return sessions;
  }

  getCurrentPassword(): string {
    return this.currentPassword;
  }
}

export const adminAuth = new AdminAuthService();