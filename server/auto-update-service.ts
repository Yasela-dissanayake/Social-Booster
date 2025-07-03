import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import cron from 'node-cron';

const execAsync = promisify(exec);

export interface UpdateConfig {
  checkInterval: string; // cron expression
  gitRepository?: string;
  branch: string;
  autoUpdate: boolean;
  backupBeforeUpdate: boolean;
  notificationUrl?: string;
}

export interface AppVersion {
  version: string;
  timestamp: Date;
  features: string[];
  changelog: string;
}

export class AutoUpdateService {
  private config: UpdateConfig;
  private isUpdating = false;
  private currentVersion: string;

  constructor(config: UpdateConfig) {
    this.config = config;
    this.currentVersion = this.getCurrentVersion();
  }

  start() {
    console.log('🔄 Auto-update service started');
    
    // Check for updates based on configured interval
    cron.schedule(this.config.checkInterval, async () => {
      await this.checkForUpdates();
    });

    // Also check on startup
    setTimeout(() => this.checkForUpdates(), 30000); // Wait 30s after startup
  }

  private getCurrentVersion(): string {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return packageJson.version || '1.0.0';
    } catch {
      return '1.0.0';
    }
  }

  private async checkForUpdates(): Promise<void> {
    if (this.isUpdating) {
      console.log('Update already in progress, skipping check');
      return;
    }

    try {
      console.log('🔍 Checking for application updates...');
      
      // Check for new features or database schema changes
      const hasUpdates = await this.detectChanges();
      
      if (hasUpdates && this.config.autoUpdate) {
        await this.performUpdate();
      } else if (hasUpdates) {
        console.log('📢 Updates available but auto-update is disabled');
        await this.notifyUpdateAvailable();
      }
    } catch (error) {
      console.error('Update check failed:', error);
    }
  }

  private async detectChanges(): Promise<boolean> {
    try {
      // Check if there are any schema migrations needed
      const { stdout } = await execAsync('npm run db:push -- --dry-run');
      
      // Check for new files or significant changes
      const hasSchemaChanges = stdout.includes('changes') || stdout.includes('migration');
      
      // Check for new features by looking at recent file modifications
      const recentChanges = await this.checkRecentFileChanges();
      
      return hasSchemaChanges || recentChanges;
    } catch (error) {
      console.log('No updates detected');
      return false;
    }
  }

  private async checkRecentFileChanges(): Promise<boolean> {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Check if any core files were modified recently
      const coreFiles = [
        'server/routes.ts',
        'server/image-service.ts',
        'server/auto-post-scheduler.ts',
        'shared/schema.ts',
        'package.json'
      ];
      
      for (const file of coreFiles) {
        if (fs.existsSync(file)) {
          const stats = fs.statSync(file);
          if (stats.mtime > yesterday) {
            console.log(`📝 Recent changes detected in ${file}`);
            return true;
          }
        }
      }
      
      return false;
    } catch {
      return false;
    }
  }

  private async performUpdate(): Promise<void> {
    this.isUpdating = true;
    
    try {
      console.log('🚀 Starting automatic update process...');
      
      // Create backup if enabled
      if (this.config.backupBeforeUpdate) {
        await this.createBackup();
      }
      
      // Apply database migrations
      await this.updateDatabase();
      
      // Update application files if needed
      await this.updateApplicationFiles();
      
      // Restart services if needed
      await this.restartServices();
      
      console.log('✅ Update completed successfully');
      await this.notifyUpdateComplete();
      
    } catch (error) {
      console.error('❌ Update failed:', error);
      await this.rollbackUpdate();
    } finally {
      this.isUpdating = false;
    }
  }

  private async createBackup(): Promise<void> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupDir = `./backups/backup-${timestamp}`;
      
      if (!fs.existsSync('./backups')) {
        fs.mkdirSync('./backups', { recursive: true });
      }
      
      // Backup database
      await execAsync(`pg_dump ${process.env.DATABASE_URL} > ${backupDir}-database.sql`);
      
      // Backup application files
      await execAsync(`tar -czf ${backupDir}-app.tar.gz --exclude=node_modules --exclude=backups .`);
      
      console.log(`💾 Backup created: ${backupDir}`);
    } catch (error) {
      console.error('Backup creation failed:', error);
      throw error;
    }
  }

  private async updateDatabase(): Promise<void> {
    try {
      console.log('🗄️ Updating database schema...');
      await execAsync('npm run db:push');
      console.log('✅ Database updated successfully');
    } catch (error) {
      console.error('Database update failed:', error);
      throw error;
    }
  }

  private async updateApplicationFiles(): Promise<void> {
    try {
      // Install any new dependencies
      console.log('📦 Installing dependencies...');
      await execAsync('npm install');
      
      // Rebuild if needed
      console.log('🔨 Rebuilding application...');
      await execAsync('npm run build');
      
      console.log('✅ Application files updated');
    } catch (error) {
      console.error('Application update failed:', error);
      throw error;
    }
  }

  private async restartServices(): Promise<void> {
    try {
      // Restart auto-post scheduler
      const { autoPostScheduler } = await import('./auto-post-scheduler');
      autoPostScheduler.stop();
      autoPostScheduler.start();
      
      console.log('🔄 Services restarted');
    } catch (error) {
      console.error('Service restart failed:', error);
    }
  }

  private async rollbackUpdate(): Promise<void> {
    try {
      console.log('⏪ Rolling back update...');
      
      // Find latest backup
      const backups = fs.readdirSync('./backups')
        .filter(f => f.endsWith('-app.tar.gz'))
        .sort()
        .reverse();
      
      if (backups.length > 0) {
        const latestBackup = backups[0];
        await execAsync(`tar -xzf ./backups/${latestBackup}`);
        console.log('✅ Rollback completed');
      }
    } catch (error) {
      console.error('Rollback failed:', error);
    }
  }

  private async notifyUpdateAvailable(): Promise<void> {
    if (this.config.notificationUrl) {
      try {
        await fetch(this.config.notificationUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'update_available',
            version: this.currentVersion,
            timestamp: new Date().toISOString()
          })
        });
      } catch (error) {
        console.error('Notification failed:', error);
      }
    }
  }

  private async notifyUpdateComplete(): Promise<void> {
    if (this.config.notificationUrl) {
      try {
        await fetch(this.config.notificationUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'update_complete',
            version: this.getCurrentVersion(),
            previousVersion: this.currentVersion,
            timestamp: new Date().toISOString()
          })
        });
      } catch (error) {
        console.error('Notification failed:', error);
      }
    }
  }

  async manualUpdate(): Promise<{ success: boolean; message: string }> {
    if (this.isUpdating) {
      return { success: false, message: 'Update already in progress' };
    }

    try {
      await this.performUpdate();
      return { success: true, message: 'Update completed successfully' };
    } catch (error) {
      return { success: false, message: `Update failed: ${error.message}` };
    }
  }

  getUpdateStatus(): {
    isUpdating: boolean;
    currentVersion: string;
    lastCheck: Date;
    autoUpdateEnabled: boolean;
  } {
    return {
      isUpdating: this.isUpdating,
      currentVersion: this.currentVersion,
      lastCheck: new Date(),
      autoUpdateEnabled: this.config.autoUpdate
    };
  }

  async setAutoUpdate(enabled: boolean): Promise<void> {
    this.config.autoUpdate = enabled;
    console.log(`Auto-update ${enabled ? 'enabled' : 'disabled'}`);
  }
}

// Default configuration
const defaultConfig: UpdateConfig = {
  checkInterval: '0 */6 * * *', // Every 6 hours
  branch: 'main',
  autoUpdate: false, // Disabled by default for safety
  backupBeforeUpdate: true
};

export const autoUpdateService = new AutoUpdateService(defaultConfig);