import type { Point, Stroke } from "../types/types";

export function draw(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  color?: string,
  lineWidth?: number,
) {
  if (color) ctx.strokeStyle = color;
  if (lineWidth) ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
}

export function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke) {
  const { points, color, lineWidth } = stroke;
  points.forEach((_, i) => {
    if (points[i + 1])
      i === 0
        ? draw(ctx, points[i], points[i + 1], color, lineWidth)
        : draw(ctx, points[i], points[i + 1]);
  });
}
