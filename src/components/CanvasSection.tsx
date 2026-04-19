import { useEffect, useRef } from "react";
import { colorsList, widthsList } from "../lists/canvas";
import { useLocation } from "react-router";
import type { Location } from "react-router";
import type { Point, RoomType, Stroke } from "../types/types";
import { socket } from "../socket/socket";
import { useRoomIdStore } from "../store/room-id-store";

export default function CanvasSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D>(null);
  const isDrawing = useRef<boolean>(false);
  const lastPosition = useRef<Point>({ x: 0, y: 0 });
  const { roomId } = useRoomIdStore();
  const location = useLocation() as Location<RoomType>;

  function setCtxColor(color: string) {
    if (!ctxRef.current) return;
    ctxRef.current.strokeStyle = color;
    console.log(color, ctxRef.current.strokeStyle);
  }

  function draw(from: Point, to: Point, color?: string, lineWidth?: number) {
    const ctx = ctxRef.current;
    if (!ctx) return;
    if (color) ctx.strokeStyle = color;
    if (lineWidth) ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    isDrawing.current = true;
    lastPosition.current = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const ctx = ctxRef.current;
    if (!isDrawing.current || !ctx) return;
    const newPosition = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    } as Point;

    draw(lastPosition.current, newPosition);
    socket.emit("draw", {
      stroke: {
        points: [lastPosition.current, newPosition],
        color: typeof ctx.strokeStyle === "string" ? ctx.strokeStyle : "#000",
        lineWidth: ctx.lineWidth.toString(),
        userId: socket.id || "",
      } as Stroke,
      roomId,
    });
    lastPosition.current = newPosition;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log("no canvas?");
      return;
    }
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctxRef.current = canvas.getContext("2d");
    const ctx = ctxRef.current;

    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    //reacting to other users' drawings
    socket.on("drawn", (data: { stroke: Stroke }) => {
      const {
        stroke: { points, color, lineWidth },
      } = data;
      draw(points[0], points[1], color, Number.parseInt(lineWidth));
    });
  }, []);

  useEffect(() => {
    const room = location.state;
    if (!room) return;
    room.strokes.forEach(({ points, color, lineWidth }) => {
      draw(points[0], points[1], color, Number.parseInt(lineWidth));
    });
  }, []);

  return (
    <section className="w-full h-full">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => (isDrawing.current = false)}
        onMouseLeave={() => (isDrawing.current = false)}
        className="bg-main h-full w-full cursor-crosshair"
      ></canvas>
      <div className="bg-secondary absolute p-3 rounded-lg top-auto bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <ul className="list-none flex gap-1.5">
          {colorsList.map((color, i) => (
            <li
              key={i}
              className={`${color.bg} w-6 h-6 rounded-full border border-amber-50 cursor-pointer ${ctxRef.current?.strokeStyle === color.hex ? "border-4" : ""}`}
              onClick={() => setCtxColor(color.hex)}
            ></li>
          ))}
          <li className="w-6 h-6 rounded-full border border-amber-50">
            <input
              type="color"
              className="cursor-pointer w-full h-full rounded-full"
              onChange={(e) => setCtxColor(e.target.value)}
            />
          </li>
        </ul>
        <div className="h-4 w-0.5 bg-[rgba(255,255,255,0.3)] rounded-xs" />
        <ul className="flex gap-1.5">
          {widthsList.map((w, i) => (
            <li
              key={i}
              className="w-6 bg-[rgba(255,255,255,0.3)] rounded-full cursor-pointer"
              onClick={() => {
                if (!ctxRef.current) return;
                ctxRef.current.lineWidth = w.value;
              }}
            >
              <p className="text-center text-white">{w.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
