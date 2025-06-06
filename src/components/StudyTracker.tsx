
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, Clock, Target, CheckCircle, BarChart3, Zap, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Subject {
  id: string;
  name: string;
  progress: number;
  deadline: string;
  priority: string;
}

interface StudyTrackerProps {
  subjects: Subject[];
  setSubjects: (subjects: Subject[]) => void;
}

export const StudyTracker = ({ subjects, setSubjects }: StudyTrackerProps) => {
  const [studySession, setStudySession] = useState({
    subjectId: "",
    duration: "",
    progress: ""
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const logStudySession = async () => {
    if (!studySession.subjectId || !studySession.duration || !studySession.progress) {
      toast({
        title: "ERROR: INCOMPLETE_DATA",
        description: "All neural parameters required",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "ERROR: ACCESS_DENIED",
        description: "Authentication required for data persistence",
        variant: "destructive"
      });
      return;
    }

    try {
      const selectedSubject = subjects.find(s => s.id === studySession.subjectId);
      if (!selectedSubject) return;

      const newProgress = Math.min(100, selectedSubject.progress + parseInt(studySession.progress));

      const { error } = await supabase
        .from('subjects')
        .update({ progress: newProgress })
        .eq('id', studySession.subjectId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating progress:', error);
        toast({
          title: "ERROR: DATABASE_SYNC_FAILED",
          description: "Neural network update unsuccessful",
          variant: "destructive"
        });
        return;
      }

      const updatedSubjects = subjects.map(subject => {
        if (subject.id === studySession.subjectId) {
          return { ...subject, progress: newProgress };
        }
        return subject;
      });

      setSubjects(updatedSubjects);
      setStudySession({ subjectId: "", duration: "", progress: "" });
      
      toast({
        title: "[SUCCESS] Session Logged",
        description: `Neural pathways enhanced: ${studySession.duration} min recorded`,
      });
    } catch (error) {
      console.error('Error logging study session:', error);
      toast({
        title: "ERROR: SYSTEM_FAILURE",
        description: "Failed to synchronize study data",
        variant: "destructive"
      });
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "neon-green";
    if (progress >= 50) return "neon-yellow";
    return "neon-magenta";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'neon-magenta';
      case 'medium': return 'neon-yellow';
      case 'low': return 'neon-green';
      default: return 'neon-cyan';
    }
  };

  return (
    <div className="space-y-8 terminal-bg cyber-grid p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold neon-magenta font-mono flex items-center justify-center gap-3">
          <Brain className="w-10 h-10" />
          PROGRESS_ANALYZER
        </h2>
        <p className="text-neon-cyan font-mono text-lg">
          &gt; Monitoring neural enhancement protocols
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Log Study Session */}
        <Card className="terminal-bg glow-cyan scanlines hover-glow hover-glow-cyan transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 neon-cyan font-mono text-xl">
              <Clock className="w-6 h-6" />
              LOG_STUDY_SESSION
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="subject-select" className="text-neon-cyan font-mono text-sm mb-2 block">
                  [SUBJECT_MODULE]
                </Label>
                <select
                  id="subject-select"
                  value={studySession.subjectId}
                  onChange={(e) => setStudySession({...studySession, subjectId: e.target.value})}
                  className="w-full p-3 terminal-bg border border-neon-cyan/50 rounded-lg neon-cyan font-mono glow-cyan focus:glow-cyan focus:outline-none"
                >
                  <option value="" className="bg-background">Select Module</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id} className="bg-background text-foreground">
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="duration" className="text-neon-magenta font-mono text-sm mb-2 block">
                  [DURATION_MINUTES]
                </Label>
                <Input
                  id="duration"
                  type="number"
                  value={studySession.duration}
                  onChange={(e) => setStudySession({...studySession, duration: e.target.value})}
                  placeholder="60"
                  className="terminal-bg border-neon-magenta/50 neon-magenta font-mono glow-magenta focus:glow-magenta"
                />
              </div>
              
              <div>
                <Label htmlFor="progress-add" className="text-neon-green font-mono text-sm mb-2 block">
                  [PROGRESS_INCREMENT_%]
                </Label>
                <Input
                  id="progress-add"
                  type="number"
                  max="100"
                  value={studySession.progress}
                  onChange={(e) => setStudySession({...studySession, progress: e.target.value})}
                  placeholder="10"
                  className="terminal-bg border-neon-green/50 neon-green font-mono glow-green focus:glow-green"
                />
              </div>
            </div>
            
            <Button 
              onClick={logStudySession} 
              className="w-full glow-cyan hover:glow-cyan font-mono border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-background transition-all hover-glow hover-glow-cyan"
              variant="outline"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              COMMIT_SESSION_DATA
            </Button>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <Card className="terminal-bg glow-magenta scanlines hover-glow hover-glow-magenta transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 neon-magenta font-mono text-xl">
              <BarChart3 className="w-6 h-6" />
              SYSTEM_METRICS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border border-neon-green/30 rounded-lg terminal-bg">
                <div className="text-3xl font-bold neon-green font-mono mb-1">{subjects.length}</div>
                <div className="text-sm neon-green/70 font-mono">ACTIVE_MODULES</div>
              </div>
              <div className="text-center p-4 border border-neon-blue/30 rounded-lg terminal-bg">
                <div className="text-3xl font-bold neon-blue font-mono mb-1">
                  {subjects.length > 0 ? Math.round(subjects.reduce((acc, s) => acc + s.progress, 0) / subjects.length) : 0}%
                </div>
                <div className="text-sm neon-blue/70 font-mono">AVG_COMPLETION</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm font-mono">
                <span className="neon-cyan">SUBJECTS_NEAR_COMPLETION</span>
                <span className="neon-green">{subjects.filter(s => s.progress >= 80).length}</span>
              </div>
              <div className="flex justify-between text-sm font-mono">
                <span className="neon-cyan">URGENT_DEADLINES</span>
                <span className="neon-magenta">{subjects.filter(s => getDaysUntilDeadline(s.deadline) <= 7).length}</span>
              </div>
              <div className="flex justify-between text-sm font-mono">
                <span className="neon-cyan">HIGH_PRIORITY_MODULES</span>
                <span className="neon-yellow">{subjects.filter(s => s.priority === 'high').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card className="terminal-bg glow-green scanlines">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 neon-green font-mono text-xl">
            <TrendingUp className="w-6 h-6" />
            NEURAL_PROGRESS_MATRIX
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {subjects.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-16 h-16 neon-cyan mx-auto mb-4" />
                <p className="neon-cyan font-mono text-xl">NO SUBJECTS LOADED</p>
                <p className="text-neon-cyan/60 font-mono">Initialize subject modules to track progress</p>
              </div>
            ) : (
              subjects.map((subject) => (
                <div key={subject.id} className="space-y-3 p-4 border border-neon-cyan/20 rounded-lg terminal-bg hover:border-neon-cyan/40 transition-all">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <h3 className="font-mono neon-cyan text-lg">{subject.name}</h3>
                      <span className={`text-xs font-mono px-2 py-1 rounded border ${getPriorityColor(subject.priority)} border-current`}>
                        {subject.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-mono">
                      <span className="neon-blue">
                        T-{getDaysUntilDeadline(subject.deadline)} DAYS
                      </span>
                      <span className={`text-xl font-bold ${getProgressColor(subject.progress)}`}>
                        {subject.progress}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Progress 
                      value={subject.progress} 
                      className="h-3 terminal-bg border border-neon-cyan/30"
                    />
                    <div className="flex justify-between text-xs font-mono">
                      <span className="neon-green">INITIATED</span>
                      <span className={`font-bold ${subject.progress === 100 ? 'neon-green' : 'neon-yellow'}`}>
                        {subject.progress === 100 ? '[COMPLETED]' : '[IN_PROGRESS]'}
                      </span>
                      <span className="neon-magenta">TARGET: {subject.deadline}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
