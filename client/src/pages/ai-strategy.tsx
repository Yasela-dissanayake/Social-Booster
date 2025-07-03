import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { AIStrategyEngine } from "@/components/ai-strategy-engine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Zap, TrendingUp, Target } from "lucide-react";

export default function AIStrategy() {
  const userId = 1; // Demo user

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      
      <div className="lg:ml-64 min-h-screen pb-20 lg:pb-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="ml-12 lg:ml-0">
            <h2 className="text-2xl font-bold text-slate-900">AI Strategy Engine</h2>
            <p className="text-slate-600">Intelligent, self-learning strategy generation and execution</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Feature Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Brain className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-semibold text-sm">AI Brain</h3>
                <p className="text-xs text-slate-600">Self-learning algorithms</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-semibold text-sm">Live Trends</h3>
                <p className="text-xs text-slate-600">Real-time analysis</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold text-sm">Smart Goals</h3>
                <p className="text-xs text-slate-600">Adaptive targeting</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <h3 className="font-semibold text-sm">One-Click</h3>
                <p className="text-xs text-slate-600">Instant execution</p>
              </CardContent>
            </Card>
          </div>

          {/* AI Strategy Engine Component */}
          <AIStrategyEngine userId={userId} />
        </main>
      </div>

      <MobileNav />
    </div>
  );
}