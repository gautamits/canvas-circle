import React, {useRef, useState, useEffect} from 'react';
import {getArcDataFromStartEnd, getDistance, getMousePosition, getFillRectDataFromStartEnd, RectCircleColliding} from './helpers'
import './App.scss';

interface Coordinate{
  x: number;
  y: number;
}

interface Structure{
  type: 'square' | 'circle';
  initial: Coordinate;
  final: Coordinate;
}

function App() {
  const ctx = useRef<CanvasRenderingContext2D | null>(null)
  const canvasRef = useRef<HTMLCanvasElement|null>(null)
  const initialPosition= useRef<Coordinate>({x: 0, y: 0})

  const [structureType, setStructureType] = useState<'square' | 'circle'>('square')
  const [structures, setStructures] = useState<Structure[]>([])
  const isMouseDown = useRef(false)


  function canvasRefCallback(el: HTMLCanvasElement){
    if(!el) return
    const container = document.getElementById("main")
    if(!container) return
    const containerRect = container.getBoundingClientRect()
    ctx.current = el.getContext("2d");
    canvasRef.current = el
    canvasRef.current.width = containerRect.width
    canvasRef.current.height = containerRect.height;
  }

  function fillSquare(startX: number, startY: number, endX: number, endY: number){
    let oneUnit = 10 // px
    const circle = structures.find(structure=>structure.type === 'circle')
    if(!circle) return
    const [circleX, circleY, radius] = getArcDataFromStartEnd(circle?.initial.x, circle?.initial.y, circle?.final.x, circle?.final.y)
    for(let i = startX + oneUnit; i + oneUnit < endX; i+=15){
      for(let j = startY + oneUnit ; j + oneUnit < endY; j+=15 ){

        const isColliding = RectCircleColliding(
          { x: circleX, y: circleY, r: radius },
          { x: i, y: j, w: oneUnit, h: oneUnit }
        );
        if(!isColliding) drawSquare(i, j, i + oneUnit, j+oneUnit, true)
      }
    }
  }

  function tile(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    structures.filter(({type})=>type==='square').forEach(square=>fillSquare(square.initial.x, square.initial.y, square.final.x, square.final.y))
  }

  function plotStructures(){
    if (!ctx.current) return;
    if(!canvasRef.current) return
    ctx.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    ctx.current.save()
    structures.forEach(structure=>drawStructure(structure))
    ctx.current.stroke();
    ctx.current.restore()
  }

  useEffect(()=>{
    plotStructures()
  },[structures.length, structureType])

  function handleMouseDown(
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) {
    if(!canvasRef.current) return
    isMouseDown.current = true
    const {x, y} = getMousePosition(canvasRef.current, e)
    initialPosition.current = {x, y}
  }

  function handleMouseUp(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    isMouseDown.current = false
    if(!canvasRef.current) return
    const {x, y} = getMousePosition(canvasRef.current, e)
    if(initialPosition.current.x === x && initialPosition.current.y === y){
     return
    }
    setStructures((structures) => [
      ...structures,
      {
        type: structureType,
        initial: initialPosition.current,
        final: { x, y },
      },
    ]);
  }

  function drawCircle(x1: number, y1: number, x2: number, y2: number){
    if(!ctx.current) return
    const circleData = getArcDataFromStartEnd(
      x1,
      y1,
      x2,
      y2
    );
    ctx.current.arc(...circleData);
  }

  function drawSquare(x1: number, y1: number, x2: number, y2: number, fill=false){
    if (!ctx.current) return;
    const squareData = getFillRectDataFromStartEnd(
          x1,
          y1,
          x2,
          y2
        )
      if(!fill) ctx.current.strokeRect(
        ...squareData
      );
      else{
        ctx.current.fillRect(...squareData)
      }
  }

  function drawStructure(data: Structure){
    if (data.type === 'circle') drawCircle(data.initial.x, data.initial.y, data.final.x, data.final.y)
    if (data.type === "square") drawSquare(data.initial.x, data.initial.y, data.final.x, data.final.y);
  }

  function handleMouseMove(
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) {
    e.persist()
    if(!isMouseDown.current) return
    if(!ctx.current) return
    if(!canvasRef.current) return
    const { x, y } = getMousePosition(canvasRef.current, e);
    ctx.current.save()
    ctx.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    plotStructures()
    drawStructure({type: structureType, initial: initialPosition.current, final: {x, y}})
    ctx.current.stroke();
    ctx.current.restore()
  }

  function reset(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (!ctx.current) return;
    if (!canvasRef.current) return;
    setStructures([])
    ctx.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <span
          className={`square structure ${
            structureType === "square" ? "active" : ""
          }`}
          onClick={(e) =>
            setStructureType((structure) =>
              structure === "circle" ? "square" : "circle"
            )
          }
        />
        <span
          className={`circle structure ${
            structureType === "circle" ? "active" : ""
          }`}
          onClick={(e) =>
            setStructureType((structure) =>
              structure === "circle" ? "square" : "circle"
            )
          }
        />
        <button type="button" onClick={tile}>Tile</button>
        <button onClick={reset}>Clear</button>
      </header>
      <main id="main">
        <canvas
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          ref={canvasRefCallback}
          id="canvas"
          className="canvas"
        ></canvas>
      </main>
    </div>
  );
}

export default App;
