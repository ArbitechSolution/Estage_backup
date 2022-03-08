import {combineReducers} from 'redux';
import {getOfVotes, setOnVoteList,getAllNominates} from './reducers/allOfChainVoter';
import {setCycleId} from './reducers/setCycleId'
import {connectWallet} from './reducers/getWalletAddrss';
import {setProfileData} from './reducers/setProfileData'
import {setIsOfVote} from './reducers/setIsOfVote';
import {setPreviousContest} from './reducers/setPreviousContests';
import {setPreviousVoteSummary} from './reducers/setPreviousVoteSummry'
const allReducer = combineReducers({
    getOfVotes:getOfVotes,
    setOnVoteList:setOnVoteList,
    getAllNominates:getAllNominates,
    connectWallet:connectWallet,
    setCycleId:setCycleId,
    setProfileData:setProfileData,
    setIsOfVote:setIsOfVote,
    previousContest:setPreviousContest,
    preVoteSummry : setPreviousVoteSummary
});

export default allReducer;