import { create } from 'zustand';
import { AppointmentLock, CursorPosition, TakeoverRequest } from '../utils/type';

export interface User {
  type: "user";
  id: string;
  name: string;
  email: string;
  role: string;
  cursorPosition: CursorPosition;
}

interface Store {
  currentUser: User | null;
  users: User[];
  locks: Record<string, AppointmentLock>;
  takeoverRequest: Record<string, TakeoverRequest>;
  setTakeoverRequest: (request: TakeoverRequest) => void;
  removeTakeoverRequest: (appointmentId: string) => void;
  addUsers: (users: User[]) => void;
  setUser: (user: User) => void;
  setLock: (lock: AppointmentLock) => void;
  removeLock: (appointmentId: string) => void;
  updateCursor: (appointmentId: string, userId: string, cursor: CursorPosition) => void;
}

export const useAppointmentStore = create<Store>((set) => ({
  locks: {},
  currentUser: null,
  users: [],
  takeoverRequest: {},
  setTakeoverRequest: (request) => set((state) => ({ takeoverRequest: { ...state.takeoverRequest, [request.appointmentId]: request } })),
  removeTakeoverRequest: (appointmentId) => set((state) => {
    const { [appointmentId]: _, ...remaining } = state.takeoverRequest;
    return { takeoverRequest: remaining };
  }),
  addUsers: (users: User[]) => set((state) => ({ users: [...state.users, ...users] })),
  setUser: (user: User) => set({ currentUser: user }),
  setLock: (lock) => {
    const timer = setTimeout(() => {
      useAppointmentStore.getState().removeLock(lock.appointmentId);
    }, lock.expiresAt - Date.now());

    set((state) => ({
      locks: {
        ...state.locks,
        [lock.appointmentId]: { ...lock, timer }
      }
    }))
  },

  removeLock: (appointmentId) => set((state) => {
    const timer = useAppointmentStore.getState().locks[appointmentId]?.timer;
    if (timer) clearTimeout(timer);

    const { [appointmentId]: _takeover, ...takeOverRemaining } = state.takeoverRequest;
    const { [appointmentId]: _lock, ...remaining } = state.locks;
    return { locks: remaining, takeoverRequest: takeOverRemaining };
  }),

  updateCursor: (appointmentId, userId, cursor) => set((state) => ({
    locks: {
      ...state.locks,
      [appointmentId]: {
        ...state.locks[appointmentId],
        userCursors: {
          ...state.locks[appointmentId]?.userCursors,
          [userId]: cursor,
        },
      },
    },
  })),
}));