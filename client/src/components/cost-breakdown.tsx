import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { CostBreakdown } from "@/lib/types";

interface CostBreakdownProps {
  userId: number;
}

export function CostBreakdownCard({ userId }: CostBreakdownProps) {
  const { data: savings, isLoading } = useQuery<CostBreakdown>({
    queryKey: ["/api/cost-savings/" + userId],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Cost Savings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!savings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Cost Savings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">No cost savings data available.</p>
        </CardContent>
      </Card>
    );
  }

  const costItems = [
    { label: "Content Creation Agency", amount: savings.contentAgencyCost },
    { label: "Stock Photos/Videos", amount: savings.stockPhotosCost },
    { label: "Copywriting Services", amount: savings.copywritingCost },
    { label: "Social Media Tools", amount: savings.toolsCost },
  ];

  const totalSaved = parseFloat(savings.totalSaved);
  const savingsPercentage = Math.round((totalSaved / (totalSaved + 100)) * 100); // Rough calculation

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Cost Savings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {costItems.map((item) => (
            <div key={item.label} className="flex justify-between items-center">
              <span className="text-slate-600">{item.label}</span>
              <span className="text-slate-900 font-medium">${item.amount}</span>
            </div>
          ))}
          
          <hr className="border-slate-200" />
          
          <div className="flex justify-between items-center text-lg font-bold">
            <span className="text-slate-900">Total Saved</span>
            <span className="text-green-600">${savings.totalSaved}</span>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-800">
              <CheckCircle className="inline w-4 h-4 mr-1" />
              You're saving {savingsPercentage}% vs traditional methods
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
