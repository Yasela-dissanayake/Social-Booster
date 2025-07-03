import { VideoGenerator } from "@/components/video-generator";
import { VideoAnalytics } from "@/components/video-analytics";
import { VideoSceneRemix } from "@/components/video-scene-remix";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function VideoStudio() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      
      <div className="lg:ml-64 min-h-screen pb-20 lg:pb-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="ml-12 lg:ml-0">
            <h2 className="text-2xl font-bold text-slate-900">AI Video Studio</h2>
            <p className="text-slate-600">Create professional viral videos with advanced AI technology</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <VideoGenerator />
        </main>
      </div>

      <MobileNav />
    </div>
  );
}