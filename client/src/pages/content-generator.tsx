import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Wand2, Image, PenTool, Video, Hash, Copy, Download, Sparkles } from "lucide-react";
import type { GeneratedContent } from "@/lib/types";
import { BulkContentGenerator } from "@/components/bulk-content-generator";
import { GrowthComparison } from "@/components/growth-comparison";
import { SmartScheduler } from "@/components/smart-scheduler";

export default function ContentGenerator() {
  const [activeTab, setActiveTab] = useState("post");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("engaging");
  const [imagePrompt, setImagePrompt] = useState("");
  const [videoTopic, setVideoTopic] = useState("");
  const [videoDuration, setVideoDuration] = useState("30 seconds");
  const [hashtagContent, setHashtagContent] = useState("");
  const [hashtagNiche, setHashtagNiche] = useState("");
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userId = 1; // Demo user

  const { data: platforms } = useQuery({
    queryKey: ["/api/platforms"],
  });

  const generateContentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/generate/content", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedContent(data);
      toast({
        title: "Content Generated!",
        description: "Your AI-generated content is ready.",
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

  const generateImageMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const response = await apiRequest("POST", "/api/generate/image", { prompt });
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedContent(data);
      toast({
        title: "Image Generated!",
        description: "Your AI-generated image is ready.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateVideoScriptMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/generate/video-script", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedContent(data);
      toast({
        title: "Video Script Generated!",
        description: "Your AI-generated video script is ready.",
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

  const generateHashtagsMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/generate/hashtags", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedContent(data);
      toast({
        title: "Hashtags Generated!",
        description: "Your AI-generated hashtags are ready.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGenerateContent = () => {
    if (!selectedPlatform || !topic.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a platform and enter a topic.",
        variant: "destructive",
      });
      return;
    }

    generateContentMutation.mutate({
      userId,
      platformId: parseInt(selectedPlatform),
      contentType: activeTab,
      topic: topic.trim(),
      style,
    });
  };

  const handleGenerateImage = () => {
    if (!imagePrompt.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter an image description.",
        variant: "destructive",
      });
      return;
    }

    generateImageMutation.mutate(imagePrompt.trim());
  };

  const handleGenerateVideoScript = () => {
    if (!selectedPlatform || !videoTopic.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a platform and enter a video topic.",
        variant: "destructive",
      });
      return;
    }

    generateVideoScriptMutation.mutate({
      userId,
      platformId: parseInt(selectedPlatform),
      topic: videoTopic.trim(),
      duration: videoDuration,
    });
  };

  const handleGenerateHashtags = () => {
    if (!selectedPlatform || !hashtagContent.trim() || !hashtagNiche.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all hashtag generation fields.",
        variant: "destructive",
      });
      return;
    }

    const platform = platforms?.find(p => p.id === parseInt(selectedPlatform));
    generateHashtagsMutation.mutate({
      platform: platform?.name,
      content: hashtagContent.trim(),
      niche: hashtagNiche.trim(),
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard.",
    });
  };

  const isGenerating = generateContentMutation.isPending || 
                      generateImageMutation.isPending || 
                      generateVideoScriptMutation.isPending || 
                      generateHashtagsMutation.isPending;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      
      <div className="lg:ml-64 min-h-screen pb-20 lg:pb-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="ml-12 lg:ml-0">
            <h2 className="text-2xl font-bold text-slate-900">AI Content Generator</h2>
            <p className="text-slate-600">Create viral content across all platforms</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <Tabs defaultValue="generator" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="generator">Single Content</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Generator</TabsTrigger>
              <TabsTrigger value="scheduler">Smart Scheduler</TabsTrigger>
              <TabsTrigger value="comparison">Growth Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="generator">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Generator Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="text-blue-600" />
                  Content Generator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="post">Post</TabsTrigger>
                    <TabsTrigger value="image">Image</TabsTrigger>
                    <TabsTrigger value="video">Video</TabsTrigger>
                    <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
                  </TabsList>

                  <TabsContent value="post" className="space-y-4 mt-4">
                    <div>
                      <Label>Platform</Label>
                      <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {platforms?.map((platform) => (
                            <SelectItem key={platform.id} value={platform.id.toString()}>
                              {platform.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Topic / Theme</Label>
                      <Input
                        placeholder="e.g., Morning productivity routine"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Style</Label>
                      <Select value={style} onValueChange={setStyle}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engaging">Engaging</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="humorous">Humorous</SelectItem>
                          <SelectItem value="inspirational">Inspirational</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={handleGenerateContent}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <PenTool className="w-4 h-4 mr-2" />
                          Generate Post
                        </>
                      )}
                    </Button>
                  </TabsContent>

                  <TabsContent value="image" className="space-y-4 mt-4">
                    <div>
                      <Label>Image Description</Label>
                      <Textarea
                        placeholder="Describe the image you want to generate..."
                        value={imagePrompt}
                        onChange={(e) => setImagePrompt(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <Button 
                      onClick={handleGenerateImage}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Image className="w-4 h-4 mr-2" />
                          Generate Image
                        </>
                      )}
                    </Button>
                  </TabsContent>

                  <TabsContent value="video" className="space-y-4 mt-4">
                    <div>
                      <Label>Platform</Label>
                      <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {platforms?.map((platform) => (
                            <SelectItem key={platform.id} value={platform.id.toString()}>
                              {platform.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Video Topic</Label>
                      <Input
                        placeholder="e.g., How to be more productive"
                        value={videoTopic}
                        onChange={(e) => setVideoTopic(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Duration</Label>
                      <Select value={videoDuration} onValueChange={setVideoDuration}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15 seconds">15 seconds</SelectItem>
                          <SelectItem value="30 seconds">30 seconds</SelectItem>
                          <SelectItem value="60 seconds">1 minute</SelectItem>
                          <SelectItem value="3 minutes">3 minutes</SelectItem>
                          <SelectItem value="5 minutes">5 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={handleGenerateVideoScript}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Video className="w-4 h-4 mr-2" />
                          Generate Script
                        </>
                      )}
                    </Button>
                  </TabsContent>

                  <TabsContent value="hashtags" className="space-y-4 mt-4">
                    <div>
                      <Label>Platform</Label>
                      <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {platforms?.map((platform) => (
                            <SelectItem key={platform.id} value={platform.id.toString()}>
                              {platform.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Content Description</Label>
                      <Textarea
                        placeholder="Briefly describe your content..."
                        value={hashtagContent}
                        onChange={(e) => setHashtagContent(e.target.value)}
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label>Niche/Industry</Label>
                      <Input
                        placeholder="e.g., Fitness, Business, Lifestyle"
                        value={hashtagNiche}
                        onChange={(e) => setHashtagNiche(e.target.value)}
                      />
                    </div>

                    <Button 
                      onClick={handleGenerateHashtags}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Hash className="w-4 h-4 mr-2" />
                          Generate Hashtags
                        </>
                      )}
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Results Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Generated Content</CardTitle>
              </CardHeader>
              <CardContent>
                {generatedContent ? (
                  <div className="space-y-4">
                    {activeTab === "image" && generatedContent.url ? (
                      <div className="space-y-4">
                        <img 
                          src={generatedContent.url} 
                          alt="Generated content" 
                          className="w-full rounded-lg"
                        />
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => copyToClipboard(generatedContent.url)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : activeTab === "hashtags" && generatedContent.hashtags ? (
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {generatedContent.hashtags.map((hashtag: string, index: number) => (
                            <Badge key={index} variant="secondary">
                              {hashtag}
                            </Badge>
                          ))}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => copyToClipboard(generatedContent.hashtags.join(" "))}
                          className="w-full"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy All Hashtags
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {generatedContent.title && (
                          <div>
                            <Label className="text-sm font-medium">Title</Label>
                            <p className="text-lg font-semibold text-slate-900">{generatedContent.title}</p>
                          </div>
                        )}
                        
                        {generatedContent.content && (
                          <div>
                            <Label className="text-sm font-medium">Content</Label>
                            <div className="bg-slate-50 p-4 rounded-lg mt-2">
                              <pre className="whitespace-pre-wrap text-sm text-slate-900 font-mono">
                                {generatedContent.content}
                              </pre>
                            </div>
                          </div>
                        )}

                        {generatedContent.hashtags && generatedContent.hashtags.length > 0 && (
                          <div>
                            <Label className="text-sm font-medium">Hashtags</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {generatedContent.hashtags.map((hashtag: string, index: number) => (
                                <Badge key={index} variant="secondary">
                                  {hashtag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          {generatedContent.qualityScore && (
                            <div>
                              <Label>Quality Score</Label>
                              <p className="text-green-600 font-medium">{generatedContent.qualityScore}%</p>
                            </div>
                          )}
                          {generatedContent.estimatedViews && (
                            <div>
                              <Label>Estimated Views</Label>
                              <p className="text-blue-600 font-medium">
                                {generatedContent.estimatedViews.toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => copyToClipboard(generatedContent.content || generatedContent.title)}
                            className="flex-1"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Content
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-slate-500 py-12">
                    <Wand2 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>Generate content to see results here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
            </TabsContent>

            <TabsContent value="bulk">
              <BulkContentGenerator />
            </TabsContent>

            <TabsContent value="scheduler">
              <SmartScheduler userId={1} />
            </TabsContent>

            <TabsContent value="comparison">
              <GrowthComparison />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
