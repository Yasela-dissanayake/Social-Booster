import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, TrendingUp, Wand2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { AIInsight } from "@/lib/types";

interface AIInsightsProps {
  userId: number;
}

export function AIInsightsCard({ userId }: AIInsightsProps) {
  const { data: insights, isLoading } = useQuery<AIInsight[]>({
    queryKey: ["/api/insights/" + userId],
  });

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "best_time":
        return Lightbulb;
      case "trending_hashtag":
        return TrendingUp;
      case "content_style":
        return Wand2;
      default:
        return Lightbulb;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "best_time":
        return "text-blue-600 bg-blue-50";
      case "trending_hashtag":
        return "text-green-600 bg-green-50";
      case "content_style":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-blue-600 bg-blue-50";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights?.map((insight) => {
            const Icon = getInsightIcon(insight.type);
            const colorClass = getInsightColor(insight.type);
            
            return (
              <div
                key={insight.id}
                className={`flex items-start gap-3 p-3 rounded-lg ${colorClass.split(' ')[1]}`}
              >
                <Icon className={`mt-1 ${colorClass.split(' ')[0]}`} size={16} />
                <div>
                  <p className="text-sm font-medium text-slate-900">{insight.title}</p>
                  <p className="text-xs text-slate-600">{insight.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
