import ArrowLeftImg from "../assets/arrow-left.svg";
import { useLocation, useNavigate } from "react-router";
import { useRoomIdStore } from "../store/room-id-store";

export default function Header() {
  const { roomId, clearRoomId } = useRoomIdStore();
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <header className="h-20 bg-secondary px-8 flex items-center justify-between ">
      <p className="text-main text-3xl flex items-center gap-5">
        {location.pathname !== "/" && (
          <button
            onClick={() => {
              navigate("/");
              clearRoomId();
            }}
          >
            <img className="w-8 cursor-pointer" src={ArrowLeftImg} />
          </button>
        )}
        Scribbble
      </p>
      {roomId && <p className="text-main">Room ID: {roomId}</p>}
    </header>
  );
}
