import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Lock, 
  Activity,
  TrendingUp,
  Zap,
  Users,
  Clock,
  Home,
  ArrowLeft,
  Bot,
  Database,
  Network
} from "lucide-react";
import { Link } from "wouter";

export default function SecurityPage() {
  const [securityScore, setSecurityScore] = useState(94);
  const [activeThreats, setActiveThreats] = useState(0);
  const [blockedAttempts, setBlockedAttempts] = useState(127);

  const securityMetrics = {
    totalScans: 12847,
    threatsBlocked: 156,
    aiModerationSuccess: 99.2,
    encryptionStatus: 'Active',
    lastScan: '2 minutes ago'
  };

  const recentThreats = [
    { type: 'Brute Force', source: '192.168.1.45', blocked: true, time: '3 min ago', severity: 'high' },
    { type: 'XSS Attempt', source: '10.0.0.23', blocked: true, time: '8 min ago', severity: 'medium' },
    { type: 'SQL Injection', source: '172.16.0.5', blocked: true, time: '15 min ago', severity: 'high' },
    { type: 'Malicious Content', source: 'User submission', blocked: true, time: '22 min ago', severity: 'medium' },
    { type: 'Rate Limit Exceeded', source: '203.0.113.1', blocked: true, time: '35 min ago', severity: 'low' }
  ];

  const aiProtections = [
    { name: 'Content Moderation AI', status: 'Active', accuracy: 99.2, threats: 34 },
    { name: 'Behavior Analysis', status: 'Active', accuracy: 96.8, threats: 12 },
    { name: 'Threat Intelligence', status: 'Active', accuracy: 94.5, threats: 8 },
    { name: 'Real-time Monitoring', status: 'Active', accuracy: 98.1, threats: 23 }
  ];

  const getSecurityScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Shield className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AI Security Center</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Advanced AI-powered protection and threat monitoring
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Security Status */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm font-medium">All Systems Protected</span>
          </div>
          <Badge variant="default" className="bg-green-100 text-green-800">
            Security Score: {securityScore}%
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Security Overview</TabsTrigger>
          <TabsTrigger value="ai-protection">AI Protection</TabsTrigger>
          <TabsTrigger value="threats">Threat Monitor</TabsTrigger>
          <TabsTrigger value="settings">Security Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Security Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Health Score
              </CardTitle>
              <CardDescription>
                Overall security posture based on AI analysis and threat detection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeDasharray={`${securityScore}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-2xl font-bold ${getSecurityScoreColor(securityScore)}`}>
                      {securityScore}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-green-600">{securityMetrics.totalScans.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Security Scans</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-600">{securityMetrics.threatsBlocked}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Threats Blocked</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <Bot className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold text-purple-600">{securityMetrics.aiModerationSuccess}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">AI Accuracy</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <Lock className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <div className="text-2xl font-bold text-orange-600">256-bit</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Encryption</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Security Activity Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentThreats.map((threat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${threat.blocked ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="font-medium">{threat.type}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">From: {threat.source}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getSeverityColor(threat.severity)} text-white mb-1`}>
                        {threat.severity}
                      </Badge>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{threat.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Protection Tab */}
        <TabsContent value="ai-protection" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Security Systems
              </CardTitle>
              <CardDescription>
                Advanced AI-powered protection mechanisms actively defending your platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiProtections.map((protection, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <h3 className="font-medium">{protection.name}</h3>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {protection.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {protection.threats} threats blocked today
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Accuracy Rate</span>
                        <span>{protection.accuracy}%</span>
                      </div>
                      <Progress value={protection.accuracy} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Protection Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Content Moderation
                  </h4>
                  <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Real-time content scanning</li>
                    <li>• Hate speech detection</li>
                    <li>• Spam and phishing protection</li>
                    <li>• Adult content filtering</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Behavior Analysis
                  </h4>
                  <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Suspicious activity detection</li>
                    <li>• Bot behavior identification</li>
                    <li>• Usage pattern analysis</li>
                    <li>• Account takeover prevention</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Threats Tab */}
        <TabsContent value="threats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Threats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{activeThreats}</div>
                <p className="text-sm text-gray-600">Currently being monitored</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Blocked Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{blockedAttempts}</div>
                <p className="text-sm text-gray-600">Malicious attempts stopped</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">Secure</div>
                <p className="text-sm text-gray-600">All protections active</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Configuration</CardTitle>
              <CardDescription>
                Manage your AI security settings and protection levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Real-time AI Monitoring</h4>
                    <p className="text-sm text-gray-600">Continuous threat detection and response</p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Advanced Content Filtering</h4>
                    <p className="text-sm text-gray-600">AI-powered content moderation</p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Behavioral Analysis</h4>
                    <p className="text-sm text-gray-600">Detect suspicious user patterns</p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Rate Limiting</h4>
                    <p className="text-sm text-gray-600">Prevent abuse and DDoS attacks</p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}