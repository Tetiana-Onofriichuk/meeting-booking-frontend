import { create } from "zustand";
import type { Booking } from "@/types/booking";
import {
  getBookings,
  createBooking as apiCreateBooking,
  updateBooking as apiUpdateBooking,
  cancelBooking as apiCancelBooking,
} from "@/lib/apiClient";

type BookingState = {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;

  fetchBookings: (params?: {
    clientId?: string;
    businessId?: string;
  }) => Promise<void>;

  createBooking: (data: {
    clientId: string;
    businessId: string;
    startAt: string;
    endAt: string;
    notes?: string;
  }) => Promise<Booking | null>;

  updateBooking: (
    id: string,
    data: Partial<{
      startAt: string;
      endAt: string;
      notes: string;
      status: string;
    }>
  ) => Promise<Booking | null>;

  cancelBooking: (id: string) => Promise<boolean>;
};

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  isLoading: false,
  error: null,

  fetchBookings: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const bookings = await getBookings(params);
      set({ bookings });
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to fetch bookings";
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  createBooking: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const booking = await apiCreateBooking(data);

      set({ bookings: [booking, ...get().bookings] });

      return booking;
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to create booking";
      set({ error: message });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  updateBooking: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await apiUpdateBooking(id, data);

      set({
        bookings: get().bookings.map((b) => (b._id === id ? updated : b)),
      });

      return updated;
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to update booking";
      set({ error: message });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  cancelBooking: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiCancelBooking(id);

      set({ bookings: get().bookings.filter((b) => b._id !== id) });

      return true;
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to cancel booking";
      set({ error: message });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));
