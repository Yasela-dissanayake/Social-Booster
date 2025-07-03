import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Database,
  Zap,
  Users,
  Monitor,
  Settings,
  Wrench,
  CreditCard,
  DollarSign,
  LogOut
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

function SubscriptionSettingsPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: settings, isLoading } = useQuery({
    queryKey: ['/api/admin/settings'],
    queryFn: () => apiRequest('GET', '/api/admin/settings').then(res => res.json())
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (updates: any) => apiRequest('PUT', '/api/admin/settings', updates).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
      toast({
        title: "Settings Updated",
        description: "Subscription settings have been updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update subscription settings. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleToggleSubscription = () => {
    if (settings) {
      updateSettingsMutation.mutate({
        subscriptionEnabled: !settings.subscriptionEnabled
      });
    }
  };

  const handlePriceUpdate = (field: 'proPriceGbp' | 'premiumPriceGbp', value: string) => {
    if (settings) {
      updateSettingsMutation.mutate({
        [field]: value
      });
    }
  };

  const handleFeatureUpdate = (field: 'proFeatures' | 'premiumFeatures', features: string[]) => {
    if (settings) {
      updateSettingsMutation.mutate({
        [field]: features
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Subscription Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription Control
          </CardTitle>
          <CardDescription>
            Toggle subscription features on/off. When disabled, all users get free access to the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
            <div className="space-y-1 flex-1">
              <h4 className="font-medium">Enable Subscription Features</h4>
              <p className="text-sm text-gray-600">
                {settings?.subscriptionEnabled 
                  ? "Subscription features are active. Users need to pay for premium features."
                  : "All features are free. Perfect for launch or testing phases."
                }
              </p>
            </div>
            <div className="flex justify-end sm:justify-start">
              <Switch
                checked={settings?.subscriptionEnabled || false}
                onCheckedChange={handleToggleSubscription}
                disabled={updateSettingsMutation.isPending}
              />
            </div>
          </div>

          {!settings?.subscriptionEnabled && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Free Mode Active</AlertTitle>
              <AlertDescription>
                All premium features are currently free for all users. You can activate subscriptions anytime when you're ready to monetize.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Pricing Settings */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pro Plan Pricing
            </CardTitle>
            <CardDescription>Set your Pro subscription price in GBP</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pro-price">Monthly Price (£)</Label>
              <Input
                id="pro-price"
                type="number"
                step="0.01"
                value={settings?.proPriceGbp || '24.00'}
                onChange={(e) => handlePriceUpdate('proPriceGbp', e.target.value)}
                disabled={updateSettingsMutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label>Pro Features</Label>
              <div className="space-y-1 text-sm">
                {settings?.proFeatures?.map((feature: string, index: number) => (
                  <p key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    {feature}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Premium Plan Pricing
            </CardTitle>
            <CardDescription>Set your Premium subscription price in GBP</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="premium-price">Monthly Price (£)</Label>
              <Input
                id="premium-price"
                type="number"
                step="0.01"
                value={settings?.premiumPriceGbp || '79.00'}
                onChange={(e) => handlePriceUpdate('premiumPriceGbp', e.target.value)}
                disabled={updateSettingsMutation.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label>Premium Features</Label>
              <div className="space-y-1 text-sm">
                {settings?.premiumFeatures?.map((feature: string, index: number) => (
                  <p key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    {feature}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Free Plan Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Free Plan Limits
          </CardTitle>
          <CardDescription>Configure what free users can access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="free-limit">Posts per month for free users</Label>
            <Input
              id="free-limit"
              type="number"
              value={settings?.freePostLimit || 5}
              onChange={(e) => updateSettingsMutation.mutate({ freePostLimit: parseInt(e.target.value) })}
              disabled={updateSettingsMutation.isPending}
            />
            <p className="text-xs text-gray-600">
              Free users can generate this many posts per month before needing to upgrade
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Current Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                {settings?.subscriptionEnabled ? 'PAID' : 'FREE'}
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Current Mode</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-xl sm:text-2xl font-bold">£{settings?.proPriceGbp || '24.00'}</div>
              <p className="text-xs sm:text-sm text-gray-600">Pro Price/Month</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-xl sm:text-2xl font-bold">£{settings?.premiumPriceGbp || '79.00'}</div>
              <p className="text-xs sm:text-sm text-gray-600">Premium Price/Month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminDashboard() {
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      setLocation('/admin/login');
      return;
    }
  }, [setLocation]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setLocation('/admin/login');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  // Real-time system monitoring
  const { data: healthCheck, isLoading: healthLoading } = useQuery({
    queryKey: ['/api/admin/health'],
    refetchInterval: 5000, // Check every 5 seconds
  });

  const { data: errorLogs } = useQuery({
    queryKey: ['/api/admin/logs'],
    refetchInterval: 10000, // Check every 10 seconds
  });

  const { data: platformStats } = useQuery({
    queryKey: ['/api/admin/stats'],
  });

  // Fix actions
  const fixDatabaseMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('https://srv885171.hstgr.cloud/api/admin/fix/database', { method: 'POST' });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Database Fixed!", description: "Connection restored successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/health'] });
    }
  });

  const restartServiceMutation = useMutation({
    mutationFn: async (service: string) => {
      const response = await fetch(`https://srv885171.hstgr.cloud/api/admin/restart/${service}`, { method: 'POST' });
      return response.json();
    },
    onSuccess: (data, service) => {
      toast({ title: `${service} Restarted!`, description: "Service is now running normally" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/health'] });
    }
  });

  const clearCacheMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('https://srv885171.hstgr.cloud/api/admin/clear-cache', { method: 'POST' });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Cache Cleared!", description: "System performance should improve" });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const mockHealthData = {
    overall: 'healthy',
    database: { status: 'healthy', responseTime: '23ms', connections: 5 },
    apis: {
      openai: { status: 'healthy', responseTime: '156ms', requests: 1247 },
      instagram: { status: 'warning', responseTime: '2.3s', errors: 3 },
      translation: { status: 'healthy', responseTime: '89ms', requests: 89 }
    },
    server: { 
      status: 'healthy', 
      cpu: 23, 
      memory: 67, 
      uptime: '2d 14h 32m',
      requests: 5420
    }
  };

  const mockErrorLogs = [
    { 
      id: 1, 
      timestamp: new Date().toISOString(), 
      level: 'error', 
      service: 'Instagram API', 
      message: 'Rate limit exceeded - retrying in 15 minutes',
      resolved: false 
    },
    { 
      id: 2, 
      timestamp: new Date(Date.now() - 300000).toISOString(), 
      level: 'warning', 
      service: 'Database', 
      message: 'Slow query detected: content generation took 3.2s',
      resolved: true 
    },
    { 
      id: 3, 
      timestamp: new Date(Date.now() - 600000).toISOString(), 
      level: 'info', 
      service: 'Translation', 
      message: 'Successfully processed 150 translation requests',
      resolved: true 
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              AI Social Media Generator - Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Monitor and manage your AI Social Media Generator platform's health and performance</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={`${getStatusColor(mockHealthData.overall)} border-0`}>
              <Activity className="h-4 w-4 mr-1" />
              System {mockHealthData.overall}
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => queryClient.invalidateQueries()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh All
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Quick Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Database</p>
                  <p className="text-lg font-semibold">{mockHealthData.database.responseTime}</p>
                </div>
                <Database className={`h-8 w-8 ${mockHealthData.database.status === 'healthy' ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Server CPU</p>
                  <p className="text-lg font-semibold">{mockHealthData.server.cpu}%</p>
                </div>
                <Monitor className={`h-8 w-8 ${mockHealthData.server.cpu < 70 ? 'text-green-600' : 'text-yellow-600'}`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">API Requests</p>
                  <p className="text-lg font-semibold">{mockHealthData.server.requests.toLocaleString()}</p>
                </div>
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Uptime</p>
                  <p className="text-lg font-semibold">{mockHealthData.server.uptime}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="monitoring" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="monitoring">System Monitor</TabsTrigger>
            <TabsTrigger value="logs">Error Logs</TabsTrigger>
            <TabsTrigger value="repair">Quick Repairs</TabsTrigger>
            <TabsTrigger value="settings">Admin Settings</TabsTrigger>
          </TabsList>

          {/* System Monitoring */}
          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Server Health */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Server Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>CPU Usage</span>
                      <span>{mockHealthData.server.cpu}%</span>
                    </div>
                    <Progress value={mockHealthData.server.cpu} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Memory Usage</span>
                      <span>{mockHealthData.server.memory}%</span>
                    </div>
                    <Progress value={mockHealthData.server.memory} className="h-2" />
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600">Uptime: {mockHealthData.server.uptime}</p>
                    <p className="text-sm text-gray-600">Requests: {mockHealthData.server.requests.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              {/* API Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    API Health Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(mockHealthData.apis).map(([api, data]: [string, any]) => (
                    <div key={api} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {data.status === 'healthy' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        )}
                        <div>
                          <p className="font-medium capitalize">{api} API</p>
                          <p className="text-sm text-gray-600">Response: {data.responseTime}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(data.status)}>
                        {data.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Database Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{mockHealthData.database.responseTime}</p>
                    <p className="text-sm text-gray-600">Response Time</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{mockHealthData.database.connections}</p>
                    <p className="text-sm text-gray-600">Active Connections</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">All Tables Healthy</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Error Logs */}
          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent System Logs</CardTitle>
                <CardDescription>Monitor errors and warnings across all services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockErrorLogs.map((log) => (
                    <Alert key={log.id} className={`${
                      log.level === 'error' ? 'border-red-200 bg-red-50' :
                      log.level === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                      'border-blue-200 bg-blue-50'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {log.level === 'error' ? (
                            <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                          ) : log.level === 'warning' ? (
                            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                          )}
                          <div>
                            <AlertTitle className="text-sm">{log.service}</AlertTitle>
                            <AlertDescription className="text-sm">{log.message}</AlertDescription>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(log.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant={log.resolved ? "default" : "destructive"}>
                          {log.resolved ? "Resolved" : "Active"}
                        </Badge>
                      </div>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quick Repairs */}
          <TabsContent value="repair" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Quick Fixes
                  </CardTitle>
                  <CardDescription>One-click solutions for common issues</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => fixDatabaseMutation.mutate()}
                    disabled={fixDatabaseMutation.isPending}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Fix Database Connection
                  </Button>
                  
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => clearCacheMutation.mutate()}
                    disabled={clearCacheMutation.isPending}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear System Cache
                  </Button>
                  
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => restartServiceMutation.mutate('ai-services')}
                    disabled={restartServiceMutation.isPending}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Restart AI Services
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Service Controls</CardTitle>
                  <CardDescription>Manage individual platform services</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {['OpenAI', 'Translation', 'Instagram API', 'Content Generator'].map((service) => (
                    <div key={service} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{service}</span>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => restartServiceMutation.mutate(service.toLowerCase())}
                        >
                          Restart
                        </Button>
                        <Badge className="bg-green-100 text-green-600">Running</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Subscription Settings */}
          <TabsContent value="settings" className="space-y-6">
            <SubscriptionSettingsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}