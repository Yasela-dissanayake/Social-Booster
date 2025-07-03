import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CostBreakdownCard } from "@/components/cost-breakdown";
import { DollarSign, TrendingDown, Calculator, CheckCircle } from "lucide-react";

export default function CostSavings() {
  const userId = 1; // Demo user

  const savingsComparison = [
    {
      service: "Content Creation Agency",
      traditional: "$1,500-3,000/month",
      withAI: "Included",
      savings: "$1,500+",
    },
    {
      service: "Stock Photos & Videos",
      traditional: "$299-599/month",
      withAI: "AI Generated",
      savings: "$299+",
    },
    {
      service: "Copywriting Services",
      traditional: "$800-2,000/month",
      withAI: "AI Generated",
      savings: "$800+",
    },
    {
      service: "Social Media Tools",
      traditional: "$149-499/month",
      withAI: "Built-in",
      savings: "$149+",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      
      <div className="lg:ml-64 min-h-screen pb-20 lg:pb-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="ml-12 lg:ml-0">
            <h2 className="text-2xl font-bold text-slate-900">Cost Savings</h2>
            <p className="text-slate-600">See how much you're saving with AI-powered content creation</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">Monthly Savings</p>
                    <p className="text-2xl font-bold text-green-600">$2,748</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <DollarSign className="text-green-600 text-xl" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm">
                  <TrendingDown className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">94% less</span>
                  <span className="text-slate-600">than traditional methods</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">Annual Savings</p>
                    <p className="text-2xl font-bold text-blue-600">$32,976</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Calculator className="text-blue-600 text-xl" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm">
                  <span className="text-slate-600">Projected yearly savings</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">ROI</p>
                    <p className="text-2xl font-bold text-purple-600">2,748%</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <CheckCircle className="text-purple-600 text-xl" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm">
                  <span className="text-slate-600">Return on investment</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CostBreakdownCard userId={userId} />

            {/* Comparison Table */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savingsComparison.map((item, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 mb-2">{item.service}</h4>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-slate-600">Traditional</p>
                          <p className="font-medium text-red-600">{item.traditional}</p>
                        </div>
                        <div>
                          <p className="text-slate-600">With AI</p>
                          <p className="font-medium text-green-600">{item.withAI}</p>
                        </div>
                        <div>
                          <p className="text-slate-600">You Save</p>
                          <p className="font-bold text-green-600">{item.savings}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Why AI Content Creation Saves Money</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">No Agency Fees</h3>
                  <p className="text-sm text-slate-600">Eliminate expensive content creation agency fees that can cost thousands per month.</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Calculator className="text-green-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Bulk Generation</h3>
                  <p className="text-sm text-slate-600">Generate hundreds of posts for the cost of creating just one manually.</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Instant Results</h3>
                  <p className="text-sm text-slate-600">No waiting weeks for content delivery. Generate what you need instantly.</p>
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
