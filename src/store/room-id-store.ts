import { create } from "zustand";

type RoomIdState = {
  roomId: string | null;
  setRoomId: (newRoomId: string) => void;
  clearRoomId: () => void;
};

export const useRoomIdStore = create<RoomIdState>((set) => ({
  roomId: null,
  setRoomId(newRoomId: string) {
    set((state) => ({ ...state, roomId: newRoomId }));
  },
  clearRoomId() {
    set((state) => ({ ...state, roomId: null }));
  },
}));
