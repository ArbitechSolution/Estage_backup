import {GET_CYCLE_TIME} from '../types/types';


let initialState = {cycle_id:Date.now()};
export const setCycleId = (state = initialState, {type,payload}) => {

        switch(type){
            case GET_CYCLE_TIME : 
            return {
                ...state,
                cycle_id: payload
            }
            default : return {...state}
        }
}