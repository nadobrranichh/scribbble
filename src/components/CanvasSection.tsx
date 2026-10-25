import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import type { Location } from "react-router";
import type { RoomType, User } from "../types/types";
import { socket } from "../socket/socket";
import { useNameStore } from "../store/name-store";
import HedgehogAvatar from "../assets/hedgehog.svg";
import ArrowYImg from "../assets/arrow-y.svg";
import Canvas from "./Canvas";

export default function CanvasSection() {
  const { name } = useNameStore();
  const location = useLocation() as Location<RoomType>;
  const room = location.state;
  const [activeUsers, setActiveUsers] = useState<User[]>(
    room?.users ?? [{ name: name }],
  );
  const [isUsersPanelOpen, setIsUsersPanelOpen] = useState<boolean>(true);

  useEffect(() => {
    //reacting to users joining/leaving
    const handleNewGuest = (newUser: User) => {
      setActiveUsers((prev) => {
        if (prev.some((u) => u.socketId === newUser.socketId)) return prev;
        return [...prev, newUser];
      });
    };

    const handleRoomLeft = (leftUser: User) => {
      setActiveUsers((prev) =>
        prev.filter((u) => u.socketId !== leftUser.socketId),
      );
    };

    socket.on("new-room-guest", handleNewGuest);
    socket.on("room-left", handleRoomLeft);
  }, []);

  return (
    <section className="w-full h-full bg-black flex items-center justify-center overflow-auto">
      <Canvas />
      <div
        className="bg-secondary absolute right-2 top-2 rounded-lg p-3 flex flex-col gap-2 min-w-44"
        style={{
          transition: "all 0.3s ease",
          width: isUsersPanelOpen ? "auto" : "11rem",
        }}
      >
        <div className="flex justify-between items-center">
          <p className="text-main text-lg">Active users:</p>
          <img
            src={ArrowYImg}
            className="w-6 h-6 border border-main rounded-xl cursor-pointer"
            onClick={() => setIsUsersPanelOpen((prev) => !prev)}
            style={{
              transition: "all 0.3s ease",
              rotate: isUsersPanelOpen ? "0deg" : "180deg",
            }}
          />
        </div>
        {isUsersPanelOpen &&
          activeUsers.map((u) => (
            <div className="flex items-center justify-start gap-2">
              <img src={HedgehogAvatar} className="w-8" />
              <p className="text-lg text-main leading-none translate-y-0.5">
                {u.name || u.socketId}
              </p>
            </div>
          ))}
      </div>
    </section>
  );
}
