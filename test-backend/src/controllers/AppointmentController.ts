
import { Request, Response } from "express";
import { broadcastUpdate } from "../routes";
import AppointmentService from "../services/AppointmentService";

  async function getAppointments(req: Request, res: Response) {
    try {
      const appointments = await AppointmentService.getAppointmets();
      res.json(appointments);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async function getAppointmentById(req: Request, res: Response) {
    try {
      const appointments = await AppointmentService.getAppointmentById(req.params.id);
      res.json(appointments);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async function getLockStatus(req: Request, res: Response) {
    try {
      const lock = await AppointmentService.getLockStatus(req.params.id);
      res.json(lock);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async function lockAppointment(req: Request, res: Response) {
    try {
      if (!req.body.userId || !req.body.userInfo) {
        throw new Error("Missing required fields");
      }
      const lock = await AppointmentService.acquireLock(req.params.id, req.body.userId, req.body.userInfo);
      broadcastUpdate(req.params.id, {type: "lock"});
      res.json(lock);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async function unlockAppointment(req: Request, res: Response) {
    try {
      if (!req.body.userId) {
        throw new Error("Missing required fields");
      }
      const lock = await AppointmentService.releaseLock(req.params.id, req.body.userId);
      broadcastUpdate(req.params.id, { type: "unlock"});
      res.json(lock);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async function getTakeoverRequest(req: Request, res: Response) {
    try {
      const request = await AppointmentService.getTakeoverRequest(req.params.id);
      console.log(request, 'ini dia');
      res.json(request);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async function createTakeoverRequest(req: Request, res: Response) {
    try {
      if (!req.body.expiresAt) {
        throw new Error("Missing required fields");
      }
      const request = await AppointmentService.createTakeoverRequest({
        appointmentId: req.params.id,
        userId: req.body.userId,
        requester: req.body.requester,
        expiresAt: req.body.expiresAt,
      });

      broadcastUpdate(req.params.id, { type: "takeover-request" });
      res.json(request);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async function deleteTakeoverRequest(req: Request, res: Response) {
    try {
      const request = await AppointmentService.deleteTakeoverRequest(req.params.id);
      res.json(request);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  export default {
    getAppointments,
    getAppointmentById,
    getLockStatus,
    lockAppointment,
    unlockAppointment,
    getTakeoverRequest,
    createTakeoverRequest,
    deleteTakeoverRequest,
  };