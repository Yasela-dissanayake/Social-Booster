import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  User, Plus, Settings, Link as LinkIcon, Unlink, 
  Eye, EyeOff, CheckCircle, AlertCircle, Shield,
  Instagram, Youtube, Twitter, Facebook
} from "lucide-react";

interface AccountManagerProps {
  userId: number;
}

export function AccountManager({ userId }: AccountManagerProps) {
  const [showCredentials, setShowCredentials] = useState<{[key: string]: boolean}>({});
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [credentials, setCredentials] = useState<{[key: string]: string}>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: connectedAccounts, isLoading } = useQuery({
    queryKey: ['/api/accounts/connected', userId],
    enabled: !!userId
  });

  const { data: platformOptions } = useQuery({
    queryKey: ['/api/platforms/available'],
    enabled: !!userId
  });

  const connectAccountMutation = useMutation({
    mutationFn: async (accountData: any) => {
      const response = await fetch("https://srv885171.hstgr.cloud/api/accounts/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(accountData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to connect account");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/accounts/connected'] });
      setIsDialogOpen(false);
      setCredentials({});
      setSelectedPlatform("");
      toast({
        title: "Account Connected Successfully!",
        description: `Your ${data.platform} account is now connected and syncing data.`
      });
    },
    onError: (error: any) => {
      toast({
        title: "Connection Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive"
      });
    }
  });

  const disconnectAccountMutation = useMutation({
    mutationFn: async (accountId: string) => {
      const response = await fetch(`https://srv885171.hstgr.cloud/api/accounts/disconnect/${accountId}`, {
        method: "DELETE"
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/accounts/connected'] });
      toast({
        title: "Account Disconnected",
        description: "The social media account has been safely removed."
      });
    }
  });

  const testConnectionMutation = useMutation({
    mutationFn: async (testData: any) => {
      const response = await fetch("https://srv885171.hstgr.cloud/api/accounts/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData)
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Connection Test Successful!",
        description: `Successfully connected to ${data.username || 'your account'} with ${data.followerCount || 'N/A'} followers.`
      });
    },
    onError: (error: any) => {
      toast({
        title: "Connection Test Failed",
        description: "Please verify your credentials and try again.",
        variant: "destructive"
      });
    }
  });

  const platforms = [
    { 
      id: "tiktok", 
      name: "TikTok", 
      icon: "🎵", 
      color: "#000000",
      fields: [
        { key: "access_token", label: "Access Token", type: "password" },
        { key: "client_key", label: "Client Key", type: "text" }
      ]
    },
    { 
      id: "instagram", 
      name: "Instagram", 
      icon: "📷", 
      color: "#E4405F",
      fields: [
        { key: "access_token", label: "Access Token", type: "password" },
        { key: "app_id", label: "App ID", type: "text" }
      ]
    },
    { 
      id: "youtube", 
      name: "YouTube", 
      icon: "📺", 
      color: "#FF0000",
      fields: [
        { key: "api_key", label: "API Key", type: "password" },
        { key: "channel_id", label: "Channel ID", type: "text" }
      ]
    },
    { 
      id: "twitter", 
      name: "Twitter", 
      icon: "🐦", 
      color: "#1DA1F2",
      fields: [
        { key: "api_key", label: "API Key", type: "password" },
        { key: "api_secret", label: "API Secret", type: "password" },
        { key: "access_token", label: "Access Token", type: "password" },
        { key: "access_secret", label: "Access Token Secret", type: "password" }
      ]
    },
    { 
      id: "facebook", 
      name: "Facebook", 
      icon: "📘", 
      color: "#1877F2",
      fields: [
        { key: "access_token", label: "Page Access Token", type: "password" },
        { key: "page_id", label: "Page ID", type: "text" }
      ]
    },
    { 
      id: "onlyfans", 
      name: "OnlyFans", 
      icon: "💎", 
      color: "#00AFF0",
      fields: [
        { key: "access_token", label: "Access Token", type: "password" },
        { key: "user_id", label: "User ID", type: "text" }
      ]
    },
    { 
      id: "snapchat", 
      name: "Snapchat", 
      icon: "👻", 
      color: "#FFFC00",
      fields: [
        { key: "access_token", label: "Access Token", type: "password" },
        { key: "app_id", label: "App ID", type: "text" }
      ]
    }
  ];

  const connected = connectedAccounts?.accounts || [];
  const selectedPlatformData = platforms.find(p => p.id === selectedPlatform);

  const handleConnect = () => {
    if (!selectedPlatform || !selectedPlatformData) {
      toast({
        title: "Please select a platform",
        description: "Choose which social media platform you want to connect.",
        variant: "destructive"
      });
      return;
    }

    const missingFields = selectedPlatformData.fields.filter(field => !credentials[field.key]?.trim());
    if (missingFields.length > 0) {
      toast({
        title: "Missing credentials",
        description: `Please fill in: ${missingFields.map(f => f.label).join(", ")}`,
        variant: "destructive"
      });
      return;
    }

    connectAccountMutation.mutate({
      userId,
      platform: selectedPlatform,
      credentials: credentials,
      platformName: selectedPlatformData.name
    });
  };

  const handleTestConnection = () => {
    if (!selectedPlatform || !selectedPlatformData) return;

    testConnectionMutation.mutate({
      platform: selectedPlatform,
      credentials: credentials
    });
  };

  const toggleCredentialVisibility = (accountId: string) => {
    setShowCredentials(prev => ({
      ...prev,
      [accountId]: !prev[accountId]
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-20 bg-slate-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Social Media Accounts</h3>
          <p className="text-sm text-muted-foreground">
            Connect your social media accounts to get real analytics and post directly
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Connect Account
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Connect Social Media Account</DialogTitle>
              <DialogDescription>
                Add your social media credentials to sync real data and enable direct posting
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((platform) => (
                      <SelectItem key={platform.id} value={platform.id}>
                        <div className="flex items-center gap-2">
                          <span>{platform.icon}</span>
                          <span>{platform.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPlatformData && (
                <div className="space-y-4">
                  {selectedPlatformData.fields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label>{field.label}</Label>
                      <Input
                        type={field.type}
                        value={credentials[field.key] || ""}
                        onChange={(e) => setCredentials(prev => ({
                          ...prev,
                          [field.key]: e.target.value
                        }))}
                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                      />
                    </div>
                  ))}

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={handleTestConnection}
                      disabled={testConnectionMutation.isPending}
                      className="flex-1"
                    >
                      {testConnectionMutation.isPending ? "Testing..." : "Test Connection"}
                    </Button>
                    <Button 
                      onClick={handleConnect}
                      disabled={connectAccountMutation.isPending}
                      className="flex-1"
                    >
                      {connectAccountMutation.isPending ? "Connecting..." : "Connect"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Connected Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {connected.length === 0 ? (
          <Card className="col-span-2">
            <CardContent className="p-8 text-center">
              <LinkIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h4 className="font-medium mb-2">No accounts connected</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Connect your social media accounts to unlock real analytics and direct posting
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Connect Your First Account
              </Button>
            </CardContent>
          </Card>
        ) : (
          connected.map((account: any) => (
            <Card key={account.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: account.color }}
                    >
                      {account.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{account.platformName}</h4>
                      <p className="text-sm text-muted-foreground">@{account.username || 'Connected'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {account.status === 'connected' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    )}
                    <Badge variant={account.status === 'connected' ? 'default' : 'secondary'}>
                      {account.status}
                    </Badge>
                  </div>
                </div>

                {account.stats && (
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Followers</p>
                      <p className="font-medium">{account.stats.followers?.toLocaleString() || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg Engagement</p>
                      <p className="font-medium">{account.stats.engagement || 'N/A'}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleCredentialVisibility(account.id)}
                  >
                    {showCredentials[account.id] ? (
                      <>
                        <EyeOff className="mr-2 h-4 w-4" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => disconnectAccountMutation.mutate(account.id)}
                    disabled={disconnectAccountMutation.isPending}
                  >
                    <Unlink className="mr-2 h-4 w-4" />
                    Disconnect
                  </Button>
                </div>

                {showCredentials[account.id] && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-medium">Connection Details</span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Connected: {new Date(account.connectedAt).toLocaleDateString()}</p>
                      <p>Last Sync: {account.lastSync ? new Date(account.lastSync).toLocaleString() : 'Never'}</p>
                      <p>Status: {account.statusMessage || 'Active connection'}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Security Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <h4 className="font-medium text-blue-900 mb-1">Security & Privacy</h4>
              <p className="text-blue-700">
                Your social media credentials are encrypted and stored securely. We only access the data you explicitly allow and never post without your permission. You can disconnect any account at any time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}