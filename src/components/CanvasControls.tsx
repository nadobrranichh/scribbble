import { useState, type RefObject } from "react";
import { colorsList, widthsList } from "../lists/canvas";

export default function CanvasControls({
  ctxRef,
}: {
  ctxRef: RefObject<CanvasRenderingContext2D | null>;
}) {
  const [currentValues, setCurrentValues] = useState({
    strokeStyle: colorsList[0].hex,
    lineWidth: widthsList[0].value,
  });

  function setCtxColor(color: string) {
    if (!ctxRef.current) return;
    ctxRef.current.strokeStyle = color;
    setCurrentValues((prev) => ({ ...prev, strokeStyle: color }));
  }

  function setCtxWidth(width: number) {
    if (!ctxRef.current) return;
    ctxRef.current.lineWidth = width;
    setCurrentValues((prev) => ({ ...prev, lineWidth: width }));
  }

  return (
    <div className="bg-secondary absolute p-3 rounded-lg top-auto bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-3">
      <ul className="list-none flex gap-1.5">
        {colorsList.map((color) => (
          <li
            key={color.key}
            className={`${color.bg} w-6 h-6 rounded-full border border-amber-50 cursor-pointer ${currentValues.strokeStyle === color.hex ? "border-3" : ""}`}
            onClick={() => setCtxColor(color.hex)}
          ></li>
        ))}
        <li className="w-6 h-6 rounded-full border border-amber-50">
          <input
            type="color"
            className="cursor-pointer w-full h-full rounded-full"
            onChange={(e) => setCtxColor(e.target.value)}
          />
        </li>
      </ul>
      <div className="h-4 w-0.5 bg-[rgba(255,255,255,0.3)] rounded-xs" />
      <ul className="flex gap-1.5">
        {widthsList.map((w) => (
          <li
            key={w.label}
            className={`w-6 h-6 bg-[rgba(255,255,255,0.3)] rounded-full border border-amber-50 cursor-pointer flex justify-center items-center ${currentValues.lineWidth === w.value ? "border-3" : ""}`}
            onClick={() => setCtxWidth(w.value)}
          >
            <p className="text-center m-0 text-white">{w.label}</p>
            {/* {w.label} */}
          </li>
        ))}
      </ul>
    </div>
  );
}
