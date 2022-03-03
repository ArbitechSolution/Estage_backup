import React from 'react'
import './Spinner.css'

export default function Spinner() {
    return (
  <div className='body2'>
        <div className="d-flex justify-content-center">
  <div className="spinner-border" style={{width:"8rem", height:"8rem"}} role="status">
    <span className="visually-hidden">Loading...</span>
  </div>
</div>

             {/* <div className="container2 rotate" style={{"--size":"12rem"}} >
                 <div className="circle primary rotate-reverse"></div>
                 <div className="circle tertiary rotate-reverse"></div>
             </div> */}
           
        </div>
    )
}