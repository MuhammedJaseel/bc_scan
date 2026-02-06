import WebSocket from "ws";
import { sendToAllSocket } from "./index.js";

// const ws = new WebSocket("ws://localhost:4501");
// const ws = new WebSocket(process.env.WS);

try {
  // ws.onopen = () => {
  //   console.log("Connected to WebSocket server");
  //   ws.send("Hello from browser!");
  // };

  // ws.onmessage = (event) => {
  //   sendToAllSocket('{ "msg" : "new_txn" }');
  //   console.log("Message from server:", event.data);
  // };

  // ws.onclose = () => {
  //   console.log("Disconnected from server");
  // };
} catch (error) {
  console.log("Web sicket error");
}

export const configRealUpdate = () => {};
