import { create } from "zustand";
import type { User } from "@/types/user";
import {
  getUsers,
  createUser as apiCreateUser,
  updateUser as apiUpdateUser,
  deleteUser as apiDeleteUser,
} from "@/lib/apiClient";

type Role = "client" | "business";

type UserState = {
  users: User[];
  activeUser: User | null;
  isLoading: boolean;
  error: string | null;

  setActiveUser: (user: User | null) => void;
  logout: () => void;

  fetchUsers: (params?: { role?: Role }) => Promise<void>;
  createUser: (data: {
    name: string;
    email: string;
    role: Role;
    avatarUrl?: string;
  }) => Promise<User | null>;
  updateUser: (
    id: string,
    data: Partial<{
      name: string;
      email: string;
      role: Role;
      avatarUrl: string;
    }>
  ) => Promise<User | null>;
  deleteUser: (id: string) => Promise<boolean>;
};

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  activeUser: null,
  isLoading: false,
  error: null,

  setActiveUser: (user) => set({ activeUser: user, error: null }),
  logout: () => set({ activeUser: null, error: null }),

  fetchUsers: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const users = await getUsers(params);
      set({ users });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to fetch users";
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  createUser: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const created = await apiCreateUser(data);
      set({ users: [created, ...get().users], activeUser: created });
      return created;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to create user";
      set({ error: message });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  updateUser: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await apiUpdateUser(id, data);
      set({ users: get().users.map((u) => (u._id === id ? updated : u)) });

      if (get().activeUser?._id === id) {
        set({ activeUser: updated });
      }

      return updated;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to update user";
      set({ error: message });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiDeleteUser(id);

      const nextUsers = get().users.filter((u) => u._id !== id);
      const wasActive = get().activeUser?._id === id;

      const nextState: Partial<UserState> = { users: nextUsers };
      if (wasActive) nextState.activeUser = null;

      set(nextState as any);
      return true;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to delete user";
      set({ error: message });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));
