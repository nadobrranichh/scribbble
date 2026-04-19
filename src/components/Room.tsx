import { socket } from "../socket/socket";

export default function Room({ id, users }: { id: string; users: number }) {
  function handleClick() {
    socket.emit("join-room", id);
  }

  return (
    <div
      className="w-2/5 border-2 rounded-xl border-secondary text-secondary bg-main text-center pb-8 cursor-pointer hover:brightness-95"
      onClick={handleClick}
    >
      <p className="text-xl">Room {id}</p>
      <p>{users} users drawing</p>
    </div>
  );
}
