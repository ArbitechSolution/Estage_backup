import React, { useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Accordion from "../components/Accordion";
import ShowVoter from './ShowVoter'
import Button, { SmallButton } from "../components/Button";
import { FaMedium, FaGlobeAmericas } from "react-icons/fa";
import {ImCancelCircle} from 'react-icons/im';
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import {Form} from 'react-bootstrap'
import {ethers} from 'ethers'
import {useSelector, useDispatch} from 'react-redux';
import {CgProfile} from 'react-icons/cg';
import {Table} from 'react-bootstrap'
import {getNominates, getWallet, getCycleId, getProfileData, getIsOfVote} from '../redux/actions/actions'
import {
  contractAddress,
  contractAbi,
  tokenAddress,
  tokenAbi,
} from "../components/Constants/Constant";
import Modal from "../components/Modal";
import Web3 from "web3";
import { create } from 'ipfs-http-client';
const client = create('https://ipfs.infura.io:5001/api/v0')
const webSupply = new Web3(
  "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
);

export default function Contest() {
  const { contestId } = useParams();
  let [showProfile, setShowProfile] = useState(false);
  let [showButton, setShowButton] = useState(true);
  let [nomiBtn, setNomiBtn] = useState(false)
  let [disabledbtn, setDisabledbtn] = useState(true);
  const [myApiArray, setMyApiarray] = useState([]);
  let [votingAdress, setVotingAddress] = useState();
  let [nominationLength, setNominationLength] = useState(0);
  let [nominatorName, setNominatorname] = useState("");
  let [isDel, setIsDel]=useState(false);
  let [delNominate, setDelNominate]=useState()
  let [updated, setUpdated] = useState(true)
  let navigate = useNavigate();
  let dispatch = useDispatch()
  let {acc} = useSelector(state =>state.connectWallet);
  let {cycle_id} = useSelector(state => state.setCycleId)
  let profile = useSelector(state => state.setProfileData)
  const disableButton = () => {
    if(acc == "No Wallet" || acc == "Connect to Rinkebey" || acc ==="Connect Wallet"){
      setNomiBtn(true)
    }else{
      setNomiBtn(false);
    }
  }
  const fetchApi = async () => {
    
    if (acc == "No Wallet" || acc == "Connect to Rinkebey" || acc ==="Connect Wallet") {
      
    } else {
      try {
        
        let web3 = window.web3;
        let contractOf = new web3.eth.Contract(contractAbi, contractAddress);
        let cycle_id = await contractOf.methods.currentVotingCycleEnd().call();

        let alreadyVoted = await contractOf.methods
          .hasVotedForCreator(acc, cycle_id)
          .call();
          let res =await axios.get(`https://defi-voting3.herokuapp.com/api/v2/votes/isVoted?address=${acc}&cycle_id=${cycle_id}`);

        if (alreadyVoted || res.data.message) {
          setDisabledbtn(true);
        } else {
          setDisabledbtn(false);
        }
      } catch (e) {
        console.log("Error While Checking has voted for Creator ", e);
      }
    }    
  };
  const getNominatesData = async () => {
    try{
      let contractOf = new webSupply.eth.Contract(contractAbi, contractAddress);

      let cycle_id = await contractOf.methods.currentVotingCycleEnd().call();
      await axios
        .get(
          `https://defi-voting3.herokuapp.com/api/v2/nominations/getNominationData?cycle_id=${cycle_id}`
        )
        .then((response) => {
          let myrequiredData = response.data.data;
          setNominationLength(myrequiredData.length);
          setMyApiarray(myrequiredData);
        });
    }catch(e){
      console.error("error while get nominates data", e);
    }
  }


  const frostyDFrostOne = async () => {
    try {
      if(acc === "Connect Wallet"){
        toast.error(`${acc}`)
      }else{
    setVoteModal(false);
    if (acc == "No Wallet") {
      toast.error("No wallet Connected");
    } else if (acc == "Connect to Rinkebey") {
      toast.error("Please Connect to Connect to Rinkebey");
    } else {
      let web3 = window.web3;
        let contractOf = new web3.eth.Contract(contractAbi, contractAddress);
        let tokenContractof = new web3.eth.Contract(tokenAbi, tokenAddress);
        let cycle_id = await contractOf.methods.currentVotingCycleEnd().call();
        let myBalance = await tokenContractof.methods.balanceOf(acc).call();
        let isNominated = await contractOf.methods
          .isNominated(votingAdress)
          .call();
        if (parseInt(myBalance) > 0) {
          if (isNominated) {
            await contractOf.methods.vote(votingAdress).send({
              from: acc,
            }).on("receipt", async(receipt)=>{
              let bal = myBalance / 10 **9;
              let data={
                voteFrom:acc,
                voteTo:votingAdress,
                cycle_id:parseInt(cycle_id),
                transactionHash:receipt.transactionHash,
                appoloBalance:parseInt(bal)
              }
              await axios.post("https://defi-voting3.herokuapp.com/api/v2/votes/voteOnChain", data)
              setUpdated(updated = !updated)
            })

            toast.success("Transaction Confirmed");
          } else {
            toast.error("There is no DAO Nomination for this address");
          }
        } else {
          toast.error("You balance is less than minimum DAO Balance");
        }
      }
    }
    } catch (e) {
      console.log("Error while Nominating", e);
      toast.error("Transaction Failed");
    }
  };

  const [voteModal, setVoteModal] = useState(false);
  // const [voteModaltwo, setVoteModaltwo] =useState(false);
  
  const openVoteModal = (addf) => {
    let finalAdd = addf.address;
    let nominametorName = addf.links.name;
    setNominatorname(nominametorName);
    setVotingAddress(finalAdd);
    setVoteModal(true);
  };
  
  const closeVoteModal = () => {
    setVoteModal(false);
    setConfirmed(false);
  };
  let postUrl = "https://web.postman.co/home";
  
  const [signModal, setSignModal] = useState(false)
  let fromAdd = useRef();
  let toAdd = useRef();
  let opoBal = useRef();
  let cyclID = useRef();
  let [data, setData]=useState()
  
  const closeSignModal = () => {
    setSignModal(false)
  }
  const openOfChainModal = async(items) => {
    try{
      if(acc === "Connect Wallet"){
        toast.error(acc)
      }else{
      if(acc == "No Wallet" || acc == "Connect to Rinkebey"){
        toast.error("No Wallet Connected or onnect to Rinkebey")
      }else{
        const web3 = window.web3;
        let contractOf = new web3.eth.Contract(contractAbi, contractAddress);
        let cycle_id = await contractOf.methods.currentVotingCycleEnd().call();
        let tokenContractof = new web3.eth.Contract(tokenAbi, tokenAddress);
        let myBalance = await tokenContractof.methods.balanceOf(acc).call();
        // myBalance = web3.utils.fromWei(myBalance)
        setSignModal(true);
        toAdd.current.value =items.address;
        fromAdd.current.value = acc;
        cyclID.current.value = cycle_id;
        opoBal.current.value = myBalance/10**9;
        let fromAddress =acc
        let toAddress = items.address
        let cycleId = cycle_id
        let myBal = myBalance
        
        let data=`fromAddress:${fromAddress},toAddress:${toAddress},cycleId:${cycleId},AppoloToken:${myBal/10**9}`
        setData(data)        
      }
    }
    }catch(e){
      console.error("error while vote of chain", e)
    }

  }
  const voteOfChain = async () => {
    try{
      if(acc === "Connect Wallet"){
        toast.error(acc)
      }else{
      if(acc == "No Wallet" || acc == "Connect to Rinkebey"){
        toast.error("No Wallet Connected or onnect to Rinkebey")
      }else{
        const web3 = window.web3;
        let currentTime = Math.floor(new Date().getTime() / 1000.0);
        let contractOf =new web3.eth.Contract(contractAbi, contractAddress);
        let contractTime = await contractOf.methods.currentVotingCycleEnd().call();
        contractTime =parseInt(contractTime);
        let finalTime = contractTime-currentTime;
        if(finalTime > 0){
      if(window.ethereum){
        let apiObj ={}
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer =  provider.getSigner()
        const signature = await signer.signMessage(data)
        let ipfsHash = await client.add(`${data}:signature:${signature}`)
        apiObj={
          voteFrom:fromAdd.current.value,
          voteTo:toAdd.current.value,
          cycle_id:parseInt(cyclID.current.value),
          hash:ipfsHash.path,
          appoloBalance:parseInt(opoBal.current.value)
        }
        let res =await axios.post("https://defi-voting3.herokuapp.com/api/v2/votes/voteOffchain", apiObj);
        setUpdated(updated = !updated)
        setDisabledbtn(true);
        setSignModal(false);
        toast.success(`${res.data.message}`)
      }
    }else{
      toast.error("Time Cycle Completed")
    }
    }
    }   
    }catch(e){
      setDisabledbtn(false);
      console.error("error while vote of chain", e)
    }
  }

  const checkCycle = async () => {
    try{
        let currentTime = Math.floor(new Date().getTime() / 1000.0);
        let contractOf =new webSupply.eth.Contract(contractAbi, contractAddress);
        let contractTime = await contractOf.methods.currentVotingCycleEnd().call();
        contractTime =parseInt(contractTime);
    let finalTime = contractTime-currentTime;
    if(finalTime > 0){
      navigate(`/contest/${contestId}/add`)
    }else{
      toast.error("Time cycle completed")
    }
      
    }catch(e){
      console.error("error while check cycle",e);
    }
  }

  const deleteNominate = async() => {
    try{
      if(acc === "Connect Wallet"){
        toast.error(acc)
      }else{
      if(acc == "No Wallet" || acc == "Connect to Rinkebey"){
        toast.error("No Wallet Connected or onnect to Rinkebey")
      }else{
        const web3 = window.web3;
        let contractOf = new web3.eth.Contract(contractAbi, contractAddress);
        const  ownerAddress = await contractOf.methods.owner().call()
        if(ownerAddress == acc){
          let data = {
            address:delNominate
          }
          await axios.post("https://defi-voting3.herokuapp.com/api/v2/nominations/delete",data)
          setIsDel(false)
          toast.success("Nomination deleted")
        }else{
          setIsDel(false)
          toast.error("Only owner can delete nomination")
        }
      }
    }
    }catch(e){
      console.error("error while delete nominate", e)
    }
  }
    const openProfileModal =  (address)=> {
      try{
        dispatch(getProfileData(cycle_id, address))
        setShowProfile(true);
      }catch(e){
        console.error("error while open profile modal");
      }
    }
const closeProfileModal = () =>{
  setShowProfile(false)
}
  
useEffect(() => {
    fetchApi();
    getNominatesData();
    disableButton()
    dispatch(getCycleId());
  }, [acc]);

  const [confirmed, setConfirmed] = useState(false);
  const [ownsApollo, setOwnsApollo] = useState(true);

  

  return (
    <StyledContest>
      {voteModal && (
        <Modal onClose={closeVoteModal}>
          <div className="vote">
            {!confirmed && (ownsApollo ? (<><p>Please confirm you wish to vote for</p>
            <h3>{nominatorName}</h3></>) : (<p>You must own some Apollo token before you can vote in a contest.</p>))}
            {confirmed && (<p>You can write your vote directly to the Ethereum blockchain by paying the appropriate gas fees. Or you can allow us to register your vote for you for free.</p>)}
            <div className="vote__actions">
              {!confirmed && (
                <>
                  <Button func={closeVoteModal} warn border>
                    Cancel
                  </Button>
                  {ownsApollo && <Button func={() => frostyDFrostOne()}>Confirm</Button>}
                </>
              )}
              {confirmed && (
                <>
                  <Button func={() => null}>
                    Cancel
                  </Button>
                  <Button func={() => null}>Vote on IPFS</Button>
                  <Button func={() => null}>Vote on blockchain</Button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
      {
        showProfile && (
          <Modal onClose={closeProfileModal}>
            <h3 className="text-center mb-3">Nominate Profile</h3>
            <div className="row">
              <Table className="" striped border hover variant="dark">
                <thead>
                  <tr className="text-center">
                    <td>Name</td>
                    <td >{profile.name}</td>
                  </tr>
                  <tr className="text-center">
                    <td>Medium</td>
                    <td>{profile.medium}</td>
                  </tr>
                  
                  <tr className="text-center">
                    <td>Website</td>
                    <td><a  href={profile.website} target="_blank" >{profile.website}</a></td>
                  </tr>
                  {
                    profile.instagram != "" && (
                      <tr className="text-center">
                    <td>Instagram</td>
                    <td><a  href={profile.instagram} target="_blank" >{profile.instagram}</a></td>
                  </tr>
                    )
                  }
                  {
                    profile.opensea != "" && (
                      <tr className="text-center">
                      <td>OpenSea</td>
                      <td><a  href={profile.opensea} target="_blank" >{profile.opensea}</a></td>
                    </tr>
                    )
                  }
                  {
                    profile.youtube != "" && (
                      <tr className="text-center">
                      <td>Youtube</td>
                      <td><a  href={profile.youtube} target="_blank" >{profile.youtube}</a></td>
                    </tr>
                    )
                  }
                  {
                    profile.tiktok != "" && (
                      <tr className="text-center">
                      <td>TikTok</td>
                      <td><a  href={profile.tiktok} target="_blank" >{profile.tiktok}</a></td>
                    </tr>
                    )
                  }
                 
                </thead>
              </Table>
            </div>
          </Modal>
        )
      }
      { signModal && 
        (
          <Modal onClose={closeSignModal}>
            <h3 className="text-center mb-3">Sign Message</h3>
            <div className="row">
              <div className="col-6">
                <Form.Label>From Address</Form.Label>
                
                <Form.Control 
                className="border-0 text-light bg-dark"
                disabled="disabled"
                ref={fromAdd}
                />
              </div>
              <div className="col-6"> 
                <Form.Label>To Address</Form.Label>
                <Form.Control 
                className="border-0 bg-dark text-light"
                disabled="disabled"
                ref={toAdd}
                />
              </div>
              <div className="col-6 mt-2"> 
                <Form.Label>Cycle ID</Form.Label>
                <Form.Control 
                className="border-0 bg-dark text-light"
                disabled="disabled"
                ref={cyclID}
                />
              </div>
              <div className="col-6 mt-2"> 
                <Form.Label>Balance</Form.Label>
                <Form.Control 
                className="border-0 bg-dark text-light"
                disabled="disabled"
                ref={opoBal}
                />
              </div>
              <div className="vote__actions mt-4">
                {!confirmed && (
                  <>
                    <Button func={closeSignModal} warn border>
                      Cancel
                    </Button>
                    {ownsApollo && <Button func={() => voteOfChain()}>Confirm</Button>}
                  </>
                )}
                
              </div>
            </div>
          </Modal>
        )
      }
      {
        isDel && (
          <Modal onClose={()=>{
            setIsDel(false)
          }}>
          <div className="vote">
            <p>Please confirm to delete this nomination</p> 
            <div className="vote__actions">
              {!confirmed && (
                <>
                  <Button func={()=> {
                    setIsDel(false)
                  }} warn border>
                    Cancel
                  </Button>
                  {ownsApollo && <Button func={() => deleteNominate()}>Confirm</Button>}
                </>
              )}
            </div>
          </div>
        </Modal>
        )
      }

      <div className="header">
        <h2>Nominated Creators</h2>
        <p>Nominations Found : {nominationLength}</p>
      </div>
      <div className="nominations">
        {myApiArray.length <= 0 && <p 
        
        >
          Be the first to <span className="text-primary" style={{pointer:"cursor"}} disabled={nomiBtn} onClick={checkCycle} >nominate </span> a creator!
        </p>}
        {myApiArray.map((items, index) => {
          let myUrl = items.links.website;
          return (
            <div key={items._id}>
              <Accordion title={items.links.name} rank={index + 1}>
              <CgProfile className="text-info fs-2 mb-2" 
              onClick={()=>{
                openProfileModal(items.address)
              }}
              />
                <div className="float-end">
                    <ImCancelCircle className="text-danger fs-3 mb-2"
                    onClick={()=> {
                      setIsDel(true)
                      setDelNominate(items.address)
                    }}
                    />
                </div>
                <div className="nominee">
                  <div className="links">
                    {/* <a
                  href={myUrl}
                  target="_blank"
                >
                <FaMedium />
              </a>  */}
                    <a href={items.links.website} target="_blank">
                      <FaGlobeAmericas />
                    </a>
                    <p className="mt-3">{items.address}</p>
                  </div>
                  <div>
                  {showButton ? (
                    <div className="">
                    <button
                      disabled={disabledbtn}
                      className="btn btnheremy m-4"
                      onClick={() => openVoteModal(items)}
                    >
                      Vote On Chain
                    </button>
                    <button
                    disabled={disabledbtn}
                    className="btn btnheremy m-4"
                    onClick={()=>openOfChainModal(items)}
                    >
                      Vote Off Chain
                    </button>
                    
                  </div>
                  ) : (
                    <></>
                  )}
                  </div>
                  {/* <SmallButton alternate func={()=>openVoteModal(items)}>
              Vote1
            </SmallButton> */}
                </div>
              </Accordion>
            </div>
          );
        })}
        
          <button disabled={nomiBtn} className="btn btn-primary"  onClick={() => checkCycle()}>
            Add Nomination
          </button>
      
     
      </div>
      
      <ShowVoter updated={updated} />
    </StyledContest>
  );
}

const StyledContest = styled.main`
  max-width: 768px;
  margin: 0 auto;
  padding: 2rem;
  .vote {
    text-align: center;
    h3 {
      margin: 1.5rem 0;
    }
    &-list{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 1rem;
    }
    &__actions {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
    }
  }
  .header {
    h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    h4{
      margin-top: 4rem;
      font-size: 1rem;
    }
    p {
      font-size: 1rem;
      color: #adadad;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
  }
  .nominations {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
    p {
      font-size: 1rem;
      color: #adadad;
      font-weight: 600;
      a {
        color: #1e78ff;
        text-decoration: underline;
      }
    }
    button {
      margin-top: 0.5rem;
      width: 100%;
    }
  }
  .nominee {
    display: flex;
    // justify-content: space-between;
    flex-direction: column;
    align-items: center;

    gap: 1rem;
    .links {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    a {
      display: inline-block;
      line-height: 1;
      transition: all 0.3s ease;
      svg {
        font-size: 1.5rem;
      }
      &:hover {
        color: #1e78ff;
      }
    }
    button {
      width: auto;
      margin-top: 0;
    }
  }
`;
