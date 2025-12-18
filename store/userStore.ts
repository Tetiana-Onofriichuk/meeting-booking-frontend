import { create } from "zustand";
import type { User } from "@/types/user";

type UserState = {
  users: User[];
  activeUser: User | null;
  isLoading: boolean;
  error: string | null;

  setActiveUser: (user: User | null) => void;

  // поки без API (додамо, коли підключимо юзер-ендпоїнти)
  setUsers: (users: User[]) => void;
};

export const useUserStore = create<UserState>((set) => ({
  users: [],
  activeUser: null,
  isLoading: false,
  error: null,

  setActiveUser: (user) => set({ activeUser: user }),
  setUsers: (users) => set({ users }),
}));
