import {
    Router
  } from "express";
  import {
    db
  } from "../../index.js";
  const router = Router();
  router.post("/voteOnChain", async (req, res) => {
    try {
     let {voteFrom,voteTo,cycle_id,transactionHash,appoloBalance}=req.body;
      const collection = db.collection("onchainVotes");
      const nominationCollection = db.collection("nominations");
      let data = await nominationCollection.find({address:voteTo,cycle_id:parseInt(cycle_id)}).toArray();  
      if (!cycle_id) {
        throw new Error("cycle_id is required");
      }
      if( !voteFrom){
        throw new Error("votefrom is required");   
      }
      if( !voteTo){
        throw new Error("voteTo is required");   
      }
      if( !transactionHash){
        throw new Error("transactionHash is required");   
      }
      if( !appoloBalance){
        throw new Error("appoloBalance is required");   
      }
      if(!data.length){
        throw new Error("No nomination Found against this address");   
      }
      const query = {
        address: voteFrom,
        nomination:voteTo,
        cycle_id:parseInt(cycle_id) ,
        transactionHash:transactionHash,
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
        message: "Vote has been casted",
      });
    } catch (err) {
      res.status(200).send({
        success: false,
        message: err.message || err,
      });
    }
  });
  router.get("/getAllOnChainVotes", async (req, res) => {
    try {
      const{cycle_id}=req.query;
      const collection = db.collection("onchainVotes");
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
  export {
    router as onchainVotes
  };