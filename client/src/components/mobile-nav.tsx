import { Link, useLocation } from "wouter";
import { Home, Sparkles, Calendar, TrendingUp, User, Wand2, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AIAssistant } from "@/components/ai-assistant";

const mobileNavItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/ai-strategy", icon: Wand2, label: "Strategy" },
  { href: "/generator", icon: Sparkles, label: "Generate" },
  { href: "/analytics", icon: TrendingUp, label: "Analytics" },
  { href: "/settings", icon: User, label: "Profile" },
];

export function MobileNav() {
  const [location] = useLocation();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 lg:hidden z-50">
        <div className="grid grid-cols-6 gap-1 p-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                    isActive ? "text-blue-600" : "text-slate-400"
                  )}
                >
                  <Icon className="text-lg" />
                  <span className="text-xs">{item.label}</span>
                </button>
              </Link>
            );
          })}
          
          {/* AI Help Button */}
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors text-purple-600 hover:text-purple-700"
          >
            <MessageCircle className="text-lg" />
            <span className="text-xs">Help</span>
          </button>
        </div>
      </div>

      {/* AI Assistant Modal */}
      <AIAssistant 
        isOpen={isAssistantOpen} 
        onClose={() => setIsAssistantOpen(false)} 
      />
    </>
  );
}
