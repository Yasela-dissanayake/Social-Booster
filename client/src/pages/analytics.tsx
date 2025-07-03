import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Eye, Heart, Share, BarChart3 } from "lucide-react";

export default function Analytics() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      
      <div className="lg:ml-64 min-h-screen pb-20 lg:pb-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="ml-12 lg:ml-0">
            <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
            <p className="text-slate-600">Track your content performance across platforms</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="text-blue-600" />
                Coming Soon
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-12">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Advanced Analytics Dashboard
              </h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Detailed performance metrics, engagement tracking, and AI-powered insights 
                are coming soon to help you optimize your content strategy.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <Eye className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                  <p className="text-xs text-slate-600">Views Tracking</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <Heart className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                  <p className="text-xs text-slate-600">Engagement</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <Share className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                  <p className="text-xs text-slate-600">Shares</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                  <p className="text-xs text-slate-600">Growth</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
