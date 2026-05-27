export type User = {
  socketId: string;
  roomId: string | null;
};

export type Point = {
  x: number;
  y: number;
};

export type Stroke = {
  points: Point[];
  color: string;
  lineWidth: number;
  userId?: string;
};

export type RoomType = {
  id: string;
  users: User[];
  baseImage: string | null;
  strokes: Stroke[];
  canvasDimensions: Point;
};
