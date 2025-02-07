import "reflect-metadata"
import { DataSource } from "typeorm"
import { Appointment } from "../models/Appointment"
import { User } from "../models/User"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "postgres",
    synchronize: true,
    logging: false,
    entities: [Appointment, User],
    migrations: [],
    subscribers: [],
})

export default AppDataSource