import { create } from "zustand";

type NameStore = {
  name: string;
  setName: (newName: string) => void;
};

export const useNameStore = create<NameStore>((set) => ({
  name: "",
  setName(newName: string) {
    set((state) => ({ ...state, name: newName }));
  },
}));
