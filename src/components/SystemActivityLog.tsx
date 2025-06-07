
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

interface ActivityLog {
  id: string;
  message: string;
  type: 'SUCCESS' | 'ALERT' | 'INFO' | 'LOG';
  timestamp: Date;
}

interface SystemActivityLogProps {
  subjects: any[];
}

export const SystemActivityLog = ({ subjects }: SystemActivityLogProps) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    // Initialize with some default logs
    const initialLogs: ActivityLog[] = [
      {
        id: '1',
        message: 'System initialization complete',
        type: 'LOG',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        message: 'Neural network optimization active',
        type: 'INFO',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ];
    setLogs(initialLogs);
  }, []);

  // Add log when subjects change
  useEffect(() => {
    if (subjects.length > 0) {
      const newLog: ActivityLog = {
        id: Date.now().toString(),
        message: `${subjects.length} modules loaded successfully`,
        type: 'SUCCESS',
        timestamp: new Date()
      };
      setLogs(prev => [newLog, ...prev].slice(0, 10)); // Keep only last 10 logs
    }
  }, [subjects.length]);

  // Add log for urgent tasks
  useEffect(() => {
    const urgentTasks = subjects.filter(s => 
      new Date(s.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    ).length;
    
    if (urgentTasks > 0) {
      const newLog: ActivityLog = {
        id: Date.now().toString() + '_urgent',
        message: `${urgentTasks} urgent task${urgentTasks > 1 ? 's' : ''} detected`,
        type: 'ALERT',
        timestamp: new Date()
      };
      setLogs(prev => [newLog, ...prev.filter(log => !log.id.includes('_urgent'))].slice(0, 10));
    }
  }, [subjects]);

  const getLogColor = (type: string) => {
    switch (type) {
      case 'SUCCESS': return 'neon-green';
      case 'ALERT': return 'neon-magenta';
      case 'INFO': return 'neon-purple';
      case 'LOG': return 'neon-cyan';
      default: return 'neon-cyan';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'now';
  };

  return (
    <Card className="terminal-bg glow-cyan scanlines hover-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 neon-cyan font-mono text-xl">
          <Zap className="w-6 h-6" />
          SYSTEM_ACTIVITY_LOG
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 font-mono">
        {logs.map((log, index) => (
          <div key={log.id} className="flex items-center justify-between py-3 border-b border-neon-cyan/20 last:border-b-0">
            <span className={getLogColor(log.type)}>
              [{log.type}] {log.message}
            </span>
            <span className="neon-blue text-sm">{formatTime(log.timestamp)}</span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-center py-4 neon-cyan/50">
            No system activity recorded
          </div>
        )}
      </CardContent>
    </Card>
  );
};
