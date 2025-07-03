import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, FileText, Eye, Download, Mail, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

export default function PrivacyPage() {
  const handleDownloadPrivacyPolicy = () => {
    window.open('/PRIVACY_POLICY.md', '_blank');
  };

  const handleDownloadTerms = () => {
    window.open('/TERMS_OF_SERVICE.md', '_blank');
  };

  const handleContactPrivacy = () => {
    window.open('mailto:privacy@viralai.app?subject=Privacy%20Inquiry', '_blank');
  };

  const handleContactSupport = () => {
    window.open('mailto:support@viralai.app?subject=Support%20Request', '_blank');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Privacy & Legal Center</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Your privacy and data protection are our top priorities. Access all legal documents and privacy controls here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Privacy Policy Card */}
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                Privacy Policy
              </CardTitle>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                GDPR Compliant
              </Badge>
            </div>
            <CardDescription>
              Comprehensive details about how we collect, use, and protect your personal data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p><strong>Last Updated:</strong> May 25, 2025</p>
              <p><strong>Next Review:</strong> November 25, 2025</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Key Highlights:</h4>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                <li>• Full GDPR and CCPA compliance</li>
                <li>• No data selling to third parties</li>
                <li>• 30-day data deletion guarantee</li>
                <li>• Complete data portability rights</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleDownloadPrivacyPolicy} className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Read Full Policy
              </Button>
              <Button variant="outline" onClick={handleDownloadPrivacyPolicy}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Terms of Service Card */}
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Terms of Service
              </CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Updated
              </Badge>
            </div>
            <CardDescription>
              Legal agreement governing your use of ViralAI Content Creator platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p><strong>Last Updated:</strong> May 25, 2025</p>
              <p><strong>Effective Date:</strong> May 25, 2025</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Key Points:</h4>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                <li>• You own your AI-generated content</li>
                <li>• Commercial use permitted</li>
                <li>• 30-day refund policy</li>
                <li>• Fair usage guidelines</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleDownloadTerms} className="flex-1" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Read Full Terms
              </Button>
              <Button variant="outline" onClick={handleDownloadTerms}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Rights Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Your Data Rights & Controls
          </CardTitle>
          <CardDescription>
            Exercise your privacy rights and control how your data is used.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <Eye className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-medium mb-1">Access Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Download all your personal information
              </p>
              <Button size="sm" variant="outline" onClick={handleContactPrivacy}>
                Request Data
              </Button>
            </div>

            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <FileText className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-medium mb-1">Update Info</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Correct your personal details
              </p>
              <Link href="/profile">
                <Button size="sm" variant="outline">
                  Edit Profile
                </Button>
              </Link>
            </div>

            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
              <Download className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <h3 className="font-medium mb-1">Export Data</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Get your data in portable format
              </p>
              <Button size="sm" variant="outline" onClick={handleContactPrivacy}>
                Export Data
              </Button>
            </div>

            <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-600" />
              <h3 className="font-medium mb-1">Delete Account</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Permanently remove all data
              </p>
              <Button size="sm" variant="outline" onClick={handleContactPrivacy}>
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact & Support
          </CardTitle>
          <CardDescription>
            Get help with privacy questions or legal concerns.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Privacy Questions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Data protection and privacy inquiries
              </p>
              <Button variant="outline" onClick={handleContactPrivacy}>
                privacy@viralai.app
              </Button>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-medium mb-2">General Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Technical help and account assistance
              </p>
              <Button variant="outline" onClick={handleContactSupport}>
                support@viralai.app
              </Button>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Legal Notices</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Terms violations and legal matters
              </p>
              <Button variant="outline" onClick={() => window.open('mailto:legal@viralai.app')}>
                legal@viralai.app
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Response times: Privacy requests within 30 days • General support within 48 hours • Legal notices within 24 hours
            </p>
            <Link href="/">
              <Button variant="outline">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}