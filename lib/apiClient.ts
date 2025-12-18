import type { Booking } from "@/types/booking";
import type { User } from "@/types/user";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
};

type ApiResponse<T> = T | { data: T };

function unwrapData<T>(json: ApiResponse<T>): T {
  if (json && typeof json === "object" && "data" in json) {
    return (json as { data: T }).data;
  }
  return json as T;
}

async function request<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    let message = "Something went wrong";

    switch (response.status) {
      case 400:
        message = "Bad request";
        break;
      case 404:
        message = "Not found";
        break;
      case 409:
        message = "Time slot already booked";
        break;
    }

    throw new Error(message);
  }

  const json = (await response.json()) as ApiResponse<T>;
  return unwrapData(json);
}

export async function getBookings(params?: {
  clientId?: string;
  businessId?: string;
}): Promise<Booking[]> {
  const searchParams = new URLSearchParams();

  if (params?.clientId) searchParams.append("clientId", params.clientId);
  if (params?.businessId) searchParams.append("businessId", params.businessId);

  const query = searchParams.toString() ? `?${searchParams.toString()}` : "";

  return await request<Booking[]>(`/bookings${query}`);
}

export async function createBooking(data: {
  clientId: string;
  businessId: string;
  startAt: string;
  endAt: string;
  notes?: string;
}): Promise<Booking> {
  return await request<Booking>("/bookings", {
    method: "POST",
    body: data,
  });
}

export async function updateBooking(
  id: string,
  data: Partial<{
    startAt: string;
    endAt: string;
    notes: string;
    status: string;
  }>
): Promise<Booking> {
  return await request<Booking>(`/bookings/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export async function cancelBooking(
  id: string
): Promise<{ success: boolean } | void> {
  return await request<{ success: boolean } | void>(`/bookings/${id}`, {
    method: "DELETE",
  });
}

export async function getUsers(params?: {
  role?: "client" | "business";
}): Promise<User[]> {
  const searchParams = new URLSearchParams();
  if (params?.role) searchParams.append("role", params.role);
  const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
  return await request<User[]>(`/users${query}`);
}

export async function createUser(data: {
  name: string;
  email: string;
  role: "client" | "business";
  avatarUrl?: string;
}): Promise<User> {
  return await request<User>("/users", {
    method: "POST",
    body: data,
  });
}

export async function updateUser(
  id: string,
  data: Partial<{
    name: string;
    email: string;
    role: "client" | "business";
    avatarUrl: string;
  }>
): Promise<User> {
  return await request<User>(`/users/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export async function deleteUser(
  id: string
): Promise<{ success: boolean } | void> {
  return await request<{ success: boolean } | void>(`/users/${id}`, {
    method: "DELETE",
  });
}
