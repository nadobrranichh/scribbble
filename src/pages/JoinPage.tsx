import Button from "../components/Button";
import SearchIcon from "../assets/search-icon.svg";
import { useEffect, useRef, useState } from "react";
import { fetchRoomsById } from "../http/http";
import type { RoomType } from "../types/types";
import Room from "../components/Room";
import { socket } from "../socket/socket";
import { useRoomIdStore } from "../store/room-id-store";
import { useNavigate } from "react-router";

export default function JoinPage() {
  const navigate = useNavigate();
  const roomIdRef = useRef<HTMLInputElement>(null);
  const [foundRooms, setFoundRooms] = useState<RoomType[]>([]);
  const { setRoomId } = useRoomIdStore();

  async function handleSearch() {
    const rooms = await fetchRoomsById(roomIdRef.current?.value || "");
    setFoundRooms(rooms);
  }

  useEffect(() => {
    socket.on("room-joined", (room: RoomType) => {
      setRoomId(room.id);
      navigate(`/room?id=${room.id}`, { state: room });
    });
  }, [socket]);

  return (
    <main className="flex-1 flex flex-col items-center bg-main gap-3">
      <div className="py-10">
        <p className="text-secondary text-center text-xl">Enter Room ID:</p>
        <input
          ref={roomIdRef}
          name="room-id"
          type="text"
          className="border-2 border-secondary rounded-md text-xl h-10 align-top text-center w-60 text-secondary"
          maxLength={14}
        />
        <Button className="ml-1 p-3" onClick={handleSearch}>
          <img src={SearchIcon} className="w-4" />
        </Button>
      </div>
      {foundRooms &&
        foundRooms.map((r) => (
          <Room key={r.id} id={r.id} users={r.users.length} />
        ))}
    </main>
  );
}
