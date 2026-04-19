import { useNavigate } from "react-router";
import Button from "../components/Button";
import { socket } from "../socket/socket";
import { useEffect } from "react";
import { useRoomIdStore } from "../store/room-id-store";

export default function LandingPage() {
  const navigate = useNavigate();
  const { setRoomId } = useRoomIdStore();

  useEffect(() => {
    socket.on("room-created", (newRoomId) => {
      setRoomId(newRoomId);
      navigate(`/room?id=${newRoomId}`);
    });
  }, [socket]);

  function handleCreateRoom() {
    socket.emit("create-room");
  }
  return (
    <main className="flex-1 bg-main text-secondary flex flex-col items-center justify-center gap-3">
      <h2 className="text-5xl font-bold">Scribbble</h2>
      <Button className="min-w-40 px-4 py-2" onClick={() => navigate("/join")}>
        Join a room
      </Button>

      <Button className="min-w-40 px-4 py-2" onClick={handleCreateRoom}>
        Create a room
      </Button>
    </main>
  );
}
