
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, Clock, Target, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Subject {
  id: number;
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

  const logStudySession = () => {
    if (!studySession.subjectId || !studySession.duration || !studySession.progress) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const updatedSubjects = subjects.map(subject => {
      if (subject.id === parseInt(studySession.subjectId)) {
        const newProgress = Math.min(100, subject.progress + parseInt(studySession.progress));
        return { ...subject, progress: newProgress };
      }
      return subject;
    });

    setSubjects(updatedSubjects);
    setStudySession({ subjectId: "", duration: "", progress: "" });
    
    toast({
      title: "Study Session Logged!",
      description: `Great job! You studied for ${studySession.duration} minutes.`,
    });
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            Log Study Session
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="subject-select">Subject</Label>
              <select
                id="subject-select"
                value={studySession.subjectId}
                onChange={(e) => setStudySession({...studySession, subjectId: e.target.value})}
                className="w-full p-2 border rounded-md bg-white"
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={studySession.duration}
                onChange={(e) => setStudySession({...studySession, duration: e.target.value})}
                placeholder="60"
                className="bg-white"
              />
            </div>
            
            <div>
              <Label htmlFor="progress-add">Progress Added (%)</Label>
              <Input
                id="progress-add"
                type="number"
                max="100"
                value={studySession.progress}
                onChange={(e) => setStudySession({...studySession, progress: e.target.value})}
                placeholder="10"
                className="bg-white"
              />
            </div>
          </div>
          
          <Button onClick={logStudySession} className="w-full bg-indigo-600 hover:bg-indigo-700">
            <CheckCircle className="w-4 h-4 mr-2" />
            Log Study Session
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {subjects.map((subject) => (
              <div key={subject.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900">{subject.name}</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {getDaysUntilDeadline(subject.deadline)} days left
                    </span>
                    <span className="text-sm font-medium">
                      {subject.progress}%
                    </span>
                  </div>
                </div>
                <Progress value={subject.progress} className="h-3" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Started</span>
                  <span className="font-medium">
                    {subject.progress === 100 ? "Completed!" : "In Progress"}
                  </span>
                  <span>Target: {subject.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
