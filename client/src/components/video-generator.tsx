import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Video, Play, Film, Camera, Clock, TrendingUp, 
  Sparkles, Download, Share, Eye, Users, Loader2,
  Scissors, Volume2, Image as ImageIcon, Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { VideoEditor } from "./video-editor";

const platforms = [
  { name: "TikTok", maxDuration: 180, aspectRatio: "9:16", optimal: 30 },
  { name: "Instagram", maxDuration: 90, aspectRatio: "9:16", optimal: 30 },
  { name: "YouTube", maxDuration: 600, aspectRatio: "16:9", optimal: 180 },
  { name: "Facebook", maxDuration: 240, aspectRatio: "16:9", optimal: 60 },
  { name: "Twitter", maxDuration: 140, aspectRatio: "16:9", optimal: 45 },
  { name: "Snapchat", maxDuration: 60, aspectRatio: "9:16", optimal: 15 }
];

const videoStyles = [
  { value: "viral", label: "Viral Hook", description: "High-energy content designed to go viral" },
  { value: "educational", label: "Educational", description: "Informative content that teaches" },
  { value: "entertainment", label: "Entertainment", description: "Fun and engaging content" },
  { value: "promotional", label: "Promotional", description: "Product or service promotion" }
];

export function VideoGenerator() {
  const [activeTab, setActiveTab] = useState("single");
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("");
  const [style, setStyle] = useState("viral");
  const [duration, setDuration] = useState("");
  const [episodeCount, setEpisodeCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<any>(null);
  const [generatedSeries, setGeneratedSeries] = useState<any[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const { toast } = useToast();

  const selectedPlatform = platforms.find(p => p.name === platform);

  const handleGenerateVideo = async () => {
    if (!topic.trim() || !platform) {
      toast({
        title: "Missing Information",
        description: "Please enter a topic and select a platform.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("https://srv885171.hstgr.cloud/api/video/generate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          platform,
          style,
          duration: duration ? parseInt(duration) : undefined,
          userId: 1
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedVideo(data.project);
        toast({
          title: "Video Generated!",
          description: `Created ${data.project.scenes?.length || 0} scenes for ${platform}.`
        });
      } else {
        throw new Error(data.error || "Failed to generate video");
      }
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Unable to generate video. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateSeries = async () => {
    if (!topic.trim() || !platform) {
      toast({
        title: "Missing Information",
        description: "Please enter a topic and select a platform.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("https://srv885171.hstgr.cloud/api/video/generate-series", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          platform,
          episodeCount,
          userId: 1
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedSeries(data.series);
        toast({
          title: "Series Generated!",
          description: `Created ${data.totalVideos} connected videos for your series.`
        });
      } else {
        throw new Error(data.error || "Failed to generate series");
      }
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Unable to generate series. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-red-500" />
            AI Video Generator
          </CardTitle>
          <CardDescription>
            Create professional viral videos with AI-powered scene planning and optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="single">Single Video</TabsTrigger>
              <TabsTrigger value="series">Video Series</TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Video Topic</Label>
                  <Textarea
                    id="topic"
                    placeholder="e.g., '5 Morning Habits That Changed My Life', 'How to Start a Side Business'"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((p) => (
                        <SelectItem key={p.name} value={p.name}>
                          <div className="flex items-center justify-between w-full">
                            <span>{p.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {p.aspectRatio} • {p.optimal}s optimal
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="style">Video Style</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {videoStyles.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          <div>
                            <div className="font-medium">{s.label}</div>
                            <div className="text-xs text-muted-foreground">{s.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedPlatform && (
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (seconds)</Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder={`Default: ${selectedPlatform.optimal}s (Max: ${selectedPlatform.maxDuration}s)`}
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      max={selectedPlatform.maxDuration}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {selectedPlatform && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">{selectedPlatform.name} Specifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Aspect Ratio:</span>
                        <span>{selectedPlatform.aspectRatio}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Optimal Length:</span>
                        <span>{selectedPlatform.optimal}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max Duration:</span>
                        <span>{formatDuration(selectedPlatform.maxDuration)}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <TabsContent value="series" className="mt-0">
                  <div className="space-y-2">
                    <Label htmlFor="episodes">Number of Episodes</Label>
                    <Input
                      id="episodes"
                      type="number"
                      min="2"
                      max="10"
                      value={episodeCount}
                      onChange={(e) => setEpisodeCount(parseInt(e.target.value) || 5)}
                    />
                  </div>
                </TabsContent>
              </div>
            </div>

            <TabsContent value="single">
              <Button 
                onClick={handleGenerateVideo} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Video Project...
                  </>
                ) : (
                  <>
                    <Film className="mr-2 h-4 w-4" />
                    Generate Video Project
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="series">
              <Button 
                onClick={handleGenerateSeries} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Video Series...
                  </>
                ) : (
                  <>
                    <Video className="mr-2 h-4 w-4" />
                    Generate Video Series
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Single Video Results */}
      {generatedVideo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{generatedVideo.title}</span>
              <Badge variant="secondary">{generatedVideo.platform}</Badge>
            </CardTitle>
            <CardDescription>
              {generatedVideo.duration}s • {generatedVideo.scenes?.length} scenes • 
              Estimated {generatedVideo.metadata?.estimatedViews?.toLocaleString()} views
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="scenes" className="space-y-4">
              <TabsList>
                <TabsTrigger value="scenes">Scenes</TabsTrigger>
                <TabsTrigger value="metadata">Analytics</TabsTrigger>
                <TabsTrigger value="thumbnail">Thumbnail</TabsTrigger>
              </TabsList>

              <TabsContent value="scenes" className="space-y-4">
                {generatedVideo.scenes?.map((scene: any, index: number) => (
                  <Card key={scene.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <Badge variant="outline">Scene {index + 1}</Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {scene.timing?.start}s - {scene.timing?.end}s
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className="text-xs" variant={
                            scene.type === 'hook' ? 'default' :
                            scene.type === 'content' ? 'secondary' :
                            scene.type === 'transition' ? 'outline' : 'destructive'
                          }>
                            {scene.type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{scene.cameraAngle}</span>
                        </div>
                        <p className="text-sm font-medium">{scene.script}</p>
                        <p className="text-xs text-muted-foreground">{scene.visualDescription}</p>
                        {scene.textOverlay && (
                          <div className="text-xs bg-muted p-2 rounded">
                            Text Overlay: "{scene.textOverlay}"
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="metadata" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 text-center">
                    <Eye className="h-5 w-5 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold">
                      {generatedVideo.metadata?.estimatedViews?.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Estimated Views</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <TrendingUp className="h-5 w-5 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold">
                      {generatedVideo.metadata?.engagementScore}%
                    </div>
                    <div className="text-xs text-muted-foreground">Engagement Score</div>
                  </Card>
                  <Card className="p-4 text-center">
                    <Zap className="h-5 w-5 mx-auto mb-2 text-purple-500" />
                    <div className="text-2xl font-bold">
                      {generatedVideo.metadata?.viralPotential}%
                    </div>
                    <div className="text-xs text-muted-foreground">Viral Potential</div>
                  </Card>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Recommended Hashtags</h4>
                    <div className="flex flex-wrap gap-1">
                      {generatedVideo.metadata?.hashtags?.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">
                      {generatedVideo.metadata?.description}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="thumbnail">
                <div className="space-y-4">
                  <div className="text-center p-8 border-2 border-dashed border-muted rounded-lg">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-medium mb-2">{generatedVideo.thumbnail?.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {generatedVideo.thumbnail?.description}
                    </p>
                    <Button variant="outline">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate AI Thumbnail
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Video Series Results */}
      {generatedSeries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Video Series</CardTitle>
            <CardDescription>
              {generatedSeries.length} connected videos created for {platform}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedSeries.map((video, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{video.title}</h4>
                    <Badge variant="outline">Episode {index + 1}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {video.duration}s • {video.scenes?.length} scenes
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {video.metadata?.estimatedViews?.toLocaleString()} views
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {video.metadata?.viralPotential}% viral potential
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}