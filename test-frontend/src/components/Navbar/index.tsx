import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav className="flex items-center w-full p-4 bg-whiteborder-b border-gray-200 border-b">
      <div className="container mx-auto flex space-x-4 font-inter font-semibold items-center justify-between text-sm">
        <div className="hidden md:flex gap-x-4 items-center">
          <h2
            className="hover:text-primary"
          >
            Health App
          </h2>
          <Link
            to="/appointments"
            className="text-indigo-600"
          >
            Appointments
          </Link>
        </div>
      </div>
    </nav>
  )
}