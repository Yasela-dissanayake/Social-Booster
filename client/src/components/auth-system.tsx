import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  User, Mail, Lock, UserPlus, LogIn, 
  Sparkles, TrendingUp, Video, Zap 
} from "lucide-react";

interface AuthSystemProps {
  onAuthSuccess: (user: any) => void;
}

export function AuthSystem({ onAuthSuccess }: AuthSystemProps) {
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (credentials: any) => {
      const response = await fetch("https://srv885171.hstgr.cloud/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }
      
      return response.json();
    },
    onSuccess: (user) => {
      toast({
        title: "Welcome back!",
        description: "Successfully logged into your AI social media platform."
      });
      onAuthSuccess(user);
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive"
      });
    }
  });

  const signupMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await fetch("https://srv885171.hstgr.cloud/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Signup failed");
      }
      
      return response.json();
    },
    onSuccess: (user) => {
      toast({
        title: "Account Created Successfully!",
        description: "Welcome to your AI-powered social media growth platform."
      });
      onAuthSuccess(user);
    },
    onError: (error: any) => {
      toast({
        title: "Signup Failed",
        description: error.message || "Please try again with different credentials.",
        variant: "destructive"
      });
    }
  });

  const handleLogin = () => {
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    }

    loginMutation.mutate(loginData);
  };

  const handleSignup = () => {
    if (!signupData.name || !signupData.email || !signupData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Please make sure both passwords match.",
        variant: "destructive"
      });
      return;
    }

    if (signupData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    signupMutation.mutate({
      name: signupData.name,
      email: signupData.email,
      password: signupData.password
    });
  };

  const handleDemoLogin = () => {
    loginMutation.mutate({
      email: "demo@viralcraft.ai",
      password: "demo123"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-slate-900">
              ViralCraft AI
            </h1>
            <p className="text-xl text-slate-600">
              Transform your social media presence with AI-powered content generation and viral optimization
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg border shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Video className="h-6 w-6 text-red-500" />
                <span className="font-medium">AI Video Studio</span>
              </div>
              <p className="text-sm text-slate-600">
                Create viral videos with intelligent scene planning and optimization
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="h-6 w-6 text-blue-500" />
                <span className="font-medium">Smart Generator</span>
              </div>
              <p className="text-sm text-slate-600">
                Bulk content creation across all major social platforms
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-6 w-6 text-green-500" />
                <span className="font-medium">Trend Analysis</span>
              </div>
              <p className="text-sm text-slate-600">
                Real-time viral opportunity detection and optimization
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="h-6 w-6 text-yellow-500" />
                <span className="font-medium">Auto Scheduling</span>
              </div>
              <p className="text-sm text-slate-600">
                AI-powered optimal timing for maximum engagement
              </p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Join thousands of creators</strong> who are already using AI to grow their social media presence and save thousands on traditional marketing services.
            </p>
          </div>
        </div>

        {/* Auth Form */}
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Get Started</CardTitle>
            <CardDescription>
              Join the AI-powered social media revolution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({
                      ...prev,
                      email: e.target.value
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({
                      ...prev,
                      password: e.target.value
                    }))}
                  />
                </div>
                <Button 
                  onClick={handleLogin} 
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    "Logging in..."
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Login to Dashboard
                    </>
                  )}
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  onClick={handleDemoLogin}
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Try Demo Account
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={signupData.name}
                    onChange={(e) => setSignupData(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signupData.email}
                    onChange={(e) => setSignupData(prev => ({
                      ...prev,
                      email: e.target.value
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={signupData.password}
                    onChange={(e) => setSignupData(prev => ({
                      ...prev,
                      password: e.target.value
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData(prev => ({
                      ...prev,
                      confirmPassword: e.target.value
                    }))}
                  />
                </div>
                <Button 
                  onClick={handleSignup} 
                  className="w-full"
                  disabled={signupMutation.isPending}
                >
                  {signupMutation.isPending ? (
                    "Creating account..."
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Account
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>
                By signing up, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}