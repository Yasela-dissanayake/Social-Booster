import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Shuffle, Zap, TrendingUp, Play, Copy, CheckCircle, BarChart3, Target, Sparkles } from "lucide-react";

interface VideoSceneRemixProps {
  userId: number;
}

export function VideoSceneRemix({ userId }: VideoSceneRemixProps) {
  const [originalScene, setOriginalScene] = useState({
    title: "",
    script: "",
    visualDescription: "",
    topic: ""
  });
  const [remixStyle, setRemixStyle] = useState("viral");
  const [remixResult, setRemixResult] = useState<any>(null);
  const [sceneAnalysis, setSceneAnalysis] = useState<any>(null);
  const [copiedScenes, setCopiedScenes] = useState<Set<string>>(new Set());

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const analyzeSceneMutation = useMutation({
    mutationFn: async (scene: any) => {
      const response = await apiRequest("POST", "/api/video/analyze-scene", { scene });
      return response.json();
    },
    onSuccess: (data) => {
      setSceneAnalysis(data.analysis);
      toast({
        title: "Scene Analyzed!",
        description: `Overall score: ${data.analysis.overallScore}/100`,
      });
    },
  });

  const remixSceneMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/video/remix-scene", data);
      return response.json();
    },
    onSuccess: (data) => {
      setRemixResult(data.remixResult);
      setSceneAnalysis(data.sceneAnalysis);
      toast({
        title: "🎬 Scene Remixed Successfully!",
        description: `Created ${data.remixResult.totalRemixes} viral variations with ${data.improvements.viralPotentialIncrease} improvement!`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/content/recent/" + userId] });
    },
    onError: (error: any) => {
      toast({
        title: "Remix Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!originalScene.script && !originalScene.topic) {
      toast({
        title: "Scene Required",
        description: "Please provide either a script or topic to analyze",
        variant: "destructive",
      });
      return;
    }

    analyzeSceneMutation.mutate(originalScene);
  };

  const handleRemix = () => {
    if (!originalScene.script && !originalScene.topic) {
      toast({
        title: "Scene Required",
        description: "Please provide either a script or topic to remix",
        variant: "destructive",
      });
      return;
    }

    remixSceneMutation.mutate({
      userId,
      originalScene,
      remixStyle
    });
  };

  const handleCopyScene = (sceneId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedScenes(prev => new Set([...prev, sceneId]));
    toast({
      title: "Copied!",
      description: "Scene content copied to clipboard",
    });
    
    setTimeout(() => {
      setCopiedScenes(prev => {
        const newSet = new Set(prev);
        newSet.delete(sceneId);
        return newSet;
      });
    }, 2000);
  };

  const getRemixStyleIcon = (style: string) => {
    const icons = {
      viral: "🔥",
      comedic: "😂",
      dramatic: "🎭",
      educational: "📚"
    };
    return icons[style] || "🎬";
  };

  const getRemixStyleColor = (style: string) => {
    const colors = {
      viral: "bg-red-500 text-white",
      comedic: "bg-yellow-500 text-black",
      dramatic: "bg-purple-600 text-white",
      educational: "bg-blue-600 text-white"
    };
    return colors[style] || "bg-gray-500 text-white";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-orange-600 to-red-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Shuffle className="w-6 h-6" />
            One-Click Video Scene Remix Generator
            <Badge className="bg-white/20 text-white">AI Powered</Badge>
          </CardTitle>
          <p className="text-orange-100">
            Transform existing video scenes into viral content with intelligent AI remixing
          </p>
        </CardHeader>
      </Card>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Original Scene Input
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Scene Title</Label>
              <Input
                id="title"
                placeholder="e.g., Morning Routine Tips"
                value={originalScene.title}
                onChange={(e) => setOriginalScene(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic">Topic/Theme</Label>
              <Input
                id="topic"
                placeholder="e.g., Productivity, Fitness, Tech"
                value={originalScene.topic}
                onChange={(e) => setOriginalScene(prev => ({ ...prev, topic: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="script">Original Script</Label>
            <Textarea
              id="script"
              placeholder="Enter your existing video script or content description..."
              value={originalScene.script}
              onChange={(e) => setOriginalScene(prev => ({ ...prev, script: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visual">Visual Description (Optional)</Label>
            <Textarea
              id="visual"
              placeholder="Describe the visual elements, camera angles, setting..."
              value={originalScene.visualDescription}
              onChange={(e) => setOriginalScene(prev => ({ ...prev, visualDescription: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="remixStyle">Remix Style</Label>
            <Select value={remixStyle} onValueChange={setRemixStyle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viral">🔥 Viral - Maximum engagement</SelectItem>
                <SelectItem value="comedic">😂 Comedic - Humor-focused</SelectItem>
                <SelectItem value="dramatic">🎭 Dramatic - Emotional impact</SelectItem>
                <SelectItem value="educational">📚 Educational - Information-rich</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleAnalyze}
              disabled={analyzeSceneMutation.isPending}
              variant="outline"
              className="flex-1"
            >
              {analyzeSceneMutation.isPending ? (
                <>
                  <BarChart3 className="w-4 h-4 mr-2 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analyze Scene
                </>
              )}
            </Button>

            <Button 
              onClick={handleRemix}
              disabled={remixSceneMutation.isPending}
              className="flex-1"
              size="lg"
            >
              {remixSceneMutation.isPending ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-pulse" />
                  Remixing...
                </>
              ) : (
                <>
                  <Shuffle className="w-4 h-4 mr-2" />
                  One-Click Remix
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scene Analysis */}
      {sceneAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Scene Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{sceneAnalysis.overallScore}/100</div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{sceneAnalysis.strengths?.length || 0}</div>
                <div className="text-sm text-gray-600">Strengths</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{sceneAnalysis.improvementAreas?.length || 0}</div>
                <div className="text-sm text-gray-600">Improvements</div>
              </div>
            </div>

            <div className="space-y-4">
              {sceneAnalysis.strengths?.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-green-600">✅ Strengths</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {sceneAnalysis.strengths.map((strength: string, idx: number) => (
                      <li key={idx} className="text-gray-700">{strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {sceneAnalysis.improvementAreas?.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-orange-600">🔧 Areas for Improvement</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {sceneAnalysis.improvementAreas.map((area: string, idx: number) => (
                      <li key={idx} className="text-gray-700">{area}</li>
                    ))}
                  </ul>
                </div>
              )}

              {sceneAnalysis.remixSuggestions?.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-purple-600">💡 Remix Suggestions</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {sceneAnalysis.remixSuggestions.map((suggestion: string, idx: number) => (
                      <li key={idx} className="text-gray-700">{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}

              {sceneAnalysis.recommendedStyles?.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">🎯 Recommended Styles</h4>
                  <div className="flex gap-2">
                    {sceneAnalysis.recommendedStyles.map((style: string, idx: number) => (
                      <Badge key={idx} className={getRemixStyleColor(style)}>
                        {getRemixStyleIcon(style)} {style}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Remix Results */}
      {remixResult && (
        <div className="space-y-6">
          {/* Remix Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Remix Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{remixResult.totalRemixes}</div>
                  <div className="text-sm text-gray-600">Remix Variations</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{remixResult.bestVariation?.viralPotential || 95}%</div>
                  <div className="text-sm text-gray-600">Viral Potential</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{remixResult.bestVariation?.uniqueness || 85}%</div>
                  <div className="text-sm text-gray-600">Uniqueness</div>
                </div>
              </div>

              {remixResult.remixInsights && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">🔄 Key Changes Made</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {remixResult.remixInsights.keyChanges?.map((change: string, idx: number) => (
                        <li key={idx} className="text-gray-700">{change}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">📊 Expected Improvements</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded">
                        <div className="font-medium text-blue-700">View Increase</div>
                        <div className="text-lg font-bold text-blue-600">
                          {remixResult.remixInsights.targetMetrics?.expectedViewIncrease || '200-400%'}
                        </div>
                      </div>
                      <div className="bg-green-50 p-3 rounded">
                        <div className="font-medium text-green-700">Engagement Boost</div>
                        <div className="text-lg font-bold text-green-600">
                          {remixResult.remixInsights.targetMetrics?.engagementBoost || '150-300%'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Remix Variations */}
          <Card>
            <CardHeader>
              <CardTitle>🎬 Remixed Scenes</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="0" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  {remixResult.variations?.map((variation: any, idx: number) => (
                    <TabsTrigger key={idx} value={idx.toString()}>
                      {getRemixStyleIcon(variation.style)} Variation {idx + 1}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {remixResult.variations?.map((variation: any, varIdx: number) => (
                  <TabsContent key={varIdx} value={varIdx.toString()} className="space-y-4">
                    <div className={`p-4 rounded-lg ${getRemixStyleColor(variation.style)}`}>
                      <h3 className="text-lg font-semibold mb-2">{variation.title}</h3>
                      <div className="flex gap-4 text-sm">
                        <span>Viral: {variation.viralPotential}%</span>
                        <span>Engagement: {variation.engagementScore}%</span>
                        <span>Uniqueness: {variation.uniqueness}%</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {variation.scenes?.map((scene: any, sceneIdx: number) => (
                        <Card key={sceneIdx} className="border-l-4 border-orange-500">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm flex items-center gap-2">
                                <Badge variant="secondary">{scene.type}</Badge>
                                {scene.duration}s - {scene.remixType}
                              </CardTitle>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCopyScene(scene.id, scene.script)}
                              >
                                {copiedScenes.has(scene.id) ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <h5 className="font-medium mb-1">Script</h5>
                              <p className="text-sm bg-gray-50 p-2 rounded border">{scene.script}</p>
                            </div>
                            <div>
                              <h5 className="font-medium mb-1">Visual Description</h5>
                              <p className="text-sm text-gray-600">{scene.visualDescription}</p>
                            </div>
                            {scene.textOverlay && (
                              <div>
                                <h5 className="font-medium mb-1">Text Overlay</h5>
                                <Badge className="bg-yellow-100 text-yellow-800">{scene.textOverlay}</Badge>
                              </div>
                            )}
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                              <span>Camera: {scene.cameraAngle}</span>
                              <span>Audio: {scene.audioNotes}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Cross-Platform Adaptations */}
          {remixResult.crossPlatformAdaptations && (
            <Card>
              <CardHeader>
                <CardTitle>🌐 Cross-Platform Adaptations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(remixResult.crossPlatformAdaptations).map(([platform, adaptation]: [string, any]) => (
                    <div key={platform} className="p-3 bg-gray-50 rounded border">
                      <h5 className="font-medium mb-1">{platform}</h5>
                      <p className="text-sm text-gray-600">{adaptation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}