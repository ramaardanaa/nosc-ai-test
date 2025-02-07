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

  @BeforeInsert()
  static addDummyData() {
    console.log('process.env.NODE_ENV', process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
      const dummyAppointments = [
        { patientName: 'John Doe', doctorName: 'Dr. Smith', appointmentDate: '2021-12-01', appointmentTime: '09:00' },
        { patientName: 'Jane Smith', doctorName: 'Dr. Brown', appointmentDate: '2021-12-01', appointmentTime: '10:00' }
      ];
      dummyAppointments.forEach(appointment => {
        const appointmentEntity = new Appointment();
        appointmentEntity.patientName = appointment.patientName;
        appointmentEntity.doctorName = appointment.doctorName;
        appointmentEntity.appointmentDate = appointment.appointmentDate;
        appointmentEntity.appointmentTime = appointment.appointmentTime;
        const appointmentRepository = AppointmentRepository();
        appointmentRepository.save(appointmentEntity);
      });
    }
  }
}
