import React, { useEffect, useState, useRef } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";
import { ScrollArea } from "../components/ui/scroll-area";
// import { useToast } from "../components/ui/use-toast";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { useToast } from "@/hooks/use-toast"


const CodeRoom = ({ token, roomId, username }) => {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [code, setCode] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [connectedUsers, setConnectedUsers] = useState(new Set());
  const [isConnected, setIsConnected] = useState(false);
  const messageEndRef = useRef(null);
  const { toast } = useToast();

  // Initialize WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      const wsUrl = `ws://localhost:3000/?roomid=${roomId}`;
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        socket.send(JSON.stringify({
          type: 'REQUEST_SYNC'
        }));
        setIsConnected(true);
        toast({
          title: "Connected to room",
          description: "Successfully joined the coding session.",
        });
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };

      socket.onclose = () => {
        setIsConnected(false);
        toast({
          title: "Disconnected",
          description: "Connection lost. Attempting to reconnect...",
          variant: "destructive",
        });
        // Attempt to reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };

      setWs(socket);
    };

    if (token && roomId) {
      connectWebSocket();
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [token, roomId]);

  // Handle different types of WebSocket messages
  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'INIT_DATA':
        setMessages(data.messages);
        setCode(data.code);
        break;
      
      case 'USER_JOINED':
        setConnectedUsers(prev => new Set([...prev, data.userId]));
        setMessages(prev => [...prev, {
          type: 'SYSTEM',
          content: `User ${data.userId} joined`,
          timestamp: data.timestamp
        }]);
        break;
      
      case 'USER_LEFT':
        setConnectedUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          return newSet;
        });
        setMessages(prev => [...prev, {
          type: 'SYSTEM',
          content: `User ${data.userId} left`,
          timestamp: data.timestamp
        }]);
        break;
      
      case 'CHAT_MESSAGE':
        setMessages(prev => [...prev, data]);
        break;
      
      case 'CODE_CHANGE':
        setCode(data.code);
        break;
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle code changes
  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'CODE_CHANGE',
        code: newCode
      }));
    }
  };

  // Send chat message
  const sendMessage = () => {
    if (!inputMessage.trim() || !ws) return;

    const message = {
      type: 'CHAT_MESSAGE',
      content: inputMessage.trim()
    };

    ws.send(JSON.stringify(message));
    setInputMessage('');
  }; 

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  // Get user initials for avatar
  const getUserInitials = (userId) => {
    return userId.slice(0, 2).toUpperCase();
  };

  return (
    <div className="h-screen p-4 bg-background">
      <ResizablePanelGroup direction="horizontal">
        {/* Code Editor Panel */}
        <ResizablePanel defaultSize={60}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Code Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={code}
                onChange={handleCodeChange}
                placeholder="Write your code here..."
                className="h-[calc(100vh-200px)] font-mono"
              />
            </CardContent>
          </Card>
        </ResizablePanel>
        
        <ResizableHandle />
        
        {/* Chat Panel */}
        <ResizablePanel defaultSize={40}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Chat
                <Badge variant={isConnected ? "default" : "destructive"}>
                  {isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-[calc(100vh-200px)]">
              {/* Connected Users */}
              <div className="mb-4 flex gap-2">
                {Array.from(connectedUsers).map(userId => (
                  <Avatar key={userId}>
                    <AvatarFallback>{getUserInitials(userId)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              
              <Separator className="my-2" />
              
              {/* Messages */}
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.map((msg, idx) => (
                    <div key={idx} className="flex flex-col">
                      {msg.type === 'SYSTEM' ? (
                        <p className="text-sm text-muted-foreground text-center">
                          {msg.content}
                        </p>
                      ) : (
                        <div className="flex items-start gap-2">
                          <Avatar>
                            <AvatarFallback>{getUserInitials(msg.userId)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{msg.userId}</p>
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatTime(msg.timestamp)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messageEndRef} />
                </div>
              </ScrollArea>
              
              {/* Message Input */}
              <div className="flex gap-2 mt-4">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button onClick={sendMessage}>Send</Button>
              </div>
            </CardContent>
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default CodeRoom;