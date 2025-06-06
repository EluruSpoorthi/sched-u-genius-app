
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, Play, Pause, RotateCcw, Clock, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudySession {
  id: string;
  subject: string;
  duration: number;
  date: string;
}

interface StudyTimerProps {
  subjects: Array<{ id: string; name: string }>;
}

export const StudyTimer = ({ subjects }: StudyTimerProps) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Load sessions from localStorage
    const savedSessions = localStorage.getItem('studySessions');
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions);
      setSessions(parsedSessions);
      
      // Calculate today's total
      const today = new Date().toDateString();
      const todaySessions = parsedSessions.filter((session: StudySession) => 
        new Date(session.date).toDateString() === today
      );
      const total = todaySessions.reduce((acc: number, session: StudySession) => 
        acc + session.duration, 0
      );
      setTodayTotal(total);
    }
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isRunning) {
      intervalId = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isRunning]);

  const startTimer = () => {
    if (!selectedSubject && subjects.length > 0) {
      toast({
        title: "ERROR: NO_SUBJECT_SELECTED",
        description: "Select a subject module to track progress",
        variant: "destructive"
      });
      return;
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    
    if (time > 0) {
      // Save session
      const session: StudySession = {
        id: Date.now().toString(),
        subject: selectedSubject || "General Study",
        duration: time,
        date: new Date().toISOString()
      };

      const updatedSessions = [...sessions, session];
      setSessions(updatedSessions);
      localStorage.setItem('studySessions', JSON.stringify(updatedSessions));
      
      // Update today's total
      const today = new Date().toDateString();
      const todaySessions = updatedSessions.filter(s => 
        new Date(s.date).toDateString() === today
      );
      const total = todaySessions.reduce((acc, s) => acc + s.duration, 0);
      setTodayTotal(total);

      toast({
        title: "[SUCCESS] Session Saved",
        description: `${formatTime(time)} logged to neural database`,
      });
    }
    
    setTime(0);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getWeeklyTotal = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return sessions
      .filter(session => new Date(session.date) >= weekAgo)
      .reduce((acc, session) => acc + session.duration, 0);
  };

  return (
    <Card className="terminal-bg glow-blue border-neon-blue/50 scanlines hover-glow hover-glow-blue transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 neon-blue font-mono text-xl">
          <Timer className="w-6 h-6" />
          NEURAL_TIMER_PROTOCOL
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Subject Selection */}
        {subjects.length > 0 && (
          <div>
            <label className="text-neon-cyan font-mono text-sm mb-2 block">
              [ACTIVE_MODULE]
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-3 terminal-bg border border-neon-cyan/50 rounded-lg neon-cyan font-mono glow-cyan focus:glow-cyan focus:outline-none"
              disabled={isRunning}
            >
              <option value="" className="bg-background">Select Subject</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.name} className="bg-background text-foreground">
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Timer Display */}
        <div className="text-center space-y-4">
          <div className="text-6xl font-mono neon-green font-bold tracking-wider">
            {formatTime(time)}
          </div>
          <div className="text-sm neon-cyan font-mono">
            {isRunning ? '[ACTIVE_SESSION]' : '[STANDBY_MODE]'}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!isRunning ? (
            <Button
              onClick={startTimer}
              className="glow-green hover:glow-green font-mono border-neon-green text-neon-green hover:bg-neon-green hover:text-background transition-all hover-glow hover-glow-green"
              variant="outline"
            >
              <Play className="w-4 h-4 mr-2" />
              INITIATE
            </Button>
          ) : (
            <Button
              onClick={pauseTimer}
              className="glow-yellow hover:glow-yellow font-mono border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-background transition-all"
              variant="outline"
            >
              <Pause className="w-4 h-4 mr-2" />
              PAUSE
            </Button>
          )}
          
          <Button
            onClick={resetTimer}
            className="glow-magenta hover:glow-magenta font-mono border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-background transition-all hover-glow hover-glow-magenta"
            variant="outline"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            RESET
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 border border-neon-cyan/30 rounded-lg terminal-bg">
            <Clock className="w-6 h-6 neon-cyan mx-auto mb-2" />
            <div className="text-xl font-bold neon-cyan font-mono">
              {formatTime(todayTotal)}
            </div>
            <div className="text-xs neon-cyan/70 font-mono">TODAY_TOTAL</div>
          </div>
          
          <div className="text-center p-4 border border-neon-magenta/30 rounded-lg terminal-bg">
            <Target className="w-6 h-6 neon-magenta mx-auto mb-2" />
            <div className="text-xl font-bold neon-magenta font-mono">
              {formatTime(getWeeklyTotal())}
            </div>
            <div className="text-xs neon-magenta/70 font-mono">WEEK_TOTAL</div>
          </div>
        </div>

        {/* Recent Sessions */}
        {sessions.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-mono neon-cyan text-sm font-bold">RECENT_SESSIONS:</h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {sessions.slice(-5).reverse().map((session) => (
                <div key={session.id} className="flex justify-between text-xs font-mono p-2 border border-neon-cyan/20 rounded terminal-bg">
                  <span className="neon-green">{session.subject}</span>
                  <span className="neon-blue">{formatTime(session.duration)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
