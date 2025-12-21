import { create } from "zustand";
import type { Booking } from "@/types/booking";
import {
  getBookings,
  createBooking as apiCreateBooking,
  updateBooking as apiUpdateBooking,
  cancelBooking as apiCancelBooking,
  deleteBooking as apiDeleteBooking,
} from "@/lib/apiClient";

type BookingFetchParams = {
  clientId?: string;
  businessId?: string;
};

type CreateBookingDto = {
  clientId: string;
  businessId: string;
  startAt: string;
  endAt: string;
  notes?: string;
};

type UpdateBookingDto = Partial<{
  startAt: string;
  endAt: string;
  notes: string;
}>;

type BookingState = {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;

  fetchBookings: (params?: BookingFetchParams) => Promise<void>;

  createBooking: (data: CreateBookingDto) => Promise<Booking | null>;

  updateBooking: (
    id: string,
    data: UpdateBookingDto
  ) => Promise<Booking | null>;

  cancelBooking: (id: string) => Promise<boolean>;

  deleteBooking: (id: string) => Promise<boolean>;

  clear: () => void;
};

function sortByStartAtAsc(items: Booking[]): Booking[] {
  return [...items].sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
  );
}

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

      set((state) => ({
        bookings: sortByStartAtAsc([...state.bookings, booking]),
      }));

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

      set((state) => ({
        bookings: sortByStartAtAsc(
          state.bookings.map((b) => (b._id === id ? updated : b))
        ),
      }));

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
      const canceled = await apiCancelBooking(id);

      set((state) => ({
        bookings: state.bookings.map((b) => (b._id === id ? canceled : b)),
      }));

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

  deleteBooking: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiDeleteBooking(id);

      set((state) => ({
        bookings: state.bookings.filter((b) => b._id !== id),
      }));

      return true;
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to delete booking";
      set({ error: message });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  clear: () => {
    set({ bookings: [], isLoading: false, error: null });
  },
}));
