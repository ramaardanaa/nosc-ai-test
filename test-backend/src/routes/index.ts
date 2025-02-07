import express from "express";
import AppointmentController from "../controllers/AppointmentController";
import UserController from "../controllers/UserController";
import { WebSocket } from "ws";

const app = express();
require('express-ws')(app);

const router = express.Router();

const routeClientMap = new Map() as Map<string, Set<WebSocket>>;

function getClientsForRoute(routePath: string) {
  if (!routeClientMap.has(routePath)) {
    routeClientMap.set(routePath, new Set());
  }
  return routeClientMap.get(routePath);
}

export function broadcastUpdate(routePath: string, data: any) {
  const clients = getClientsForRoute(routePath);
  const payload = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

router.get("/users/:id", UserController.getUserById);
router.post("/users", UserController.createUser);

router.get("/appointments", AppointmentController.getAppointments);
router.get("/appointments/:id", AppointmentController.getAppointmentById);

router.get("/appointments/:id/lock-status", AppointmentController.getLockStatus);
router.post("/appointments/:id/acquire-lock", AppointmentController.lockAppointment);
router.delete("/appointments/:id/release-lock", AppointmentController.unlockAppointment);

router.get("/appointments/:id/takeover-request", AppointmentController.getTakeoverRequest);
router.post("/appointments/:id/takeover-request", AppointmentController.createTakeoverRequest);
router.delete("/appointments/:id/takeover-request", AppointmentController.deleteTakeoverRequest);

router.ws("/appointments/:id/updates", (ws, req) => {
  const route = req.params.id;
  const clients = getClientsForRoute(route);
  clients.add(ws);

  ws.on("close", () => {
    clients.delete(ws);
  });
});

export default router;