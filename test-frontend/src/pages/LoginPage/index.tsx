import { useStore } from "zustand";
import { useAppointmentStore } from "../../stores";
import { useNavigate } from "react-router";

export default function LoginPage() {

  const { setUser } = useAppointmentStore()
  const navigate = useNavigate()

  const createUser = async () => {
    const nameElement = document.getElementById('name') as HTMLInputElement | null;
    const emailElement = document.getElementById('email') as HTMLInputElement | null;
    const roleElement = document.getElementById('role') as HTMLSelectElement | null;

    const name = nameElement ? nameElement.value : '';
    const email = emailElement ? emailElement.value : '';
    const role = roleElement ? roleElement.value : '';
    const response = await fetch('http://localhost:5001/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, role }),
    })

    const data = await response.json()
    localStorage.setItem('user', JSON.stringify(data))
    
    if (response.ok) {
      alert('User created')
      setUser(data)

      navigate('/appointments')
    } else {
      alert('Error creating user')
    }

    
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold m-2" htmlFor="name">
              Name
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Name" />
            <label className="block text-gray-700 text-sm font-bold m-2" htmlFor="email">
              Email
            </label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="text" placeholder="Email" />
            <label className="block text-gray-700 text-sm font-bold m-2" htmlFor="role">
              Role
            </label>
            <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="role">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button onClick={createUser} className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}