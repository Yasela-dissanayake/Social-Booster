import { MultilingualTranslator } from "@/components/multilingual-translator";
import { useAuth } from "@/contexts/auth-context";

export default function TranslatorPage() {
  const { user } = useAuth();

  if (!user) {
    return <div>Please log in to access the Multilingual Translator</div>;
  }

  return <MultilingualTranslator userId={user.id} />;
}