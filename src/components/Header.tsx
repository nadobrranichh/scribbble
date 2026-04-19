import { useRoomIdStore } from "../store/room-id-store";

export default function Header() {
  const { roomId } = useRoomIdStore();
  return (
    <header className="h-20 bg-secondary px-8 flex items-center justify-between ">
      <p className="text-main text-3xl">Scribbble</p>
      {roomId && <p className="text-main">Room ID: {roomId}</p>}
    </header>
  );
}
