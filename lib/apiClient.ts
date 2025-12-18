const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
};

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

  const data = await response.json();
  return data;
}

export async function getBookings(params?: {
  clientId?: string;
  businessId?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params?.clientId) searchParams.append("clientId", params.clientId);
  if (params?.businessId) searchParams.append("businessId", params.businessId);

  const query = searchParams.toString() ? `?${searchParams.toString()}` : "";

  return await request(`/bookings${query}`);
}

export async function createBooking(data: {
  clientId: string;
  businessId: string;
  startAt: string;
  endAt: string;
  notes?: string;
}) {
  return await request("/bookings", {
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
) {
  return await request(`/bookings/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export async function cancelBooking(id: string) {
  return await request(`/bookings/${id}`, {
    method: "DELETE",
  });
}
