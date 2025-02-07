import AppDataSource from "../config/data-source";
import { Appointment } from "./Appointment";
import { User } from "./User";

export function AppointmentRepository() {
  return AppDataSource.getRepository(Appointment);
}

export function UserRepository() {
  return AppDataSource.getRepository(User);
}
