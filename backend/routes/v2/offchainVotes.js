import {
    Router
  } from "express";
  import {
    db
  } from "../../index.js";
  const router = Router();
  router.post("/voteOffchain", async (req, res) => {
    try {
     let {voteFrom,voteTo,cycle_id,hash,appoloBalance}=req.body;
      const collection = db.collection("offchainVotes");
      const nominationCollection = db.collection("nominations");
      let data = await nominationCollection.find({address:voteTo,cycle_id:parseInt(cycle_id)}).toArray();  
      let isVoted = await collection.find({address:voteFrom,cycle_id:parseInt(cycle_id)}).toArray();  
      if (!cycle_id) {
        throw new Error("cycle_id is required");
      }
      if( !voteFrom){
        throw new Error("votefrom is required");   
      }
      if( !voteTo){
        throw new Error("voteTo is required");   
      }
      if( !hash){
        throw new Error("hash is required");   
      }
      if( !appoloBalance){
        throw new Error("appoloBalance is required");   
      }
      if(isVoted.length){
        throw new Error("User has alreay voted"); 
      }
      if(!data.length){
        throw new Error("No nomination Found against this address");   
      }
      const query = {
        address: voteFrom,
        nomination:voteTo,
        cycle_id: parseInt(cycle_id),
        hash:hash,
        appoloBalance:parseInt(appoloBalance)
      };
      
      const cursor = await collection.insertOne(query);
      console.log("data",data[0]?.numberOfVotes);
      const updatedConfirmation = await nominationCollection.updateOne({address:voteTo,cycle_id:parseInt(cycle_id)}, {
        $set: {
          numberOfVotes: 1 + data[0]?.numberOfVotes
        }
      }, {
        upsert: true
      });
      res.status(200).send({
        success: true,
        message:"Vote has been casted on ipfs"
      });
    } catch (err) {
      res.status(200).send({
        success: false,
        message: err.message || err,
      });
    }
  });
  router.get("/getAllOffchainVotes", async (req, res) => {
    try {
      const{cycle_id}=req.query;
      const collection = db.collection("offchainVotes");
      if (!cycle_id) {
        throw new Error("cycle_id is required");
      }
  
      const filter = {
        cycle_id:parseInt(cycle_id) ,
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
  router.get("/getWinner", async (req, res) => {
    try {
      let {cycle_id}=req.query;
      cycle_id=parseInt(cycle_id);
      console.log("cycle_id",typeof cycle_id);
      const collection = db.collection("nominations");
       let winner= await collection.find({cycle_id}).sort({numberOfVotes:-1}).limit(1).toArray()
       console.log("winner",winner);
      if (!cycle_id) {
        throw new Error("cycle_id is required");
      }
  
      const filter = {
        cycle_id: cycle_id,
      };
   
      const cursor = await collection.find(filter).toArray();
      res.send({
        success: true,
        data: winner,
      });
    } catch (err) {
      res.send({
        success: false,
        message: err.message || err,
      });
    }
  });
  export {
    router as offchainVotes
  };