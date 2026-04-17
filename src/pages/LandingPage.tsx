import Button from "../components/Button";

export default function LandingPage() {
  return (
    <main className="flex-1 bg-main text-secondary flex flex-col items-center justify-center gap-3">
      <h2 className="text-5xl font-bold">Scribbble</h2>
      <Button className="px-4 py-2">Join a room</Button>

      <Button className="px-4 py-2">Create a room</Button>
    </main>
  );
}
