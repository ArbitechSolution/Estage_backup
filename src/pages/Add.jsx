import styled from "styled-components";
import Button from "../components/Button";
import Form from "../components/Form";
import { toast } from 'react-toastify';
import { contractAddress, contractAbi, tokenAddress, tokenAbi } from '../components/Constants/Constant'
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux';
import {getWallet} from '../redux/actions/actions'
import axios from "axios";
import "./add.css"
import Spinner from '../components/spinner/Spinner';
import { AiOutlineArrowLeft } from 'react-icons/ai';

export default function Add() {
  const baseURL = process.env.REACT_APP_BSE_URL
let dispatch = useDispatch();
let {acc} = useSelector(state => state.connectWallet)
  let nameOfArtist = useRef();
  let usersWebsite = useRef();
  let userInstagram = useRef("");
  let userMedium = useRef();
  let userOpenSea = useRef("");
  let userYoutube = useRef("");
  let userTikTok = useRef("")
  let [isLoading, setIsLoading] = useState(false);
  // let [userCycleId, setuserCycleid]=useState();

  let navigate = useNavigate();


  const addNomination = async () => {
    try {
    if(acc === "Connect Wallet"){
      toast.error(`${acc}`);
    }else{
    if (acc == "No Wallet") {
      toast.error("No wallet Connected")
    } else if (acc == process.env.REACT_APP_NETWORK_MESSAGE) {
      toast.error(process.env.REACT_APP_NETWORK_MESSAGE)
    } else {
      setIsLoading(true)
      let web3 = window.web3;
        if (nameOfArtist.current.value !== "" && userMedium.current.value !== "" && usersWebsite.current.value !== "") {
          let contractOf = new web3.eth.Contract(contractAbi, contractAddress);
          let cycle_id = await contractOf.methods.currentVotingCycleEnd().call();
          // let isNominated = await contractOf.methods.isNominated(add).call();
          cycle_id = parseInt(cycle_id);
          let tokenContractof = new web3.eth.Contract(tokenAbi, tokenAddress);
          let myBalance = await tokenContractof.methods.balanceOf(acc).call();
          let minimumDaoBalance = await contractOf.methods.minimumDAOBalance().call();

          if (parseInt(minimumDaoBalance) <= parseInt(myBalance)) {
            let data = {
              address: acc,
              cycle_id: cycle_id,
              numberOfVotes: 0,
              links: {
                name: nameOfArtist.current.value,
                medium: userMedium.current.value,
                website: usersWebsite.current.value,
                instagram: userInstagram.current.value,
                opensea: userOpenSea.current.value,
                youtube:userYoutube.current.value,
                tiktok: userTikTok.current.value
              }
            };

            await contractOf.methods.nominate().send({
              from: acc
            })
           await axios.post(`${baseURL}/nominations/add`, data)
            navigate("/contest/3")
            toast.success("Transaction Confirmed");
            setIsLoading(false)
          } else {

            minimumDaoBalance = parseInt(minimumDaoBalance);
            minimumDaoBalance = minimumDaoBalance / 1000000000;
            setIsLoading(false)
            toast.error(`You Must Hold ${minimumDaoBalance} Appolo Tokens`)
          }

        } else {
          toast.error("Fields Can't be empty!")
        }

    }
      }
    }catch (e) {
      setIsLoading(false)
      console.log("Error while Nominating", e);
      toast.error("Transaction Failed")
    }
  }
  return (
    <StyledAdd>
      <div className="header">
      {
          isLoading && (
            <Spinner />
          )
        }
            <h2>
          <AiOutlineArrowLeft className="myarrowIcon" onClick={() => navigate("/")} />
                Go to Contest
            </h2>    
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos
          nesciunt dolor harum! Ullam temporibus quas quae. Obcaecati
          consequuntur autem repudiandae?
        </p>
      </div>
      <div className="form">
        <Form>
          <div className="grid">
            <label>
              Name of Artist<span>*</span>
              <input type="text" ref={nameOfArtist} placeholder="Name of Artist" required />
            </label>
            <label>
              Medium<span>*</span>
              <input type="text" ref={userMedium} placeholder="Medium URL" required />
            </label>
            <label>
              Website<span>*</span>
              <input type="text" ref={usersWebsite} placeholder="Website URL" required />
            </label>
            <label>
              Instagram
              <input ref={userInstagram} type="text" placeholder="Instagram URL" />
            </label>
            <label>
              Opensea
              <input type="text" ref={userOpenSea} placeholder="Opensea URL" />
            </label>
            <label>
              Youtube
              <input type="text" ref={userYoutube} placeholder="Youtube URL" />
            </label>
            <label>
              TikTok
              <input type="text" ref={userTikTok} placeholder="TikTok URL" />
            </label>
            <Button func={addNomination}>Submit</Button>
            {/* <button onClick={()=>addNomination()}  >Submit</button> */}
          </div>
        </Form>
      </div>
    </StyledAdd>
  );
}

const StyledAdd = styled.main`
  max-width: 768px;
  margin: 0 auto;
  padding: 2rem;
  .header {
    h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    p {
      font-size: 1rem;
      color: #adadad;
      font-weight: 300;
      margin-bottom: 0.5rem;
    }
  }
  .form {
    margin-top: 1rem;
    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }
    button {
      width: 100%;
    }
  }
`;
