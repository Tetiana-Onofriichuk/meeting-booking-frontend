// src/lib/clientApi.ts
import { User } from "@/types/user";
import { nextApi } from "./api";
import { NewNoteData, Note } from "@/types/note";

export interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
}
export type LoginRequest = {
  email: string;
  password: string;
};

export const register = async (data: RegisterRequest): Promise<User> => {
  const res = await nextApi.post<User>("/auth/register", data);
  return res.data;
};

export const login = async (data: LoginRequest): Promise<User> => {
  const res = await nextApi.post<User>("/auth/login", data);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await nextApi.post("/auth/logout");
};

export const getMe = async (): Promise<User> => {
  const { data } = await nextApi.get<User>("/users/me");
  return data;
};

export const updateMe = async ({
  username,
  email,
}: {
  username: string;
  email: string;
}): Promise<User> => {
  const res = await nextApi.patch<User>("/users/me", { username, email });
  return res.data;
};

type CheckSessionResponse = { success: boolean };

export const checkSession = async (): Promise<boolean> => {
  const res = await nextApi.get<CheckSessionResponse>("/auth/session");
  return res.data.success;
};

export const fetchNotes = async (
  search: string,
  page: number,
  tag: string | undefined
): Promise<NotesHttpResponse> => {
  const params = {
    ...(search && { search }),
    tag,
    page,
    perPage: 8,
  };

  const res = await nextApi.get<NotesHttpResponse>("/notes", { params });
  return res.data;
};

export const createNote = async (note: NewNoteData): Promise<Note> => {
  const res = await nextApi.post<Note>("/notes", note);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await nextApi.delete<Note>(`/notes/${id}`);
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await nextApi.get<Note>(`/notes/${id}`);
  return res.data;
};
