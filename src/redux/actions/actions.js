import axios from 'axios';
import {GET_OF_CHAIN_VOTER, GET_ON_CHAIN_VOTER,GET_NOMINATORS, GET_WALLET_ADDRESS, GET_CYCLE_TIME, GET_PROFILE_DATA, IS_VOTED, GET_PREVIOUS_CONTESTS, GET_PREVIOUS_VOTE_SUMMRY} from '../types/types'
import {loadAccountAddress} from '../../Api/api'
import {contractAddress, contractAbi} from '../../components/Constants/Constant'
import Web3 from 'web3';
const webSupply = new Web3("https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");

const baseURL = process.env.REACT_APP_BSE_URL;
console.log("baseURL",baseURL);

export const getOfChainVote = (value) => async (dispatch) => {
    // console.log("value", value);
    let res = await axios.get(`${baseURL}/votes/getAllOffchainVotes?cycle_id=${value}`);
    dispatch({
        type:GET_OF_CHAIN_VOTER,
        payload:res.data.data
    })
}


export const getOnChainVote = (cycle_id) => async (dispatch) => {
    let res = await axios.get(`${baseURL}/votes/getAllOnChainVotes?cycle_id=${cycle_id}`);
    dispatch({
        type:GET_ON_CHAIN_VOTER,
        payload:res.data.data
    })
}


export const getNominates = (cycle_id) => async (dispatch) => {

   let res = await axios
        .get(
          `${baseURL}/nominations/getNominationData?cycle_id=${cycle_id}`
        )
        dispatch({
            type:GET_NOMINATORS,
            payload:res.data
        })
} 

export const getWallet = () => async (dispatch) => {
    
    let address = await loadAccountAddress();
    dispatch({
        type: GET_WALLET_ADDRESS,
        payload:address
    })
}

export const getCycleId = () => async (dispatch) => {

    let contractOf = new webSupply.eth.Contract(contractAbi, contractAddress);
    let time = await contractOf.methods.currentVotingCycleEnd().call();
    time = parseInt(time);
    dispatch({
        type:GET_CYCLE_TIME,
        payload:time
    })

}


export const getProfileData = (cycle_id, address) => async (dispatch)=> {
    let res = await axios.get(`${baseURL}/nominations/getUserProfile?address=${address}&cycle_id=${cycle_id}`)

    dispatch({
        type:GET_PROFILE_DATA,
        payload:res.data.data,
    })
}

export const getIsOfVote = (cycle_id, address) => async (dispatch) => {

    let res = await axios.get(`${baseURL}/votes/isVoted?address=${address}&cycle_id=${cycle_id}`);
    dispatch({
        type:IS_VOTED,
        payload:res.data.message
    })
} 

export const getPreviousContest = () => async (dispatch) => {
    let contractOf = new webSupply.eth.Contract(contractAbi, contractAddress);
    let pre_Cycle_id = await contractOf.methods.previousVotingCycleEnd().call();
    let res = await axios.get(`${baseURL}/nominations/getNominationData?cycle_id=${pre_Cycle_id}`);

    dispatch({
        type:GET_PREVIOUS_CONTESTS,
        payload:res.data.data
    })
}

export const getPreviousVoteSummry = () => async (dispatch) => {
    let contractOf = new webSupply.eth.Contract(contractAbi, contractAddress);
    let pre_Cycle_id = await contractOf.methods.previousVotingCycleEnd().call();
    let res = await axios.get(`${baseURL}/votes/allVoteSummry?cycle_id=${pre_Cycle_id}`);

    dispatch({
        type:GET_PREVIOUS_VOTE_SUMMRY,
        payload:res.data.data
    })
}