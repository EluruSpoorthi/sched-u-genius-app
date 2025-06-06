
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, BookOpen, MessageCircle, Target, Clock, LogOut, User, Terminal, Zap } from "lucide-react";
import { StudyTracker } from "@/components/StudyTracker";
import { TimetableGenerator } from "@/components/TimetableGenerator";
import { ChatInterface } from "@/components/ChatInterface";
import { SubjectManager } from "@/components/SubjectManager";
import { useAuth } from "@/contexts/AuthContext";
import { useSubjects } from "@/hooks/useSubjects";

const Index = () => {
  const { user, signOut } = useAuth();
  const { subjects, setSubjects, loading } = useSubjects();

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center terminal-bg scanlines">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neon-green glow-green mx-auto"></div>
          <p className="mt-4 text-neon-green font-mono typing-animation">Loading neural networks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative terminal-bg">
      {/* Matrix/Grid Background */}
      <div className="absolute inset-0 retro-grid"></div>
      <div className="absolute inset-0 matrix-bg"></div>
      
      <div className="relative z-10 container mx-auto p-6">
        {/* Header with cyberpunk styling */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold mb-2 neon-green font-pixel">
              <Terminal className="inline-block w-8 h-8 mr-2" />
              NEURAL STUDY MATRIX
            </h1>
            <p className="text-neon-blue font-mono text-lg">
              &gt; Hacking your way to academic excellence...
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-neon-green border border-neon-green px-3 py-1 rounded terminal-bg">
              <User className="w-4 h-4" />
              <span className="text-sm font-mono">{user?.email}</span>
            </div>
            <Button 
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 glow-pink hover:glow-pink font-mono border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-background transition-all"
            >
              <LogOut className="w-4 h-4" />
              LOGOUT
            </Button>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 terminal-bg border-neon-green">
            <TabsTrigger value="dashboard" className="flex items-center gap-2 font-mono text-neon-green data-[state=active]:bg-neon-green data-[state=active]:text-background">
              <Target className="w-4 h-4" />
              MAINFRAME
            </TabsTrigger>
            <TabsTrigger value="timetable" className="flex items-center gap-2 font-mono text-neon-blue data-[state=active]:bg-neon-blue data-[state=active]:text-background">
              <Calendar className="w-4 h-4" />
              SCHEDULER
            </TabsTrigger>
            <TabsTrigger value="tracker" className="flex items-center gap-2 font-mono text-neon-pink data-[state=active]:bg-neon-pink data-[state=active]:text-background">
              <BookOpen className="w-4 h-4" />
              PROGRESS
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2 font-mono text-neon-purple data-[state=active]:bg-neon-purple data-[state=active]:text-background">
              <MessageCircle className="w-4 h-4" />
              AI_TUTOR
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="terminal-bg glow-green scanlines">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-mono text-neon-green">
                    &gt; TOTAL_SUBJECTS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold neon-green font-pixel">{subjects.length}</div>
                  <div className="text-xs text-neon-green font-mono mt-1">MODULES_LOADED</div>
                </CardContent>
              </Card>

              <Card className="terminal-bg glow-blue scanlines">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-mono text-neon-blue">
                    &gt; AVG_PROGRESS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold neon-blue font-pixel">
                    {subjects.length > 0 ? Math.round(subjects.reduce((acc, s) => acc + s.progress, 0) / subjects.length) : 0}%
                  </div>
                  <div className="text-xs text-neon-blue font-mono mt-1">COMPLETION_RATE</div>
                </CardContent>
              </Card>

              <Card className="terminal-bg glow-pink scanlines">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-mono text-neon-pink">
                    &gt; URGENT_TASKS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold neon-pink font-pixel pulse-glow">
                    {subjects.filter(s => new Date(s.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}
                  </div>
                  <div className="text-xs text-neon-pink font-mono mt-1">CRITICAL_ALERTS</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SubjectManager subjects={subjects} setSubjects={setSubjects} />
              
              <Card className="terminal-bg glow-green scanlines">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 neon-green font-mono">
                    <Zap className="w-5 h-5" />
                    &gt; SYSTEM_LOG
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 font-mono text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-neon-green/20">
                    <span className="text-neon-green">[INFO] Chemistry module_completed</span>
                    <span className="text-neon-blue">2h_ago</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-neon-green/20">
                    <span className="text-neon-pink">[WARN] Mathematics quiz_scheduled</span>
                    <span className="text-neon-blue">5h_ago</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-neon-purple">[LOG] Physics session_started</span>
                    <span className="text-neon-blue">1d_ago</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timetable">
            <TimetableGenerator subjects={subjects} />
          </TabsContent>

          <TabsContent value="tracker">
            <StudyTracker subjects={subjects} setSubjects={setSubjects} />
          </TabsContent>

          <TabsContent value="chat">
            <ChatInterface />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
