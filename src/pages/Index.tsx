
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Calendar, BookOpen, MessageCircle, Target, Plus, Clock } from "lucide-react";
import { StudyTracker } from "@/components/StudyTracker";
import { TimetableGenerator } from "@/components/TimetableGenerator";
import { ChatInterface } from "@/components/ChatInterface";
import { SubjectManager } from "@/components/SubjectManager";

const Index = () => {
  const [subjects, setSubjects] = useState([
    { id: 1, name: "Mathematics", progress: 65, deadline: "2024-07-15", priority: "high" },
    { id: 2, name: "Physics", progress: 45, deadline: "2024-07-20", priority: "medium" },
    { id: 3, name: "Chemistry", progress: 80, deadline: "2024-07-10", priority: "high" },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">
      {/* Cool Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>
      
      <div className="relative z-10 container mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            AI Study Planner
          </h1>
          <p className="text-gray-600 text-lg">
            Your intelligent companion for academic success
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="timetable" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Timetable
            </TabsTrigger>
            <TabsTrigger value="tracker" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Tracker
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              AI Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Subjects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-indigo-600">{subjects.length}</div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Average Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(subjects.reduce((acc, s) => acc + s.progress, 0) / subjects.length)}%
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Upcoming Deadlines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {subjects.filter(s => new Date(s.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SubjectManager subjects={subjects} setSubjects={setSubjects} />
              
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Chemistry chapter completed</span>
                    <span className="text-xs text-gray-400">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Mathematics quiz scheduled</span>
                    <span className="text-xs text-gray-400">5 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">Physics study session</span>
                    <span className="text-xs text-gray-400">1 day ago</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timetable">
            <TimetableGenerator subjects={subjects} />
          </TabsContent>

          <TabsContent value="tracker">
            <StudyTracker subjects={subjects} setSubjects={setSubjects} />
          </TabsContent>

          <TabsContent value="chat">
            <ChatInterface />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
