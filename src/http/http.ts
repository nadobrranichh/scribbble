import type { RoomType } from "../types/types";

export async function fetchRoomsById(roomId: string): Promise<RoomType[]> {
  if (!roomId || roomId.length === 0) return [];
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/rooms?id=${roomId}`,
    );

    const data = await response.json();
    return data;
  } catch (error) {
    return [];
  }
}
