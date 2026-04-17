import SpinnerIcon from "../assets/spinner.svg";
import { useEffect, useState } from "react";

export default function LoadingBlock({ label = "Loading" }: { label: string }) {
  const [ellipsis, setEllipsis] = useState<string>(".");

  useEffect(() => {
    const interval = setInterval(
      () => setEllipsis((prev) => (prev.length === 3 ? "" : prev + ".")),
      500,
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center flex flex-col justify-center gap-1.5">
      <img
        src={SpinnerIcon}
        alt=""
        className="animate-spin [animation-duration:3s] h-8"
      />
      <p className="text-secondary">
        {label}
        {ellipsis}
      </p>
    </div>
  );
}
