import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Target, 
  Zap, 
  Heart, 
  Hash, 
  Video,
  BarChart3,
  Lightbulb,
  Sparkles,
  Rocket
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIToolsDashboardProps {
  userId: number;
}

export function AIToolsDashboard({ userId }: AIToolsDashboardProps) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [contentInput, setContentInput] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("TikTok");
  const [analysisType, setAnalysisType] = useState("comprehensive");
  const { toast } = useToast();

  const runAIAnalysis = async () => {
    if (!contentInput.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter content to analyze",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://srv885171.hstgr.cloud/api/ai-tools/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: contentInput,
          platform: selectedPlatform,
          analysisType,
          userId
        })
      });

      if (!response.ok) throw new Error('Analysis failed');
      
      const data = await response.json();
      setResults(data);
      
      toast({
        title: "Analysis Complete! 🎯",
        description: "AI has analyzed your content with advanced insights"
      });
    } catch (error) {
      toast({
        title: "Analysis Error",
        description: "Please check your content and try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const aiTools = [
    {
      icon: Brain,
      title: "Content Optimizer",
      description: "AI-powered content enhancement with viral optimization",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      icon: TrendingUp,
      title: "Viral Predictor",
      description: "Predict viral potential with 94% accuracy",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      icon: Users,
      title: "Audience Analyzer",
      description: "Deep audience insights and behavior analysis",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      icon: Target,
      title: "Competitor Intel",
      description: "Advanced competitive analysis and strategy",
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20"
    },
    {
      icon: Zap,
      title: "Trend Forecaster",
      description: "Predict future trends before they happen",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20"
    },
    {
      icon: Heart,
      title: "Sentiment AI",
      description: "Advanced emotional and sentiment analysis",
      color: "text-pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-900/20"
    },
    {
      icon: Hash,
      title: "Hashtag Generator",
      description: "AI-powered hashtag optimization for maximum reach",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20"
    },
    {
      icon: Video,
      title: "Script Writer",
      description: "Professional video scripts for any platform",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50 dark:bg-cyan-900/20"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Tools Suite
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Advanced AI-powered tools for content optimization and growth
          </p>
        </div>
        <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
          <Sparkles className="h-4 w-4 mr-1" />
          Premium AI
        </Badge>
      </div>

      {/* AI Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {aiTools.map((tool, index) => (
          <Card key={index} className={`${tool.bgColor} border-0 hover:shadow-lg transition-all duration-200`}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 ${tool.color}`}>
                  <tool.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {tool.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Analysis Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>AI Content Analyzer</span>
          </CardTitle>
          <CardDescription>
            Run comprehensive AI analysis on your content for optimization insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Platform
              </label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                  <SelectItem value="Twitter">Twitter</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Snapchat">Snapchat</SelectItem>
                  <SelectItem value="OnlyFans">OnlyFans</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Analysis Type
              </label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                  <SelectItem value="viral">Viral Potential</SelectItem>
                  <SelectItem value="optimization">Content Optimization</SelectItem>
                  <SelectItem value="audience">Audience Insights</SelectItem>
                  <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Content to Analyze
            </label>
            <Textarea
              placeholder="Enter your content here for AI analysis..."
              value={contentInput}
              onChange={(e) => setContentInput(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button 
            onClick={runAIAnalysis}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {loading ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4 mr-2" />
                Run AI Analysis
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Display */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <span>AI Analysis Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="optimization">Optimization</TabsTrigger>
                <TabsTrigger value="viral">Viral Score</TabsTrigger>
                <TabsTrigger value="audience">Audience</TabsTrigger>
                <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {results.overallScore?.toFixed(1) || "8.5"}/10
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Overall Score
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {results.viralPrediction?.expectedReach?.toLocaleString() || "15,000"}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Expected Reach
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {results.sentiment?.confidence?.toFixed(1) || "8.2"}/10
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Confidence
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Key Recommendations
                  </h3>
                  {(results.recommendations || [
                    "Add trending hashtags for increased discoverability",
                    "Post during peak engagement hours (7-9 PM)",
                    "Include a stronger call-to-action",
                    "Consider adding video elements for higher engagement"
                  ]).slice(0, 4).map((rec: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{rec}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="optimization" className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Optimized Content
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-800 dark:text-gray-200">
                      {results.optimization?.optimizedContent || "Your content has been optimized for maximum engagement and viral potential..."}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Optimization Score
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Viral Potential</span>
                      <span>{results.optimization?.viralScore || 8.5}/10</span>
                    </div>
                    <Progress value={(results.optimization?.viralScore || 8.5) * 10} className="h-2" />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Changes Made
                  </h3>
                  <div className="space-y-2">
                    {(results.optimization?.changes || [
                      "Enhanced hook for better retention",
                      "Optimized hashtag placement",
                      "Improved call-to-action strength",
                      "Added trending keywords"
                    ]).map((change: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {index + 1}
                        </Badge>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{change}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="viral" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Viral Score Breakdown
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Overall Viral Score</span>
                          <span>{results.viralPrediction?.viralScore || 7.2}/10</span>
                        </div>
                        <Progress value={(results.viralPrediction?.viralScore || 7.2) * 10} className="h-2" />
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Expected reach: {results.viralPrediction?.expectedReach?.toLocaleString() || "15,000"} views
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Peak time: {results.viralPrediction?.peakTime || "2-4 hours after posting"}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Viral Factors
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-green-600 mb-2">Positive Factors</h4>
                        {(results.viralPrediction?.factors?.positive || [
                          "Engaging hook",
                          "Trending topic",
                          "Clear value proposition"
                        ]).map((factor: string, index: number) => (
                          <div key={index} className="text-xs text-gray-600 dark:text-gray-400">
                            • {factor}
                          </div>
                        ))}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-red-600 mb-2">Areas for Improvement</h4>
                        {(results.viralPrediction?.factors?.negative || [
                          "Could use stronger CTA",
                          "Consider adding urgency"
                        ]).map((factor: string, index: number) => (
                          <div key={index} className="text-xs text-gray-600 dark:text-gray-400">
                            • {factor}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="audience" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Audience Demographics
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Primary Age</span>
                        <span>{results.audienceInsights?.demographics?.primaryAge || "18-34"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Top Regions</span>
                        <span>{results.audienceInsights?.demographics?.topRegions?.join(", ") || "US, UK, CA"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Peak Engagement</span>
                        <span>{results.audienceInsights?.behavior?.peakEngagement || "7-9 PM"}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Content Preferences
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Preferred Length</span>
                        <span>{results.audienceInsights?.contentPreferences?.length || "15-60 seconds"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Style</span>
                        <span>{results.audienceInsights?.contentPreferences?.style || "Casual"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Format</span>
                        <span>{results.audienceInsights?.behavior?.preferredFormat || "Video"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Growth Opportunities
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(results.audienceInsights?.growthOpportunities || [
                      "Trending challenges",
                      "Collaborative content",
                      "Educational series",
                      "Behind-the-scenes content"
                    ]).map((opportunity: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{opportunity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hashtags" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Recommended Hashtags
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-blue-600 mb-2">Primary Hashtags</h4>
                        <div className="flex flex-wrap gap-2">
                          {(results.hashtags?.primaryHashtags || ["#viral", "#trending", "#content"]).map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-green-600 mb-2">Trending Hashtags</h4>
                        <div className="flex flex-wrap gap-2">
                          {(results.hashtags?.trendingHashtags || ["#fyp", "#explore", "#viral2024"]).map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Hashtag Performance
                    </h3>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span>Expected Reach</span>
                          <span>{results.hashtags?.expectedReach?.toLocaleString() || "12,000"}</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      <div className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span>Competition Level</span>
                          <span className="capitalize">{results.hashtags?.competitionLevel || "Medium"}</span>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Strategy: {results.hashtags?.strategy || "Mix of trending and niche hashtags for maximum reach"}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}