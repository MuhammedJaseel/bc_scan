import express from "express";
import mongoose from "mongoose";
const router = express.Router();

router.get("/wallets", async (req, res) => {
  const collection = mongoose.connection.db.collection("wallets");
  const data = await collection
    .find({}, { projection: { _id: 0, a: 1, b: 1, n: 1 } })
    .skip(0)
    .limit(100)
    .toArray();
  const total = await collection.countDocuments();
  return res.json({ data, total });
});

router.get("/transactions", async (req, res) => {
  const collection = mongoose.connection.db.collection("txns");
  const data = await collection
    .find({}, { projection: { _id: 0, a: 1, b: 1, n: 1 } })
    .skip(0)
    .limit(100)
    .toArray();
  const total = await collection.countDocuments();
  return res.json({ data, total });
});

router.get("/blocks", async (req, res) => {
  const collection = mongoose.connection.db.collection("blocks");
  const data = await collection
    .find({}, { projection: { _id: 0, a: 1, b: 1, n: 1 } })
    .skip(0)
    .limit(100)
    .toArray();
  const total = await collection.countDocuments();
  return res.json({ data, total });
});

export default router;
