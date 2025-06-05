
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Zap, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Subject {
  id: number;
  name: string;
  progress: number;
  deadline: string;
  priority: string;
}

interface TimetableGeneratorProps {
  subjects: Subject[];
}

interface StudySlot {
  time: string;
  subject: string;
  duration: string;
  type: string;
}

export const TimetableGenerator = ({ subjects }: TimetableGeneratorProps) => {
  const [preferences, setPreferences] = useState({
    studyHoursPerDay: "6",
    preferredStartTime: "09:00",
    preferredEndTime: "18:00",
    breakDuration: "15"
  });
  
  const [generatedTimetable, setGeneratedTimetable] = useState<StudySlot[]>([]);
  const { toast } = useToast();

  const generateTimetable = () => {
    if (subjects.length === 0) {
      toast({
        title: "No subjects available",
        description: "Please add some subjects first",
        variant: "destructive"
      });
      return;
    }

    // Simple timetable generation algorithm
    const slots: StudySlot[] = [];
    const totalHours = parseInt(preferences.studyHoursPerDay);
    const startHour = parseInt(preferences.preferredStartTime.split(':')[0]);
    const breakDuration = parseInt(preferences.breakDuration);
    
    // Sort subjects by priority and progress (less progress = more time needed)
    const sortedSubjects = [...subjects].sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityWeight[a.priority as keyof typeof priorityWeight];
      const bPriority = priorityWeight[b.priority as keyof typeof priorityWeight];
      
      // Higher priority and lower progress get more time
      return (bPriority - aPriority) || (a.progress - b.progress);
    });

    let currentHour = startHour;
    let remainingHours = totalHours;
    
    sortedSubjects.forEach((subject, index) => {
      if (remainingHours <= 0) return;
      
      // Allocate time based on priority and progress
      let allocatedHours = Math.max(1, Math.floor(remainingHours / (sortedSubjects.length - index)));
      if (subject.priority === 'high') allocatedHours = Math.min(allocatedHours + 1, remainingHours);
      
      slots.push({
        time: `${currentHour.toString().padStart(2, '0')}:00`,
        subject: subject.name,
        duration: `${allocatedHours * 60} min`,
        type: subject.progress < 50 ? 'Intensive Study' : 'Review'
      });
      
      currentHour += allocatedHours;
      remainingHours -= allocatedHours;
      
      // Add break
      if (index < sortedSubjects.length - 1 && remainingHours > 0) {
        slots.push({
          time: `${currentHour.toString().padStart(2, '0')}:00`,
          subject: 'Break',
          duration: `${breakDuration} min`,
          type: 'Rest'
        });
        currentHour += breakDuration / 60;
      }
    });

    setGeneratedTimetable(slots);
    toast({
      title: "Timetable Generated!",
      description: "Your personalized study schedule is ready.",
    });
  };

  const getSlotColor = (type: string) => {
    switch (type) {
      case 'Intensive Study': return 'bg-red-100 border-red-300 text-red-800';
      case 'Review': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'Rest': return 'bg-green-100 border-green-300 text-green-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-600" />
            Study Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="study-hours">Study Hours/Day</Label>
              <Input
                id="study-hours"
                type="number"
                min="1"
                max="12"
                value={preferences.studyHoursPerDay}
                onChange={(e) => setPreferences({...preferences, studyHoursPerDay: e.target.value})}
                className="bg-white"
              />
            </div>
            
            <div>
              <Label htmlFor="start-time">Preferred Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={preferences.preferredStartTime}
                onChange={(e) => setPreferences({...preferences, preferredStartTime: e.target.value})}
                className="bg-white"
              />
            </div>
            
            <div>
              <Label htmlFor="end-time">Preferred End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={preferences.preferredEndTime}
                onChange={(e) => setPreferences({...preferences, preferredEndTime: e.target.value})}
                className="bg-white"
              />
            </div>
            
            <div>
              <Label htmlFor="break-duration">Break Duration (min)</Label>
              <Input
                id="break-duration"
                type="number"
                min="5"
                max="60"
                value={preferences.breakDuration}
                onChange={(e) => setPreferences({...preferences, breakDuration: e.target.value})}
                className="bg-white"
              />
            </div>
          </div>
          
          <Button onClick={generateTimetable} className="w-full bg-indigo-600 hover:bg-indigo-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate AI Timetable
          </Button>
        </CardContent>
      </Card>

      {generatedTimetable.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Generated Study Timetable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generatedTimetable.map((slot, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${getSlotColor(slot.type)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold">{slot.time}</span>
                      </div>
                      <div>
                        <div className="font-medium">{slot.subject}</div>
                        <div className="text-sm opacity-75">{slot.type}</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {slot.duration}
                    </div>
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
