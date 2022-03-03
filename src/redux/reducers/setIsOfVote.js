import {IS_VOTED}  from '../types/types';

let initialState = {status:false};

export const setIsOfVote = (state = initialState, {type,payload }) => {

    switch(type){
        case IS_VOTED :
            return{
                ...state,
                status:payload
            }
            default: return {...state}
    }

}