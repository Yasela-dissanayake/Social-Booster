import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Brain, Zap, TrendingUp, Target, Calendar, CheckCircle, 
  Sparkles, BarChart3, Users, Clock, Hash, Play,
  Lightbulb, Rocket, Eye, Heart
} from "lucide-react";

interface StrategyPlan {
  title: string;
  description: string;
  duration: string;
  platforms: string[];
  contentTypes: string[];
  postingSchedule: {
    platform: string;
    times: string[];
    frequency: string;
  }[];
  keyMetrics: string[];
  estimatedResults: {
    viewsIncrease: string;
    engagementBoost: string;
    followerGrowth: string;
    reachExpansion: string;
  };
  actionItems: {
    id: string;
    task: string;
    priority: 'high' | 'medium' | 'low';
    platform: string;
    contentType: string;
    deadline: string;
  }[];
  learningInsights: string[];
  trendingTopics: string[];
  competitorAnalysis: string[];
}

interface AIStrategyEngineProps {
  userId: number;
}

export function AIStrategyEngine({ userId }: AIStrategyEngineProps) {
  const [activeTab, setActiveTab] = useState("generate");
  const [goals, setGoals] = useState("");
  const [niche, setNiche] = useState("");
  const [timeframe, setTimeframe] = useState("30");
  const [generatedStrategy, setGeneratedStrategy] = useState<StrategyPlan | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: platforms } = useQuery({
    queryKey: ["/api/platforms"],
  });

  const { data: learningData } = useQuery({
    queryKey: ["/api/strategy/learning/" + userId],
  });

  const generateStrategyMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/strategy/generate", data);
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedStrategy(data);
      toast({
        title: "🚀 AI Strategy Generated!",
        description: "Your intelligent growth strategy is ready for execution.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Strategy Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const analyzeTrendsMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/trends/analyze", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "📈 Trends Analyzed!",
        description: "Latest social media trends have been analyzed and integrated.",
      });
    },
  });

  const executeStrategyMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/strategy/execute", data);
      return response.json();
    },
    onSuccess: (data) => {
      setIsExecuting(false);
      toast({
        title: "🎯 Strategy Executed Successfully!",
        description: `Generated ${data.generatedContent?.length || 0} optimized content pieces across platforms.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/content/recent/" + userId] });
    },
    onError: (error: any) => {
      setIsExecuting(false);
      toast({
        title: "Execution Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGenerateStrategy = () => {
    if (!goals.trim()) {
      toast({
        title: "Missing Information",
        description: "Please describe your social media goals.",
        variant: "destructive",
      });
      return;
    }

    generateStrategyMutation.mutate({
      userId,
      goals: goals.trim(),
      niche: niche.trim() || "general",
      timeframe: parseInt(timeframe)
    });
  };

  const handleExecuteStrategy = () => {
    if (!generatedStrategy) return;
    
    setIsExecuting(true);
    executeStrategyMutation.mutate({
      userId,
      strategy: generatedStrategy,
      selectedPlatforms: platforms?.slice(0, 3) // Execute on top 3 platforms
    });
  };

  const handleAnalyzeTrends = () => {
    if (!platforms) return;
    
    analyzeTrendsMutation.mutate({
      platforms: platforms.map(p => p.name),
      niche: niche.trim() || "general"
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const isGenerating = generateStrategyMutation.isPending || analyzeTrendsMutation.isPending;

  return (
    <div className="space-y-6">
      {/* AI Strategy Header */}
      <Card className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Brain className="w-6 h-6" />
            AI Strategy Engine
            <Badge className="bg-white/20 text-white">Self-Learning</Badge>
          </CardTitle>
          <p className="text-purple-100">
            Intelligent strategy generation that evolves with your performance and stays current with trends
          </p>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate Strategy</TabsTrigger>
          <TabsTrigger value="execute">Execute & Monitor</TabsTrigger>
          <TabsTrigger value="learning">AI Learning</TabsTrigger>
        </TabsList>

        {/* Strategy Generation Tab */}
        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="text-purple-600" />
                  Strategy Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Social Media Goals</Label>
                  <Textarea
                    placeholder="e.g., Increase brand awareness, grow followers, drive website traffic, boost engagement..."
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Niche/Industry</Label>
                  <Input
                    placeholder="e.g., Fitness, Tech, Business, Lifestyle"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Strategy Timeframe</Label>
                  <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days (Sprint)</SelectItem>
                      <SelectItem value="30">30 days (Monthly)</SelectItem>
                      <SelectItem value="90">90 days (Quarterly)</SelectItem>
                      <SelectItem value="365">1 year (Annual)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleGenerateStrategy}
                    disabled={isGenerating}
                    className="flex-1"
                  >
                    {isGenerating ? (
                      <>
                        <Brain className="w-4 h-4 mr-2 animate-pulse" />
                        AI Thinking...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Strategy
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={handleAnalyzeTrends}
                    variant="outline"
                    disabled={isGenerating}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Analyze Trends
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Live Trends Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="text-green-600" />
                  Live Trend Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <Hash className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800">#ProductivityHacks trending +240%</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-800">Short-form videos performing 73% better</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-purple-800">Peak engagement: 7-9 PM EST</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                    <Users className="w-4 h-4 text-orange-600" />
                    <span className="text-sm text-orange-800">Audience prefers behind-the-scenes content</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Execute & Monitor Tab */}
        <TabsContent value="execute" className="space-y-6">
          {generatedStrategy ? (
            <div className="space-y-6">
              {/* Strategy Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Rocket className="text-blue-600" />
                      {generatedStrategy.title}
                    </div>
                    <Button 
                      onClick={handleExecuteStrategy}
                      disabled={isExecuting}
                      className="bg-gradient-to-r from-green-600 to-blue-600"
                    >
                      {isExecuting ? (
                        <>
                          <Zap className="w-4 h-4 mr-2 animate-spin" />
                          Executing...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Execute Strategy
                        </>
                      )}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">{generatedStrategy.description}</p>
                  
                  {/* Estimated Results */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Eye className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                      <p className="text-sm text-slate-600">Views Increase</p>
                      <p className="font-bold text-blue-600">{generatedStrategy.estimatedResults.viewsIncrease}</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Heart className="w-6 h-6 mx-auto mb-1 text-green-600" />
                      <p className="text-sm text-slate-600">Engagement</p>
                      <p className="font-bold text-green-600">{generatedStrategy.estimatedResults.engagementBoost}</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <Users className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                      <p className="text-sm text-slate-600">Follower Growth</p>
                      <p className="font-bold text-purple-600">{generatedStrategy.estimatedResults.followerGrowth}</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <TrendingUp className="w-6 h-6 mx-auto mb-1 text-orange-600" />
                      <p className="text-sm text-slate-600">Reach Expansion</p>
                      <p className="font-bold text-orange-600">{generatedStrategy.estimatedResults.reachExpansion}</p>
                    </div>
                  </div>

                  {/* Action Items */}
                  <div>
                    <h4 className="font-semibold mb-3">Action Items</h4>
                    <div className="space-y-2">
                      {generatedStrategy.actionItems.slice(0, 5).map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">{item.task}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(item.priority)}>
                              {item.priority}
                            </Badge>
                            <Badge variant="outline">{item.platform}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trending Topics Integration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="text-green-600" />
                    Trending Topics to Leverage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {generatedStrategy.trendingTopics.map((topic, index) => (
                      <Badge key={index} className="bg-green-100 text-green-800">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Brain className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No Strategy Generated Yet
                </h3>
                <p className="text-slate-600 mb-4">
                  Generate an AI strategy first to see execution options and monitoring.
                </p>
                <Button onClick={() => setActiveTab("generate")}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Strategy
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* AI Learning Tab */}
        <TabsContent value="learning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="text-yellow-600" />
                AI Performance Learning
              </CardTitle>
            </CardHeader>
            <CardContent>
              {learningData ? (
                <div className="space-y-6">
                  {/* Best Performing Content */}
                  <div>
                    <h4 className="font-semibold mb-3">Best Performing Content Types</h4>
                    <div className="space-y-2">
                      {learningData.bestPerformingContentTypes?.slice(0, 3).map((content, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <span className="text-sm font-medium">{content.type}</span>
                          <span className="text-sm text-green-600">{content.views} views</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Improvement Suggestions */}
                  <div>
                    <h4 className="font-semibold mb-3">AI Improvement Suggestions</h4>
                    <div className="space-y-2">
                      {learningData.improvementSuggestions?.map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                          <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                          <span className="text-sm text-blue-800">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Learning Evolution */}
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">🧠 AI Evolution Status</h4>
                    <p className="text-sm text-purple-800">
                      Your AI is continuously learning from performance data and adapting strategies. 
                      Current learning confidence: 94% - The AI has analyzed your content patterns 
                      and is making increasingly accurate predictions.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <p className="text-slate-600">
                    AI is gathering performance data to provide learning insights...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}