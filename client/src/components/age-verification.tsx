import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Shield, Calendar } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AgeVerificationProps {
  onVerified: (isVerified: boolean) => void;
  platform?: string;
}

export function AgeVerification({ onVerified, platform = "OnlyFans" }: AgeVerificationProps) {
  const [birthDate, setBirthDate] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleVerification = () => {
    if (!birthDate) {
      setError("Please enter your birth date");
      return;
    }

    setIsVerifying(true);
    setError("");

    const age = calculateAge(birthDate);
    
    setTimeout(() => {
      if (age >= 18) {
        // Store verification in localStorage for session
        localStorage.setItem('ageVerified', 'true');
        localStorage.setItem('verificationDate', new Date().toISOString());
        onVerified(true);
      } else {
        setError("You must be 18 or older to access adult content platforms.");
        onVerified(false);
      }
      setIsVerifying(false);
    }, 1000);
  };

  const handleDecline = () => {
    onVerified(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold">
            Age Verification Required
          </CardTitle>
          <CardDescription>
            Access to {platform} content requires verification that you are 18 years of age or older
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This platform contains adult content. You must be 18+ to proceed.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="birthdate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date of Birth
            </Label>
            <Input
              id="birthdate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleDecline}
              disabled={isVerifying}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerification}
              disabled={isVerifying || !birthDate}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isVerifying ? "Verifying..." : "Verify Age"}
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center pt-2">
            Your age verification is stored locally and is not shared with third parties.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook to check if user is age verified
export function useAgeVerification() {
  const checkVerification = (): boolean => {
    const verified = localStorage.getItem('ageVerified');
    const verificationDate = localStorage.getItem('verificationDate');
    
    if (!verified || !verificationDate) return false;
    
    // Check if verification is less than 24 hours old
    const verifyTime = new Date(verificationDate).getTime();
    const now = new Date().getTime();
    const hoursDiff = (now - verifyTime) / (1000 * 60 * 60);
    
    return hoursDiff < 24;
  };

  const clearVerification = () => {
    localStorage.removeItem('ageVerified');
    localStorage.removeItem('verificationDate');
  };

  return { checkVerification, clearVerification };
}