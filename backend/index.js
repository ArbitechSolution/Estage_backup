import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import { MongoClient } from "mongodb";
//Routes
// import { contestRouter } from "./routes/contest.js";
// import { nominationRouter } from "./routes/nomination.js";
// import { voterRouter } from "./routes/voter.js";
import { nominationRouterV2 } from "./routes/v2/nominations.js";
import { offchainVotes } from "./routes/v2/offchainVotes.js";
import {onchainVotes} from './routes/v2/onchainVotes.js';


const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  keepAlive: true,
  ignoreUndefined: true,
});
const databaseName = "defi_dao_v2";

const port = process.env.PORT || 4000;
export const basePath = "/api/v2";

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));

app.get("/", (req, res) => {
  res.send("OK ✅");
});

// app.use(`${basePath}/contest`, contestRouter);
// app.use(`${basePath}/nomination`, nominationRouter);
// app.use(`${basePath}/voter`, voterRouter);
app.use(`${basePath}/nominations`, nominationRouterV2);
app.use(`${basePath}/votes`, offchainVotes);
app.use(`${basePath}/votes`, onchainVotes);
await client.connect();

const db = client.db(databaseName);

console.log(`Connected to MongoDB 🍀 Database: ${databaseName}`);

app.listen(port, () => {
  console.log(`Server running on port ${port} 🏃`);
});

export { db };
