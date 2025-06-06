
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, BookOpen, MessageCircle, Target, Clock, LogOut, User, Terminal, Zap, Brain } from "lucide-react";
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
      <div className="min-h-screen bg-background flex items-center justify-center terminal-bg cyber-grid">
        <div className="text-center space-y-6">
          <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-neon-cyan glow-cyan mx-auto"></div>
          <div className="space-y-2">
            <p className="text-2xl neon-cyan font-mono typing-animation">INITIALIZING NEURAL NETWORK...</p>
            <p className="text-neon-magenta font-mono text-sm">Loading study protocols...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative cyber-grid" style={{ backgroundColor: '#0d0d0d' }}>
      {/* Subtle background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-neon-cyan/5 to-neon-magenta/5"></div>
      
      <div className="relative z-10 container mx-auto p-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="text-center flex-1">
            <h1 className="text-5xl font-bold mb-4 neon-cyan font-mono">
              <Terminal className="inline-block w-12 h-12 mr-4" />
              NEURAL STUDY HUB
            </h1>
            <p className="text-neon-magenta font-mono text-xl">
              &gt; Optimizing your academic performance through AI-driven insights
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 text-neon-cyan border border-neon-cyan/50 px-4 py-2 rounded-lg terminal-bg glow-cyan">
              <User className="w-5 h-5" />
              <span className="font-mono">{user?.email}</span>
            </div>
            <Button 
              onClick={handleSignOut}
              variant="outline"
              className="flex items-center gap-2 glow-magenta hover:glow-magenta font-mono border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-background transition-all hover-glow hover-glow-magenta"
            >
              <LogOut className="w-5 h-5" />
              LOGOUT
            </Button>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-10 terminal-bg border-neon-cyan/30 p-2">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-3 font-mono text-neon-cyan data-[state=active]:bg-neon-cyan data-[state=active]:text-background data-[state=active]:glow-cyan transition-all hover-glow"
            >
              <Target className="w-5 h-5" />
              DASHBOARD
            </TabsTrigger>
            <TabsTrigger 
              value="timetable" 
              className="flex items-center gap-3 font-mono text-neon-blue data-[state=active]:bg-neon-blue data-[state=active]:text-background data-[state=active]:glow-blue transition-all hover-glow"
            >
              <Calendar className="w-5 h-5" />
              SCHEDULER
            </TabsTrigger>
            <TabsTrigger 
              value="tracker" 
              className="flex items-center gap-3 font-mono text-neon-magenta data-[state=active]:bg-neon-magenta data-[state=active]:text-background data-[state=active]:glow-magenta transition-all hover-glow"
            >
              <BookOpen className="w-5 h-5" />
              PROGRESS
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className="flex items-center gap-3 font-mono text-neon-green data-[state=active]:bg-neon-green data-[state=active]:text-background data-[state=active]:glow-green transition-all hover-glow"
            >
              <Brain className="w-5 h-5" />
              AI_TUTOR
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8 animate-fade-in">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="terminal-bg glow-cyan scanlines hover-glow hover-glow-cyan transition-all">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-mono neon-cyan flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    MODULES_LOADED
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold neon-cyan font-mono mb-2">{subjects.length}</div>
                  <div className="text-sm text-neon-cyan/70 font-mono">Active subjects</div>
                </CardContent>
              </Card>

              <Card className="terminal-bg glow-magenta scanlines hover-glow hover-glow-magenta transition-all">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-mono neon-magenta flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    AVG_PROGRESS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold neon-magenta font-mono mb-2">
                    {subjects.length > 0 ? Math.round(subjects.reduce((acc, s) => acc + s.progress, 0) / subjects.length) : 0}%
                  </div>
                  <div className="text-sm text-neon-magenta/70 font-mono">Completion rate</div>
                </CardContent>
              </Card>

              <Card className="terminal-bg glow-green scanlines hover-glow hover-glow-green transition-all">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-mono neon-green flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    URGENT_TASKS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold neon-green font-mono mb-2 pulse-glow">
                    {subjects.filter(s => new Date(s.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}
                  </div>
                  <div className="text-sm text-neon-green/70 font-mono">Due this week</div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <SubjectManager subjects={subjects} setSubjects={setSubjects} />
              </div>
              
              <Card className="terminal-bg glow-cyan scanlines hover-glow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 neon-cyan font-mono text-xl">
                    <Zap className="w-6 h-6" />
                    SYSTEM_ACTIVITY_LOG
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 font-mono">
                  <div className="flex items-center justify-between py-3 border-b border-neon-cyan/20">
                    <span className="neon-green">[SUCCESS] Chemistry module completed</span>
                    <span className="neon-blue text-sm">2h ago</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-neon-cyan/20">
                    <span className="neon-magenta">[ALERT] Mathematics quiz scheduled</span>
                    <span className="neon-blue text-sm">5h ago</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-neon-cyan/20">
                    <span className="neon-purple">[INFO] Physics session initiated</span>
                    <span className="neon-blue text-sm">1d ago</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="neon-cyan">[LOG] System optimization complete</span>
                    <span className="neon-blue text-sm">2d ago</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timetable" className="animate-fade-in">
            <TimetableGenerator subjects={subjects} />
          </TabsContent>

          <TabsContent value="tracker" className="animate-fade-in">
            <StudyTracker subjects={subjects} setSubjects={setSubjects} />
          </TabsContent>

          <TabsContent value="chat" className="animate-fade-in">
            <ChatInterface />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
