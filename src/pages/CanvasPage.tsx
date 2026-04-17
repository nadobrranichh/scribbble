import CanvasSection from "../components/CanvasSection";

export default function CanvasPage() {
  return (
    <main className="flex-1 flex relative">
      {/* toolbar */}
      <section className="toolbar bg-secondary h-full w-20"></section>
      {/* main canvas area */}
      <CanvasSection />
    </main>
  );
}
