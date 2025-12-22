import express from "express";
import mongoose from "mongoose";
const router = express.Router();

router.get("/api/accounts", async (req, res) => {
  const collection = mongoose.connection.db.collection("wallets");
  const data = await collection
    .find({}, { projection: { _id: 0, a: 1, b: 1, n: 1 } })
    .skip(0)
    .limit(100)
    .sort({ _id: -1 })
    .toArray();
  const total = await collection.countDocuments();
  return res.json({ data, total });
});

router.get("/api/transactions", async (req, res) => {
  const collection = mongoose.connection.db.collection("txns");
  const data = await collection
    .find({}, { projection: { _id: 0, th: 1, v: 1, f: 1, t: 1, gu: 1, ca: 1 } })
    .skip(0)
    .limit(100)
    .sort({ _id: -1 })
    .toArray();
  const total = await collection.countDocuments();
  return res.json({ data, total });
});

router.get("/api/blocks", async (req, res) => {
  const collection = mongoose.connection.db.collection("blocks");
  const data = await collection
    .find(
      {},
      {
        projection: {
          _id: 0,
          bh: 1,
          ph: 1,
          bn: 1,
          ph: 1,
          tsx: 1,
          ts: 1,
          ca: 1,
        },
      }
    )
    .skip(0)
    .limit(100)
    .sort({ _id: -1 })
    .toArray();
  const total = await collection.countDocuments();
  return res.json({ data, total });
});

app.post("/pocker-api/create-room", (req, res) => {
  return res.json({ msg: "this is a sample response" });
});

export default router;
