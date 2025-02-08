// CollaborationRoom.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../../components/ui/resizable";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";
import { useToast } from "@/hooks/use-toast"

const CollaborationRoom = ({ token }) => {
  const { roomId } = useParams();
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [code, setCode] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const connectWebSocket = () => {
      const wsUrl = new WebSocket(`ws://localhost:3000/?token=${token}&roomid=${roomId}`);
      const socket = new WebSocket(wsUrl);
      

      socket.addEventListener('open', () => {
        // Add authorization header
        socket.send(JSON.stringify({
          type: 'Authorization',
          token
        }));
        setIsConnected(true);
        toast({
          title: "Connected to room",
          description: "Successfully joined the coding session.",
        });
      });

      socket.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      });

      socket.addEventListener('close', () => {
        setIsConnected(false);
        toast({
          title: "Disconnected",
          description: "Connection lost. Attempting to reconnect...",
          variant: "destructive",
        });
        setTimeout(connectWebSocket, 3000);
      });

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

  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'CODE_CHANGE':
        setCode(data.code);
        break;
      case 'CHAT_MESSAGE':
        setMessages(prev => [...prev, data]);
        break;
      // Handle other message types...
    }
  };

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'CODE_CHANGE',
        code: newCode
      }));
    }
  };

  const sendMessage = () => {
    if (!inputMessage.trim() || !ws) return;

    ws.send(JSON.stringify({
      type: 'CHAT_MESSAGE',
      content: inputMessage.trim()
    }));
    setInputMessage('');
  };

  return (
    <div className="h-screen">
      <div className="border-b p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Room: {roomId}</h1>
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={60}>
          <Card className="h-full rounded-none border-0">
            <CardContent className="p-0">
              <textarea
                value={code}
                onChange={handleCodeChange}
                className="w-full h-full min-h-[calc(100vh-100px)] p-4 font-mono resize-none focus:outline-none"
                placeholder="Write your code here..."
              />
            </CardContent>
          </Card>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={40}>
          <Card className="h-full rounded-none border-0">
            <CardHeader>
              <CardTitle>Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-250px)]">
                <div className="space-y-4">
                  {messages.map((msg, idx) => (
                    <div key={idx} className="flex flex-col">
                      <p className="text-sm">
                        <span className="font-medium">{msg.userId}:</span> {msg.content}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              <Separator className="my-4" />
              
              <div className="flex gap-2">
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

export default CollaborationRoom;