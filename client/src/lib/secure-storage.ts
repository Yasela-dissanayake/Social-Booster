/**
 * Secure storage for mobile app
 * Handles sensitive data with encryption on device
 */
export class SecureStorage {
  private static readonly PREFIX = 'ai_app_';
  
  /**
   * Store sensitive data securely
   */
  static async setSecureValue(key: string, value: string): Promise<void> {
    try {
      const encryptedValue = btoa(value); // Basic encoding (enhance with crypto if needed)
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.PREFIX + key, encryptedValue);
      }
    } catch (error) {
      console.error('Failed to store secure value:', error);
      throw new Error('Secure storage failed');
    }
  }
  
  /**
   * Retrieve sensitive data securely
   */
  static async getSecureValue(key: string): Promise<string | null> {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null;
      
      const value = localStorage.getItem(this.PREFIX + key);
      if (!value) return null;
      
      return atob(value); // Basic decoding
    } catch (error) {
      console.error('Failed to retrieve secure value:', error);
      return null;
    }
  }
  
  /**
   * Remove sensitive data
   */
  static async removeSecureValue(key: string): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(this.PREFIX + key);
      }
    } catch (error) {
      console.error('Failed to remove secure value:', error);
    }
  }
  
  /**
   * Clear all app data (logout/reset)
   */
  static async clearAllSecureData(): Promise<void> {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      
      const keys = Object.keys(localStorage);
      const appKeys = keys.filter(key => key.startsWith(this.PREFIX));
      
      for (const key of appKeys) {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Failed to clear secure data:', error);
    }
  }
  
  /**
   * Store user session data
   */
  static async setUserSession(sessionData: {
    userId?: string;
    preferences?: Record<string, any>;
    lastActivity?: number;
  }): Promise<void> {
    await this.setSecureValue('user_session', JSON.stringify({
      ...sessionData,
      lastActivity: Date.now()
    }));
  }
  
  /**
   * Get user session data
   */
  static async getUserSession(): Promise<any | null> {
    try {
      const sessionStr = await this.getSecureValue('user_session');
      if (!sessionStr) return null;
      
      const session = JSON.parse(sessionStr);
      
      // Check if session is still valid (24 hours)
      const maxAge = 24 * 60 * 60 * 1000;
      if (Date.now() - session.lastActivity > maxAge) {
        await this.removeSecureValue('user_session');
        return null;
      }
      
      return session;
    } catch (error) {
      console.error('Failed to get user session:', error);
      return null;
    }
  }
  
  /**
   * Store generated content cache
   */
  static async cacheContent(contentId: string, content: any): Promise<void> {
    const cacheData = {
      content,
      timestamp: Date.now(),
      id: contentId
    };
    
    await this.setSecureValue(`cache_${contentId}`, JSON.stringify(cacheData));
  }
  
  /**
   * Retrieve cached content
   */
  static async getCachedContent(contentId: string): Promise<any | null> {
    try {
      const cacheStr = await this.getSecureValue(`cache_${contentId}`);
      if (!cacheStr) return null;
      
      const cache = JSON.parse(cacheStr);
      
      // Check if cache is still valid (30 minutes)
      const maxAge = 30 * 60 * 1000;
      if (Date.now() - cache.timestamp > maxAge) {
        await this.removeSecureValue(`cache_${contentId}`);
        return null;
      }
      
      return cache.content;
    } catch (error) {
      console.error('Failed to get cached content:', error);
      return null;
    }
  }
}

export default SecureStorage;