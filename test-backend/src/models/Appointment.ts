import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, BeforeInsert } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { AppointmentRepository } from ".";

@Entity("appointments")
export class Appointment {
  @PrimaryGeneratedColumn("uuid")
  id: string = uuidv4();

  @Column({ type: "varchar", name: "patient_name" })
  patientName: string;

  @Column({ type: "varchar", name: "doctor_name" })
  doctorName: string;

  @Column({ type: "date", name: "appointment_date" })
  appointmentDate: string;

  @Column({ type: "time", name: "appointment_time" })
  appointmentTime: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
