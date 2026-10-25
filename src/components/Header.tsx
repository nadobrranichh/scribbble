import ArrowLeftImg from "../assets/arrow-left.svg";
import { Link, useLocation, useNavigate } from "react-router";
import { useRoomIdStore } from "../store/room-id-store";
import { socket } from "../socket/socket";

export default function Header() {
  const { roomId, clearRoomId } = useRoomIdStore();
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <header className="h-20 bg-secondary px-4 lg:px-8 flex items-center justify-between ">
      <p className="text-main text-3xl flex items-center gap-4 lg:gap-8">
        {location.pathname !== "/" && (
          <button
            onClick={() => {
              socket.emit("leave-room", roomId);
              navigate("/");
              clearRoomId();
            }}
          >
            <img className="w-8 h-8 cursor-pointer" src={ArrowLeftImg} />
          </button>
        )}
        <Link to="/">Scribbble</Link>
      </p>
      {roomId && (
        <p className="text-main text-end">
          Room ID: <br /> {roomId}
        </p>
      )}
    </header>
  );
}
