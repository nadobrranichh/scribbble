import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useIdStore = create<{ id: string }>()(
  persist(
    () => ({
      id: crypto.randomUUID() as string,
    }),
    { name: "id" },
  ),
);
