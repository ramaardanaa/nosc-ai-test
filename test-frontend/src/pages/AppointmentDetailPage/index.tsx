import { useEffect, useState } from "react";
import { acquireLock, createTakeoverRequest, deleteTakeoverRequest, fetchAppointmentById, getLockStatus, getTakeoverRequest, releaseLock } from "../../api";
import { useParams } from "react-router";
import { useQuery } from "react-query";
import Alert from "../../components/Alert";
import { useWebSocket } from "../../utils/hooks/useWebsocket";
import { useAppointmentStore } from "../../stores";
import { AppointmentLock, TakeoverRequest } from "../../utils/type";
import { FollowerPointerCard } from "../../components/FollowingPointer";
import Modal from "../../components/Modal";


export default function AppointmentDetail() {
  const { currentUser, takeoverRequest, locks, setLock, removeTakeoverRequest, removeLock } = useAppointmentStore();
  const { id } = useParams();
  const [lockError, setLockError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const { data, error, isLoading } = useQuery(["appointment", id], () => fetchAppointmentById(id!), { staleTime: 1000 * 60 * 5, refetchOnMount: false });
  const ws = useWebSocket(`http://localhost:5001/api/appointments/${id}/updates`);

  if (ws.current) {
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "lock") {
        getLockStatus(id!);
      }

      if (data.type === "unlock") {
        removeLock(id!);
      }

      if (data.type === "takeover-request") {
        console.log("takeover-request", data);
        getTakeoverRequest(id!);
      }
    }
  }

  const handleEdit = async () => {
    try {
      const response = await acquireLock(id!, currentUser!.id, currentUser!.name, currentUser!.email);
      const lockData: AppointmentLock = await response.json();
      setLock(lockData);
    } catch (err) {
      setLockError("Failed to acquire lock");
    }
  }

  const handleRequestControl = async () => {
    createTakeoverRequest(id!, currentLock!.userId, currentUser!, currentLock!.expiresAt);
  }

  const handleCancel = async () => {
    const result = await releaseLock(id!, currentUser!.id);
    if (result.ok) {
      removeLock(id!);
    }
  }

  const handleDeclineTakeover = async () => {
    const result = await deleteTakeoverRequest(id!);
    if (result.ok) {
      setOpenModal(false);
      removeTakeoverRequest(id!);
    }
  }

  console.log(takeoverRequest[id!]);


  const handleApproveTakeover = async (takeoverRequest: TakeoverRequest) => {
    await handleCancel();
    await deleteTakeoverRequest(id!);
    const response = await acquireLock(id!, takeoverRequest.requester.id, takeoverRequest.requester.name, takeoverRequest.requester.email);

    const lockData: AppointmentLock = await response.json();
    setLock(lockData);
  }

  const currentLock = locks[id!];

  useEffect(() => {
    const checkLockStatus = async () => {
      await getLockStatus(id!);
      await getTakeoverRequest(id!);
    };
    checkLockStatus();
  }, [id]);

  useEffect(() => {
    if (takeoverRequest[id!] && takeoverRequest[id!].userId === currentUser?.id) {
      setOpenModal(true);
    }
  }
    , [takeoverRequest[id!]]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error Fetching Appointment</div>;

  return (
    <FollowerPointerCard className="h-[100vw]" title={
      <div className="bg-indigo-500 text-white p-2 rounded-md">
        <span className="ml-2">{currentUser?.email}</span>
        <span className="ml-2">Editing</span>
      </div>
    }>
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <h2>Detail Appointments</h2>
          <div className="flex gap-4">
            {currentLock && currentLock.userId === currentUser?.id ? <button onClick={handleCancel} className="bg-indigo-500 hover:bg-indigo-700 text-white py-2 px-4 rounded cursor-pointer">
              Cancel Edit
            </button> : <button onClick={handleEdit} disabled={!!currentLock} className="bg-indigo-500 hover:bg-indigo-700 text-white py-2 px-4 rounded cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed">
              Edit Appointment
            </button>}
            {currentLock && currentLock.userId !== currentUser?.id && currentUser?.role === "admin" &&
              <button onClick={handleRequestControl} className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded cursor-pointer">
                Request Control
              </button>}
          </div>
        </div>
        {currentLock &&
          <>
            <Alert title="Locked for Editing" description={`locked by ${currentLock.userInfo.email}`} expiresAt={currentLock.expiresAt} />
          </>}
        <form className="flex flex-col justify-between my-4 border border-gray-200 bg-gray-100 rounded-md p-4 gap-4">
          <div>
            <h3>Doctor Name</h3>
            {currentLock && currentLock.userId === currentUser?.id ? <input className="shadow bg-white appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="doctorName" type="text" name="doctorName" defaultValue={data.doctorName} /> :<p>{data.doctorName}</p>}
          </div>
          <div>
            <h3>Patient Name</h3>
            <p>{currentLock && currentLock.userId === currentUser?.id ? <input className="shadow bg-white appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="patientName" type="text" name="patientName" defaultValue={data.patientName} />: data.patientName}</p>
          </div>
          <div>
            <h3>Date</h3>
            <p>{currentLock && currentLock.userId === currentUser?.id ? <input className="shadow bg-white appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="appointmentDate" type="text" name="appointmentDate" defaultValue={data.appointmentDate} /> : data.appointmentDate}</p>
          </div>
          <div>
            <h3>Time</h3>
            <p>{currentLock && currentLock.userId === currentUser?.id ?  <input className="shadow bg-white appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="appointmentDate" type="text" name="appointmentDate" defaultValue={data.appointmentDate} /> : data.appointmentTime}</p>
          </div>
        </form>
      </div>
      {takeoverRequest[id!] && <Modal open={openModal} onOk={() => handleApproveTakeover(takeoverRequest[id!])} onCancel={handleDeclineTakeover} requester={takeoverRequest[id!].requester} setOpen={setOpenModal} />}
    </FollowerPointerCard>
  )
}