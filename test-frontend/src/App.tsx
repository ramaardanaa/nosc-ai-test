import AppointmentDetail from './pages/AppointmentDetailPage'
import AppointmentPage from './pages/AppointmentPage'
import { Outlet, Route, Routes } from 'react-router'
import { Navigate } from 'react-router'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import { useAppointmentStore } from './stores'

const ProtectedRoute = ({ currentUser }: { currentUser: any }) => {
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  const { currentUser, setUser } = useAppointmentStore();

  const user = localStorage.getItem('user');

  if (!currentUser && user) {
    setUser(JSON.parse(user));
  }

  return (
    <div className='container mx-auto p-4'>
      <Routes>
        <Route element={<ProtectedRoute currentUser={currentUser} />}>
          <Route element={<Navbar />} />
          <Route path="/appointments/:id" element={<AppointmentDetail />} />
          <Route path="/appointments" element={<AppointmentPage />} />
          <Route path="/" element={<Navigate to="/appointments" />} />
        </Route>
        <Route path="/login" element={!currentUser ? <LoginPage /> : <Navigate to="/appointments" />} />
      </Routes>
    </div>
  )
}

export default App
