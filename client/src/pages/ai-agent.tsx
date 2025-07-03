import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  Heart, 
  MessageCircle, 
  Share, 
  TrendingUp,
  Clock,
  Target,
  Shield,
  Zap,
  Users,
  Activity,
  CheckCircle,
  AlertTriangle,
  Brain,
  Home,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { Link } from "wouter";

export default function AIAgentPage() {
  const [isAgentActive, setIsAgentActive] = useState(false);
  const [engagementRate, setEngagementRate] = useState([75]);
  const [activityLevel, setActivityLevel] = useState([50]);
  const [safetyMode, setSafetyMode] = useState(true);

  const platforms = [
    { name: "Instagram", enabled: true, status: "active", followers: 2456 },
    { name: "TikTok", enabled: true, status: "active", followers: 8923 },
    { name: "Twitter", enabled: false, status: "paused", followers: 1234 },
    { name: "YouTube", enabled: true, status: "active", followers: 567 },
    { name: "Facebook", enabled: false, status: "inactive", followers: 890 },
  ];

  const recentActivity = [
    { action: "Auto-created viral post", platform: "Instagram", time: "1 min ago", success: true },
    { action: "Generated trending content", platform: "TikTok", time: "3 min ago", success: true },
    { action: "Liked post", platform: "Instagram", time: "5 min ago", success: true },
    { action: "Posted smart comment", platform: "TikTok", time: "8 min ago", success: true },
    { action: "Auto-posted story", platform: "Instagram", time: "12 min ago", success: true },
    { action: "Shared quality content", platform: "Instagram", time: "15 min ago", success: true },
    { action: "Followed similar creator", platform: "TikTok", time: "18 min ago", success: true },
    { action: "Generated daily post", platform: "YouTube", time: "22 min ago", success: true },
  ];

  const agentStats = {
    totalActions: 1247,
    successRate: 94.2,
    newFollowers: 156,
    engagementBoost: 73
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Bot className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AI Social Media Agent</h1>
              <p className="text-gray-600 dark:text-gray-400">
                24/7 automated social media management and growth
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
        
        {/* Quick Status */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isAgentActive ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className="text-sm font-medium">
              {isAgentActive ? 'Agent Active' : 'Agent Paused'}
            </span>
          </div>
          <Badge variant={isAgentActive ? "default" : "secondary"}>
            {isAgentActive ? 'Running' : 'Stopped'}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="settings">Agent Settings</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Control Panel */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Agent Control Panel
                  </CardTitle>
                  <CardDescription>
                    Start, stop, and monitor your AI social media agent
                  </CardDescription>
                </div>
                <Button
                  size="lg"
                  onClick={() => setIsAgentActive(!isAgentActive)}
                  className={isAgentActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                >
                  {isAgentActive ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Stop Agent
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Agent
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-600">{agentStats.totalActions}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Actions</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-green-600">{agentStats.successRate}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                  <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold text-purple-600">+{agentStats.newFollowers}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">New Followers</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <div className="text-2xl font-bold text-orange-600">+{agentStats.engagementBoost}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Engagement Boost</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Auto-Generated Content Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI-Generated Content Queue
              </CardTitle>
              <CardDescription>
                Content your agent has created and scheduled for posting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                  <div className="flex justify-between items-start mb-2">
                    <Badge>Instagram Post</Badge>
                    <span className="text-sm text-gray-600">Scheduled: Today 2:00 PM</span>
                  </div>
                  <p className="mb-2">"🚀 The future of content creation is here! AI isn't replacing creators - it's empowering them to focus on what matters most: authentic connection with their audience. #AICreator #ContentStrategy #SocialMediaGrowth"</p>
                  <div className="text-sm text-gray-600">Predicted engagement: 2.3K likes, 150 comments</div>
                </div>
                
                <div className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary">TikTok Video Script</Badge>
                    <span className="text-sm text-gray-600">Scheduled: Today 7:00 PM</span>
                  </div>
                  <p className="mb-2">"Hook: 'This AI tool just changed my entire workflow...' - 15-second demo of automated content creation process with trending audio overlay"</p>
                  <div className="text-sm text-gray-600">Viral potential: 85% - Trending topic match</div>
                </div>
                
                <div className="border rounded-lg p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">YouTube Short</Badge>
                    <span className="text-sm text-gray-600">Scheduled: Tomorrow 9:00 AM</span>
                  </div>
                  <p className="mb-2">"3 AI tools every content creator needs in 2025 - quick-fire tips that actually save time and boost engagement"</p>
                  <div className="text-sm text-gray-600">SEO score: 92% - High search potential</div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>Content in queue:</span>
                  <span className="font-medium">12 posts ready</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Agent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${activity.success ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{activity.platform}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{activity.time}</p>
                      {activity.success ? (
                        <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500 ml-auto" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          {/* AI Learning System */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Learning & Style Analysis
              </CardTitle>
              <CardDescription>
                Your agent learns from your content history to mirror your unique style
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Content Analysis</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Content analyzed</span>
                      <Badge>1,247 posts</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Writing style confidence</span>
                      <Badge variant="secondary">94%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tone patterns learned</span>
                      <Badge variant="outline">Advanced</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Detected Style Patterns</h4>
                  <div className="space-y-2">
                    <div className="text-sm bg-blue-50 dark:bg-blue-950 p-2 rounded">
                      <strong>Tone:</strong> Enthusiastic, motivational, friendly
                    </div>
                    <div className="text-sm bg-green-50 dark:bg-green-950 p-2 rounded">
                      <strong>Language:</strong> Casual with professional insights
                    </div>
                    <div className="text-sm bg-purple-50 dark:bg-purple-950 p-2 rounded">
                      <strong>Hashtags:</strong> 3-5 per post, trend-focused
                    </div>
                    <div className="text-sm bg-orange-50 dark:bg-orange-950 p-2 rounded">
                      <strong>Emojis:</strong> Strategic use, growth-oriented
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Learning Controls</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Label>Learn from successful posts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Label>Analyze engagement patterns</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Label>Adapt to trending topics</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch />
                    <Label>Copy competitor strategies</Label>
                  </div>
                </div>
              </div>

              <Button className="w-full">
                <Bot className="h-4 w-4 mr-2" />
                Re-analyze Content & Update Style
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Agent Behavior Settings
              </CardTitle>
              <CardDescription>
                Configure how your AI agent interacts on social media
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Safety Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Safety Mode</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enhanced safety checks and conservative engagement patterns
                  </p>
                </div>
                <Switch checked={safetyMode} onCheckedChange={setSafetyMode} />
              </div>

              <Separator />

              {/* Activity Level */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Activity Level: {activityLevel[0]}%</Label>
                <Slider
                  value={activityLevel}
                  onValueChange={setActivityLevel}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Controls how frequently the agent performs actions (lower = more conservative)
                </p>
              </div>

              <Separator />

              {/* Engagement Rate */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Target Engagement Rate: {engagementRate[0]}%</Label>
                <Slider
                  value={engagementRate}
                  onValueChange={setEngagementRate}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Desired engagement level for interactions and content discovery
                </p>
              </div>

              <Separator />

              {/* Interaction Preferences */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Interaction Types</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Label>Auto-like relevant posts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Label>Post thoughtful comments</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch />
                    <Label>Share quality content</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Label>Follow similar accounts</Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Auto Content Creation */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Automated Content Creation</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Label>Auto-generate daily posts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Label>Create trending content</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch />
                    <Label>Auto-post generated content</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked />
                    <Label>Generate story content</Label>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Content Creation Schedule</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Daily posts:</span>
                      <span className="font-medium">2-3 per day</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Optimal times:</span>
                      <span className="font-medium">9am, 2pm, 7pm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Content style:</span>
                      <span className="font-medium">Matches your voice</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Voice and Tone */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Agent Voice & Tone</Label>
                <Textarea
                  placeholder="Describe how you want your AI agent to communicate (e.g., friendly, professional, casual, enthusiastic...)"
                  className="min-h-[80px]"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  The agent will mirror this communication style in comments and interactions
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platforms Tab */}
        <TabsContent value="platforms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Connected Platforms
              </CardTitle>
              <CardDescription>
                Manage which social media platforms your agent monitors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platforms.map((platform, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full ${
                        platform.status === 'active' ? 'bg-green-500' : 
                        platform.status === 'paused' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`} />
                      <div>
                        <h3 className="font-medium">{platform.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {platform.followers.toLocaleString()} followers
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={
                        platform.status === 'active' ? 'default' : 
                        platform.status === 'paused' ? 'secondary' : 'outline'
                      }>
                        {platform.status}
                      </Badge>
                      <Switch checked={platform.enabled} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Growth Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Follower Growth</span>
                      <span>+12.3%</span>
                    </div>
                    <Progress value={78} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Engagement Rate</span>
                      <span>+23.1%</span>
                    </div>
                    <Progress value={85} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Reach Expansion</span>
                      <span>+45.7%</span>
                    </div>
                    <Progress value={92} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <div className="text-lg font-bold text-green-600">Safe & Authentic</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      No policy violations detected
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <Zap className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-lg font-bold text-blue-600">Highly Efficient</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      94.2% success rate on interactions
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}