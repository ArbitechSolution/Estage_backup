import { Router } from "express";
import { db } from "../index.js";
import { ObjectId } from "mongodb";
import { v4 as uuid } from "uuid";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const collection = db.collection("contest");

    const slug = req.query.slug;

    if (!slug) {
      throw new Error("Slug is required");
    }

    const cursor = await collection.find({ slug }).toArray();

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

router.get("/all", async (req, res) => {
  try {
    const collection = db.collection("contest");

    const cursor = await collection.find({}).toArray();

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
    const collection = db.collection("contest");

    if (!req.body.name || !req.body.endTime?.month) {
      throw new Error("Name is required");
    }

    const autoSlug = `${req.body.name
      .replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
        ""
      )
      .replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, "")
      .replace(/\s/g, "-")
      .replace(/---|--/g, "-")
      .toLowerCase()}-${uuid()}`;

    const query = {
      name: req.body.name,
      slug: autoSlug,
      endTime: `${req.body.endTime?.month} ${req.body.endTime?.day}, ${req.body.endTime?.year} ${req.body.endTime?.hour}:${req.body.endTime?.minute}:00 GMT${req.body.endTime?.timezone}`,
      nominations: [],
      isActive: true,
      createdAt: new Date(),
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

router.patch("/edit", async (req, res) => {
  try {
    const collection = db.collection("contest");

    if (!req.body.id) {
      throw new Error("ID is required");
    }

    const filter = {
      _id: ObjectId(req.body.id),
    };

    let query;

    if (req.body.endTime?.month) {
      query = {
        $set: {
          name: req.body.name,
          endTime: `${req.body.endTime?.month} ${req.body.endTime?.day}, ${req.body.endTime?.year} ${req.body.endTime?.hour}:${req.body.endTime?.minute}:00 GMT${req.body.endTime?.timezone}`,
          isActive: req.body.isActive,
        },
      };
    } else {
      query = {
        $set: {
          name: req.body.name,
          isActive: req.body.isActive,
        },
      };
    }

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

router.delete("/delete", async (req, res) => {
  try {
    const collection = db.collection("contest");

    if (!req.body.id) {
      throw new Error("ID is required");
    }

    const filter = {
      _id: ObjectId(req.body.id),
    };

    const cursor = await collection.deleteOne(filter);

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

export { router as contestRouter };
