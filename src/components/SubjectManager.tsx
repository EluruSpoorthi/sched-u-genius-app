
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Plus, BookOpen, Calendar, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Subject {
  id: number;
  name: string;
  progress: number;
  deadline: string;
  priority: string;
}

interface SubjectManagerProps {
  subjects: Subject[];
  setSubjects: (subjects: Subject[]) => void;
}

export const SubjectManager = ({ subjects, setSubjects }: SubjectManagerProps) => {
  const [newSubject, setNewSubject] = useState({
    name: "",
    deadline: "",
    priority: "medium"
  });
  const { toast } = useToast();

  const addSubject = () => {
    if (!newSubject.name || !newSubject.deadline) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const subject: Subject = {
      id: Date.now(),
      name: newSubject.name,
      progress: 0,
      deadline: newSubject.deadline,
      priority: newSubject.priority
    };

    setSubjects([...subjects, subject]);
    setNewSubject({ name: "", deadline: "", priority: "medium" });
    
    toast({
      title: "Success",
      description: "Subject added successfully!",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "medium": return <Calendar className="w-4 h-4 text-yellow-500" />;
      case "low": return <BookOpen className="w-4 h-4 text-green-500" />;
      default: return <BookOpen className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          Subject Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <Label htmlFor="subject-name">Subject Name</Label>
            <Input
              id="subject-name"
              value={newSubject.name}
              onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
              placeholder="Enter subject name"
              className="bg-white"
            />
          </div>
          
          <div>
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={newSubject.deadline}
              onChange={(e) => setNewSubject({...newSubject, deadline: e.target.value})}
              className="bg-white"
            />
          </div>
          
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={newSubject.priority} onValueChange={(value) => setNewSubject({...newSubject, priority: value})}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={addSubject} className="w-full bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Subject
          </Button>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {subjects.map((subject) => (
            <div key={subject.id} className="p-3 bg-white rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getPriorityIcon(subject.priority)}
                  <span className="font-medium">{subject.name}</span>
                </div>
                <span className="text-sm text-gray-500">{subject.deadline}</span>
              </div>
              <Progress value={subject.progress} className="h-2" />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">{subject.progress}% complete</span>
                <span className={`text-xs font-medium ${getPriorityColor(subject.priority)}`}>
                  {subject.priority.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
