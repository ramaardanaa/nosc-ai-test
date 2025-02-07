import { Request, Response } from "express";
import UserService from "../services/UserService";

async function getUserById(req: Request, res: Response) {
  try {
    const user = await UserService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function createUser(req: Request, res: Response) {
  try {
    const { name, email, role } = req.body;
    const getUserByEmail = await UserService.getUserByEmail(email);

    if (getUserByEmail) {
      res.json(getUserByEmail);
    }

    const user = await UserService.createUser(name, email, role);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export default {
  getUserById,
  createUser
};