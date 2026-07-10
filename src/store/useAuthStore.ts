import { create } from "zustand";

type UserStore = {
  user: any;
  setUser: (user: any) => void;
  clearUser: () => void;
  getUser: () => any;
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  setUser: (user: any) => set({ user }),
  clearUser: () => set({ user: null }),
  getUser: () => get().user,
}));
