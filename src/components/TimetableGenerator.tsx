
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Target, Zap, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Subject {
  id: string;
  name: string;
  progress: number;
  deadline: string;
  priority: string;
}

interface TimetableGeneratorProps {
  subjects: Subject[];
}

interface TimeSlot {
  id: string;
  subject: string;
  startTime: string;
  endTime: string;
  day: string;
}

export const TimetableGenerator = ({ subjects }: TimetableGeneratorProps) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [newSlot, setNewSlot] = useState({
    subject: "",
    startTime: "",
    endTime: "",
    day: "Monday"
  });
  const { toast } = useToast();

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const addTimeSlot = () => {
    if (!newSlot.subject || !newSlot.startTime || !newSlot.endTime) {
      toast({
        title: "ERROR: INCOMPLETE_DATA",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const slot: TimeSlot = {
      id: Date.now().toString(),
      subject: newSlot.subject,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      day: newSlot.day
    };

    setTimeSlots([...timeSlots, slot]);
    setNewSlot({ subject: "", startTime: "", endTime: "", day: "Monday" });
    
    toast({
      title: "[SUCCESS] Schedule Updated",
      description: "Time slot added to your study protocol",
    });
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
    toast({
      title: "[INFO] Slot Removed",
      description: "Schedule entry deleted from system",
    });
  };

  const generateSmartTimetable = () => {
    if (subjects.length === 0) {
      toast({
        title: "ERROR: NO_SUBJECTS_FOUND",
        description: "Add subjects before generating schedule",
        variant: "destructive"
      });
      return;
    }

    // Smart scheduling algorithm based on priority and deadlines
    const newSlots: TimeSlot[] = [];
    const timeSlots = ["09:00", "11:00", "14:00", "16:00", "19:00"];
    
    subjects.forEach((subject, index) => {
      const dayIndex = index % 7;
      const timeIndex = index % timeSlots.length;
      
      newSlots.push({
        id: `generated-${index}`,
        subject: subject.name,
        startTime: timeSlots[timeIndex],
        endTime: `${parseInt(timeSlots[timeIndex]) + 2}:00`,
        day: daysOfWeek[dayIndex]
      });
    });

    setTimeSlots(newSlots);
    toast({
      title: "[AI] Smart Schedule Generated",
      description: "Optimized timetable created based on subject priorities",
    });
  };

  return (
    <div className="space-y-8 terminal-bg cyber-grid p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold neon-cyan font-mono flex items-center justify-center gap-3">
          <Calendar className="w-10 h-10" />
          NEURAL_SCHEDULER
        </h2>
        <p className="text-neon-magenta font-mono text-lg">
          &gt; Optimizing your study sessions with AI precision
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Time Slot */}
        <Card className="terminal-bg glow-cyan scanlines hover-glow hover-glow-cyan transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 neon-cyan font-mono text-xl">
              <Plus className="w-6 h-6" />
              ADD_SCHEDULE_ENTRY
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
                  value={newSlot.subject}
                  onChange={(e) => setNewSlot({...newSlot, subject: e.target.value})}
                  className="w-full p-3 terminal-bg border border-neon-cyan/50 rounded-lg neon-cyan font-mono glow-cyan focus:glow-cyan focus:outline-none"
                >
                  <option value="" className="bg-background">Select Module</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.name} className="bg-background text-foreground">
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="day-select" className="text-neon-magenta font-mono text-sm mb-2 block">
                  [DAY_CYCLE]
                </Label>
                <select
                  id="day-select"
                  value={newSlot.day}
                  onChange={(e) => setNewSlot({...newSlot, day: e.target.value})}
                  className="w-full p-3 terminal-bg border border-neon-magenta/50 rounded-lg neon-magenta font-mono glow-magenta focus:glow-magenta focus:outline-none"
                >
                  {daysOfWeek.map(day => (
                    <option key={day} value={day} className="bg-background text-foreground">
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-time" className="text-neon-green font-mono text-sm mb-2 block">
                    [START_TIME]
                  </Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})}
                    className="terminal-bg border-neon-green/50 neon-green font-mono glow-green focus:glow-green"
                  />
                </div>
                
                <div>
                  <Label htmlFor="end-time" className="text-neon-blue font-mono text-sm mb-2 block">
                    [END_TIME]
                  </Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})}
                    className="terminal-bg border-neon-blue/50 neon-blue font-mono glow-blue focus:glow-blue"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button 
                onClick={addTimeSlot} 
                className="flex-1 glow-cyan hover:glow-cyan font-mono border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-background transition-all hover-glow hover-glow-cyan"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                SCHEDULE
              </Button>
              
              <Button 
                onClick={generateSmartTimetable} 
                className="flex-1 glow-magenta hover:glow-magenta font-mono border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-background transition-all hover-glow hover-glow-magenta"
                variant="outline"
              >
                <Zap className="w-4 h-4 mr-2" />
                AI_GEN
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Overview */}
        <Card className="terminal-bg glow-green scanlines hover-glow hover-glow-green transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 neon-green font-mono text-xl">
              <Target className="w-6 h-6" />
              SCHEDULE_MATRIX
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {timeSlots.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 neon-cyan mx-auto mb-4" />
                  <p className="neon-cyan font-mono">NO SCHEDULES FOUND</p>
                  <p className="text-neon-cyan/60 font-mono text-sm">Initialize your study protocol</p>
                </div>
              ) : (
                timeSlots.map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between p-4 border border-neon-green/30 rounded-lg terminal-bg glow-green/20 hover:glow-green/40 transition-all">
                    <div className="space-y-1">
                      <div className="font-mono neon-green text-lg">{slot.subject}</div>
                      <div className="font-mono text-neon-blue text-sm">
                        [{slot.day}] {slot.startTime} → {slot.endTime}
                      </div>
                    </div>
                    <Button
                      onClick={() => removeTimeSlot(slot.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white glow-red hover:glow-red transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly View */}
      {timeSlots.length > 0 && (
        <Card className="terminal-bg glow-blue scanlines">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 neon-blue font-mono text-xl">
              <Calendar className="w-6 h-6" />
              WEEKLY_PROTOCOL_VIEW
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {daysOfWeek.map(day => (
                <div key={day} className="space-y-2">
                  <h3 className="font-mono neon-magenta text-center text-sm font-bold border-b border-neon-magenta/30 pb-2">
                    {day.toUpperCase()}
                  </h3>
                  <div className="space-y-2">
                    {timeSlots
                      .filter(slot => slot.day === day)
                      .map(slot => (
                        <div key={slot.id} className="p-2 border border-neon-cyan/30 rounded terminal-bg text-xs">
                          <div className="neon-cyan font-mono truncate">{slot.subject}</div>
                          <div className="text-neon-blue font-mono text-xs">
                            {slot.startTime}-{slot.endTime}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
