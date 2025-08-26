import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
  icon: LucideIcon;
  color?: "green" | "brown" | "beige" | "olive";
}

const colorVariants = {
  green: "bg-sbie-green-dark text-white",
  brown: "bg-sbie-brown text-white",
  beige: "bg-sbie-beige-light text-sbie-green-dark",
  olive: "bg-sbie-green-olive text-white",
};

export default function StatsCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = "green" 
}: StatsCardProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <CardContent className="p-0">
        <div className="flex">
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-sbie-green-gray">{title}</p>
                <p className="text-3xl font-bold text-sbie-green-dark mt-2">{value}</p>
                {change && (
                  <div className="flex items-center mt-2">
                    <span
                      className={cn(
                        "text-xs font-medium",
                        change.trend === "up" && "text-green-600",
                        change.trend === "down" && "text-red-600",
                        change.trend === "neutral" && "text-sbie-green-gray"
                      )}
                    >
                      {change.value}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={cn("w-20 flex items-center justify-center", colorVariants[color])}>
            <Icon className="h-8 w-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
