import styled from "styled-components";
import Timer from "../components/Home/Timer";
import Accordion from "../components/Accordion";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useState,useEffect, useRef } from "react";
import Web3 from "web3";
import { toast } from 'react-toastify';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {getCycleId} from '../redux/actions/actions'
import MyTimer from './MyTimer'
import {contractAddress,contractAbi,tokenAddress,tokenAbi} from '../components/Constants/Constant';
const webSupply = new Web3("https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");

export default function Home() {
  let [minutes,setMinutes]=useState(0);
  let [hours,setHours]=useState(0);
  let [days, setDays]=useState(0);
  let [second, setSecond]=useState(0)
  let [cycleStamp, setCycleStamp]=useState(0)
  let refSec = useRef()
  let [showCompletion,setShowCompletion]=useState(false);
  let navigate = useNavigate();
  let currentTime = Math.floor(new Date().getTime() / 1000.0);
  
   let {acc} =useSelector(state => state.connectWallet)
  let dispatch = useDispatch()
  const myTimer=async()=>{
    // const web3 =window.web3;
    let contractOf = new webSupply.eth.Contract(contractAbi, contractAddress);
    let contractTime= await contractOf.methods.currentVotingCycleEnd().call();
    contractTime =parseInt(contractTime);
    let finalTime = contractTime-currentTime;

    if(finalTime<=0){
      setShowCompletion(true);
    }
    else{
      let myDays = finalTime/86400
      myDays=parseInt(myDays);
      let myHours =finalTime -(myDays*86400);
      myHours=myHours/3600;
      myHours=parseInt(myHours);
      let myMins =finalTime -(myDays*86400) -(myHours*3600);
      myMins =myMins/60;
      myMins=parseInt(myMins);
      let mySecond= finalTime - (myDays * 86400) - (myHours * 3600) -(myMins * 60)
      mySecond = parseInt(mySecond);
      setDays(myDays);
      setMinutes(myMins);
      setHours(myHours);

      setShowCompletion(false)
    }
  }

  const startCycle = async () => {
    try{
      if(acc === "Connect Wallet"){
        toast.error(`${acc}`)
      }else{
      if(acc == "No Wallet" || acc == "Connect to Rinkebey"){
        toast.error("No Wallet Connected or onnect to Rinkebey")
      }else{
        const web3 = window.web3;
        const contractOf = new web3.eth.Contract(contractAbi, contractAddress); 
        let ownerAddress = await contractOf.methods.owner().call();
        if(ownerAddress === acc){
          let cycle_id = await contractOf.methods.currentVotingCycleEnd().call()
          let currentTime = Math.floor(new Date().getTime() / 1000.0);
          let contractTime = cycle_id;
          contractTime =parseInt(contractTime);
    let finalTime = contractTime-currentTime;
    if(finalTime < 0){
      let winerDetail = await axios.get(`https://defi-voting3.herokuapp.com/api/v2/votes/getWinner?cycle_id=${cycle_id}`);
      if(winerDetail.data.data.length){
        let numberOfVotes = winerDetail.data.data[0].numberOfVotes;
            let winnerAddress = winerDetail.data.data[0].address;
            await contractOf.methods.completeCycle(winnerAddress,numberOfVotes).send(
              {from:acc               
              })
              dispatch(getCycleId())
              
      }else{
            let numberOfVotes = 1;
            let winnerAddress = ownerAddress;
            await contractOf.methods.completeCycle(winnerAddress,numberOfVotes).send(
              {from:acc               
              })             
            }
            dispatch(getCycleId())
      }else{
            toast.error("Time is remaning")
            }
    
        }else{
          toast.error("Only owner can complete this cycle");
        }
      }
    }
    }catch(e){
      console.error("error while start cycle", e);
    }
  }


  useEffect(()=>{
    dispatch(getCycleId())
  },[])
  return (
    <StyledHome>
      <div className="header">
        {/* <span ref={refSec}>hh</span> */}
        <h1>Contest</h1>
        <p>Current Contest Ends In</p>

        {/* {showCompletion?
        <p> Cycle Time Completed</p>:
        <p>{days} &nbsp;&nbsp; Days&nbsp;&nbsp;{hours}&nbsp;&nbsp; Hours&nbsp;&nbsp;{minutes}&nbsp;&nbsp; Minutes &nbsp;&nbsp;</p>  
      } */}
        {
<MyTimer/>
        }
        <br/>
        <br/>

        
        <button className="btn btn-light text-primary " onClick={() => navigate("/contest/3")}><b>Vote Now</b></button>
        <div>

        <button className="btn btn-light text-primary" 
        onClick={startCycle}
        ><b>Complete Cycle</b></button>
        </div>
      </div>
      <div className="prev">
        <h4>Previous contests:</h4>
        <div className="grid">
          <Accordion title={`Contest #2`} alt>
            <p>No Data Available</p>
          </Accordion>
          <Accordion title={`Contest #1`} alt>
            <p>No Data Available</p>
          </Accordion>
        </div>
      </div>
    </StyledHome>
  );
}

const StyledHome = styled.main`
  max-width: 768px;
  margin: 0 auto;
  padding: 2rem;
  .header {
    text-align: center;
    h1 {
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }
    p {
      font-size: 1rem;
      color: #adadad;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    button {
      margin-top: 1rem;
    }
  }
  .prev {
    margin-top: 2rem;
    h4 {
      font-size: 0.9rem;
      font-weight: 400;
      color: #adadad;
    }
    .grid {
      margin-top: 0.5rem;
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }
  }
`;
