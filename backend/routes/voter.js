import { Router } from "express";
import { db } from "../index.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const collection = db.collection("voter");

    const address = req.query.address;

    if (!address) {
      throw new Error("Address is required");
    }

    const cursor = await collection.find({ address }).toArray();

    res.send({
      success: true,
      data: cursor,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message || err,
    });
  }
});

router.post("/create", async (req, res) => {
  try {
    const collection = db.collection("voter");

    if (!req.body.address) {
      throw new Error("Address is required");
    }

    const query = {
      address: req.body.address,
      voted: [],
    };

    const cursor = await collection.insertOne(query);

    res.send({
      success: true,
      data: cursor,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message || err,
    });
  }
});

router.patch("/voted", async (req, res) => {
  try {
    const collection = db.collection("voter");

    if (!req.body.address) {
      throw new Error("Address is required");
    }

    if (!req.body.slug) {
      throw new Error("Slug is required");
    }

    const filter = {
      address: req.body.address,
    };

    let query = {
      $addToSet: {
        voted: req.body.slug,
      },
    };

    const cursor = await collection.updateOne(filter, query);

    res.send({
      success: true,
      data: cursor,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message || err,
    });
  }
});

export { router as voterRouter };
