export interface AppointmentLock {
  appointmentId: string;
  userId: string;
  userInfo: { name: string; email: string };
  expiresAt: Date;
}

export interface CursorPosition {
  x: number;
  y: number;
}

export interface TakeoverRequest {
  appointmentId: string;
  userId: string;
  requester: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  }
  expiresAt: number;
}