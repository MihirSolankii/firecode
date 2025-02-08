import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { MessageSquare, Code, PenTool, Circle, Square, Type } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';

const RoomSelection = () => {
  const tokens = localStorage.getItem('token');
  const [roomId, setRoomId] = useState('');
  const [messages, setMessages] = useState([]);
  const [code, setCode] = useState('// Start coding here...');
  const [messageInput, setMessageInput] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [userId, setUserId] = useState(`user-${Math.random().toString(36).substr(2, 9)}`);

  const [whiteboardHistory, setWhiteboardHistory] = useState([]);
 
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedTool, setSelectedTool] = useState('pen');
  const [drawingText, setDrawingText] = useState('');


  const wsRef = useRef(null);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const themeColors = {
    primary: '#FF4F00',
    secondary: '#1E1E1E',
    background: '#0D0D0D',
    surface: '#1A1A1A',
    text: '#FFFFFF',
    border: '#2D2D2D'
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.strokeStyle = themeColors.primary;
      ctx.lineWidth = 2;
      contextRef.current = ctx;
    }
  }, []);

  const handleCreateRoom = async () => {
    try {
      const response = await axios.post('https://leetcode-backend-1-5uw5.onrender.com/create-room', {}, {
        headers: { Authorization: `Bearer ${tokens}` },
      });
      setRoomId(response.data.roomId);
      toast.success(`Room Created! Room ID: ${response.data.roomId}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to create room.');
    }
  };

  const handleJoinRoom = async () => {
    try {
      connectWebSocket();
      toast.success('Joined room successfully.');
    } catch (error) {
      console.error(error);
      toast.error('Failed to join room.');
    }
  };

  const connectWebSocket = () => {
    const wsUrl = `ws://leetcode-backend-1-5uw5.onrender.com/?roomid=${roomId}&token=${tokens}`;
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      setConnectionStatus('Connected');
      toast.success('Connected to WebSocket server.');
      // Request initial sync
      wsRef.current.send(JSON.stringify({ type: 'REQUEST_SYNC' }));
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'CHAT_MESSAGE':
          setMessages((prev) => [...prev, data]);
          break;
        case 'CODE_CHANGE':
          setCode(data.code);
          break;
        case 'CURSOR_MOVE':
          if (data.userId !== userId) {
            setCursors(prev => ({
              ...prev,
              [data.userId]: { x: data.x, y: data.y }
            }));
          }
          break;
        case 'DRAW':
          drawRemoteStroke(data.data);
          setWhiteboardHistory(prev => [...prev, data]);
          break;
        case 'CLEAR_WHITEBOARD':
          clearCanvas();
          setWhiteboardHistory([]);
          break;
        case 'SYNC_RESPONSE':
          setCode(data.code);
          setMessages(data.messages);
          redrawWhiteboard(data.whiteboard);
          break;
        case 'INIT_DATA':
          setMessages(data.messages);
          setCode(data.code);
          redrawWhiteboard(data.whiteboard);
          break;
        case 'USER_DISCONNECT':
          setCursors(prev => {
            const newCursors = { ...prev };
            delete newCursors[data.userId];
            return newCursors;
          });
          break;
      }
    };

    wsRef.current.onclose = () => {
      setConnectionStatus('Disconnected');
      toast.warning('Disconnected from WebSocket server.');
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast.error('WebSocket error occurred.');
    };
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const message = {
      type: 'CHAT_MESSAGE',
      content: messageInput,
      userId,
      timestamp: new Date().toLocaleTimeString()
    };

    // Update local state immediately
    setMessages(prev => [...prev, message]);
    
    // Send to other users
    wsRef.current?.send(JSON.stringify(message));
    setMessageInput('');
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode); // Update local state immediately
    
    const message = {
      type: 'CODE_CHANGE',
      code: newCode,
      userId,
    };
    wsRef.current?.send(JSON.stringify(message));
  };

  // const handleStartDrawing = (e) => {
  //   const canvas = canvasRef.current;
  //   const rect = canvas.getBoundingClientRect();
  //   const x = e.clientX - rect.left;
  //   const y = e.clientY - rect.top;

  //   contextRef.current.beginPath();
  //   contextRef.current.moveTo(x, y);
  //   setIsDrawing(true);

  //   // Send starting point to other users
  //   const drawData = {
  //     type: 'DRAW',
  //     data: {
  //       x,
  //       y,
  //       drawing: false
  //     }
  //   };
  //   wsRef.current?.send(JSON.stringify(drawData));
  // };

  const handleDrawing = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();

    const drawData = {
      type: 'DRAW',
      data: {
        x,
        y,
        drawing: true
      }
    };
    wsRef.current?.send(JSON.stringify(drawData));
    
    // Update local whiteboard history
    setWhiteboardHistory(prev => [...prev, drawData]);
  };

  // const handleStopDrawing = () => {
  //   contextRef.current?.closePath();
  //   setIsDrawing(false);
  // };

  const drawRemoteStroke = (data) => {
    if (!contextRef.current) return;

    if (!data.drawing) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(data.x, data.y);
    } else {
      contextRef.current.lineTo(data.x, data.y);
      contextRef.current.stroke();
    }
  };

  const clearCanvas = () => {
    if (!contextRef.current || !canvasRef.current) return;
    contextRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  };

  const handleClearWhiteboard = () => {
    clearCanvas();
    setWhiteboardHistory([]); // Clear local history immediately
    
    const clearMessage = {
      type: 'CLEAR_WHITEBOARD',
      userId
    };
    wsRef.current?.send(JSON.stringify(clearMessage));
  };

  const redrawWhiteboard = (history) => {
    clearCanvas();
    if (!history) return;
    
    history.forEach(item => {
      if (item.type === 'DRAW') {
        drawRemoteStroke(item.data);
      }
    });
  };

  useEffect(() => {
    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'USER_DISCONNECT',
          userId
        }));
      }
      wsRef.current?.close();
    };
  }, [userId]);
  // ... (keep existing WebSocket and room management functions)

  // const handleDraw = (e) => {
  //   if (!isDrawing) return;

  //   const canvas = canvasRef.current;
  //   const rect = canvas.getBoundingClientRect();
  //   const x = e.clientX - rect.left;
  //   const y = e.clientY - rect.top;

  //   switch (selectedTool) {
  //     case 'circle':
  //       drawCircle(x, y, 30);
  //       break;
  //     case 'rectangle':
  //       drawRectangle(x, y, 60, 40);
  //       break;
  //     case 'text':
  //       drawText(x, y, drawingText);
  //       break;
  //     default:
  //       drawFreehand(x, y);
  //   }

  //   const drawData = {
  //     type: 'DRAW',
  //     data: {
  //       x,
  //       y,
  //       tool: selectedTool,
  //       text: drawingText,
  //       drawing: true
  //     }
  //   };
  //   wsRef.current?.send(JSON.stringify(drawData));
  // };

  // const drawCircle = (x, y, radius) => {
  //   contextRef.current.beginPath();
  //   contextRef.current.arc(x, y, radius, 0, 2 * Math.PI);
  //   contextRef.current.stroke();
  // };

  // const drawRectangle = (x, y, width, height) => {
  //   contextRef.current.strokeRect(x - width/2, y - height/2, width, height);
  // };

  // const drawText = (x, y, text) => {
  //   contextRef.current.font = '16px Arial';
  //   contextRef.current.fillStyle = themeColors.primary;
  //   contextRef.current.fillText(text, x, y);
  // };

  const drawFreehand = (x, y) => {
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };
  const handleStartDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setStartPoint({ x, y });
    setIsDrawing(true);

    if (selectedTool === 'pen') {
      contextRef.current.beginPath();
      contextRef.current.moveTo(x, y);
    } else if (selectedTool === 'text') {
      // Draw text immediately on click
      drawText(x, y, drawingText);
      const drawData = {
        type: 'DRAW',
        data: {
          tool: 'text',
          x,
          y,
          text: drawingText
        }
      };
      wsRef.current?.send(JSON.stringify(drawData));
    }
  };

  const handleDraw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedTool === 'pen') {
      contextRef.current.lineTo(x, y);
      contextRef.current.stroke();
      
      const drawData = {
        type: 'DRAW',
        data: {
          tool: 'pen',
          x,
          y,
          drawing: true
        }
      };
      wsRef.current?.send(JSON.stringify(drawData));
    }
  };

  const handleStopDrawing = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedTool === 'circle') {
      drawCircle(startPoint.x, startPoint.y);
      const drawData = {
        type: 'DRAW',
        data: {
          tool: 'circle',
          x: startPoint.x,
          y: startPoint.y
        }
      };
      wsRef.current?.send(JSON.stringify(drawData));
    } else if (selectedTool === 'rectangle') {
      drawRectangle(startPoint.x, startPoint.y);
      const drawData = {
        type: 'DRAW',
        data: {
          tool: 'rectangle',
          x: startPoint.x,
          y: startPoint.y
        }
      };
      wsRef.current?.send(JSON.stringify(drawData));
    }

    setIsDrawing(false);
    contextRef.current?.closePath();
  };

  const drawCircle = (x, y) => {
    contextRef.current.beginPath();
    contextRef.current.arc(x, y, 30, 0, 2 * Math.PI);
    contextRef.current.stroke();
    contextRef.current.closePath();
  };

  const drawRectangle = (x, y) => {
    const width = 60;
    const height = 40;
    contextRef.current.beginPath();
    contextRef.current.strokeRect(x - width/2, y - height/2, width, height);
    contextRef.current.closePath();
  };

  const drawText = (x, y, text) => {
    if (!text.trim()) return;
    contextRef.current.font = '16px Arial';
    contextRef.current.fillStyle = themeColors.primary;
    contextRef.current.fillText(text, x, y);
  };

  // Handle remote drawing data
  const handleRemoteDrawing = (data) => {
    switch (data.tool) {
      case 'pen':
        if (!data.drawing) {
          contextRef.current.beginPath();
          contextRef.current.moveTo(data.x, data.y);
        } else {
          contextRef.current.lineTo(data.x, data.y);
          contextRef.current.stroke();
        }
        break;
      case 'circle':
        drawCircle(data.x, data.y);
        break;
      case 'rectangle':
        drawRectangle(data.x, data.y);
        break;
      case 'text':
        drawText(data.x, data.y, data.text);
        break;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: themeColors.background, color: themeColors.text }}>
      <ToastContainer theme="dark" />
      
      {/* Navbar */}
      <div className="fixed w-full h-16 flex justify-between items-center px-6 z-50 border-b" 
           style={{ background: themeColors.surface, borderColor: themeColors.border }}>
        <Link to="/" className="text-2xl font-bold">
          Fire<span style={{ color: themeColors.primary }}>Code</span>
        </Link>
        {/* ... (keep existing navbar content) */}
        <div className="flex items-center gap-6">
          {tokens && (
            <div className="cursor-pointer group relative">
              {/* <FaUserCircle className="w-8 h-8 text-[#b3b3b3]" /> */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-[#2c2c2c] text-orange-500 p-3 rounded shadow-lg group-hover:scale-100 scale-0 transition-all">
              
              </div>
            </div>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-[#1a1a1a] hover:bg-[#2c2c2c] text-white border-none">
                {connectionStatus === 'Connected' ? 'Connected' : 'Join Room'}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-800 border-zinc-700">
              <DialogHeader>
                <DialogTitle className="text-white">Join Collaboration Room</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="join" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-zinc-700">
                  <TabsTrigger value="join" className="text-white data-[state=active]:bg-zinc-600">
                    Join Room
                  </TabsTrigger>
                  <TabsTrigger value="create" className="text-white data-[state=active]:bg-zinc-600">
                    Create Room
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="join">
                  <div className="space-y-4">
                    <Input
                      placeholder="Enter Room ID"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      className="bg-zinc-700 border-zinc-600 text-white"
                    />
                    <Button onClick={handleJoinRoom} className="w-full bg-orange-500 hover:bg-orange-600">
                      Join Room
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="create">
                  <div className="space-y-4">
                    <Button onClick={handleCreateRoom} className="w-full bg-orange-500 hover:bg-orange-600">
                      Create New Room
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4 h-screen">
        <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-5rem)]">
          {/* Code Editor Panel */}
          <ResizablePanel defaultSize={50}>
            <Card className="h-[calc(100vh-8rem)]" style={{ background: themeColors.surface, borderColor: themeColors.border }}>
              <CardHeader className="border-b" style={{ borderColor: themeColors.border }}>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Code Editor
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-4rem)]">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  theme="vs-dark"
                  value={code}
                  onChange={setCode}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    padding: { top: 10 }
                  }}
                />
              </CardContent>
            
            </Card>
          </ResizablePanel>

          <ResizableHandle className="w-1" style={{ background: themeColors.border }} />

          {/* Chat and Whiteboard Panel */}
          <ResizablePanel defaultSize={50}>
            <ResizablePanelGroup direction="vertical">
              {/* Chat Panel with Updated Styling */}
              <ResizablePanel defaultSize={50}>
                <Card className="h-full" style={{ background: themeColors.surface, borderColor: themeColors.border }}>
                  <CardHeader className="border-b" style={{ borderColor: themeColors.border }}>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 h-[calc(100%-4rem)] flex flex-col">
                    <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                      {messages.map((msg, index) => (
                        <div 
                          key={index} 
                          className={`flex ${msg.userId === userId ? 'justify-end' : 'justify-start'}`}
                        >
                          <div style={{
                            background: msg.userId === userId ? themeColors.primary : themeColors.secondary,
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            maxWidth: '80%'
                          }}>
                            <div className="text-sm font-medium opacity-80">{msg.userId}</div>
                            <div className="break-words">{msg.content}</div>
                            <div className="text-xs opacity-50 mt-1">{msg.timestamp}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        style={{ background: themeColors.secondary, borderColor: themeColors.border }}
                      />
                      <Button onClick={handleSendMessage} style={{ background: themeColors.primary }}>
                        Send
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </ResizablePanel>

              <ResizableHandle className="h-1" style={{ background: themeColors.border }} />

              {/* Whiteboard Panel with Drawing Tools */}
              <ResizablePanel defaultSize={50}>
                <Card className="h-full" style={{ background: themeColors.surface, borderColor: themeColors.border }}>
                  <CardHeader className="border-b" style={{ borderColor: themeColors.border }}>
                    <CardTitle className="flex items-center gap-2">
                      <PenTool className="h-5 w-5" />
                      Whiteboard
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant={selectedTool === 'pen' ? 'secondary' : 'ghost'}
                          size="sm"
                          onClick={() => setSelectedTool('pen')}
                        >
                          <PenTool className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={selectedTool === 'circle' ? 'secondary' : 'ghost'}
                          size="sm"
                          onClick={() => setSelectedTool('circle')}
                        >
                          <Circle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={selectedTool === 'rectangle' ? 'secondary' : 'ghost'}
                          size="sm"
                          onClick={() => setSelectedTool('rectangle')}
                        >
                          <Square className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={selectedTool === 'text' ? 'secondary' : 'ghost'}
                          size="sm"
                          onClick={() => setSelectedTool('text')}
                        >
                          <Type className="h-4 w-4" />
                        </Button>
                      </div>
                      {selectedTool === 'text' && (
                        <Input
                          value={drawingText}
                          onChange={(e) => setDrawingText(e.target.value)}
                          placeholder="Enter text..."
                          className="ml-2 w-32"
                          style={{ background: themeColors.secondary, borderColor: themeColors.border }}
                        />
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleClearWhiteboard}
                        className="ml-auto"
                      >
                        Clear
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <canvas
                      ref={canvasRef}
                      className="w-full h-full rounded-lg"
                      style={{ background: themeColors.secondary }}
                      onMouseDown={handleStartDrawing}
                      onMouseMove={handleDraw}
                      onMouseUp={handleStopDrawing}
                      onMouseLeave={handleStopDrawing}
                    />
                  </CardContent>
                </Card>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default RoomSelection;