import express, { application } from "express";
import { connectToDatabase } from "./services/database.service"
import { clientsRouter } from "./routes/clients.router";

connectToDatabase()
    .then(() => {
        application.use("/clients", clientsRouter);

        application.listen(9090, () => {
            console.log(`Server started at http://localhost:${9090}`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });