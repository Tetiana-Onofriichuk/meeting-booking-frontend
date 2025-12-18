import type { User } from "./user";

export type BookingStatus = "active" | "canceled";

export type Booking = {
  _id: string;
  clientId: User;
  businessId: User;
  startAt: string;
  endAt: string;
  notes?: string;
  status: BookingStatus;
  createdAt?: string;
  updatedAt?: string;
};
