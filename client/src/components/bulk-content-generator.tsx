import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const platforms = [
  { name: "TikTok", color: "#000000" },
  { name: "Instagram", color: "#E4405F" },
  { name: "Facebook", color: "#1877F2" },
  { name: "Snapchat", color: "#FFFC00" },
  { name: "YouTube", color: "#FF0000" },
  { name: "Twitter", color: "#1DA1F2" }
];

export function BulkContentGenerator() {
  const [topic, setTopic] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [contentCount, setContentCount] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any[]>([]);
  const { toast } = useToast();

  const handlePlatformToggle = (platformName: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformName)
        ? prev.filter(p => p !== platformName)
        : [...prev, platformName]
    );
  };

  const handleGenerate = async () => {
    if (!topic.trim() || selectedPlatforms.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please enter a topic and select at least one platform.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("https://srv885171.hstgr.cloud/api/ai/bulk-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          platforms: selectedPlatforms,
          contentCount,
          userId: 1
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setGeneratedContent(data.content);
        toast({
          title: "Content Generated!",
          description: `Successfully created ${data.generated} pieces of content across ${selectedPlatforms.length} platforms.`
        });
        
        // Refresh the content list
        queryClient.invalidateQueries({ queryKey: ["/api/content/recent"] });
      } else {
        throw new Error(data.error || "Failed to generate content");
      }
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Unable to generate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Bulk Content Generator
          </CardTitle>
          <CardDescription>
            Create viral-worthy content for multiple platforms at once using advanced AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Content Topic</Label>
            <Input
              id="topic"
              placeholder="e.g., 'productivity tips for entrepreneurs', 'healthy meal prep ideas'"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>Select Platforms</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {platforms.map((platform) => (
                <div key={platform.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={platform.name}
                    checked={selectedPlatforms.includes(platform.name)}
                    onCheckedChange={() => handlePlatformToggle(platform.name)}
                  />
                  <Label htmlFor={platform.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: platform.color }}
                    />
                    {platform.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="count">Posts per Platform</Label>
            <Input
              id="count"
              type="number"
              min="1"
              max="10"
              value={contentCount}
              onChange={(e) => setContentCount(parseInt(e.target.value) || 1)}
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Content...
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-4 w-4" />
                Generate Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedContent.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
            <CardDescription>
              {generatedContent.length} pieces of content created and saved as drafts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedContent.map((content, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{content.title}</h4>
                    <Badge 
                      variant="secondary"
                      style={{ backgroundColor: `${content.platform.color}20`, color: content.platform.color }}
                    >
                      {content.platform.name}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {content.content}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Est. Views: {content.estimatedViews?.toLocaleString()}</span>
                    <span>•</span>
                    <span>Quality: {content.qualityScore}/100</span>
                  </div>
                  {content.hashtags && content.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {content.hashtags.slice(0, 5).map((tag: string, tagIndex: number) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}