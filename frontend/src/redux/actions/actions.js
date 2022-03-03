import axios from 'axios';
import {GET_OF_CHAIN_VOTER, GET_NOMINATORS, GET_WALLET_ADDRESS, GET_CYCLE_TIME, GET_PROFILE_DATA, IS_VOTED} from '../types/types'
import {loadAccountAddress} from '../../Api/api'
import {contractAddress, contractAbi} from '../../components/Constants/Constant'
import Web3 from 'web3';
const webSupply = new Web3("https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
export const getOfChainVote = (value) => async (dispatch) => {
    // console.log("value", value);
    let res = await axios.get(`https://defi-voting3.herokuapp.com/api/v2/votes/getAllOffchainVotes?cycle_id=${value}`);
    dispatch({
        type:GET_OF_CHAIN_VOTER,
        payload:res.data.data
    })
}


export const getNominates = (cycle_id) => async (dispatch) => {

   let res = await axios
        .get(
          `https://defi-voting3.herokuapp.com/api/v2/nominations/getNominationData?cycle_id=${cycle_id}`
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
    let res = await axios.get(`https://defi-voting3.herokuapp.com/api/v2/nominations/getUserProfile?address=${address}&cycle_id=${cycle_id}`)

    dispatch({
        type:GET_PROFILE_DATA,
        payload:res.data.data,
    })
}

export const getIsOfVote = (cycle_id, address) => async (dispatch) => {

    let res = await axios.get(`https://defi-voting3.herokuapp.com/api/v2/votes/isVoted?address=${address}&cycle_id=${cycle_id}`);
    dispatch({
        type:IS_VOTED,
        payload:res.data.message
    })
} 

