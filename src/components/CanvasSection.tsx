import { useEffect, useRef, useState } from "react";
import { colorsList, widthsList } from "../lists/canvas";
import { useLocation } from "react-router";
import type { Location } from "react-router";
import type { Point, RoomType, Stroke, User } from "../types/types";
import { socket } from "../socket/socket";
import { useRoomIdStore } from "../store/room-id-store";
import { draw, drawStroke } from "../util/canvas";
import { useNameStore } from "../store/name-store";
import HedgehogAvatar from "../assets/hedgehog.svg";

export default function CanvasSection() {
  const { roomId } = useRoomIdStore();
  const { name } = useNameStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D>(null);
  const isDrawing = useRef<boolean>(false);
  const lastPosition = useRef<Point>({ x: 0, y: 0 });
  const currentStroke = useRef<Stroke>(null);
  const location = useLocation() as Location<RoomType>;
  const room = location.state;
  const [activeUsers, setActiveUsers] = useState<User[]>(
    room?.users ?? [{ name: name }],
  );

  function setCtxColor(color: string) {
    if (!ctxRef.current) return;
    ctxRef.current.strokeStyle = color;
  }

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!ctxRef.current) return;
    isDrawing.current = true;
    const startingPosition = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };
    lastPosition.current = startingPosition;
    currentStroke.current = {
      points: [startingPosition],
      color: ctxRef.current.strokeStyle as string,
      lineWidth: ctxRef.current.lineWidth,
    };
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const ctx = ctxRef.current;
    const curStroke = currentStroke.current;
    if (!isDrawing.current || !ctx || !curStroke) return;
    const newPosition = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    } as Point;

    draw(ctx, lastPosition.current, newPosition);
    curStroke.points.push(newPosition);
    lastPosition.current = newPosition;
  }

  function handleStopDrawing() {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    socket.emit("draw", {
      stroke: { ...currentStroke.current, userId: socket.id || "" },
      roomId,
    });
    currentStroke.current = null;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (room) {
      canvas.width = room.canvasDimensions.x;
      canvas.height = room.canvasDimensions.y;
    } else {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      socket.emit("set-dimensions", {
        roomId,
        dimensions: { x: canvas.width, y: canvas.height },
      });
    }

    ctxRef.current = canvas.getContext("2d");
    const ctx = ctxRef.current;

    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    //reacting to users joining/leaving
    const handleNewGuest = (newUser: User) => {
      setActiveUsers((prev) => {
        if (prev.some((u) => u.socketId === newUser.socketId)) return prev;
        return [...prev, newUser];
      });
    };

    const handleRoomLeft = (leftUser: User) => {
      setActiveUsers((prev) =>
        prev.filter((u) => u.socketId !== leftUser.socketId),
      );
    };

    socket.on("new-room-guest", handleNewGuest);
    socket.on("room-left", handleRoomLeft);

    //reacting to other users' drawings
    socket.on("drawn", (data: { stroke: Stroke }) => {
      const { stroke } = data;
      drawStroke(ctx, stroke);
    });

    socket.on("request-snapshot", () => {
      console.log(
        "SENDING A SNAPSHOT TO BACKEND:",
        canvasRef.current?.toDataURL(),
        roomId,
      );
      socket.emit("snapshot", {
        image: canvasRef.current?.toDataURL(),
        roomId,
      });
    });
  }, []);

  useEffect(() => {
    // for late room joiners: drawing base image and strokes
    const ctx = ctxRef.current;

    if (!room || !ctx) return;
    if (room.baseImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        room.strokes.forEach((s) => drawStroke(ctx, s));
      };
      img.src = room.baseImage;
    } else room.strokes.forEach((s) => drawStroke(ctx, s));
  }, []);

  const dimensions = room
    ? { height: room.canvasDimensions.y, width: room.canvasDimensions.x }
    : { height: "100%", width: "100%" };

  console.log("SETTING DIMENSIONS AS:", dimensions);
  return (
    <section className="w-full h-full bg-black flex items-center justify-center overflow-auto">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleStopDrawing}
        onMouseLeave={handleStopDrawing}
        className="bg-main cursor-crosshair"
        style={dimensions}
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
      <div className="bg-secondary absolute w-65 right-4 top-5 rounded-lg p-3 flex flex-col gap-2">
        <p className="text-main text-lg">Active users:</p>
        {activeUsers.map((u) => (
          <div className="flex items-center justify-start gap-2">
            <img src={HedgehogAvatar} className="w-8" />
            <p className="text-lg text-main leading-none translate-y-0.5">
              {u.name || u.socketId}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
