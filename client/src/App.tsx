import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { AuthSystem } from "@/components/auth-system";
import { AIAssistant, AIAssistantTrigger } from "@/components/ai-assistant";
import Dashboard from "@/pages/dashboard";
import ContentGenerator from "@/pages/content-generator";
import VideoStudio from "@/pages/video-studio";
import Analytics from "@/pages/analytics";
import CostSavings from "@/pages/cost-savings";
import AIStrategy from "@/pages/ai-strategy";
import Trends from "@/pages/trends";
import AITools from "@/pages/ai-tools";
import AIAgent from "@/pages/ai-agent";
import Translator from "@/pages/translator";
import Settings from "@/pages/settings";
import Security from "@/pages/security";
import Calendar from "@/pages/calendar";
import AdminDashboard from "@/pages/admin";
import AdminLogin from "@/pages/test-admin";
import Pricing from "@/pages/pricing";
import Privacy from "@/pages/privacy";
import BrandHeader from "@/components/brand-header";
import NotFound from "@/pages/not-found";
import { useState } from "react";

function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/ai-strategy" component={AIStrategy} />
      <Route path="/generator" component={ContentGenerator} />
      <Route path="/video-studio" component={VideoStudio} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/trends" component={Trends} />
      <Route path="/ai-tools" component={AITools} />
      <Route path="/ai-agent" component={AIAgent} />
      <Route path="/translator" component={Translator} />
      <Route path="/cost-savings" component={CostSavings} />
      <Route path="/calendar" component={Calendar} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/settings" component={Settings} />
      <Route path="/security" component={Security} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/privacy" component={Privacy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter>
          <Toaster />
          <AppRoutes />
          
          {/* AI Assistant */}
          <AIAssistantTrigger onClick={() => setIsAssistantOpen(true)} />
          <AIAssistant 
            isOpen={isAssistantOpen} 
            onClose={() => setIsAssistantOpen(false)} 
          />
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
