import { useAppointmentStore } from "../stores";
import { User } from "../utils/type";

const API_URL = "http://localhost:5001/api";

export async function fetchAppointments() {
  return fetch(`${API_URL}/appointments`).then((res) => res.json());
}

export async function fetchAppointmentById(id: string) {
  return fetch(`${API_URL}/appointments/${id}`).then((res) => res.json());
}

export async function acquireLock(id: string, userId: string, name: string, email: string) {
  return fetch(`${API_URL}/appointments/${id}/acquire-lock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      userInfo: { name, email },
    }),
  });
}

export async function releaseLock(id: string, userId: string) {
  return fetch(`${API_URL}/appointments/${id}/release-lock`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });
}

export async function getLockStatus(id: string) {
  const lockStatus = await fetch(`${API_URL}/appointments/${id}/lock-status`);
  const result = lockStatus.ok ? await lockStatus.json() : null;
  if (result) {
    useAppointmentStore.getState().setLock(result);
  }
}

export async function getTakeoverRequest(id: string) {
  const request = await fetch(`${API_URL}/appointments/${id}/takeover-request`);
  const result = request.ok ? await request.json() : null;

  if (result) {
    useAppointmentStore.getState().setTakeoverRequest(result);
  }
}

export async function createTakeoverRequest(id: string, userId:string, requester: User, expiresAt: number) {
  return fetch(`${API_URL}/appointments/${id}/takeover-request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, expiresAt, requester, appointmentId: id }),
  });
}

export async function deleteTakeoverRequest(id: string) {
  return fetch(`${API_URL}/appointments/${id}/takeover-request`, {
    method: "DELETE",
  });
}