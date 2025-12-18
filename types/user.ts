export type UserRole = "client" | "business";

export type User = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};
