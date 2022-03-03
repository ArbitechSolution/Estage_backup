import {
  Router
} from "express";
import {
  db
} from "../../index.js";

const router = Router();

router.post("/add", async (req, res) => {
  try {
    console.log("called");
    const collection = db.collection("nominations");

    if (!req.body.cycle_id || !req.body.address||req.body.numberOfVotes!=0) {
      throw new Error("address,no of votes and cycle_id is required");
    }

    const query = {
      address: req.body.address,
      cycle_id: req.body.cycle_id,
      links: req.body.links,
      numberOfVotes:req.body.numberOfVotes
    };

    const cursor = await collection.insertOne(query);

    res.status(200).send({
      success: true,
      message: "Nomination Updated"
    });
  } catch (err) {
    res.status(404).send({
      success: false,
      message: err.message || err,
    });
  }
});
router.post("/delete", async (req, res) => {
  try {
    console.log("called");
    const collection = db.collection("nominations");

    if (!req.body.address) {
      throw new Error("address is required");
    }


    const query = {
      address: req.body.address
    };

    const cursor = await collection.deleteOne(query);

    res.send({
      success: true,
      message: "Nomination Deleted",
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message || err,
    });
  }
});

router.get("/getNominationData", async (req, res) => {
  try {
    const collection = db.collection("nominations");

    if (!req.query.cycle_id) {
      throw new Error("cycle_id is required");
    }

    const filter = {
      cycle_id: parseInt(req.query.cycle_id),
    };

    const cursor = await collection.find(filter).toArray();

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
export {
  router as nominationRouterV2
};