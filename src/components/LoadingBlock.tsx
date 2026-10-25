import SpinnerIcon from "../assets/spinner.svg";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { fade } from "../motion";

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
    <motion.div
      variants={fade()}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="text-center flex flex-col justify-center gap-1.5 bg-main p-5 rounded-lg border-2 border-secondary"
    >
      <img
        src={SpinnerIcon}
        alt=""
        className="animate-spin [animation-duration:3s] h-8"
      />
      <p className="text-secondary">
        {label}
        {ellipsis}
      </p>
    </motion.div>
  );
}
