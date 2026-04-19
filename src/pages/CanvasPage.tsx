import { useEffect } from "react";
import CanvasSection from "../components/CanvasSection";
import { useRoomIdStore } from "../store/room-id-store";
import { socket } from "../socket/socket";
import { useNavigate, useSearchParams } from "react-router";

export default function CanvasPage() {
  const { roomId, setRoomId } = useRoomIdStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // if the user didn't have their roomId set
    if (roomId) return;
    const urlRoomId = searchParams.get("id");
    if (!urlRoomId) {
      navigate("/");
      return;
    }
    setRoomId(urlRoomId);
    socket.emit("join-room", { roomId });
  }, []);

  return (
    <main className="flex-1 flex relative">
      {/* toolbar */}
      <section className="toolbar bg-secondary h-full w-20"></section>
      {/* main canvas area */}
      <CanvasSection />
    </main>
  );
}
