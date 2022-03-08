import {GET_PREVIOUS_VOTE_SUMMRY} from '../types/types';

let initialState = {
    preVoteData : []
}
export const setPreviousVoteSummary = (state = initialState, action) =>{
    
    switch (action.type){
        case  GET_PREVIOUS_VOTE_SUMMRY :
            return {
                ...state,
                preVoteData : action.payload
            }
            default : return {...state}
    }
}