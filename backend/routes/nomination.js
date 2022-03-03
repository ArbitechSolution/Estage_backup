import { Router } from "express";
import fetch from "node-fetch";
import { db } from "../index.js";
import { basePath } from "../index.js";

const router = Router();

router.post("/add", async (req, res) => {
  try {
    const collection = db.collection("contest");

    const slug = req.body.slug;

    if (!slug) {
      throw new Error("Slug is required");
    }

    if (!req.body.name || !req.body.address) {
      throw new Error("Name and address is required");
    }

    const filter = { slug };

    const query = {
      $addToSet: {
        nominations: {
          name: req.body.name,
          address: req.body.address,
          votes: 0,
          medium_url: req.body.medium_url,
          twitter_url: req.body.twitter_url,
          instagram_url: req.body.instagram_url,
          youtube_url: req.body.youtube_url,
          website_url: req.body.website_url,
          tiktok_url: req.body.tiktok_url,
          opensea_url: req.body.opensea_url,
        },
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

router.patch("/vote", async (req, res) => {
  try {
    const collection = db.collection("contest");

    const slug = req.body.slug;

    if (!slug) {
      throw new Error("Slug is required");
    }

    if (!req.body.address) {
      throw new Error("Address is required");
    }

    if (!req.body.voterAddress) {
      throw new Error("Voter address is required");
    }

    const filter = { slug, "nominations.address": req.body.address };

    const query = {
      $inc: {
        "nominations.$.votes": 1,
      },
    };

    const protocol = req.protocol;
    const host = req.get("host");

    const response = await fetch(
      `${protocol}://${host}${basePath}/voter?address=${req.body.voterAddress}`
    );
    const { data } = await response.json();

    if (data[0].voted.includes(slug)) {
      throw new Error("You have already voted for this nominee");
    } else {
      const cursor = await collection.updateOne(filter, query);

      const response = await fetch(
        `${protocol}://${host}${basePath}/voter/voted`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: req.body.voterAddress,
            slug,
          }),
        }
      );

      res.send({
        success: true,
        data: cursor,
      });
    }
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

    const slug = req.body.slug;

    if (!slug) {
      throw new Error("Slug is required");
    }

    if (!req.body.address) {
      throw new Error("Address is required");
    }

    const filter = { slug };

    const query = {
      $pull: {
        nominations: {
          address: req.body.address,
        },
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

export { router as nominationRouter };
