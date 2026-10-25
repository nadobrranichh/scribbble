import { stagger, type Variants } from "motion";

export function fade({ withStagger = false, yStart = 30 } = {}): Variants {
  return {
    hidden: {
      opacity: 0,
      y: yStart,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        ...(withStagger && { delayChildren: stagger(0.1) }),
      },
    },
    exit: {
      opacity: 0,
      y: -yStart,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };
}

export const hoverScale = { scale: 1.05 };
export const tapScale = { scale: 0.95 };
