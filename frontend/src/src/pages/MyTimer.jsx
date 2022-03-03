import React, { useEffect } from 'react';
import Countdown from 'react-countdown';
import {getCycleId} from '../redux/actions/actions'
import {useSelector, useDispatch} from 'react-redux'

const Completionist = () => <p>Cycle Time Completed</p>;
const MyTimer = () => {
    let dispatch = useDispatch()
    let {cycle_id} = useSelector(state => state.setCycleId)
    const getTimeStamp = async () => {
        try {
            dispatch(getCycleId())
        } catch (e) {
            console.error("error while get time stamp", e)
        }
    }
    useEffect(()=>{
        getTimeStamp()

},[cycle_id])

  
    const renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a completed state
            return <Completionist />;
        } else {

            return <span>{hours}:&nbsp;Hours&nbsp;&nbsp;{minutes}:&nbsp;Minutes&nbsp;&nbsp;{seconds}:&nbsp;Seconds</span>;
        }
    };

    return (
        <>
            <Countdown
                date={Date.now()+((parseInt(cycle_id)  * 1000))-Date.now()}
                renderer={renderer}
            />

        </>
    )
}

export default MyTimer;