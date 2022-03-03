import React,{useState, useEffect} from 'react'
import {FiChevronRight} from 'react-icons/fi';
import {FiChevronLeft} from 'react-icons/fi';
import {useSelector, useDispatch} from 'react-redux';
import {getOfChainVote, getCycleId, getWallet} from '../redux/actions/actions'
import axios from 'axios'
import styled from "styled-components";
import {Table} from 'react-bootstrap'
import {
    contractAddress,
    contractAbi,
    tokenAddress,
    tokenAbi,
  } from "../components/Constants/Constant";
import Web3 from 'web3';
const webSupply = new Web3("https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
const ShowVoter = ({updated}) => {
    const[listOfVotes, setListOfVotes] = useState(['test']);
    let [voterData, showVoterData]=useState([]);
    let [onVoterData, showOnVoterData] = useState([]);
    let [isVote, setIsVote]=useState(true);
    let [onVoteLength, setOnVoteLength]=useState(0)
    let [onVoteStartLimit, setOnVoteStartLimit]=useState(0);
    let [onVoteEndLimit, setOnVoteEndLimit]=useState(10)
    let [ofVoteStartLimit, setOfVoteStartLimit]=useState(0);
    let [ofVoteEndLimit, setOfVoteEndLimit]=useState(10)
    let [ofVoteLength, setOfVoteLength]=useState(0)

  let dispatch = useDispatch();
  let {acc} = useSelector((state => state.connectWallet))
  let {cycle_id} = useSelector(state => state.setCycleId)
    const getData = async () => {
      // dispatch(getCycleId())
        try{
            let contractOf = new webSupply.eth.Contract(contractAbi, contractAddress);
            let cycle_id = await contractOf.methods.currentVotingCycleEnd().call();
            dispatch(getOfChainVote(cycle_id))
        }catch(e){
            console.error("error while get data", e);
        }
    }
    const getOfVoterData = async () => {
      try{
        let contractOf = new webSupply.eth.Contract(contractAbi, contractAddress);
        let cycle_id = await contractOf.methods.currentVotingCycleEnd().call();
        let res = await axios.get(`https://defi-voting3.herokuapp.com/api/v2/votes/getAllOffchainVotes?cycle_id=${cycle_id}`)
        showVoterData(res.data.data);
        setOfVoteLength(res.data.data.length)
      }catch(e){
        console.error("error while voter data", e);
      }
    } 
    const getOnVoteData = async () => {
      try{
        let contractOf = new webSupply.eth.Contract(contractAbi, contractAddress);
        let cycle_id = await contractOf.methods.currentVotingCycleEnd().call();
        let res = await axios.get(`https://defi-voting3.herokuapp.com/api/v2/votes/getAllOnChainVotes?cycle_id=${cycle_id}`)
        setOnVoteLength(res.data.data.length)
        showOnVoterData(res.data.data)
      }catch(e){
        console.log("error while get on vote data",e);
      }
    }
    const nextOfVote = () => {
      if(ofVoteEndLimit <  ofVoteLength){
        setOfVoteStartLimit(ofVoteEndLimit);
        setOfVoteEndLimit(ofVoteEndLimit+1)
      }
    } 
    const preOfVote = () => {
      if(ofVoteStartLimit > 0){
        setOfVoteStartLimit(ofVoteStartLimit-1);
        setOfVoteEndLimit(ofVoteEndLimit- ofVoteStartLimit)
      }
    }
    const nextOnVote = () => {
      if(onVoteEndLimit <  onVoteLength){
        setOnVoteStartLimit(onVoteEndLimit);
        setOnVoteEndLimit(onVoteEndLimit+1)
      }
    }
    const preOnVote = () => {
      if(onVoteStartLimit > 0){
        setOnVoteStartLimit(onVoteStartLimit-1);
        setOnVoteEndLimit(onVoteEndLimit- onVoteStartLimit)
      }
    }
    const ofVoteTable = () => {
      setIsVote(true)
    }
    const onVoteTable = () => {
      setIsVote(false)
    }
    useEffect(()=>{
      
      getOfVoterData()
      getOnVoteData()
        getData()

    },[updated])
    return (
      <StyledContest>
        <div>
          {
            // ( )
          }
            <div className="header d-flex justify-content-evenly mt-5 mb-3">
        <div className={isVote ? "btn btn-primary" : "btn btn-light"} onClick={ofVoteTable} >List off chain votes</div>
        <div  className={isVote ? "btn btn-light" : "btn btn-primary"} onClick={onVoteTable}>List on chain votes</div>
      </div>
      {/* <div className="nominations">
          {listOfVotes.length > 0 ? (<>
            {voterData.map(v => {
              return (
                <p className="vote-list">0x1234...5678 <FiChevronRight /> 0x9876...5432</p>
              )
            })}
          </>) : (<p>No votes yet</p>)}
      </div> */}
      {
        isVote ? <>
        <div className="maindivvote">

<Table className="" striped  hover bordered variant="dark"  responsive>
  <thead>
  <tr className="text-center">
    {/* <td>#</td> */}
  <td>IPFS Hash</td>
  <td >Address</td>
  <td >Nomination</td>
  <td >Balance</td>
  <td >Cycle ID</td>
  </tr>
  </thead>
{
  voterData?.slice(ofVoteStartLimit, ofVoteEndLimit).map((list,index)=> {
    let hashNum = list.hash
    hashNum =hashNum.substring(0,4)+"..."+hashNum.substring(hashNum?.length -4)
    return (
      <tbody key={index}>
      <tr className="text-center">
      {/* <td className="p-2 m-1">{index+1}</td> */}
  <td className="p-2 m-1"><a href={`https://ipfs.infura.io/ipfs/${list.hash}`} target="_blank">{hashNum}</a></td>
  <td className="p-2 m-1">  {list.address.substring(0,4)+"..."+list.address.substring(list.address.length - 4)}</td>
  <td className="p-2 m-1">{list.nomination.substring(0,4)+"..."+list.nomination.substring(list.nomination.length - 4)}</td>
  <td className="p-2 m-1">{list.appoloBalance}</td>
  <td className="p-2 m-1">{list.cycle_id}</td>
  </tr>
  </tbody>
     )
   })
}
      </Table>
      <div className="text-center"> 

      <FiChevronLeft className={ofVoteEndLimit+1 > voterData.length? "fs-1 text-primary": "fs-1 text-light"} 
      onClick={preOfVote}
      />
      <span className="text-primary p-2 m-2 fs-5">
      {ofVoteStartLimit} - {ofVoteLength}
      </span>
      <FiChevronRight className={ofVoteStartLimit+1 < ofVoteLength? "fs-1 text-primary": "fs-1 text-light"} 
      onClick={nextOfVote}
      />
      </div>
</div>
        </> : <>
        <div className="maindivvote">

<Table className="" striped hover variant="dark"  responsive>
  <thead>
  <tr className="text-center" >
  <td>Transaction Hash</td>
  <td >Address</td>
  <td >Nomination</td>
  <td >Balance</td>
  <td >Cycle ID</td>
  </tr>
  </thead>
{
  onVoterData?.slice(onVoteStartLimit, onVoteEndLimit).map((list,index)=> {
    let hashNum = list.transactionHash
    hashNum =hashNum.substring(0,4)+"..."+hashNum.substring(hashNum?.length -4)
    return (
      <tbody key={index}>
      <tr className="text-center">
  <td className="p-2 m-1"> <a href={`https://rinkeby.etherscan.io/tx/${list.transactionHash}`} target="_blank" > {hashNum}</a></td>
  <td className="p-2 m-1">{list.address.substring(0,4)+"..."+list.address.substring(list.address.length - 4)}</td>
  <td className="p-2 m-1">{list.nomination.substring(0,4)+"..."+list.nomination.substring(list.nomination.length - 4)}</td>
  <td className="p-2 m-1">{list.appoloBalance}</td>
  <td className="p-2 m-1">{list.cycle_id}</td>
  </tr>
  </tbody>
     )
   })
}
      </Table>
      <div className="text-center"> 

<FiChevronLeft className={onVoteEndLimit+1 > onVoteLength? "fs-1 text-primary": "fs-1 text-light"}
onClick={preOnVote}
/>
<span className="text-primary p-2 m-2 fs-5">
{onVoteStartLimit} - {onVoteLength}
</span>
<FiChevronRight className={onVoteStartLimit+1 < onVoteLength? "fs-1 text-primary": "fs-1 text-light"} 
onClick={nextOnVote}
/>
</div>
</div>
        </>
      }
      
        </div>
        </StyledContest>
    )

}

export default ShowVoter


const StyledContest = styled.main`
// .listStyle{
//   list-style:none;
// }
`;