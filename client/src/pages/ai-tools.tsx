import { AIToolsDashboard } from "@/components/ai-tools-dashboard";
import { useAuth } from "@/contexts/auth-context";

export default function AIToolsPage() {
  const { user } = useAuth();

  if (!user) {
    return <div>Please log in to access AI Tools</div>;
  }

  return <AIToolsDashboard userId={user.id} />;
}