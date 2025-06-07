
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, BookOpen, MessageCircle, Target, Clock, LogOut, User, Terminal, Zap, Brain, Timer, Maximize, Minimize } from "lucide-react";
import { StudyTracker } from "@/components/StudyTracker";
import { TimetableGenerator } from "@/components/TimetableGenerator";
import { ChatInterface } from "@/components/ChatInterface";
import { SubjectManager } from "@/components/SubjectManager";
import { MusicPlayer } from "@/components/MusicPlayer";
import { StudyTimer } from "@/components/StudyTimer";
import { SystemActivityLog } from "@/components/SystemActivityLog";
import { useAuth } from "@/contexts/AuthContext";
import { useSubjects } from "@/hooks/useSubjects";

const Index = () => {
  const { user, signOut } = useAuth();
  const { subjects, setSubjects, loading } = useSubjects();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
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
  };

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
            <Button 
              onClick={toggleFullscreen}
              variant="outline"
              className="flex items-center gap-2 glow-green hover:glow-green font-mono border-neon-green text-neon-green hover:bg-neon-green hover:text-background transition-all hover-glow hover-glow-green"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              {isFullscreen ? 'EXIT' : 'FULLSCREEN'}
            </Button>
            
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
          <TabsList className="grid w-full grid-cols-5 mb-10 terminal-bg border-neon-cyan/30 p-2">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-3 font-mono text-neon-cyan data-[state=active]:bg-neon-cyan data-[state=active]:text-background data-[state=active]:glow-cyan transition-all hover-glow"
            >
              <Target className="w-5 h-5" />
              DASHBOARD
            </TabsTrigger>
            <TabsTrigger 
              value="timer" 
              className="flex items-center gap-3 font-mono text-neon-green data-[state=active]:bg-neon-green data-[state=active]:text-background data-[state=active]:glow-green transition-all hover-glow"
            >
              <Timer className="w-5 h-5" />
              TIMER
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
              className="flex items-center gap-3 font-mono text-neon-purple data-[state=active]:bg-neon-purple data-[state=active]:text-background data-[state=active]:glow-purple transition-all hover-glow"
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-6">
                <SubjectManager subjects={subjects} setSubjects={setSubjects} />
              </div>
              
              <div className="space-y-6">
                <StudyTimer subjects={subjects} />
                <SystemActivityLog subjects={subjects} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timer" className="animate-fade-in">
            <div className="space-y-8 terminal-bg cyber-grid p-6" style={{ backgroundColor: '#0d0d0d' }}>
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold neon-green font-mono flex items-center justify-center gap-3">
                  <Timer className="w-10 h-10" />
                  NEURAL_TIMER_PROTOCOL
                </h2>
                <p className="text-neon-cyan font-mono text-lg">
                  &gt; Track your study sessions with precision timing
                </p>
              </div>
              
              <div className="flex justify-center">
                <div className="w-full max-w-2xl">
                  <StudyTimer subjects={subjects} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timetable" className="animate-fade-in">
            <div className="space-y-8 terminal-bg cyber-grid p-6" style={{ backgroundColor: '#0d0d0d' }}>
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold neon-blue font-mono flex items-center justify-center gap-3">
                  <Calendar className="w-10 h-10" />
                  NEURAL_SCHEDULER_PROTOCOL
                </h2>
                <p className="text-neon-cyan font-mono text-lg">
                  &gt; Optimize your study schedule with AI precision
                </p>
              </div>
              <TimetableGenerator subjects={subjects} />
            </div>
          </TabsContent>

          <TabsContent value="tracker" className="animate-fade-in">
            <div className="space-y-8 terminal-bg cyber-grid p-6" style={{ backgroundColor: '#0d0d0d' }}>
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold neon-magenta font-mono flex items-center justify-center gap-3">
                  <BookOpen className="w-10 h-10" />
                  NEURAL_PROGRESS_TRACKER
                </h2>
                <p className="text-neon-cyan font-mono text-lg">
                  &gt; Monitor your academic advancement in real-time
                </p>
              </div>
              <StudyTracker subjects={subjects} setSubjects={setSubjects} />
            </div>
          </TabsContent>

          <TabsContent value="chat" className="animate-fade-in">
            <div className="space-y-8 terminal-bg cyber-grid p-6" style={{ backgroundColor: '#0d0d0d' }}>
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold neon-purple font-mono flex items-center justify-center gap-3">
                  <Brain className="w-10 h-10" />
                  NEURAL_AI_TUTOR_INTERFACE
                </h2>
                <p className="text-neon-cyan font-mono text-lg">
                  &gt; Engage with advanced AI tutoring algorithms
                </p>
              </div>
              <ChatInterface />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Fixed Music Player - Top Right */}
      <MusicPlayer />
    </div>
  );
};

export default Index;
