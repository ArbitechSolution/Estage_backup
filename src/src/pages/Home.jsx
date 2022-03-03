import styled from "styled-components";
import Timer from "../components/Home/Timer";
import Accordion from "../components/Accordion";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Web3 from "web3";
import { toast } from 'react-toastify';
import axios from 'axios';
import Modal from '../components/Modal'
import { useDispatch, useSelector } from 'react-redux';
import { getCycleId } from '../redux/actions/actions'
import MyTimer from './MyTimer'
import Spinner from '../components/spinner/Spinner';

import { contractAddress, contractAbi, tokenAddress, tokenAbi } from '../components/Constants/Constant';
const webSupply = new Web3("https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");

export default function Home() {
  let [isLoading, setIsLoading] = useState(false);
  let [contestSummry, setContestSummry] = useState(false)
  let [winnerLength, setWinnerLength] =useState(0);
  let [winnerData, setWinnrData]=useState({
    addrss:"",
    name:"",
    votes:"",
    ipfsHash:"",
  })
  let navigate = useNavigate();
  let currentTime = Math.floor(new Date().getTime() / 1000.0);

  let { acc } = useSelector(state => state.connectWallet)
  let dispatch = useDispatch()


  const startCycle = async () => {
    try {
      setIsLoading(true);
          const web3 = window.web3;
          const contractOf = new web3.eth.Contract(contractAbi, contractAddress);
          await contractOf.methods.completeCycle(winnerData.address, winnerData.votes).send(
            {
              from: acc
            })
          dispatch(getCycleId());
          setIsLoading(false);
      setContestSummry(false);
    } catch (e) {
      console.error("error while start cycle", e);
    }
  }
  // setIsLoading(true);
  // setContestSummry(true)
  const openContestSummry = async () => {
    try {
      if (acc === "Connect Wallet") {
        toast.error(`${acc}`)
      } else {
        if (acc == "No Wallet" || acc == "Connect to Rinkebey") {
          toast.error("No Wallet Connected or onnect to Rinkebey")
        } else {
          setIsLoading(true);
          const web3 = window.web3;
          const contractOf = new web3.eth.Contract(contractAbi, contractAddress);
          let ownerAddress = await contractOf.methods.owner().call();
          if (ownerAddress != acc) {
            toast.error("Only owner can complete this cycle");
            setIsLoading(false);
          }
          let cycle_time = await contractOf.methods.currentVotingCycleEnd().call()
          let currentTime = Math.floor(new Date().getTime() / 1000.0);
          let contractTime = cycle_time;
          contractTime = parseInt(contractTime);
          let finalTime = contractTime - currentTime;
          if (finalTime > 0) {
            toast.error("Time is remaning");
            setIsLoading(false);
          }else{
            console.log("cycle_id", cycle_time)
            let winerDetail = await axios.get(`https://defi-voting3.herokuapp.com/api/v2/votes/getWinner?cycle_id=${cycle_time}`);
                // if(winerDetail.data)
                if(winerDetail.data.data.length){
              console.log("winerDetail", winerDetail.data.data[0])
              setWinnerLength(winerDetail.data.data.length)
              setWinnrData({
                address:winerDetail.data.data[0].address,
                name:winerDetail.data.data[0].links.name,
                votes:winerDetail.data.data[0].numberOfVotes,
              })
                setIsLoading(false);
                setContestSummry(true);
            }else{
              setContestSummry(true);
            }
            setIsLoading(false);
          }
        }
      }

    } catch (e) {
      setIsLoading(false);
      console.error("error while open contest summry", e)
    }
  }

  const closeContestSummry = () => {
    setContestSummry(false);
  }


  useEffect(() => {
    dispatch(getCycleId())
  }, [])
  return (
    <StyledHome>
      <div className="header">
        {
          isLoading && (
            <Spinner />
          )
        }
        {
          contestSummry && (
            <Modal onClose={closeContestSummry}>
              <div>
                {
                  winnerLength != 0 ? <>
                  <div >Name: {winnerData.name}</div>
                <div>Votes:{winnerData.votes}</div>
                <div>IPFS hash of the contest summary</div>
                </>
                :
                <div>No nomination found</div>
                }               
              </div>
              <>
                <Button func={closeContestSummry} warn border>
                  Cancel
                </Button>
                <Button func={() => startCycle()}>Confirm</Button>
              </>
            </Modal>
          )
        }
        {/* <span ref={refSec}>hh</span> */}
        <h1>Contest</h1>
        <p>Current Contest Ends In</p>

        {/* {showCompletion?
        <p> Cycle Time Completed</p>:
        <p>{days} &nbsp;&nbsp; Days&nbsp;&nbsp;{hours}&nbsp;&nbsp; Hours&nbsp;&nbsp;{minutes}&nbsp;&nbsp; Minutes &nbsp;&nbsp;</p>  
      } */}
        {
          <MyTimer />
        }
        <br />
        <br />


        <button className="btn btn-light text-primary " onClick={() => navigate("/contest/3")}><b>Vote Now</b></button>
        <div>

          <button className="btn btn-light text-primary"
            onClick={openContestSummry}
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
