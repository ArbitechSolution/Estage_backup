
import {GET_OF_CHAIN_VOTER, GET_ON_CHAIN_VOTER,GET_NOMINATORS, GET_NOMINATORS_LENGTH} from '../types/types';

let initialState = {
    ofVoterData:[]
};

export const getOfVotes = (state = initialState, action) =>{
    switch(action.type){
        case GET_OF_CHAIN_VOTER:
            return {...state, ofVoterData:action.payload};
    default : return {...state};
    }

}

let initialOnState = {
    onVoteData : []
}
export const setOnVoteList = (state = initialOnState, {type,payload})=>{
    switch (type){
        case GET_ON_CHAIN_VOTER:
            return {
                ...state,
                onVoteData:payload
            }
            default: return {...state}
    }
}

    let initialData = []
    let length = 0;
export const  getAllNominates = (nominateState = initialData, action) => {
  return "hello"
    // switch (action.type){
    //     case GET_NOMINATORS :
    //     return {...nominateState, nominate:action.payload}
    
    // default : return {...nominateState, nominate:[]}; 
    // }

}


// export const getAllNominateslength = (state = length, action)



