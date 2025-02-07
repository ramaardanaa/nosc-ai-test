export interface Appointment {
  id: number
  doctorName: string
  patientName: string
  appointmentDate: string
  appointmentTime: string
}

export interface CursorPosition {
  x: any;
  y: any;
}

export interface AppointmentLock {
  appointmentId: string;
  userId: string;
  userInfo: { name: string; email: string }; 
  userCursors: Record<string, CursorPosition>;
  timer: ReturnType<typeof setTimeout>;
  expiresAt: number;
}



export interface TakeoverRequest{
  appointmentId: string;
  userId: string;
  requester: User;
  expiresAt: number;
  timer: ReturnType<typeof setTimeout>;
}

export interface User {
  type: "user";
  id: string;
  name: string;
  email: string;
  role: string;
}