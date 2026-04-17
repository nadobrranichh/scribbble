import Button from "../components/Button";
import SearchIcon from "../assets/search-icon.svg";

export default function JoinPage() {
  return (
    <main className="flex-1 flex flex-col items-center bg-main gap-3">
      <div className="py-10">
        <p className="text-secondary text-center text-xl">Enter Room ID:</p>
        <input
          name="room-id"
          type="text"
          className="border-2 border-secondary rounded-md text-xl h-10 align-top text-center w-60 text-secondary"
          maxLength={14}
        />
        <Button className="ml-1 p-3">
          <img src={SearchIcon} className="w-4" />
        </Button>
      </div>
    </main>
  );
}
