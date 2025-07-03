import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar as CalendarIcon, Clock, Eye, TrendingUp, 
  Zap, Plus, Edit, MoreHorizontal, Video, Image as ImageIcon,
  Play, CheckCircle, AlertTriangle
} from "lucide-react";

interface ContentCalendarProps {
  userId: number;
}

export function ContentCalendar({ userId }: ContentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  const { data: calendarData, isLoading } = useQuery({
    queryKey: ['/api/calendar/content', userId, selectedDate?.getMonth(), selectedDate?.getFullYear()],
    enabled: !!userId && !!selectedDate
  });

  const { data: todayContent } = useQuery({
    queryKey: ['/api/calendar/today', userId],
    enabled: !!userId
  });

  const { data: upcomingContent } = useQuery({
    queryKey: ['/api/calendar/upcoming', userId],
    enabled: !!userId
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

  const platforms = [
    { id: "all", name: "All Platforms", color: "#6366f1" },
    { id: "tiktok", name: "TikTok", color: "#000000" },
    { id: "instagram", name: "Instagram", color: "#E4405F" },
    { id: "youtube", name: "YouTube", color: "#FF0000" },
    { id: "twitter", name: "Twitter", color: "#1DA1F2" }
  ];

  const scheduledContent = calendarData?.content || [
    {
      id: 1,
      title: "Morning Productivity Tips",
      platform: "TikTok",
      scheduledTime: "2024-05-24T18:00:00",
      type: "video",
      status: "scheduled",
      estimatedViews: "2.5M",
      viralScore: 95,
      color: "#000000"
    },
    {
      id: 2,
      title: "iPhone Hidden Features",
      platform: "Instagram",
      scheduledTime: "2024-05-24T20:30:00",
      type: "carousel",
      status: "ready",
      estimatedViews: "1.8M",
      viralScore: 89,
      color: "#E4405F"
    },
    {
      id: 3,
      title: "Study Methods That Work",
      platform: "YouTube",
      scheduledTime: "2024-05-25T15:00:00",
      type: "video",
      status: "draft",
      estimatedViews: "850K",
      viralScore: 82,
      color: "#FF0000"
    }
  ];

  const todayPosts = todayContent?.posts || [
    {
      id: 1,
      title: "AI Tools for Productivity",
      platform: "TikTok",
      time: "18:00",
      status: "scheduled",
      views: "2.5M est."
    },
    {
      id: 2,
      title: "Quick Recipe Hack",
      platform: "Instagram",
      time: "20:30",
      status: "published",
      views: "1.2M"
    }
  ];

  const upcoming = upcomingContent?.content || [
    {
      date: "Tomorrow",
      posts: [
        { title: "Morning Routine Update", platform: "Instagram", time: "06:00", score: 87 },
        { title: "Tech Review: iPhone 16", platform: "YouTube", time: "15:00", score: 92 }
      ]
    },
    {
      date: "This Week",
      posts: [
        { title: "Productivity Series Ep 1", platform: "TikTok", time: "18:00", score: 95 },
        { title: "Behind the Scenes", platform: "Instagram", time: "19:00", score: 78 }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-100 text-green-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "ready": return "bg-yellow-100 text-yellow-800";
      case "draft": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published": return <CheckCircle className="h-4 w-4" />;
      case "scheduled": return <Clock className="h-4 w-4" />;
      case "ready": return <Play className="h-4 w-4" />;
      case "draft": return <Edit className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Content Calendar</h3>
          <p className="text-sm text-muted-foreground">
            Plan and schedule your AI-generated content across all platforms
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {platforms.map((platform) => (
                <SelectItem key={platform.id} value={platform.id}>
                  {platform.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Content
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-blue-500" />
                Content Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
              
              {/* Scheduled Content for Selected Date */}
              {selectedDate && (
                <div className="mt-6 space-y-3">
                  <h4 className="font-medium">
                    Scheduled for {selectedDate.toLocaleDateString()}
                  </h4>
                  {scheduledContent
                    .filter(content => {
                      const contentDate = new Date(content.scheduledTime);
                      return contentDate.toDateString() === selectedDate.toDateString();
                    })
                    .map((content) => (
                      <div key={content.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: content.color }}
                          ></div>
                          <div>
                            <p className="font-medium text-sm">{content.title}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{content.platform}</span>
                              <span>•</span>
                              <span>{new Date(content.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(content.status)}>
                            {getStatusIcon(content.status)}
                            <span className="ml-1">{content.status}</span>
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  {scheduledContent.filter(content => {
                    const contentDate = new Date(content.scheduledTime);
                    return contentDate.toDateString() === selectedDate.toDateString();
                  }).length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No content scheduled for this date</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-500" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayPosts.map((post, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{post.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{post.platform}</span>
                        <span>•</span>
                        <span>{post.time}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(post.status)} variant="outline">
                        {post.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{post.views}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                Upcoming Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcoming.map((section, index) => (
                  <div key={index}>
                    <h4 className="font-medium text-sm mb-2">{section.date}</h4>
                    <div className="space-y-2">
                      {section.posts.map((post, postIndex) => (
                        <div key={postIndex} className="flex items-center justify-between p-2 bg-slate-50 rounded text-sm">
                          <div className="flex-1">
                            <p className="font-medium">{post.title}</p>
                            <p className="text-xs text-muted-foreground">{post.platform} • {post.time}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-medium text-blue-600">{post.score}/100</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Scheduled Posts</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Est. Total Views</span>
                  <span className="font-medium">8.4M</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Viral Score</span>
                  <span className="font-medium">87/100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Platforms</span>
                  <span className="font-medium">5 Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}