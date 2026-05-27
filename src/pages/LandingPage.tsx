import { useNavigate } from "react-router";
import Button from "../components/Button";
import { socket } from "../socket/socket";
import { useEffect, useState } from "react";
import { useRoomIdStore } from "../store/room-id-store";
import { useNameStore } from "../store/name-store";

const NAME_MAX_LENGTH = 20;

export default function LandingPage() {
  const navigate = useNavigate();
  const { setRoomId } = useRoomIdStore();
  const { name, setName } = useNameStore();
  const [isNameError, setIsNameError] = useState<boolean>(false);

  const [enteredName, setEnteredName] = useState<string>("");

  useEffect(() => {
    socket.on("room-created", (newRoomId) => {
      setRoomId(newRoomId);
      navigate(`/room?id=${newRoomId}`);
    });
  }, [socket]);

  useEffect(() => {
    setEnteredName(name);
  }, [name]);

  function checkNameAndExecute(action: () => void) {
    if (!enteredName.trim()) {
      setIsNameError(true);
      return;
    }

    socket.emit("set-name", enteredName);
    setName(enteredName);
    action();
  }
  return (
    <main className="flex-1 bg-main text-secondary flex flex-col items-center justify-center gap-4">
      <h2 className="text-5xl font-bold">Scribbble</h2>
      <div>
        {isNameError ? (
          <p className="text-xl text-error text-center">
            Please enter your name first:
          </p>
        ) : (
          <p className="text-2xl text-center">Enter your name:</p>
        )}
        <input
          value={enteredName}
          onChange={(e) => setEnteredName(e.target.value)}
          className="border-2 border-secondary rounded-md text-xl h-10 align-top text-center w-70 text-secondary"
          maxLength={NAME_MAX_LENGTH}
        />
      </div>
      <div>
        <Button
          className="min-w-40 px-4 py-2 block  my-2"
          onClick={() => checkNameAndExecute(() => navigate("join"))}
        >
          Join a room
        </Button>

        <Button
          className="min-w-40 px-4 py-2 block my-2"
          onClick={() => checkNameAndExecute(() => socket.emit("create-room"))}
        >
          Create a room
        </Button>
      </div>
    </main>
  );
}
