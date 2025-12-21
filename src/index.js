import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./database.js";
import cors from "cors";
import routes from "./routes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());

connectDB();

app.get("", async (req, res) => {
  return res.json({ app: "Scan API's", status: "WORKING", version: "1.0.2" });
});

app.use("/api", routes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
