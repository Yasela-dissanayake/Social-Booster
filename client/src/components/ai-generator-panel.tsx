import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, PenTool, Video, Hash } from "lucide-react";
import { useLocation } from "wouter";

const generatorOptions = [
  {
    icon: Image,
    title: "Generate Image Post",
    description: "AI-powered visuals",
    type: "image",
  },
  {
    icon: PenTool,
    title: "Write Captions",
    description: "Engaging copy",
    type: "caption",
  },
  {
    icon: Video,
    title: "Video Scripts",
    description: "Viral video ideas",
    type: "video",
  },
  {
    icon: Hash,
    title: "Smart Hashtags",
    description: "Trending keywords",
    type: "hashtags",
  },
];

export function AIGeneratorPanel() {
  const [, setLocation] = useLocation();

  const handleGeneratorClick = (type: string) => {
    setLocation(`/generator?type=${type}`);
  };

  return (
    <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold mb-2">AI Content Generator</CardTitle>
        <p className="text-blue-100 text-sm">Create viral content in seconds</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {generatorOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.type}
                variant="ghost"
                className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-4 text-left hover:bg-white/30 transition-all duration-200 h-auto"
                onClick={() => handleGeneratorClick(option.type)}
              >
                <div className="flex items-center gap-3 text-white">
                  <Icon className="text-xl flex-shrink-0" />
                  <div>
                    <p className="font-medium">{option.title}</p>
                    <p className="text-sm text-blue-100">{option.description}</p>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
