import express, { Request, Response } from "express";
import { collections } from "../services/database.service";
import Data from "../models/clients";


export const clientsRouter = express.Router();

clientsRouter.use(express.json());

//POST

clientsRouter.post("/", async (req: Request, res: Response) => {
    try {
        const newGame = req.body as Data;
        const result = await collections.clients.insertOne(newGame);

        result
            ? res.status(201).send(`Successfully created a new clients with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new clients.");
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});