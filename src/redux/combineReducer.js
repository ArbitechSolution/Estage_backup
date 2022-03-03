import {combineReducers} from 'redux';
import {getOfVotes, getAllNominates} from './reducers/allOfChainVoter';
import {setCycleId} from './reducers/setCycleId'
import {connectWallet} from './reducers/getWalletAddrss';
import {setProfileData} from './reducers/setProfileData'
import {setIsOfVote} from './reducers/setIsOfVote'
const allReducer = combineReducers({
    getOfVotes:getOfVotes,
    getAllNominates:getAllNominates,
    connectWallet:connectWallet,
    setCycleId:setCycleId,
    setProfileData:setProfileData,
    setIsOfVote:setIsOfVote
});

export default allReducer;