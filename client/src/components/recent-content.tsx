import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { RecentContent } from "@/lib/types";

interface RecentContentProps {
  userId: number;
}

export function RecentContentCard({ userId }: RecentContentProps) {
  const { data: content, isLoading } = useQuery<RecentContent[]>({
    queryKey: ["/api/content/recent/" + userId],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "published":
        return "Live";
      case "scheduled":
        return "Scheduled";
      case "draft":
        return "Draft";
      default:
        return status;
    }
  };

  const getPlatformIcon = (name: string) => {
    switch (name) {
      case "TikTok": return "🎵";
      case "Instagram": return "📷";
      case "Facebook": return "📘";
      case "Snapchat": return "👻";
      case "YouTube": return "📺";
      case "Twitter": return "🐦";
      default: return "📱";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent AI Generated Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent AI Generated Content</CardTitle>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {content?.map((item) => (
            <div
              key={item.id}
              className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-3">
                <div 
                  className="w-6 h-6 rounded flex items-center justify-center text-xs"
                  style={{ backgroundColor: item.platform.color }}
                >
                  <span className="text-white">{getPlatformIcon(item.platform.name)}</span>
                </div>
                <span className="text-sm text-slate-600">{item.platform.name}</span>
                <Badge 
                  variant="secondary" 
                  className={`ml-auto text-xs ${getStatusColor(item.status)}`}
                >
                  {getStatusLabel(item.status)}
                </Badge>
              </div>
              
              <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded mb-3 flex items-center justify-center">
                <span className="text-4xl">{getPlatformIcon(item.platform.name)}</span>
              </div>
              
              <p className="text-sm text-slate-900 font-medium mb-2 line-clamp-2">
                {item.title}
              </p>
              
              <div className="flex justify-between text-xs text-slate-600">
                <span>
                  {item.actualViews 
                    ? `${item.actualViews > 1000 ? Math.floor(item.actualViews / 1000) + 'K' : item.actualViews} views`
                    : `Est. ${item.estimatedViews ? Math.floor(item.estimatedViews / 1000) + 'K' : '0'} views`
                  }
                </span>
                <span>{item.timeAgo}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
