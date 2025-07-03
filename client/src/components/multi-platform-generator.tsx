import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Zap, Globe, TrendingUp, Copy, CheckCircle, Eye, Hash, Clock, Shield } from "lucide-react";
import { AgeVerification, useAgeVerification } from "./age-verification";

interface MultiPlatformGeneratorProps {
  userId: number;
}

export function MultiPlatformGenerator({ userId }: MultiPlatformGeneratorProps) {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("engaging");
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [copiedPlatforms, setCopiedPlatforms] = useState<Set<string>>(new Set());
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState(false);

  const { toast } = useToast();
  const { checkVerification } = useAgeVerification();
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/generate/multi-platform", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedContent(data);
      toast({
        title: "🚀 Multi-Platform Content Generated!",
        description: `Created ${data.totalVariations} optimized variations with ${data.estimatedTotalReach.toLocaleString()} total estimated reach!`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/content/recent/" + userId] });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic to generate content for",
        variant: "destructive",
      });
      return;
    }

    generateMutation.mutate({
      userId,
      topic: topic.trim(),
      style
    });
  };

  const handleCopyContent = (platform: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedPlatforms(prev => new Set([...prev, platform]));
    toast({
      title: "Copied!",
      description: `${platform} content copied to clipboard`,
    });
    
    setTimeout(() => {
      setCopiedPlatforms(prev => {
        const newSet = new Set(prev);
        newSet.delete(platform);
        return newSet;
      });
    }, 2000);
  };

  const getPlatformIcon = (platform: string) => {
    const icons: any = {
      TikTok: "🎵",
      Instagram: "📸", 
      YouTube: "🎬",
      Twitter: "🐦",
      Facebook: "👥",
      Snapchat: "👻",
      OnlyFans: "💎"
    };
    return icons[platform] || "📱";
  };

  const getPlatformColor = (platform: string) => {
    const colors: any = {
      TikTok: "bg-black text-white",
      Instagram: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
      YouTube: "bg-red-600 text-white",
      Twitter: "bg-blue-500 text-white", 
      Facebook: "bg-blue-700 text-white",
      Snapchat: "bg-yellow-400 text-black",
      OnlyFans: "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
    };
    return colors[platform] || "bg-gray-500 text-white";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Globe className="w-6 h-6" />
            Multi-Platform Content Generator
            <Badge className="bg-white/20 text-white">6 Platforms</Badge>
          </CardTitle>
          <p className="text-blue-100">
            Generate optimized content variations for all major social media platforms instantly
          </p>
        </CardHeader>
      </Card>

      {/* Generation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Content Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="Enter your content topic (e.g., Productivity Tips, Fitness Journey, Tech Reviews)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="style">Content Style</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engaging">Engaging</SelectItem>
                <SelectItem value="viral">Viral</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="storytelling">Storytelling</SelectItem>
                <SelectItem value="educational">Educational</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={generateMutation.isPending || !topic.trim()}
            className="w-full"
            size="lg"
          >
            {generateMutation.isPending ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-pulse" />
                Generating Across All Platforms...
              </>
            ) : (
              <>
                <Globe className="w-4 h-4 mr-2" />
                Generate Multi-Platform Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Content Results */}
      {generatedContent && (
        <div className="space-y-6">
          {/* Strategy Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Cross-Platform Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{generatedContent.totalVariations}</div>
                  <div className="text-sm text-gray-600">Platform Variations</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {generatedContent.estimatedTotalReach?.toLocaleString() || '1M+'}
                  </div>
                  <div className="text-sm text-gray-600">Total Estimated Reach</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{generatedContent.crossPlatformStrategy?.timingGaps || '2-4h'}</div>
                  <div className="text-sm text-gray-600">Posting Intervals</div>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <strong>Recommended Posting Order:</strong> {generatedContent.crossPlatformStrategy?.postingOrder?.join(' → ') || 'TikTok → Instagram → YouTube → Twitter → Facebook → Snapchat'}
              </div>
            </CardContent>
          </Card>

          {/* Platform Variations */}
          <Card>
            <CardHeader>
              <CardTitle>Platform-Optimized Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="TikTok" className="w-full">
                <TabsList className="grid w-full grid-cols-7">
                  {Object.keys(generatedContent.variations || {}).map((platform) => (
                    <TabsTrigger key={platform} value={platform} className="text-xs">
                      {getPlatformIcon(platform)} {platform}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.entries(generatedContent.variations || {}).map(([platform, content]: [string, any]) => (
                  <TabsContent key={platform} value={platform} className="space-y-4">
                    <div className={`p-4 rounded-lg ${getPlatformColor(platform)}`}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold">
                          {getPlatformIcon(platform)} {platform} Optimized
                        </h3>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleCopyContent(platform, content.content)}
                          className="bg-white/20 hover:bg-white/30"
                        >
                          {copiedPlatforms.has(platform) ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      
                      {content.format && (
                        <Badge className="mb-3 bg-white/20">
                          {content.format.replace('_', ' ').toUpperCase()}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Title</h4>
                        <p className="text-sm bg-gray-50 p-3 rounded border">{content.title}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Content</h4>
                        <div className="text-sm bg-gray-50 p-3 rounded border whitespace-pre-wrap">
                          {content.content}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Hash className="w-4 h-4" />
                            Hashtags
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {content.hashtags?.map((tag: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Eye className="w-4 h-4" />
                            <span>Est. Views: {content.estimatedViews?.toLocaleString() || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <TrendingUp className="w-4 h-4" />
                            <span>Quality Score: {content.qualityScore || 90}/100</span>
                          </div>
                          {content.duration && (
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4" />
                              <span>Duration: {content.duration}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Platform-specific features */}
                      {content.hooks && (
                        <div>
                          <h4 className="font-semibold mb-2">Platform-Specific Hooks</h4>
                          <div className="text-xs text-gray-600">
                            {content.hooks.join(' • ')}
                          </div>
                        </div>
                      )}

                      {content.description && (
                        <div>
                          <h4 className="font-semibold mb-2">Video Description</h4>
                          <p className="text-sm text-gray-600">{content.description}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}