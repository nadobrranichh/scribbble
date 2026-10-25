import { fade, hoverScale, tapScale } from "../motion";
import { socket } from "../socket/socket";
import { motion } from "motion/react";

export default function Room({ id, users }: { id: string; users: number }) {
  function handleClick() {
    socket.emit("join-room", id);
  }

  return (
    <motion.div
      whileHover={hoverScale}
      whileTap={tapScale}
      variants={fade()}
      className="w-90 lg:w-140 py-4 border-2 rounded-xl border-secondary text-secondary bg-main text-center cursor-pointer hover:brightness-95"
      onClick={handleClick}
    >
      <p className="text-xl">Room {id}</p>
      <p>{users} users drawing</p>
    </motion.div>
  );
}
