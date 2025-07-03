import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Scissors, Volume2, Zap, Filter, Type, Image as ImageIcon,
  Play, Pause, SkipBack, SkipForward, Download, Share2,
  Layers, Palette, Music, Sparkles, Clock, Eye
} from "lucide-react";

interface VideoEditingProps {
  videoProject: any;
  onUpdate: (updatedProject: any) => void;
}

export function VideoEditor({ videoProject, onUpdate }: VideoEditingProps) {
  const [activeEditTab, setActiveEditTab] = useState("timeline");
  const [selectedScene, setSelectedScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const scenes = videoProject?.scenes || [];
  const currentScene = scenes[selectedScene];

  const handleSceneUpdate = (sceneIndex: number, updates: any) => {
    const updatedScenes = [...scenes];
    updatedScenes[sceneIndex] = { ...updatedScenes[sceneIndex], ...updates };
    
    const updatedProject = {
      ...videoProject,
      scenes: updatedScenes
    };
    
    onUpdate(updatedProject);
  };

  const addTransition = (type: string) => {
    const updatedProject = {
      ...videoProject,
      transitions: [...(videoProject.transitions || []), type]
    };
    onUpdate(updatedProject);
  };

  return (
    <div className="space-y-6">
      {/* Video Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Play className="h-5 w-5 text-red-500" />
              Video Preview
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{videoProject?.platform}</Badge>
              <Badge variant="secondary">{videoProject?.duration}s</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center mb-4">
            <div className="text-center text-white">
              <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">{videoProject?.title}</p>
              <p className="text-sm opacity-75">Scene {selectedScene + 1} of {scenes.length}</p>
            </div>
          </div>

          {/* Video Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" size="sm">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button 
                variant={isPlaying ? "secondary" : "default"}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0:00</span>
                <span>{Math.floor(videoProject?.duration / 60)}:{(videoProject?.duration % 60).toString().padStart(2, '0')}</span>
              </div>
              <Slider
                value={[currentTime]}
                onValueChange={(value) => setCurrentTime(value[0])}
                max={videoProject?.duration || 60}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editing Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scissors className="h-5 w-5 text-blue-500" />
            Video Editor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeEditTab} onValueChange={setActiveEditTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="effects">Effects</TabsTrigger>
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>

            {/* Timeline Editor */}
            <TabsContent value="timeline" className="space-y-4">
              <div className="space-y-3">
                <Label>Scene Timeline</Label>
                <div className="space-y-2">
                  {scenes.map((scene: any, index: number) => (
                    <div 
                      key={scene.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedScene === index ? 'border-blue-500 bg-blue-50' : 'border-slate-200'
                      }`}
                      onClick={() => setSelectedScene(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant={scene.type === 'hook' ? 'default' : 'outline'}>
                            Scene {index + 1}
                          </Badge>
                          <span className="text-sm font-medium">{scene.type}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {scene.timing?.start}s - {scene.timing?.end}s
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {scene.script}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {currentScene && (
                <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-medium">Edit Scene {selectedScene + 1}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Scene Duration (seconds)</Label>
                      <Input
                        type="number"
                        value={currentScene.duration}
                        onChange={(e) => handleSceneUpdate(selectedScene, { 
                          duration: parseInt(e.target.value) || 0 
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Camera Angle</Label>
                      <Select 
                        value={currentScene.cameraAngle}
                        onValueChange={(value) => handleSceneUpdate(selectedScene, { cameraAngle: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Close-up">Close-up</SelectItem>
                          <SelectItem value="Medium">Medium Shot</SelectItem>
                          <SelectItem value="Wide">Wide Shot</SelectItem>
                          <SelectItem value="Over-shoulder">Over Shoulder</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Text Overlay</Label>
                    <Input
                      value={currentScene.textOverlay || ''}
                      onChange={(e) => handleSceneUpdate(selectedScene, { textOverlay: e.target.value })}
                      placeholder="Add text overlay for this scene"
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Visual Effects */}
            <TabsContent value="effects" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="outline" className="h-20 flex-col">
                  <Filter className="h-6 w-6 mb-2" />
                  <span className="text-xs">Vintage</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Sparkles className="h-6 w-6 mb-2" />
                  <span className="text-xs">Glow</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Zap className="h-6 w-6 mb-2" />
                  <span className="text-xs">Energy</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Palette className="h-6 w-6 mb-2" />
                  <span className="text-xs">Color Pop</span>
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Brightness</Label>
                  <Slider defaultValue={[50]} max={100} step={1} />
                </div>
                <div className="space-y-2">
                  <Label>Contrast</Label>
                  <Slider defaultValue={[50]} max={100} step={1} />
                </div>
                <div className="space-y-2">
                  <Label>Saturation</Label>
                  <Slider defaultValue={[50]} max={100} step={1} />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Transitions</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => addTransition('fade')}
                  >
                    Fade
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => addTransition('slide')}
                  >
                    Slide
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => addTransition('zoom')}
                  >
                    Zoom
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Text Editor */}
            <TabsContent value="text" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Font Style</Label>
                  <Select defaultValue="bold">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bold">Bold Impact</SelectItem>
                      <SelectItem value="modern">Modern Clean</SelectItem>
                      <SelectItem value="handwritten">Handwritten</SelectItem>
                      <SelectItem value="retro">Retro Vibes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Text Size</Label>
                  <Slider defaultValue={[24]} min={12} max={72} step={2} />
                </div>

                <div className="space-y-2">
                  <Label>Text Color</Label>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-white border-2 border-slate-300 rounded cursor-pointer"></div>
                    <div className="w-8 h-8 bg-black border-2 border-slate-300 rounded cursor-pointer"></div>
                    <div className="w-8 h-8 bg-red-500 border-2 border-slate-300 rounded cursor-pointer"></div>
                    <div className="w-8 h-8 bg-blue-500 border-2 border-slate-300 rounded cursor-pointer"></div>
                    <div className="w-8 h-8 bg-yellow-400 border-2 border-slate-300 rounded cursor-pointer"></div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="text-animation" />
                  <Label htmlFor="text-animation">Animated Text</Label>
                </div>
              </div>
            </TabsContent>

            {/* Audio Editor */}
            <TabsContent value="audio" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Background Music</Label>
                  <Select defaultValue={videoProject?.soundtrack || 'upbeat'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upbeat">Upbeat Energy</SelectItem>
                      <SelectItem value="chill">Chill Vibes</SelectItem>
                      <SelectItem value="dramatic">Dramatic Build</SelectItem>
                      <SelectItem value="motivational">Motivational</SelectItem>
                      <SelectItem value="none">No Music</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Music Volume</Label>
                  <Slider defaultValue={[70]} max={100} step={5} />
                </div>

                <div className="space-y-2">
                  <Label>Voice Volume</Label>
                  <Slider defaultValue={[100]} max={100} step={5} />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="auto-captions" defaultChecked />
                  <Label htmlFor="auto-captions">Auto-generate Captions</Label>
                </div>
              </div>
            </TabsContent>

            {/* Export Options */}
            <TabsContent value="export" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Export Quality</Label>
                  <Select defaultValue="hd">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4k">4K Ultra HD</SelectItem>
                      <SelectItem value="hd">1080p HD</SelectItem>
                      <SelectItem value="sd">720p SD</SelectItem>
                      <SelectItem value="mobile">Mobile Optimized</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Format</Label>
                  <Select defaultValue="mp4">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mp4">MP4 (Universal)</SelectItem>
                      <SelectItem value="mov">MOV (High Quality)</SelectItem>
                      <SelectItem value="webm">WebM (Web Optimized)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Export Video
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Project
                  </Button>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Export Preview</span>
                  </div>
                  <div className="text-sm text-blue-700">
                    <p>Duration: {videoProject?.duration}s</p>
                    <p>Estimated file size: ~{Math.round((videoProject?.duration || 0) * 2.5)}MB</p>
                    <p>Optimal for: {videoProject?.platform}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}