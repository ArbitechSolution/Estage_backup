import {GET_PREVIOUS_CONTESTS} from '../types/types';

let initialState = {
    preContest :[]
}
export const setPreviousContest = (state = initialState, action) => {

    switch(action.type){
        case GET_PREVIOUS_CONTESTS :
         return {
            ...state,
            preContest:action.payload
         };
         default : return {...state}
    }
}