import React,{useEffect} from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {useState} from "react"
import {loadAccountAddress} from "../../src/Api/api"
import {useSelector, useDispatch} from 'react-redux';
import {getWallet} from '../redux/actions/actions'
import { toast } from 'react-toastify';
import "./Nav.css"
export default function Nav() {
  let [notConnected, setNotConnected]= useState(true)
  let dispatch = useDispatch()
  let {acc} = useSelector(state => state.connectWallet)
   const getaddress=()=> {
    dispatch(getWallet())
   }
  return (
    <StyledNav>
      <Link to="/">
        <h3>Defi DAO</h3>
      </Link>
      
        <button  className={ notConnected? "btn btn121": "btn btn122"} 
        onClick={getaddress}
        >{acc ==="No Wallet" ? "Insatll metamask" :acc ==="Connect Wallet" ? acc  : acc ==="Connect to Rinkebey"? acc :acc.substring(0,5) + "..." + acc.substring(acc.length - 5)  }</button>
      
      
    </StyledNav>
  );
}

const StyledNav = styled.nav`
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #ffffff;
  h3 {
    font-size: 1.5rem;
  }
`;
