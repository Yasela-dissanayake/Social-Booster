import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  Globe, 
  Languages, 
  Copy, 
  CheckCircle, 
  Sparkles, 
  ArrowRight,
  Eye,
  Hash,
  Users,
  Lightbulb
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface MultilingualTranslatorProps {
  userId: number;
}

const SUPPORTED_LANGUAGES = {
  'en': { name: 'English', flag: '🇺🇸', region: 'Global' },
  'es': { name: 'Spanish', flag: '🇪🇸', region: 'Spain/Latin America' },
  'fr': { name: 'French', flag: '🇫🇷', region: 'France/Francophone' },
  'de': { name: 'German', flag: '🇩🇪', region: 'Germany/DACH' },
  'it': { name: 'Italian', flag: '🇮🇹', region: 'Italy' },
  'pt': { name: 'Portuguese', flag: '🇵🇹', region: 'Portugal/Brazil' },
  'ru': { name: 'Russian', flag: '🇷🇺', region: 'Russia/CIS' },
  'ja': { name: 'Japanese', flag: '🇯🇵', region: 'Japan' },
  'ko': { name: 'Korean', flag: '🇰🇷', region: 'South Korea' },
  'zh': { name: 'Chinese (Simplified)', flag: '🇨🇳', region: 'China' },
  'zh-TW': { name: 'Chinese (Traditional)', flag: '🇹🇼', region: 'Taiwan/Hong Kong' },
  'ar': { name: 'Arabic', flag: '🇸🇦', region: 'Middle East/North Africa' },
  'hi': { name: 'Hindi', flag: '🇮🇳', region: 'India' },
  'th': { name: 'Thai', flag: '🇹🇭', region: 'Thailand' },
  'vi': { name: 'Vietnamese', flag: '🇻🇳', region: 'Vietnam' },
  'id': { name: 'Indonesian', flag: '🇮🇩', region: 'Indonesia' },
  'tr': { name: 'Turkish', flag: '🇹🇷', region: 'Turkey' },
  'pl': { name: 'Polish', flag: '🇵🇱', region: 'Poland' },
  'nl': { name: 'Dutch', flag: '🇳🇱', region: 'Netherlands' },
  'sv': { name: 'Swedish', flag: '🇸🇪', region: 'Sweden' },
  'fi': { name: 'Finnish', flag: '🇫🇮', region: 'Finland' }
};

