import { useQuery } from "react-query"
import { fetchAppointments } from "../../api"
import { Link, Links } from "react-router"
import { Appointment } from "../../utils/type"


export default function AppointmentPage() {
  const { data, isLoading, isError } = useQuery("appointments", async () => {
    const res = await fetchAppointments()
    return res
  })

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error Fetching Users</div>

  return (
    <div>
      <h1>Appointments</h1>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data.data.map((appointment: Appointment) => (
                    <tr key={appointment.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {appointment.doctorName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{appointment.patientName}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{appointment.appointmentDate}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{appointment.appointmentTime}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link to={`/appointments/${appointment.id}`} className="text-indigo-600 hover:text-indigo-900">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}