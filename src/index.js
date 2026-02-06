import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./database.js";
import cors from "cors";
import routes from "./routes.js";
import { WebSocketServer } from "ws";
import { configRealUpdate } from "./realUpdate.js";

dotenv.config();

const app = express();
app.use(express.json());
const connectedClients = new Set();

app.use(cors());

await connectDB();

configRealUpdate();

app.get("", async (req, res) => {
  return res.json({ app: "Scan API's", status: "WORKING", version: "0.0.4" });
});

app.use("/", routes);

const PORT = process.env.PORT;
const server = app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  connectedClients.add(ws);
  ws.on("message", (msg) => {});
  ws.on("close", () => {
    connectedClients.delete(ws);
  });
});

export function sendToAllSocket(payload) {
  const msg = typeof payload === "string" ? payload : JSON.stringify(payload);
  for (const ws of connectedClients) {
    if (ws.readyState === 1) {
      // 1 === OPEN
      try {
        ws.send(msg);
        console.log("Succesfully sended to WS msg");
      } catch (err) {
        console.error("Failed to send to a client:", err);
      }
    } else {
      connectedClients.delete(ws);
    }
  }
}
