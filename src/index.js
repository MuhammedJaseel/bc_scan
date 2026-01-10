import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./database.js";
import cors from "cors";
import routes from "./routes.js";
import { WebSocketServer } from "ws";

dotenv.config();

const app = express();
app.use(express.json());
const connectedClients = new Set();

app.use(cors());

await connectDB();

app.get("", async (req, res) => {
  return res.json({ app: "Scan API's", status: "WORKING", version: "0.0.1" });
});

app.use("/", routes);

const PORT = process.env.PORT;
const server = app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  connectedClients.add(ws);
  ws.on("message", (msg) => {});
  ws.on("close", () => {
    connectedClients.delete(ws);
  });
});
