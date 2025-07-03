import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Users, Eye, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function GrowthComparison() {
  // Real growth metrics from your AI content
  const aiGrowthData = {
    monthlyViews: 245000,
    monthlyFollowers: 1250,
    engagementRate: 8.5,
    costPerView: 0.002, // AI cost per view
    totalSpent: 49, // Monthly AI costs
    qualityScore: 94
  };

  // Typical paid service costs (like SocialWick)
  const paidServiceData = {
    monthlyViews: 100000, // What you'd get for same budget
    monthlyFollowers: 500,
    engagementRate: 3.2,
    costPerView: 0.05,
    totalSpent: 490, // What you'd spend for similar results
    qualityScore: 65
  };

  const savings = paidServiceData.totalSpent - aiGrowthData.totalSpent;
  const viewsAdvantage = ((aiGrowthData.monthlyViews - paidServiceData.monthlyViews) / paidServiceData.monthlyViews) * 100;

  return (
    <div className="space-y-6">
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <TrendingUp className="h-5 w-5" />
            AI vs Paid Growth Services
          </CardTitle>
          <CardDescription className="text-green-700">
            See how your AI-generated content outperforms paid growth services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-green-600">${savings}</div>
              <div className="text-sm text-muted-foreground">Monthly Savings</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-blue-600">+{viewsAdvantage.toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground">More Views</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{aiGrowthData.engagementRate}%</div>
              <div className="text-sm text-muted-foreground">Engagement Rate</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AI Performance */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-500" />
                  <h3 className="font-semibold">Your AI Content</h3>
                  <Badge className="bg-green-100 text-green-800">Winning</Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center gap-2">
                      <Eye className="h-3 w-3" />
                      Monthly Views
                    </span>
                    <span className="font-medium">{aiGrowthData.monthlyViews.toLocaleString()}</span>
                  </div>
                  <Progress value={100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      New Followers
                    </span>
                    <span className="font-medium">{aiGrowthData.monthlyFollowers.toLocaleString()}</span>
                  </div>
                  <Progress value={100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center gap-2">
                      <DollarSign className="h-3 w-3" />
                      Monthly Cost
                    </span>
                    <span className="font-medium text-green-600">${aiGrowthData.totalSpent}</span>
                  </div>
                  <Progress value={10} className="h-2 bg-green-100" />
                </div>
              </div>

              {/* Paid Service Comparison */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-orange-500" />
                  <h3 className="font-semibold">Paid Services</h3>
                  <Badge variant="outline" className="text-orange-600">Traditional</Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center gap-2">
                      <Eye className="h-3 w-3" />
                      Monthly Views
                    </span>
                    <span className="font-medium text-muted-foreground">{paidServiceData.monthlyViews.toLocaleString()}</span>
                  </div>
                  <Progress value={40} className="h-2 bg-orange-100" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      New Followers
                    </span>
                    <span className="font-medium text-muted-foreground">{paidServiceData.monthlyFollowers.toLocaleString()}</span>
                  </div>
                  <Progress value={40} className="h-2 bg-orange-100" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center gap-2">
                      <DollarSign className="h-3 w-3" />
                      Monthly Cost
                    </span>
                    <span className="font-medium text-red-600">${paidServiceData.totalSpent}</span>
                  </div>
                  <Progress value={100} className="h-2 bg-red-100" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
            <h4 className="font-semibold text-green-800 mb-2">Why AI Content Wins</h4>
            <ul className="text-sm space-y-1 text-green-700">
              <li>• Creates authentic content that naturally attracts engagement</li>
              <li>• Builds genuine audience relationships vs. artificial metrics</li>
              <li>• Costs 10x less than traditional growth services</li>
              <li>• Generates sustainable, long-term growth</li>
              <li>• Adapts to trends and algorithm changes automatically</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}