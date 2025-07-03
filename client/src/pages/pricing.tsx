import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Crown, Zap } from "lucide-react";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const CheckoutForm = ({ planId, planName }: { planId: string; planName: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome to Premium!",
        description: `Successfully subscribed to ${planName}`,
      });
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="w-full h-12 text-lg font-semibold"
      >
        {isProcessing ? "Processing..." : `Subscribe to ${planName}`}
      </Button>
    </form>
  );
};

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const { toast } = useToast();

  const plans = [
    {
      id: "free",
      name: "Free Starter",
      price: "£0",
      period: "forever",
      description: "Perfect for trying out AI content generation",
      features: [
        "5 AI-generated posts per day",
        "2 social media platforms",
        "Basic analytics",
        "Community support"
      ],
      limitations: [
        "Limited to TikTok and Instagram",
        "Basic content templates only",
        "No advanced AI features"
      ],
      icon: <Sparkles className="h-8 w-8 text-blue-500" />,
      color: "border-gray-200",
      buttonText: "Get Started Free",
      popular: false
    },
    {
      id: "pro",
      name: "Pro Creator",
      price: "£24",
      period: "month",
      description: "For serious content creators and influencers",
      features: [
        "Unlimited AI content generation",
        "All 7 social media platforms",
        "Advanced viral prediction",
        "Multi-language translation (25+ languages)",
        "Video script generation",
        "Real-time analytics",
        "Priority email support",
        "Advanced hashtag optimization"
      ],
      icon: <Zap className="h-8 w-8 text-orange-500" />,
      color: "border-orange-200 bg-orange-50",
      buttonText: "Start Pro Trial",
      popular: true
    },
    {
      id: "premium",
      name: "Premium Agency",
      price: "£79",
      period: "month", 
      description: "For agencies and enterprise content teams",
      features: [
        "Everything in Pro",
        "White-label customization",
        "Team collaboration (up to 10 users)",
        "Advanced AI strategy automation",
        "Custom brand voice training",
        "API access for integrations",
        "Dedicated account manager",
        "Custom reporting dashboards",
        "Priority phone support"
      ],
      icon: <Crown className="h-8 w-8 text-purple-500" />,
      color: "border-purple-200 bg-purple-50",
      buttonText: "Contact Sales",
      popular: false
    }
  ];

  const handlePlanSelect = async (planId: string) => {
    if (planId === "free") {
      toast({
        title: "Free Plan Active!",
        description: "You can start creating content right away.",
      });
      return;
    }

    if (planId === "premium") {
      window.location.href = "mailto:support@aisocialmediagenerator.com?subject=Premium Plan Inquiry";
      return;
    }

    try {
      const response = await apiRequest("POST", "/api/create-subscription", { 
        planId 
      });
      const data = await response.json();
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setSelectedPlan(planId);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (clientSecret && selectedPlan) {
    const plan = plans.find(p => p.id === selectedPlan);
    
    // Show dev message if Stripe is not configured
    if (!stripePromise) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
          <div className="max-w-md mx-auto pt-8">
            <Card className="shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Development Mode
                </CardTitle>
                <CardDescription className="text-lg">
                  Payment processing is disabled in local development
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center p-6">
                <p className="text-gray-600 mb-4">
                  Stripe is not configured for local development. 
                  In production, this would process the payment for:
                </p>
                <p className="font-semibold text-lg">
                  {plan?.name} - {plan?.price}/{plan?.period}
                </p>
                <Button 
                  onClick={() => {
                    setClientSecret("");
                    setSelectedPlan("");
                  }}
                  className="mt-4"
                >
                  Back to Plans
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto pt-8">
          <Card className="shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Complete Your Subscription
              </CardTitle>
              <CardDescription className="text-lg">
                {plan?.name} - {plan?.price}/{plan?.period}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm planId={selectedPlan} planName={plan?.name || ""} />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your AI Power Level
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate viral content for TikTok, Instagram, YouTube and more with advanced AI technology. 
            Start free or upgrade for unlimited power.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${plan.color} hover:shadow-xl transition-all duration-300 ${plan.popular ? 'ring-2 ring-orange-500 scale-105' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mt-2">
                  {plan.price}
                  {plan.period !== "forever" && (
                    <span className="text-lg text-gray-500">/{plan.period}</span>
                  )}
                </div>
                <CardDescription className="text-base mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`w-full h-12 text-lg font-semibold ${
                    plan.popular 
                      ? 'bg-orange-500 hover:bg-orange-600' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {plan.buttonText}
                </Button>

                {plan.id === "free" && (
                  <p className="text-xs text-gray-500 text-center">
                    No credit card required
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose AI Social Media Generator?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Creation</h3>
              <p className="text-gray-600">Generate viral content using advanced GPT-4o technology that understands trending patterns.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multi-Platform Support</h3>
              <p className="text-gray-600">Create content optimized for TikTok, Instagram, YouTube, Twitter, Facebook, Snapchat, and OnlyFans.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Proven Results</h3>
              <p className="text-gray-600">Users report 300%+ engagement increases with our AI-optimized content strategies.</p>
            </div>
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Go Viral?</h2>
          <p className="text-xl mb-6">Join thousands of creators who use AI to grow their social media presence.</p>
          <Button 
            onClick={() => handlePlanSelect("pro")}
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
          >
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </div>
  );
}