
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Bot, User, Brain, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "[SYSTEM_INIT] Neural AI Tutor activated. Ready to assist with your academic optimization protocols.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      console.log('Sending message to AI:', inputMessage);
      
      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: {
          message: inputMessage,
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Failed to get AI response: ${error.message}`);
      }

      console.log('AI response received:', data);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || "[ERROR] Neural pathways temporarily disrupted. Please retry transmission.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "[ERROR] Connection to neural network failed. Attempting to re-establish link...",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "ERROR: AI_CONNECTION_FAILED",
        description: "Unable to reach neural network. Check system status.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full terminal-bg cyber-grid p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold neon-green font-mono flex items-center justify-center gap-3">
          <Brain className="w-10 h-10" />
          AI_NEURAL_TUTOR
        </h2>
        <p className="text-neon-cyan font-mono text-lg">
          &gt; Advanced artificial intelligence study companion
        </p>
      </div>

      <Card className="h-[600px] flex flex-col terminal-bg glow-green scanlines">
        <CardHeader className="border-b border-neon-green/30">
          <CardTitle className="flex items-center gap-3 neon-green font-mono text-xl">
            <Zap className="w-6 h-6" />
            NEURAL_CHAT_INTERFACE
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div className={`p-2 rounded-lg border ${
                  message.isUser 
                    ? 'bg-neon-cyan/10 border-neon-cyan/30' 
                    : 'bg-neon-green/10 border-neon-green/30'
                }`}>
                  {message.isUser ? (
                    <User className="w-5 h-5 neon-cyan" />
                  ) : (
                    <Bot className="w-5 h-5 neon-green" />
                  )}
                </div>
                
                <div className={`max-w-[80%] p-4 rounded-lg border font-mono ${
                  message.isUser
                    ? 'terminal-bg border-neon-cyan/30 neon-cyan text-right'
                    : 'terminal-bg border-neon-green/30 neon-green'
                }`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 opacity-60 ${
                    message.isUser ? 'neon-cyan' : 'neon-green'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg border bg-neon-green/10 border-neon-green/30">
                  <Bot className="w-5 h-5 neon-green" />
                </div>
                <div className="max-w-[80%] p-4 rounded-lg border terminal-bg border-neon-green/30">
                  <div className="flex items-center gap-2 neon-green font-mono">
                    <div className="animate-pulse">●</div>
                    <div className="animate-pulse animation-delay-200">●</div>
                    <div className="animate-pulse animation-delay-400">●</div>
                    <span className="text-sm">Neural processing...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-neon-green/30 p-6">
            <div className="flex gap-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="[INPUT] Enter your query..."
                className="flex-1 terminal-bg border-neon-cyan/50 neon-cyan font-mono glow-cyan focus:glow-cyan"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="glow-green hover:glow-green font-mono border-neon-green text-neon-green hover:bg-neon-green hover:text-background transition-all hover-glow hover-glow-green"
                variant="outline"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs neon-cyan/60 font-mono mt-2">
              [TIP] Press Enter to transmit • Shift+Enter for new line
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
