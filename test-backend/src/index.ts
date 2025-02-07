import { AppDataSource } from "./config/data-source"
import router from "./routes";
import express from "express";
import { seedAppointment } from "./seeder/AppointmentSeeder";

AppDataSource.initialize().then(async () => {
  const app = express();
  require('express-ws')(app);
  
  app.use(express.json());
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });
  app.use("/api", router);

  app.listen(5001, () => console.log("Server running on port 5000"));
  seedAppointment();

}).catch(error => console.log(error))
