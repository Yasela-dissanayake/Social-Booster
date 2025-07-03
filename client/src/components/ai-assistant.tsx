import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Bot, User, Sparkles, HelpCircle, Lightbulb } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your AI assistant for social media content creation. I can help you with:\n\n✨ Content ideas and strategies\n📱 Platform-specific tips\n🎯 Hashtag suggestions\n📊 Performance optimization\n🔧 Platform troubleshooting\n\nWhat would you like help with today?",
      timestamp: new Date(),
      suggestions: [
        "How do I create viral TikTok content?",
        "Best hashtags for Instagram growth",
        "Help me with content strategy",
        "Optimize my posting schedule"
      ]
    }
  ]);
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const sendMessageMutation = useMutation({
    mutationFn: (question: string) => 
      apiRequest('POST', '/api/ai-assistant/chat', { message: question }),
    onSuccess: (response) => {
      response.json().then((data) => {
        const assistantMessage: Message = {
          id: Date.now().toString(),
          type: 'assistant',
          content: data.response,
          timestamp: new Date(),
          suggestions: data.suggestions
        };
        setMessages(prev => [...prev, assistantMessage]);
      });
    },
    onError: () => {
      toast({
        title: "Assistant Error",
        description: "I'm having trouble responding right now. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    sendMessageMutation.mutate(input);
    setInput("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <Card className="w-full max-w-2xl h-[90vh] sm:h-[600px] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
              <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg">AI Assistant</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Your social media helper</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col gap-4">
          {/* Messages */}
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-2 sm:gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.type === 'assistant' && (
                    <div className="p-1.5 sm:p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full h-fit">
                      <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-[85%] sm:max-w-[70%] ${message.type === 'user' ? 'order-first' : ''}`}>
                    <div className={`p-2 sm:p-3 rounded-lg whitespace-pre-wrap text-sm sm:text-base ${
                      message.type === 'user' 
                        ? 'bg-blue-500 text-white ml-auto' 
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {message.content}
                    </div>
                    
                    {message.suggestions && (
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Try asking:</p>
                        <div className="flex flex-wrap gap-1">
                          {message.suggestions.map((suggestion, index) => (
                            <Badge 
                              key={index}
                              variant="outline" 
                              className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>

                  {message.type === 'user' && (
                    <div className="p-1.5 sm:p-2 bg-blue-500 rounded-full h-fit">
                      <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {sendMessageMutation.isPending && (
                <div className="flex gap-3 justify-start">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full h-fit">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="flex gap-2 pt-2 sm:pt-4 border-t">
            <Input
              placeholder="Ask me anything about social media..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={sendMessageMutation.isPending}
              className="text-sm sm:text-base"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={sendMessageMutation.isPending || !input.trim()}
              size="sm"
              className="px-3"
            >
              <Send className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-1 sm:gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleSuggestionClick("Generate content ideas for my niche")}
              className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3"
            >
              <Lightbulb className="h-3 w-3" />
              <span className="hidden sm:inline">Content Ideas</span>
              <span className="sm:hidden">Ideas</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleSuggestionClick("Help me improve my engagement rate")}
              className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3"
            >
              <Sparkles className="h-3 w-3" />
              <span className="hidden sm:inline">Boost Engagement</span>
              <span className="sm:hidden">Engage</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleSuggestionClick("What are the best posting times?")}
              className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3"
            >
              <HelpCircle className="h-3 w-3" />
              <span className="hidden sm:inline">Best Practices</span>
              <span className="sm:hidden">Tips</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function AIAssistantTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg z-50 flex items-center justify-center"
      size="icon"
    >
      <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
    </Button>
  );
}