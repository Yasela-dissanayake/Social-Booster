import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  Play, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Target,
  MessageSquare,
  TrendingUp,
  Camera,
  Hash,
  Calendar,
  X,
  BookOpen
} from "lucide-react";

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  component: React.ReactNode;
  tips: string[];
  nextAction?: string;
}

interface TutorialWalkthoughProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function TutorialWalkthrough({ isOpen, onClose, onComplete }: TutorialWalkthoughProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const tutorialSteps: TutorialStep[] = [
    {
      id: "welcome",
      title: "Welcome to AI Social Media Generator!",
      description: "Let's create your first viral content in just 5 minutes. I'll guide you through each step.",
      icon: Sparkles,
      component: <WelcomeStep />,
      tips: [
        "This tutorial takes about 5 minutes",
        "You can pause anytime and resume later",
        "Each step builds on the previous one"
      ]
    },
    {
      id: "platform",
      title: "Choose Your Platform",
      description: "Select which social media platform you want to create content for. Each platform has unique optimization.",
      icon: Target,
      component: <PlatformSelectionStep />,
      tips: [
        "TikTok works best for short viral videos",
        "Instagram is perfect for visual content",
        "LinkedIn is ideal for professional content"
      ],
      nextAction: "Select a platform to continue"
    },
    {
      id: "content-type",
      title: "Pick Your Content Style",
      description: "What type of content do you want to create? Our AI will optimize based on your choice.",
      icon: Camera,
      component: <ContentTypeStep />,
      tips: [
        "Educational content builds authority",
        "Entertainment content goes viral faster",
        "Behind-the-scenes builds trust"
      ],
      nextAction: "Choose a content style"
    },
    {
      id: "ai-generation",
      title: "AI Content Creation",
      description: "Watch our AI generate personalized content ideas, captions, and hashtags for maximum engagement.",
      icon: MessageSquare,
      component: <AIGenerationStep />,
      tips: [
        "AI analyzes current trends automatically",
        "Content is optimized for your chosen platform",
        "Each generation is unique and tailored"
      ],
      nextAction: "Generate your content"
    },
    {
      id: "optimization",
      title: "Smart Optimization",
      description: "See how AI optimizes your content for maximum reach, engagement, and viral potential.",
      icon: TrendingUp,
      component: <OptimizationStep />,
      tips: [
        "Hashtags are researched for trending topics",
        "Posting times are optimized for your audience",
        "Content structure follows viral patterns"
      ]
    },
    {
      id: "scheduling",
      title: "Schedule for Success",
      description: "Learn how to schedule your content at optimal times for maximum engagement and reach.",
      icon: Calendar,
      component: <SchedulingStep />,
      tips: [
        "Best posting times vary by platform",
        "Consistency is key for growth",
        "Schedule a week ahead for best results"
      ]
    },
    {
      id: "complete",
      title: "You're Ready to Go Viral!",
      description: "Congratulations! You've learned how to create engaging content with AI. Start creating your viral posts now!",
      icon: CheckCircle,
      component: <CompletionStep />,
      tips: [
        "Practice with different content types",
        "Monitor your analytics for insights",
        "Use the AI assistant for ongoing help"
      ]
    }
  ];

  const currentStepData = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setCompletedSteps([...completedSteps, currentStepData.id]);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTutorial = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <Card className="relative">
          {/* Header */}
          <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                  <currentStepData.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
                  <CardDescription className="text-sm">
                    Step {currentStep + 1} of {tutorialSteps.length}
                  </CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={skipTutorial}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tutorial Progress</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="p-6 min-h-[400px] max-h-[60vh] overflow-y-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {currentStepData.description}
                  </p>
                  
                  <div key={currentStep} className="transition-all duration-300 ease-in-out">
                    {currentStepData.component}
                  </div>
                </div>
              </div>

              {/* Sidebar Tips */}
              <div className="space-y-4">
                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-600" />
                      Pro Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {currentStepData.tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{tip}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Progress Indicators */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Steps</h4>
                  {tutorialSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-2 text-sm">
                      {completedSteps.includes(step.id) ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : index === currentStep ? (
                        <div className="h-4 w-4 border-2 border-blue-500 rounded-full flex items-center justify-center">
                          <div className="h-2 w-2 bg-blue-500 rounded-full" />
                        </div>
                      ) : (
                        <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
                      )}
                      <span className={`${index === currentStep ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>

          {/* Footer */}
          <div className="border-t bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {currentStep > 0 && (
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                )}
                <Button variant="ghost" onClick={skipTutorial} className="text-gray-600">
                  Skip Tutorial
                </Button>
              </div>

              <div className="flex items-center gap-3">
                {currentStepData.nextAction && (
                  <span className="text-sm text-gray-600">
                    {currentStepData.nextAction}
                  </span>
                )}
                <Button onClick={nextStep} className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                  {currentStep === tutorialSteps.length - 1 ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Tutorial
                    </>
                  ) : (
                    <>
                      Next Step
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Tutorial Step Components
function WelcomeStep() {
  return (
    <div className="text-center space-y-6">
      <div className="relative">
        <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
          <Play className="h-16 w-16 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create Your First Viral Post
        </h3>
        <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          Our AI will guide you through creating content that gets maximum engagement and reach across all social platforms.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="secondary">AI-Powered</Badge>
          <Badge variant="secondary">Multi-Platform</Badge>
          <Badge variant="secondary">Trend-Optimized</Badge>
        </div>
      </div>
    </div>
  );
}

function PlatformSelectionStep() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  
  const platforms = [
    { id: "tiktok", name: "TikTok", icon: "🎵", users: "1B+ users", focus: "Short viral videos" },
    { id: "instagram", name: "Instagram", icon: "📷", users: "2B+ users", focus: "Visual storytelling" },
    { id: "youtube", name: "YouTube", icon: "📺", users: "2.7B+ users", focus: "Long-form content" },
    { id: "twitter", name: "Twitter", icon: "🐦", users: "450M+ users", focus: "Real-time updates" }
  ];

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        {platforms.map((platform) => (
          <Card 
            key={platform.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedPlatform === platform.id 
                ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => setSelectedPlatform(platform.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{platform.icon}</span>
                <div className="flex-1">
                  <h4 className="font-medium">{platform.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{platform.users}</p>
                  <p className="text-xs text-gray-500">{platform.focus}</p>
                </div>
                {selectedPlatform === platform.id && (
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedPlatform && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-300">
            Great choice! Our AI will optimize your content specifically for {platforms.find(p => p.id === selectedPlatform)?.name}.
          </p>
        </div>
      )}
    </div>
  );
}

function ContentTypeStep() {
  const [selectedType, setSelectedType] = useState<string>("");
  
  const contentTypes = [
    { id: "educational", name: "Educational", desc: "How-to guides, tips, tutorials", emoji: "🎓" },
    { id: "entertainment", name: "Entertainment", desc: "Funny, viral, trending content", emoji: "🎭" },
    { id: "behind-scenes", name: "Behind the Scenes", desc: "Process, day-in-life content", emoji: "🎬" },
    { id: "promotional", name: "Promotional", desc: "Product showcases, announcements", emoji: "📢" }
  ];

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-3">
        {contentTypes.map((type) => (
          <Card 
            key={type.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedType === type.id 
                ? 'ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => setSelectedType(type.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{type.emoji}</span>
                <div className="flex-1">
                  <h4 className="font-medium">{type.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{type.desc}</p>
                </div>
                {selectedType === type.id && (
                  <CheckCircle className="h-5 w-5 text-purple-500" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AIGenerationStep() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          size="lg"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              AI is creating your content...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Content with AI
            </>
          )}
        </Button>
      </div>

      {isGenerating && (
        <div className="space-y-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full" />
              <span className="text-sm font-medium">Analyzing trending topics...</span>
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="animate-pulse w-2 h-2 bg-purple-500 rounded-full" />
              <span className="text-sm font-medium">Optimizing for maximum engagement...</span>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
            <div className="flex items-center gap-2 mb-2">
              <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm font-medium">Creating viral-optimized content...</span>
            </div>
          </div>
        </div>
      )}

      {generated && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="font-medium">Content Generated Successfully!</span>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Caption:</span>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                "5 productivity hacks that will change your life! 🚀 Which one will you try first? #productivity #lifehacks #motivation"
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Hashtags:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {["#productivity", "#lifehacks", "#motivation", "#success", "#viral"].map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OptimizationStep() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-medium text-green-800 dark:text-green-200">Viral Score: 92/100</h4>
                <p className="text-sm text-green-600 dark:text-green-300">High potential for viral spread</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Hash className="h-5 w-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200">Trending Hashtags Added</h4>
                <p className="text-sm text-blue-600 dark:text-blue-300">5 high-performing hashtags included</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-purple-600" />
              <div>
                <h4 className="font-medium text-purple-800 dark:text-purple-200">Audience Optimization</h4>
                <p className="text-sm text-purple-600 dark:text-purple-300">Content tailored for 18-35 age group</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SchedulingStep() {
  return (
    <div className="space-y-4">
      <Card className="border-2 border-dashed border-blue-300 dark:border-blue-700">
        <CardContent className="p-6 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-blue-500" />
          <h4 className="font-medium mb-2">Optimal Posting Time</h4>
          <p className="text-2xl font-bold text-blue-600 mb-2">Tuesday, 7:30 PM</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Based on your audience activity and platform analytics
          </p>
          <Button className="mt-4" variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Post
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function CompletionStep() {
  return (
    <div className="text-center space-y-6">
      <div className="relative">
        <div className="w-32 h-32 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
          <CheckCircle className="h-16 w-16 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          You're All Set to Create Viral Content!
        </h3>
        <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          You've learned the complete AI-powered content creation process. Start creating amazing posts that engage your audience!
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
            Create First Post
          </Button>
          <Button variant="outline">
            Explore More Features
          </Button>
        </div>
      </div>
    </div>
  );
}

export function TutorialTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="border-2 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 bg-white/10 border-white/30 text-white hover:bg-white/20"
    >
      <Play className="h-4 w-4 mr-2" />
      Start Tutorial
    </Button>
  );
}