export function MultilingualTranslator({ userId }: MultilingualTranslatorProps) {
  const [originalContent, setOriginalContent] = useState("");
  const [fromLanguage, setFromLanguage] = useState("en");
  const [selectedTargetLanguages, setSelectedTargetLanguages] = useState<string[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState("TikTok");
  const [translations, setTranslations] = useState<any>(null);
  const [copiedLanguages, setCopiedLanguages] = useState<Set<string>>(new Set());
  const [translationMode, setTranslationMode] = useState<"single" | "batch">("batch");

  const { toast } = useToast();

  const translateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('https://srv885171.hstgr.cloud/api/translate/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Translation failed');
      return response.json();
    },
    onSuccess: (data) => {
      setTranslations(data);
      toast({
        title: "Translation Complete! 🌍",
        description: `Content translated to ${Object.keys(data.translations || {}).length} languages`
      });
    },
    onError: (error: any) => {
      toast({
        title: "Translation Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleLanguageSelection = (language: string, checked: boolean) => {
    if (checked) {
      setSelectedTargetLanguages(prev => [...prev, language]);
    } else {
      setSelectedTargetLanguages(prev => prev.filter(lang => lang !== language));
    }
  };

  const handleTranslate = () => {
    if (!originalContent.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter content to translate",
        variant: "destructive"
      });
      return;
    }

    if (selectedTargetLanguages.length === 0) {
      toast({
        title: "Target Languages Required",
        description: "Please select at least one target language",
        variant: "destructive"
      });
      return;
    }

    translateMutation.mutate({
      content: originalContent,
      fromLanguage,
      targetLanguages: selectedTargetLanguages,
      platform: selectedPlatform,
      userId,
      mode: translationMode
    });
  };

  const handleCopyTranslation = (language: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedLanguages(prev => new Set([...prev, language]));
    toast({
      title: "Copied!",
      description: `${SUPPORTED_LANGUAGES[language as keyof typeof SUPPORTED_LANGUAGES]?.name} translation copied`
    });
    
    setTimeout(() => {
      setCopiedLanguages(prev => {
        const newSet = new Set(prev);
        newSet.delete(language);
        return newSet;
      });
    }, 2000);
  };

  const popularLanguages = ['es', 'fr', 'de', 'ja', 'ko', 'zh', 'pt', 'ar', 'hi'];
  const otherLanguages = Object.keys(SUPPORTED_LANGUAGES).filter(lang => 
    !popularLanguages.includes(lang) && lang !== fromLanguage
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Languages className="h-8 w-8 text-blue-600" />
            Multilingual Translator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Translate and localize your content for global audiences with cultural adaptation
          </p>
        </div>
        <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
          <Globe className="h-4 w-4 mr-1" />
          25+ Languages
        </Badge>
      </div>

      {/* Translation Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 h-5 text-purple-600" />
            Content Translation & Localization
          </CardTitle>
          <CardDescription>
            Translate your content with cultural adaptation for different markets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>From Language</Label>
              <Select value={fromLanguage} onValueChange={setFromLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                    <SelectItem key={code} value={code}>
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Platform</Label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TikTok">🎵 TikTok</SelectItem>
                  <SelectItem value="Instagram">📸 Instagram</SelectItem>
                  <SelectItem value="YouTube">🎬 YouTube</SelectItem>
                  <SelectItem value="Twitter">🐦 Twitter</SelectItem>
                  <SelectItem value="Facebook">👥 Facebook</SelectItem>
                  <SelectItem value="Snapchat">👻 Snapchat</SelectItem>
                  <SelectItem value="OnlyFans">💎 OnlyFans</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Original Content</Label>
            <Textarea
              placeholder="Enter your content to translate..."
              value={originalContent}
              onChange={(e) => setOriginalContent(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          {/* Language Selection */}
          <div>
            <Label className="text-base font-semibold mb-4 block">Select Target Languages</Label>
            
            {/* Popular Languages */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Popular Languages</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {popularLanguages.map(langCode => {
                  const lang = SUPPORTED_LANGUAGES[langCode as keyof typeof SUPPORTED_LANGUAGES];
                  return (
                    <div key={langCode} className="flex items-center space-x-2">
                      <Checkbox
                        id={langCode}
                        checked={selectedTargetLanguages.includes(langCode)}
                        onCheckedChange={(checked) => handleLanguageSelection(langCode, checked as boolean)}
                      />
                      <label
                        htmlFor={langCode}
                        className="text-sm font-medium cursor-pointer flex items-center gap-1"
                      >
                        {lang.flag} {lang.name}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Other Languages */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Other Languages</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {otherLanguages.map(langCode => {
                  const lang = SUPPORTED_LANGUAGES[langCode as keyof typeof SUPPORTED_LANGUAGES];
                  return (
                    <div key={langCode} className="flex items-center space-x-2">
                      <Checkbox
                        id={langCode}
                        checked={selectedTargetLanguages.includes(langCode)}
                        onCheckedChange={(checked) => handleLanguageSelection(langCode, checked as boolean)}
                      />
                      <label
                        htmlFor={langCode}
                        className="text-sm font-medium cursor-pointer flex items-center gap-1"
                      >
                        {lang.flag} {lang.name}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedTargetLanguages.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Selected: {selectedTargetLanguages.length} languages
                </p>
              </div>
            )}
          </div>

          <Button 
            onClick={handleTranslate}
            disabled={translateMutation.isPending || !originalContent.trim() || selectedTargetLanguages.length === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            size="lg"
          >
            {translateMutation.isPending ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Translating to {selectedTargetLanguages.length} languages...
              </>
            ) : (
              <>
                <Globe className="h-4 w-4 mr-2" />
                Translate & Localize Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Translation Results */}
      {translations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Translation Results
            </CardTitle>
            <CardDescription>
              Culturally adapted content for {Object.keys(translations.translations || {}).length} languages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={Object.keys(translations.translations || {})[0]} className="w-full">
              <TabsList className="grid w-full grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                {Object.keys(translations.translations || {}).map((language) => {
                  const lang = SUPPORTED_LANGUAGES[language as keyof typeof SUPPORTED_LANGUAGES];
                  return (
                    <TabsTrigger key={language} value={language} className="text-xs">
                      {lang?.flag} {lang?.name.split(' ')[0]}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {Object.entries(translations.translations || {}).map(([language, result]: [string, any]) => {
                const lang = SUPPORTED_LANGUAGES[language as keyof typeof SUPPORTED_LANGUAGES];
                return (
                  <TabsContent key={language} value={language} className="space-y-4">
                    <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          {lang?.flag} {lang?.name}
                          <Badge variant="outline">{lang?.region}</Badge>
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                            <Eye className="h-4 w-4" />
                            Confidence: {Math.round((result.confidence || 0.85) * 100)}%
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopyTranslation(language, result.translatedContent)}
                          >
                            {copiedLanguages.has(language) ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Translated Content</h4>
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                            <p className="text-gray-800 dark:text-gray-200">{result.translatedContent}</p>
                          </div>
                        </div>

                        {result.localizedHashtags && result.localizedHashtags.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                              <Hash className="h-4 w-4" />
                              Localized Hashtags
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {result.localizedHashtags.map((hashtag: string, index: number) => (
                                <Badge key={index} variant="secondary">{hashtag}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {result.culturalAdaptations && result.culturalAdaptations.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              Cultural Adaptations
                            </h4>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                              {result.culturalAdaptations.map((adaptation: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-blue-500">•</span>
                                  {adaptation}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {result.suggestions && result.suggestions.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                              <Lightbulb className="h-4 w-4" />
                              Optimization Suggestions
                            </h4>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                              {result.suggestions.map((suggestion: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-green-500">•</span>
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}