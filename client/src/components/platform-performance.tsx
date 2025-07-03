import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { PlatformPerformance } from "@/lib/types";

interface PlatformPerformanceProps {
  userId: number;
}

export function PlatformPerformanceCard({ userId }: PlatformPerformanceProps) {
  const { data: performance, isLoading } = useQuery<PlatformPerformance[]>({
    queryKey: ["/api/analytics/platform-performance/" + userId],
  });

  const getPlatformIcon = (iconClass: string) => {
    if (iconClass.includes("tiktok")) return "🎵";
    if (iconClass.includes("instagram")) return "📷";
    if (iconClass.includes("facebook")) return "📘";
    if (iconClass.includes("snapchat")) return "👻";
    if (iconClass.includes("youtube")) return "📺";
    if (iconClass.includes("twitter")) return "🐦";
    return "📱";
  };

  if (isLoading) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Platform Performance</CardTitle>
          <Select defaultValue="7days">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {performance?.map((item, index) => (
            <div
              key={item.platform.id}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: item.platform.color }}
                >
                  <span className="text-lg">{getPlatformIcon(item.platform.icon)}</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900">{item.platform.name}</p>
                  <p className="text-sm text-slate-600">{item.postsGenerated} posts generated</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900">{item.totalViews} views</p>
                <p className="text-sm text-green-500">{item.engagement} engagement</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
