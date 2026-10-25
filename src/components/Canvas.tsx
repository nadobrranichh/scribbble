import React, { useEffect, useRef } from "react";
import { useLocation, type Location } from "react-router";
import type { Point, RoomType, Stroke } from "../types/types";
import { useRoomIdStore } from "../store/room-id-store";
import { draw, drawStroke } from "../util/canvas";
import { socket } from "../socket/socket";
import CanvasControls from "./CanvasControls";

export default function Canvas() {
  const { roomId } = useRoomIdStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D>(null);
  const isDrawing = useRef<boolean>(false);
  const lastPosition = useRef<Point>({ x: 0, y: 0 });
  const currentStroke = useRef<Stroke>(null);
  const location = useLocation() as Location<RoomType>;
  const room = location.state;
  const dimensions = room
    ? { height: room.canvasDimensions.y, width: room.canvasDimensions.x }
    : { height: "100%", width: "100%" };

  function handleStartDrawing(e: React.MouseEvent<HTMLCanvasElement>) {
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

  function handleDraw(e: React.MouseEvent<HTMLCanvasElement>) {
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

    //   reacting to other users' drawings
    socket.on("drawn", (data: { stroke: Stroke }) => {
      const { stroke } = data;
      drawStroke(ctx, stroke);
    });

    socket.on("request-snapshot", () => {
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

  return (
    <>
      <canvas
        ref={canvasRef}
        onMouseDown={handleStartDrawing}
        onMouseMove={handleDraw}
        onMouseUp={handleStopDrawing}
        onMouseLeave={handleStopDrawing}
        onPointerDown={handleStartDrawing}
        onPointerMove={handleDraw}
        onPointerUp={handleStopDrawing}
        onPointerCancel={handleStopDrawing}
        className="bg-main cursor-crosshair touch-none"
        style={dimensions}
      />
      <CanvasControls ctxRef={ctxRef} />
    </>
  );
}
