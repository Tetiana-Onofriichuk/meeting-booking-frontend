// src/lib/server.ts
import { cookies } from "next/headers";
import { backend } from "./api";
import { Note } from "@/types/note";
import { User } from "@/types/user";

type CheckSessionResponse = { success: boolean };

const cookieHeader = () => {
  const jar = cookies();
  const str = jar.toString();
  return str ? { Cookie: str } : {};
};

export const checkServerSession = async (): Promise<boolean> => {
  try {
    const res = await backend.get<CheckSessionResponse>("/auth/session", {
      headers: cookieHeader(),
    });
    return res.status === 200 && res.data?.success === true;
  } catch {
    return false;
  }
};

export const getServerMe = async (): Promise<User> => {
  const res = await backend.get<User>("/users/me", {
    headers: cookieHeader(),
  });
  if (res.status !== 200) {
    throw new Error("Unauthorized");
  }
  return res.data;
};

interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  search: string,
  page: number,
  tag: string | undefined
): Promise<NotesHttpResponse> => {
  const params = {
    ...(search && { search }),
    tag,
    page,
    perPage: 12,
  };

  const res = await backend.get<NotesHttpResponse>("/notes", {
    params,
    headers: cookieHeader(),
  });

  if (res.status !== 200) {
    throw new Error("Failed to load notes");
  }
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await backend.get<Note>(`/notes/${id}`, {
    headers: cookieHeader(),
  });
  if (res.status !== 200) {
    throw new Error("Note not found");
  }
  return res.data;
};
