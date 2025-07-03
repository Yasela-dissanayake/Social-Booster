import { AccountManager } from "@/components/account-manager";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      
      <div className="lg:ml-64 min-h-screen pb-20 lg:pb-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="ml-12 lg:ml-0">
            <h2 className="text-2xl font-bold text-slate-900">Account Settings</h2>
            <p className="text-slate-600">Manage your social media connections and account preferences</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <Tabs defaultValue="accounts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="accounts">Social Media Accounts</TabsTrigger>
              <TabsTrigger value="profile">Profile Settings</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="accounts">
              <AccountManager userId={1} />
            </TabsContent>

            <TabsContent value="profile">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">Profile Settings</h3>
                <p className="text-muted-foreground">Coming soon - manage your profile and billing</p>
              </div>
            </TabsContent>

            <TabsContent value="preferences">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">Preferences</h3>
                <p className="text-muted-foreground">Coming soon - customize your experience</p>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}