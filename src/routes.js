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

router.get("/api/accounts/:address", async (req, res) => {
  const { address } = req.params;

  const c1 = mongoose.connection.db.collection("wallets");
  const account = await c1.findOne(
    { a: address },
    { projection: { _id: 0, a: 1, b: 1, n: 1 } },
  );

  const c2 = mongoose.connection.db.collection("txns");
  const txns = await c2
    .find(
      { $or: [{ f: address }, { t: address }] },
      {
        projection: {
          _id: 0,
          address: "$a",
          type: "wallet",
          balance: "$b",
          name: "MANO Wallet User",
          balanceUSD: 0,
          transactionCount: "$n",
          lastActivity: "-",
          firstSeen: "$ts",
          verified: true,
        },
      },
    )
    .toArray();

  return res.json({ account, txns });
});

router.get("/api/transactions", async (req, res) => {
  const collection = mongoose.connection.db.collection("txns");
  const data = await collection
    .find(
      {},
      {
        projection: {
          _id: 0,
          th: 1,
          v: 1,
          f: 1,
          t: 1,
          gu: 1,
          bn: 1,
          ts: 1,
          m: 1,
        },
      },
    )
    .skip(0)
    .limit(100)
    .sort({ _id: -1 })
    .toArray();
  const total = await collection.countDocuments();
  return res.json({ data, total });
});

router.get("/api/transactions/:hash", async (req, res) => {
  const { hash } = req.params;
  const collection = mongoose.connection.db.collection("txns");
  const data = await collection.findOne(
    { th: hash },
    {
      projection: {
        _id: 0,
        hash: "$th",
        blockNumber: "$bn",
        timestamp: "$ts",
        from: "$f",
        to: "$t",
        value: "$v",
        gasFee: "$gu",
        status: {
          $cond: { if: { $eq: ["$st", "F"] }, then: "failed", else: "success" },
        },
      },
    },
  );

  return res.json(data);
});

router.get("/api/blocks", async (req, res) => {
  const collection = mongoose.connection.db.collection("blocks");
  const data = await collection
    .find(
      {},
      {
        projection: {
          _id: 0,
          number: "$bn",
          timestamp: "$ts",
          transactionCount: { $size: "$txs" },
          miner: "$m",
          gasUsed: "$gu",
          gasLimit: "$gu",
          confirmations: { $size: "$txs" },
        },
      },
    )
    .skip(0)
    .limit(100)
    .sort({ _id: -1 })
    .toArray();
  const total = await collection.countDocuments();
  return res.json({ data, total });
});

router.get("/api/blocks/:num", async (req, res) => {
  const { num } = req.params;
  const collection = mongoose.connection.db.collection("blocks");
  const data = await collection.findOne(
    { num: parseInt(num) },
    {
      projection: {
        _id: 0,
        bh: 1,
        ph: 1,
        bn: 1,
        txs: 1,
        ts: 1,
        m: 1,
        gu: 1,
      },
    },
  );

  return res.json(data);
});

export default router;
