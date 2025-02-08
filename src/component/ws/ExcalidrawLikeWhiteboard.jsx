"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Pencil, Square, Circle, Type, Move, Undo, Redo, Download, Upload, Trash } from "lucide-react"

const ExcalidrawLikeWhiteboard = ({ roomId, userId, wsRef }) => {
  const canvasRef = useRef(null)
  const [shapes, setShapes] = useState([])
  const [currentShape, setCurrentShape] = useState(null)
  const [selectedTool, setSelectedTool] = useState("select")
  const [selectedColor, setSelectedColor] = useState("#000000")
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [isDrawing, setIsDrawing] = useState(false)
  const [selectedShape, setSelectedShape] = useState(null)
  const [textInput, setTextInput] = useState("")
  const [undoStack, setUndoStack] = useState([])
  const [redoStack, setRedoStack] = useState([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
  }, [])

  useEffect(() => {
    drawShapes()
  }, [shapes])

  const drawShapes = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx || !canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    shapes.forEach((shape) => {
      ctx.beginPath()
      ctx.strokeStyle = shape.color
      ctx.lineWidth = shape.strokeWidth

      switch (shape.type) {
        case "rectangle":
          ctx.rect(shape.x1, shape.y1, shape.x2 - shape.x1, shape.y2 - shape.y1)
          break
        case "ellipse":
          const centerX = (shape.x1 + shape.x2) / 2
          const centerY = (shape.y1 + shape.y2) / 2
          const radiusX = Math.abs(shape.x2 - shape.x1) / 2
          const radiusY = Math.abs(shape.y2 - shape.y1) / 2
          ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI)
          break
        case "line":
          ctx.moveTo(shape.x1, shape.y1)
          ctx.lineTo(shape.x2, shape.y2)
          break
        case "text":
          ctx.font = `${shape.strokeWidth * 8}px Arial`
          ctx.fillStyle = shape.color
          ctx.fillText(shape.text || "", shape.x1, shape.y1)
          break
      }

      if (shape.type !== "text") {
        ctx.stroke()
      }

      if (shape === selectedShape) {
        ctx.setLineDash([5, 5])
        ctx.strokeStyle = "blue"
        ctx.lineWidth = 1
        ctx.strokeRect(shape.x1 - 5, shape.y1 - 5, shape.x2 - shape.x1 + 10, shape.y2 - shape.y1 + 10)
        ctx.setLineDash([])
      }
    })
  }

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (selectedTool === "select") {
      const clickedShape = shapes.find((shape) => x >= shape.x1 && x <= shape.x2 && y >= shape.y1 && y <= shape.y2)
      setSelectedShape(clickedShape || null)
    } else {
      setIsDrawing(true)
      const newShape = {
        id: Date.now().toString(),
        type: selectedTool === "text" ? "text" : selectedTool,
        x1: x,
        y1: y,
        x2: x,
        y2: y,
        color: selectedColor,
        strokeWidth: strokeWidth,
        text: selectedTool === "text" ? textInput : undefined,
      }
      setCurrentShape(newShape)
      const drawData = {
        type: 'DRAW',
        data: {
          x,
          y,
          drawing: true,
          shapeType: selectedTool,
          color: selectedColor,
          strokeWidth,
          text: textInput,
          id: newShape.id,
        }
      }
      wsRef.current?.send(JSON.stringify(drawData))
    
    }
  }
  



  const handleMouseMove = (e) => {
    if (!isDrawing || !currentShape) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setCurrentShape({
      ...currentShape,
      x2: x,
      y2: y,
    })

    const drawData = {
        type: 'DRAW',
        data: {
          x,
          y,
          drawing: true,
          shapeType: currentShape.type,
          color: currentShape.color,
          strokeWidth: currentShape.strokeWidth,
          id: currentShape.id,
        }
      }
      wsRef.current?.send(JSON.stringify(drawData))
  
      drawShapes()
      drawCurrentShape()
  }

  const handleMouseUp = () => {
    if (!currentShape) return

    const drawData = {
        type: 'DRAW',
        data: {
          x: currentShape.x2,
          y: currentShape.y2,
          drawing: false,
          shapeType: currentShape.type,
          color: currentShape.color,
          strokeWidth: currentShape.strokeWidth,
          id: currentShape.id,
        }
      }
      wsRef.current?.send(JSON.stringify(drawData))
  
      setIsDrawing(false)
      setUndoStack([...undoStack, shapes])
      setRedoStack([])
      setShapes([...shapes, currentShape])
      setCurrentShape(null)
  }
  

  const drawCurrentShape = () => {
    if (!currentShape) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx || !canvas) return

    ctx.beginPath()
    ctx.strokeStyle = currentShape.color
    ctx.lineWidth = currentShape.strokeWidth

    switch (currentShape.type) {
      case "rectangle":
        ctx.rect(currentShape.x1, currentShape.y1, currentShape.x2 - currentShape.x1, currentShape.y2 - currentShape.y1)
        break
      case "ellipse":
        const centerX = (currentShape.x1 + currentShape.x2) / 2
        const centerY = (currentShape.y1 + currentShape.y2) / 2
        const radiusX = Math.abs(currentShape.x2 - currentShape.x1) / 2
        const radiusY = Math.abs(currentShape.y2 - currentShape.y1) / 2
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI)
        break
      case "line":
        ctx.moveTo(currentShape.x1, currentShape.y1)
        ctx.lineTo(currentShape.x2, currentShape.y2)
        break
      case "text":
        ctx.font = `${currentShape.strokeWidth * 8}px Arial`
        ctx.fillStyle = currentShape.color
        ctx.fillText(currentShape.text || "", currentShape.x1, currentShape.y1)
        break
    }

    if (currentShape.type !== "text") {
      ctx.stroke()
    }
  }

  const handleClearWhiteboard = () => {
    setShapes([])
    setUndoStack([...undoStack, shapes])
    setRedoStack([])
    wsRef.current?.send(
      JSON.stringify({
        type: "CLEAR_WHITEBOARD",
        roomId,
        userId,
      }),
    )
  }

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousShapes = undoStack[undoStack.length - 1]
      setRedoStack([...redoStack, shapes])
      setShapes(previousShapes)
      setUndoStack(undoStack.slice(0, -1))
    }
  }

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextShapes = redoStack[redoStack.length - 1]
      setUndoStack([...undoStack, shapes])
      setShapes(nextShapes)
      setRedoStack(redoStack.slice(0, -1))
    }
  }

  const handleExport = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = "whiteboard.png"
      link.href = dataUrl
      link.click()
    }
  }

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          const canvas = canvasRef.current
          if (canvas) {
            const ctx = canvas.getContext("2d")
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height)
              ctx.drawImage(img, 0, 0)
            }
          }
        }
        img.src = event.target?.result
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    if (!wsRef.current) return

    const handleMessage = (event) => {
        const data = JSON.parse(event.data)
        
        if (data.type === 'DRAW' && data.userId !== userId) {
          const { x, y, drawing, shapeType, color, strokeWidth, id, text } = data.data
          
          if (drawing) {
            // Start or continue drawing
            if (!shapes.find(shape => shape.id === id)) {
              // New shape
              const newShape = {
                id,
                type: shapeType,
                x1: x,
                y1: y,
                x2: x,
                y2: y,
                color,
                strokeWidth,
                text
              }
              setShapes(prevShapes => [...prevShapes, newShape])
            } else {
              // Update existing shape
              setShapes(prevShapes => 
                prevShapes.map(shape => 
                  shape.id === id 
                    ? { ...shape, x2: x, y2: y }
                    : shape
                )
              )
            }
          }
        } else if (data.type === "CLEAR_WHITEBOARD" && data.roomId === roomId && data.userId !== userId) {
          setShapes([])
        }
      }
  
      wsRef.current.addEventListener("message", handleMessage)
  
      return () => {
        wsRef.current?.removeEventListener("message", handleMessage)
      }
    }, [roomId, userId, wsRef, shapes])

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-2 p-2 bg-gray-800 rounded-lg">
        <div className="flex space-x-2">
          <Button
            variant={selectedTool === "select" ? "default" : "outline"}
            size="icon"
            onClick={() => setSelectedTool("select")}
          >
            <Move className="h-4 w-4" />
          </Button>
          <Button
            variant={selectedTool === "rectangle" ? "default" : "outline"}
            size="icon"
            onClick={() => setSelectedTool("rectangle")}
          >
            <Square className="h-4 w-4" />
          </Button>
          <Button
            variant={selectedTool === "ellipse" ? "default" : "outline"}
            size="icon"
            onClick={() => setSelectedTool("ellipse")}
          >
            <Circle className="h-4 w-4" />
          </Button>
          <Button
            variant={selectedTool === "line" ? "default" : "outline"}
            size="icon"
            onClick={() => setSelectedTool("line")}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant={selectedTool === "text" ? "default" : "outline"}
            size="icon"
            onClick={() => setSelectedTool("text")}
          >
            <Type className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-8 h-8 p-0 border-none"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                Stroke: {strokeWidth}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <Slider value={[strokeWidth]} onValueChange={(value) => setStrokeWidth(value[0])} max={20} step={1} />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={handleUndo}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleRedo}>
            <Redo className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
          <label htmlFor="import-file">
            <Button variant="outline" size="icon" as="span">
              <Upload className="h-4 w-4" />
            </Button>
          </label>
          <input id="import-file" type="file" accept="image/*" className="hidden" onChange={handleImport} />
          <Button variant="destructive" size="icon" onClick={handleClearWhiteboard}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {selectedTool === "text" && (
        <Input
          type="text"
          placeholder="Enter text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="mb-2"
        />
      )}
      <canvas
        ref={canvasRef}
        className="flex-grow bg-white border border-gray-300 rounded cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  )
}

export default ExcalidrawLikeWhiteboard