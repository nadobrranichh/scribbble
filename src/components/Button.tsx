import { type ReactNode } from "react";

export default function Button({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
}) {
  return (
    <button
      className={`rounded-md bg-secondary text-main text-xl cursor-pointer hover:brightness-85 transition duration-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
