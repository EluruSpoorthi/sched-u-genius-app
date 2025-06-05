
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Subject {
  id: string;
  name: string;
  progress: number;
  deadline: string;
  priority: string;
}

export const useSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSubjects = async () => {
    if (!user) {
      setSubjects([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching subjects:', error);
        toast({
          title: "Error",
          description: "Failed to load subjects",
          variant: "destructive"
        });
        return;
      }

      const formattedSubjects: Subject[] = data?.map(subject => ({
        id: subject.id,
        name: subject.name,
        progress: subject.progress,
        deadline: subject.deadline,
        priority: subject.priority
      })) || [];

      setSubjects(formattedSubjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast({
        title: "Error",
        description: "Failed to load subjects",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [user]);

  return { subjects, setSubjects, loading, refetch: fetchSubjects };
};
