import { ContentCalendar } from "@/components/content-calendar";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";

export default function Calendar() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      
      <div className="lg:ml-64 min-h-screen pb-20 lg:pb-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="ml-12 lg:ml-0">
            <h2 className="text-2xl font-bold text-slate-900">Content Calendar</h2>
            <p className="text-slate-600">Plan, schedule, and track your AI-generated content across all platforms</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <ContentCalendar userId={1} />
        </main>
      </div>

      <MobileNav />
    </div>
  );
}