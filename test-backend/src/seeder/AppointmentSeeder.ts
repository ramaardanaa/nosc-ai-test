import { AppointmentRepository } from '../models';

export async function seedAppointment() {
  const appointmentRepository = AppointmentRepository();
  const existingAppointments = await appointmentRepository.count();

  if (existingAppointments === 0) {
    const appointments = [
      { patientName: 'John Doe', doctorName: 'Dr. Smith', appointmentDate: '2021-12-01', appointmentTime: '09:00' },
      { patientName: 'Jane Smith', doctorName: 'Dr. Brown', appointmentDate: '2021-12-01', appointmentTime: '10:00' },
      { patientName: 'John Doe', doctorName: 'Dr. Smith', appointmentDate: '2021-12-01', appointmentTime: '09:00' },
    ];
    await appointmentRepository.save(appointments);
    console.log('Dummy appointments seeded!');
  } else {
    console.log('Appointments already exist, skipping seeding.');
  }
}
