import { useRef, useState, type RefObject } from "react";
import { colorsList, widthsList } from "../lists/canvas";
import EraserImg from "../assets/eraser.svg";

export default function CanvasControls({
  ctxRef,
}: {
  ctxRef: RefObject<CanvasRenderingContext2D | null>;
}) {
  const colorInputRef = useRef<HTMLInputElement | null>(null);
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
    <div className="bg-secondary absolute p-3 rounded-lg top-auto bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
      <ul className="list-none flex gap-1.5">
        {colorsList.map((color) => (
          <li
            key={color.key}
            className={`${color.bg} w-6 h-6 rounded-full border border-amber-50 cursor-pointer ${currentValues.strokeStyle === color.hex ? "border-3" : ""}`}
            onClick={() => setCtxColor(color.hex)}
          ></li>
        ))}
        <li
          className={`w-6 h-6 rounded-full border border-amber-50 ${currentValues.strokeStyle === colorInputRef.current?.value ? "border-3" : ""} `}
        >
          <input
            ref={colorInputRef}
            type="color"
            className="cursor-pointer w-full h-full rounded-full"
            onChange={(e) => setCtxColor(e.target.value)}
            onClick={() =>
              colorInputRef.current && setCtxColor(colorInputRef.current.value)
            }
          />
        </li>
      </ul>
      <ul className="flex gap-1.5">
        <li
          className={`w-6 h-6 rounded-full bg-[rgba(255,255,255,0.3)] border border-amber-50 flex justify-center items-center ${currentValues.strokeStyle === "#ffd9ad" ? "border-3 " : ""}`}
          onClick={() => setCtxColor("#ffd9ad")}
        >
          <img src={EraserImg} className="h-4 w-4" />
        </li>
        {widthsList.map((w) => (
          <li
            key={w.label}
            className={`w-6 h-6 bg-[rgba(255,255,255,0.3)] rounded-full border border-amber-50 cursor-pointer flex justify-center items-center ${currentValues.lineWidth === w.value ? "border-3" : ""}`}
            onClick={() => setCtxWidth(w.value)}
          >
            <p className="text-center m-0 text-white">{w.label}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
