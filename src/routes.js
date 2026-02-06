import express from "express";
import mongoose from "mongoose";
import { ethers } from "ethers";
import { sendToAllSocket } from ".";
const router = express.Router();

router.post("/webhook/new-txn", async (req, res) => {
  sendToAllSocket('{ "msg" : "new_txn" }');
  return res.json({ succes: true });
});

router.get("/api/details", async (req, res) => {
  const c1 = mongoose.connection.db.collection("blocks");
  const blockCount = await c1.countDocuments();
  return res.json({ blockCount });
});

router.get("/api/accounts", async (req, res) => {
  const collection = mongoose.connection.db.collection("wallets");
  const data = await collection
    .find(
      {},
      {
        projection: {
          _id: 0,
          address: "$a",
          type: "wallet",
          balance: "$b",
          name: "MANO Wallet User",
          balanceUSD: "0",
          transactionCount: "$n",
          lastActivity: "-",
          firstSeen: "$ts",
          verified: true,
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

router.get("/api/accounts/:address", async (req, res) => {
  let { address } = req.params;
  address = ethers.getAddress(address);

  const collection = mongoose.connection.db.collection("wallets");
  const data = await collection.findOne(
    { a: address },
    {
      projection: {
        _id: 0,
        address: "$a",
        type: "wallet",
        balance: "$b",
        name: "MANO Wallet User",
        balanceUSD: "0",
        transactionCount: "$n",
        lastActivity: "-",
        firstSeen: "$ts",
        verified: true,
      },
    },
  );

  return res.json(data);
});

router.get("/api/transactions", async (req, res) => {
  const collection = mongoose.connection.db.collection("txns");
  const data = await collection
    .find(
      {},
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
            $cond: {
              if: { $eq: ["$st", "F"] },
              then: "failed",
              else: "success",
            },
          },
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

router.get("/api/accounts-transactions/:address", async (req, res) => {
  let { address } = req.params;
  address = ethers.getAddress(address);
  const collection = mongoose.connection.db.collection("txns");

  const query = { $or: [{ f: address }, { t: address }] };

  const data = await collection
    .find(query, {
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
          $cond: {
            if: { $eq: ["$st", "F"] },
            then: "failed",
            else: "success",
          },
        },
      },
    })
    .skip(0)
    .limit(100)
    .sort({ _id: -1 })
    .toArray();
  const total = await collection.countDocuments(query);
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
    { bn: parseInt(num) },
    {
      projection: {
        _id: 0,
        number: "$bn",
        blockHash: "$bh",
        timestamp: "$ts",
        transactionCount: { $size: "$txs" },
        miner: "$m",
        gasUsed: "$gu",
        gasLimit: "$gu",
        confirmations: { $size: "$txs" },
      },
    },
  );

  return res.json(data);
});

router.get("/api/blocks-transactions/:num", async (req, res) => {
  const { num } = req.params;
  const collection = mongoose.connection.db.collection("txns");

  const query = { bn: parseInt(num) };

  const data = await collection
    .find(query, {
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
          $cond: {
            if: { $eq: ["$st", "F"] },
            then: "failed",
            else: "success",
          },
        },
      },
    })
    .skip(0)
    .limit(100)
    .sort({ _id: -1 })
    .toArray();
  const total = await collection.countDocuments(query);
  return res.json({ data, total });
});

export default router;
