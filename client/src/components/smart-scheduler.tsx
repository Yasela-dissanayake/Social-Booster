import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar as CalendarIcon, Clock, Target, TrendingUp, Zap, 
  Users, Globe, Brain, Sparkles, Play, Pause, Settings,
  CheckCircle, AlertCircle, BarChart3, Eye
} from "lucide-react";

interface SmartSchedulerProps {
  userId: number;
}

export function SmartScheduler({ userId }: SmartSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [contentType, setContentType] = useState("video");
  const [platform, setPlatform] = useState("tiktok");
  const [autoOptimize, setAutoOptimize] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: schedulingData, isLoading } = useQuery({
    queryKey: ['/api/scheduler/optimal-times', userId, platform],
    enabled: !!userId
  });

  const { data: upcomingPosts } = useQuery({
    queryKey: ['/api/scheduler/upcoming', userId],
    enabled: !!userId
  });

  const { data: performanceInsights } = useQuery({
    queryKey: ['/api/scheduler/performance', userId, platform],
    enabled: !!userId
  });

  const schedulePostMutation = useMutation({
    mutationFn: async (scheduleData: any) => {
      const response = await fetch("https://srv885171.hstgr.cloud/api/scheduler/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheduleData)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/scheduler/upcoming'] });
      toast({
        title: "Content Scheduled Successfully!",
        description: "Your content has been optimized and scheduled for maximum engagement."
      });
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
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

  const optimalTimes = schedulingData?.optimalTimes || [
    { time: "6:00 PM", score: 95, engagement: "High", audience: "2.4M active" },
    { time: "8:30 PM", score: 92, engagement: "High", audience: "2.1M active" },
    { time: "12:00 PM", score: 88, engagement: "Medium", audience: "1.8M active" },
    { time: "9:00 AM", score: 82, engagement: "Medium", audience: "1.5M active" }
  ];

  const weeklySchedule = schedulingData?.weeklyOptimal || {
    Monday: { best: "7:00 PM", engagement: 89 },
    Tuesday: { best: "6:30 PM", engagement: 92 },
    Wednesday: { best: "8:00 PM", engagement: 94 },
    Thursday: { best: "7:30 PM", engagement: 96 },
    Friday: { best: "6:00 PM", engagement: 98 },
    Saturday: { best: "11:00 AM", engagement: 85 },
    Sunday: { best: "2:00 PM", engagement: 88 }
  };

  const upcoming = upcomingPosts?.posts || [
    { 
      id: 1, 
      title: "Morning Productivity Tips", 
      platform: "TikTok", 
      scheduledTime: "2024-05-24T18:00:00", 
      status: "scheduled",
      estimatedViews: "2.5M",
      optimizationScore: 95
    },
    { 
      id: 2, 
      title: "iPhone Hidden Features", 
      platform: "Instagram", 
      scheduledTime: "2024-05-24T20:30:00", 
      status: "processing",
      estimatedViews: "1.8M",
      optimizationScore: 89
    }
  ];

  const handleSchedulePost = () => {
    if (!selectedDate) {
      toast({
        title: "Please select a date",
        description: "Choose when you want to schedule your content.",
        variant: "destructive"
      });
      return;
    }

    const scheduleData = {
      userId,
      contentType,
      platform,
      scheduledDate: selectedDate.toISOString(),
      autoOptimize,
      title: "AI Generated Content",
      description: "Optimized for maximum engagement"
    };

    schedulePostMutation.mutate(scheduleData);
  };

  return (
    <div className="space-y-6">
      {/* AI Optimization Banner */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-blue-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900">AI-Powered Smart Scheduling</h3>
              <p className="text-sm text-blue-700">
                Our AI analyzes audience behavior, platform algorithms, and competitor data to find the perfect posting times for your content.
              </p>
            </div>
            <Switch 
              checked={autoOptimize} 
              onCheckedChange={setAutoOptimize}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="schedule" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schedule">Schedule Content</TabsTrigger>
          <TabsTrigger value="optimal">Optimal Times</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Posts</TabsTrigger>
          <TabsTrigger value="insights">Performance</TabsTrigger>
        </TabsList>

        {/* Schedule Content */}
        <TabsContent value="schedule" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-green-500" />
                  Schedule New Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Content Type</Label>
                    <Select value={contentType} onValueChange={setContentType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="image">Image Post</SelectItem>
                        <SelectItem value="story">Story</SelectItem>
                        <SelectItem value="carousel">Carousel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Content Title</Label>
                  <Input placeholder="Enter your content title..." />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Add a description..." rows={3} />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch 
                    id="auto-optimize" 
                    checked={autoOptimize}
                    onCheckedChange={setAutoOptimize}
                  />
                  <Label htmlFor="auto-optimize">Auto-optimize posting time</Label>
                </div>

                <Button 
                  onClick={handleSchedulePost} 
                  className="w-full"
                  disabled={schedulePostMutation.isPending}
                >
                  {schedulePostMutation.isPending ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Schedule with AI Optimization
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Optimal Times */}
        <TabsContent value="optimal" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  Today's Optimal Times
                </CardTitle>
                <CardDescription>
                  Best times to post for maximum engagement on {platform}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {optimalTimes.map((time, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-semibold">{time.time}</div>
                        <Badge variant={time.score > 90 ? "default" : "secondary"}>
                          {time.engagement}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{time.score}/100</div>
                        <div className="text-xs text-muted-foreground">{time.audience}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  Weekly Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(weeklySchedule).map(([day, data]) => (
                    <div key={day} className="flex items-center justify-between p-2 rounded">
                      <div className="font-medium">{day}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{data.best}</span>
                        <div className="w-16 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${data.engagement}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground">{data.engagement}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Upcoming Posts */}
        <TabsContent value="upcoming" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-purple-500" />
                Scheduled Content
              </CardTitle>
              <CardDescription>
                Your upcoming posts optimized for maximum engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcoming.map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{post.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{post.platform}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(post.scheduledTime).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>Est. {post.estimatedViews}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          <span>{post.optimizationScore}% optimized</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {post.status === "scheduled" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                      <Button variant="outline" size="sm">
                        <Settings className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Insights */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Engagement</p>
                    <p className="text-2xl font-bold">
                      {performanceInsights?.avgEngagement || '8.7%'}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+23.5% vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Optimal Posts</p>
                    <p className="text-2xl font-bold">
                      {performanceInsights?.optimalPosts || '87%'}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-blue-500" />
                </div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+12% this week</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Time Saved</p>
                    <p className="text-2xl font-bold">
                      {performanceInsights?.timeSaved || '24h'}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-500" />
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-purple-600">Weekly automation</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI Scheduling Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Peak Performance Window</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Your content performs 45% better when posted between 6-8 PM on weekdays. AI scheduling is automatically optimizing for these windows.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Audience Activity</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Your audience is most active during evening hours. Weekend posting shows 23% higher engagement for lifestyle content.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-800">Algorithm Insights</span>
                  </div>
                  <p className="text-sm text-purple-700">
                    Platform algorithms favor consistent posting. Your current schedule maintains optimal frequency for maximum reach and engagement.
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