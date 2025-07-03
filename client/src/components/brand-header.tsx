import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Menu, 
  X, 
  User, 
  Settings, 
  Crown,
  Zap,
  TrendingUp
} from "lucide-react";
import { Link, useLocation } from "wouter";

interface BrandHeaderProps {
  isAuthenticated?: boolean;
  userSubscription?: string;
}

export function BrandHeader({ isAuthenticated = false, userSubscription = "free" }: BrandHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: TrendingUp },
    { name: "AI Tools", href: "/ai-tools", icon: Sparkles },
    { name: "Analytics", href: "/analytics", icon: TrendingUp },
    { name: "Video Studio", href: "/video-studio", icon: Zap },
    { name: "Pricing", href: "/pricing", icon: Crown },
  ];

  const getSubscriptionBadge = () => {
    if (userSubscription === "pro") {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
          <Crown className="w-3 h-3 mr-1" />
          Pro
        </span>
      );
    }
    if (userSubscription === "premium") {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
          <Crown className="w-3 h-3 mr-1" />
          Premium
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
        Free
      </span>
    );
  };

  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          {/* Brand Logo */}
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-ai">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="hidden font-bold text-xl text-gradient-ai sm:inline-block">
              AI Social Media Generator
            </span>
            <span className="font-bold text-lg text-gradient-ai sm:hidden">
              AI SMG
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium flex-1">
            {isAuthenticated && navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`transition-colors hover:text-foreground/80 flex items-center space-x-1 ${
                    isActive ? "text-foreground" : "text-foreground/60"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                {/* Subscription Badge */}
                <div className="hidden sm:block">
                  {getSubscriptionBadge()}
                </div>
                
                {/* User Menu */}
                <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                  <User className="h-4 w-4" />
                </Button>
                
                {/* Settings */}
                <Link href="/settings">
                  <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full">
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/pricing">
                  <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                    View Pricing
                  </Button>
                </Link>
                <Button className="btn-ai-primary text-sm">
                  Get Started Free
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden h-8 w-8"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed right-0 top-16 h-full w-80 border-l bg-background p-6 shadow-lg">
            <div className="space-y-6">
              {/* User Info */}
              {isAuthenticated && (
                <div className="flex items-center space-x-3 pb-4 border-b">
                  <div className="h-10 w-10 rounded-full bg-gradient-ai flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Welcome back!</p>
                    {getSubscriptionBadge()}
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="space-y-2">
                {isAuthenticated ? (
                  navigation.map((item) => {
                    const isActive = location === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })
                ) : (
                  <div className="space-y-3">
                    <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        <Crown className="mr-2 h-4 w-4" />
                        View Pricing
                      </Button>
                    </Link>
                    <Button className="w-full btn-ai-primary">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Get Started Free
                    </Button>
                  </div>
                )}
              </nav>

              {/* Upgrade CTA for Free Users */}
              {isAuthenticated && userSubscription === "free" && (
                <div className="mt-6 p-4 rounded-lg bg-gradient-ai text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <Crown className="h-5 w-5" />
                    <span className="font-semibold">Upgrade to Pro</span>
                  </div>
                  <p className="text-sm opacity-90 mb-3">
                    Unlock unlimited AI content generation and advanced features
                  </p>
                  <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full bg-white text-purple-600 hover:bg-gray-100">
                      Upgrade Now
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BrandHeader;