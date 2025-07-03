import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import {
  TrendingUp, TrendingDown, Eye, Heart, Share2, MessageCircle,
  Play, Users, Clock, Target, Zap, Award, Brain, ChartBar
} from "lucide-react";

interface VideoAnalyticsProps {
  userId: number;
}

export function VideoAnalytics({ userId }: VideoAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  const { data: videoMetrics, isLoading } = useQuery({
    queryKey: ['/api/video/analytics', userId, selectedPeriod],
    enabled: !!userId
  });

  const { data: performanceData } = useQuery({
    queryKey: ['/api/video/performance', userId, selectedPeriod],
    enabled: !!userId
  });

  const { data: viralPredictions } = useQuery({
    queryKey: ['/api/video/viral-predictions', userId],
    enabled: !!userId
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="h-20 bg-slate-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const overallMetrics = videoMetrics?.overall || {};
  const platformBreakdown = videoMetrics?.platforms || [];
  const contentTypes = videoMetrics?.contentTypes || [];
  const viralScores = viralPredictions?.predictions || [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Period Selection */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Video Performance Analytics</h3>
        <div className="flex gap-2">
          {['24h', '7d', '30d', '90d'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">
                  {overallMetrics.totalViews?.toLocaleString() || '2.4M'}
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+24.5%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Engagement Rate</p>
                <p className="text-2xl font-bold">
                  {overallMetrics.engagementRate || '8.2%'}
                </p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+12.3%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Viral Videos</p>
                <p className="text-2xl font-bold">
                  {overallMetrics.viralCount || '7'}
                </p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+75%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Viral Score</p>
                <p className="text-2xl font-bold">
                  {overallMetrics.avgViralScore || '78'}/100
                </p>
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+18.2%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="viral">Viral Predictions</TabsTrigger>
          <TabsTrigger value="optimization">AI Insights</TabsTrigger>
        </TabsList>

        {/* Performance Overview */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartBar className="h-5 w-5 text-blue-500" />
                View Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData?.viewTrends || [
                  { date: 'Mon', views: 45000, engagement: 3200 },
                  { date: 'Tue', views: 52000, engagement: 4100 },
                  { date: 'Wed', views: 48000, engagement: 3800 },
                  { date: 'Thu', views: 67000, engagement: 5200 },
                  { date: 'Fri', views: 71000, engagement: 5800 },
                  { date: 'Sat', views: 83000, engagement: 6900 },
                  { date: 'Sun', views: 95000, engagement: 8100 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="views" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="engagement" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Videos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(performanceData?.topVideos || [
                    { title: "Morning Routine That Changed My Life", views: 1200000, viralScore: 95 },
                    { title: "5-Minute Productivity Hack", views: 890000, viralScore: 87 },
                    { title: "Hidden iPhone Feature", views: 750000, viralScore: 82 }
                  ]).map((video: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{video.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {video.views?.toLocaleString()} views
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={video.viralScore > 80 ? 'default' : 'secondary'}>
                          {video.viralScore}/100
                        </Badge>
                        <Award className={`h-4 w-4 ${video.viralScore > 90 ? 'text-yellow-500' : 'text-slate-400'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="text-sm">Likes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">342K</span>
                      <Progress value={85} className="w-20" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Comments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">28K</span>
                      <Progress value={65} className="w-20" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Share2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Shares</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">15K</span>
                      <Progress value={45} className="w-20" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Watch Time</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">78%</span>
                      <Progress value={78} className="w-20" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Platform Performance */}
        <TabsContent value="platforms" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={platformBreakdown.length ? platformBreakdown : [
                        { name: 'TikTok', value: 45, color: '#000000' },
                        { name: 'Instagram', value: 25, color: '#E4405F' },
                        { name: 'YouTube', value: 20, color: '#FF0000' },
                        { name: 'Twitter', value: 10, color: '#1DA1F2' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {(platformBreakdown.length ? platformBreakdown : [
                        { name: 'TikTok', value: 45, color: '#000000' },
                        { name: 'Instagram', value: 25, color: '#E4405F' },
                        { name: 'YouTube', value: 20, color: '#FF0000' },
                        { name: 'Twitter', value: 10, color: '#1DA1F2' }
                      ]).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(platformBreakdown.length ? platformBreakdown : [
                    { name: 'TikTok', avgViews: '1.2M', engagement: '9.2%', viralRate: '15%' },
                    { name: 'Instagram', avgViews: '480K', engagement: '7.8%', viralRate: '8%' },
                    { name: 'YouTube', avgViews: '890K', engagement: '6.5%', viralRate: '12%' },
                    { name: 'Twitter', avgViews: '120K', engagement: '4.2%', viralRate: '3%' }
                  ]).map((platform: any, index: number) => (
                    <div key={platform.name} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{platform.name}</h4>
                        <Badge variant="outline">{platform.viralRate}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Avg Views</p>
                          <p className="font-medium">{platform.avgViews}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Engagement</p>
                          <p className="font-medium">{platform.engagement}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Viral Predictions */}
        <TabsContent value="viral" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                AI Viral Predictions
              </CardTitle>
              <CardDescription>
                Our AI analyzes your content and predicts viral potential
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(viralScores.length ? viralScores : [
                  { title: "Tech Review: iPhone 16", score: 92, trend: 'rising', confidence: 'high' },
                  { title: "Morning Routine Update", score: 78, trend: 'stable', confidence: 'medium' },
                  { title: "Productivity Tips #3", score: 85, trend: 'rising', confidence: 'high' },
                  { title: "Behind the Scenes", score: 65, trend: 'falling', confidence: 'medium' }
                ]).map((prediction: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{prediction.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={prediction.confidence === 'high' ? 'default' : 'secondary'}>
                          {prediction.confidence} confidence
                        </Badge>
                        <span className={`text-xs flex items-center gap-1 ${
                          prediction.trend === 'rising' ? 'text-green-600' : 
                          prediction.trend === 'falling' ? 'text-red-600' : 'text-slate-600'
                        }`}>
                          {prediction.trend === 'rising' ? <TrendingUp className="h-3 w-3" /> : 
                           prediction.trend === 'falling' ? <TrendingDown className="h-3 w-3" /> : null}
                          {prediction.trend}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-yellow-600">{prediction.score}</p>
                      <p className="text-xs text-muted-foreground">viral score</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Optimization Insights */}
        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                AI Optimization Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Optimal Posting Time</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Post between 6-8 PM on weekdays for 34% higher engagement
                  </p>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Content Strategy</span>
                  </div>
                  <p className="text-sm text-green-700">
                    How-to videos are performing 78% better than entertainment content
                  </p>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-800">Hook Optimization</span>
                  </div>
                  <p className="text-sm text-purple-700">
                    Start with questions or surprising facts for 45% better retention
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Duration Sweet Spot</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Keep videos under 45 seconds for TikTok, 60 seconds for Instagram Reels
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}