import {GET_PROFILE_DATA} from '../types/types';


let initailData = {
    name:"",
    medium:"",
    website:"",
    instagram:"",
    opensea:"",
    youtube:"",
    tiktok:""

}
export const setProfileData = ( state = initailData, {type,payload} ) => {

    switch(type){
        case GET_PROFILE_DATA:
            return {
                ...state,
                    name:payload.name,
                    medium:payload.medium,
                    website:payload.website,
                    instagram:payload.instagram,
                    opensea:payload.opensea,
                    youtube:payload.youtube,
                    tiktok:payload.tiktok

               
            }
        default : return {...state}
    }
}