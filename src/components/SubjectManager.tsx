
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Plus, BookOpen, Calendar, AlertTriangle, Zap } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const addSubject = async () => {
    if (!newSubject.name || !newSubject.deadline) {
      toast({
        title: "ERROR",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "ACCESS_DENIED",
        description: "Authentication required to add subjects",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert([
          {
            name: newSubject.name,
            deadline: newSubject.deadline,
            priority: newSubject.priority,
            user_id: user.id,
            progress: 0
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding subject:', error);
        toast({
          title: "SYSTEM_ERROR",
          description: "Failed to add subject. Please try again.",
          variant: "destructive"
        });
        return;
      }

      const newSubjectData: Subject = {
        id: data.id,
        name: data.name,
        progress: data.progress,
        deadline: data.deadline,
        priority: data.priority
      };

      setSubjects([...subjects, newSubjectData]);
      setNewSubject({ name: "", deadline: "", priority: "medium" });
      
      toast({
        title: "SUCCESS",
        description: "Subject module added to neural network!",
      });
    } catch (error) {
      console.error('Error adding subject:', error);
      toast({
        title: "NETWORK_ERROR",
        description: "Connection failed. Please retry.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "neon-magenta";
      case "medium": return "neon-cyan";
      case "low": return "neon-green";
      default: return "text-gray-400";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <AlertTriangle className="w-4 h-4 text-neon-magenta" />;
      case "medium": return <Calendar className="w-4 h-4 text-neon-cyan" />;
      case "low": return <BookOpen className="w-4 h-4 text-neon-green" />;
      default: return <BookOpen className="w-4 h-4 text-gray-400" />;
    }
  };

  const getProgressBarColor = (progress: number) => {
    if (progress >= 80) return "bg-neon-green";
    if (progress >= 50) return "bg-neon-cyan";
    return "bg-neon-magenta";
  };

  return (
    <Card className="terminal-bg glow-cyan scanlines hover-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 neon-cyan font-mono text-xl">
          <Zap className="w-6 h-6" />
          SUBJECT_MANAGER
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Subject Form */}
        <div className="space-y-4 p-4 terminal-bg border border-neon-cyan/30 rounded-lg">
          <div className="text-sm neon-cyan font-mono mb-3">&gt; ADD_NEW_MODULE</div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject-name" className="font-mono text-neon-cyan text-sm">MODULE_NAME</Label>
              <Input
                id="subject-name"
                value={newSubject.name}
                onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                placeholder="Enter subject name..."
                className="bg-background/50 border-neon-cyan/30 text-foreground font-mono glow-cyan focus:glow-cyan mt-1"
                disabled={isLoading}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deadline" className="font-mono text-neon-cyan text-sm">DEADLINE</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newSubject.deadline}
                  onChange={(e) => setNewSubject({...newSubject, deadline: e.target.value})}
                  className="bg-background/50 border-neon-cyan/30 text-foreground font-mono glow-cyan focus:glow-cyan mt-1"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <Label htmlFor="priority" className="font-mono text-neon-cyan text-sm">PRIORITY_LEVEL</Label>
                <Select 
                  value={newSubject.priority} 
                  onValueChange={(value) => setNewSubject({...newSubject, priority: value})}
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-background/50 border-neon-cyan/30 text-foreground font-mono glow-cyan focus:glow-cyan mt-1">
                    <SelectValue placeholder="Set priority..." />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-neon-cyan/30 font-mono">
                    <SelectItem value="low" className="text-neon-green">LOW</SelectItem>
                    <SelectItem value="medium" className="text-neon-cyan">MEDIUM</SelectItem>
                    <SelectItem value="high" className="text-neon-magenta">HIGH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              onClick={addSubject} 
              className="w-full bg-neon-cyan text-background hover:bg-neon-cyan/80 font-mono glow-cyan hover-glow hover-glow-cyan transition-all"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isLoading ? "PROCESSING..." : "ADD_MODULE"}
            </Button>
          </div>
        </div>

        {/* Subject List */}
        <div className="space-y-3 max-h-80 overflow-y-auto">
          <div className="text-sm neon-cyan font-mono mb-3">&gt; ACTIVE_MODULES [{subjects.length}]</div>
          
          {subjects.length === 0 ? (
            <div className="text-center py-8 text-neon-cyan/60 font-mono">
              No modules loaded. Add your first subject to begin.
            </div>
          ) : (
            subjects.map((subject) => (
              <div key={subject.id} className="p-4 terminal-bg border border-neon-cyan/20 rounded-lg hover:border-neon-cyan/40 transition-all hover-glow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getPriorityIcon(subject.priority)}
                    <span className="font-mono text-foreground font-medium">{subject.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono px-2 py-1 rounded border ${getPriorityColor(subject.priority)} border-current`}>
                      {subject.priority.toUpperCase()}
                    </span>
                    <span className="text-sm neon-blue font-mono">{subject.deadline}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Progress 
                    value={subject.progress} 
                    className="h-2 bg-background/30"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-foreground/70">
                      Progress: {subject.progress}%
                    </span>
                    <span className={`text-xs font-mono ${getProgressBarColor(subject.progress)}`}>
                      {subject.progress === 100 ? "COMPLETED" : "IN_PROGRESS"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
