import { AppointmentRepository } from "../models";
import { AppRedis } from "../config/redis";
import { TakeoverRequest } from "../utils/type";

const LOCK_PREFIX = "lock:appointment:";
const TAKEOVER_REQUEST_PREFIX = "takeover:request:";
const redis = AppRedis


async function getAppointmets(limit: number = 10, cursor?: string) {
  const query = cursor ? { where: { id: cursor } } : {};
  const appointments = await AppointmentRepository().find({
    ...query,
    take: limit + 1,
    order: { id: "ASC" }
  });

  const hasNextPage = appointments.length > limit;
  const data = hasNextPage ? appointments.slice(0, -1) : appointments;
  const nextCursor = hasNextPage ? appointments[appointments.length - 1].id : null;

  return {
    data,
    pageInfo: {
      hasNextPage,
      nextCursor
    }
  };
}

async function getAppointmentById(id: string) {
  return AppointmentRepository().findOne({ where: { id } });
}

async function getLockStatus(appointmentId: string) {
  const lock = await redis.get(LOCK_PREFIX + appointmentId);
  return lock ? JSON.parse(lock) : false;
}

async function acquireLock(appointmentId: string, userId: string, userInfo: { name: string; email: string }) {
  const lockKey = LOCK_PREFIX + appointmentId;
  const lockData = { appointmentId, userId, userInfo, expiresAt: Date.now() + 5 * 60 * 1000 };

  const success = await redis.set(lockKey, JSON.stringify(lockData), 'PX', 5 * 60 * 1000, 'NX');
  if (!success) throw new Error("Appointment already locked");

  return lockData;
}

async function releaseLock(appointmentId: string, userId: string) {
  const lockKey = LOCK_PREFIX + appointmentId;
  const lock = await redis.get(lockKey);

  if (!lock) throw new Error("No active lock");
  const lockData = JSON.parse(lock);
  if (lockData.userId !== userId) throw new Error("Not authorized");

  await redis.del(lockKey);
  return { appointmentId, locked: false };
}

async function createTakeoverRequest(takeoverRequest: TakeoverRequest) {
  const key = TAKEOVER_REQUEST_PREFIX + takeoverRequest.appointmentId;

  const remainingTime = takeoverRequest.expiresAt - Date.now();

  await redis.set(key, JSON.stringify(takeoverRequest), 'PX', remainingTime, 'NX');
  return takeoverRequest;
}

async function getTakeoverRequest(appointmentId: string) {
  const key = TAKEOVER_REQUEST_PREFIX + appointmentId;
  const request = await redis.get(key);
  return request ? JSON.parse(request) : null;
}

async function deleteTakeoverRequest(appointmentId: string) {
  const key = TAKEOVER_REQUEST_PREFIX + appointmentId;
  await redis.del(key);
}


export default { getAppointmets, getAppointmentById, getLockStatus, acquireLock, releaseLock, createTakeoverRequest, getTakeoverRequest, deleteTakeoverRequest };