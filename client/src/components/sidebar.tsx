import { Link, useLocation } from "wouter";
import { useState } from "react";
import { 
  Home, Sparkles, Calendar, TrendingUp, DollarSign, 
  Settings, Menu, X, Wand2, Video, Zap, Brain, Languages, Shield, Bot 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserProfileHeader } from "./user-profile-header";

interface SidebarProps {
  appName?: string;
  className?: string;
}

const navigationItems = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "/ai-strategy", icon: Wand2, label: "AI Strategy" },
  { href: "/generator", icon: Sparkles, label: "AI Generator" },
  { href: "/ai-tools", icon: Brain, label: "AI Tools" },
  { href: "/ai-agent", icon: Bot, label: "AI Agent" },
  { href: "/translator", icon: Languages, label: "Translator" },
  { href: "/video-studio", icon: Video, label: "Video Studio" },
  { href: "/calendar", icon: Calendar, label: "Content Calendar" },
  { href: "/analytics", icon: TrendingUp, label: "Analytics" },
  { href: "/trends", icon: Zap, label: "Trends" },
  { href: "/cost-savings", icon: DollarSign, label: "Cost Savings" },
  { href: "/settings", icon: Settings, label: "Settings" },
  { href: "/security", icon: Shield, label: "AI Security" },
  { href: "/privacy", icon: Shield, label: "Privacy & Legal" },
];

export function Sidebar({ appName = "AI Social Media Generator", className }: SidebarProps) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo Section */}
      <div className="flex items-center gap-3 p-6 border-b border-slate-200">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
          <Wand2 className="text-white text-lg" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{appName}</h1>
          <p className="text-xs text-slate-500">Content Generator</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                )}
                onClick={() => setIsMobileOpen(false)}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
            AJ
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900">Alex Johnson</p>
            <p className="text-xs text-slate-500">Pro Plan</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X /> : <Menu />}
      </Button>

      {/* Desktop Sidebar */}
      <div className={cn("fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl border-r border-slate-200 hidden lg:block", className)}>
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-slate-200 lg:hidden">
            {sidebarContent}
          </div>
        </>
      )}
    </>
  );
}
