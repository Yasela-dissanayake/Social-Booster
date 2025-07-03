import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative";
  icon: LucideIcon;
  iconColor: string;
  description?: string;
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = "positive", 
  icon: Icon, 
  iconColor,
  description 
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-600 text-sm">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
          </div>
          <div className={cn("p-3 rounded-lg", iconColor)}>
            <Icon className="text-xl" />
          </div>
        </div>
        {(change || description) && (
          <div className="mt-4 flex items-center gap-1 text-sm">
            {change && (
              <>
                <TrendingUp className={cn("h-4 w-4", changeType === "positive" ? "text-green-500" : "text-red-500")} />
                <span className={cn(changeType === "positive" ? "text-green-500" : "text-red-500")}>{change}</span>
              </>
            )}
            <span className="text-slate-600">{description || "from last month"}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
