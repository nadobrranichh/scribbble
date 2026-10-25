import { type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { fade, hoverScale, tapScale } from "../motion";

export default function Button({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> &
  HTMLMotionProps<"button"> & {
    children: ReactNode;
  }) {
  return (
    <motion.button
      whileHover={hoverScale}
      whileTap={tapScale}
      variants={fade()}
      className={`rounded-md bg-secondary text-main text-xl cursor-pointer hover:brightness-85 transition duration-300 ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
