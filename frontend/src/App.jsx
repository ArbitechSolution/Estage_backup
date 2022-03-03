import React,{useState,useEffect} from 'react'
import { Route, Routes } from "react-router-dom";
import GlobalStyle from "./components/GlobalStyles";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Contest from "./pages/Contest";
import Add from "./pages/Add";

export default function App() {
 
  return (
    <>
    <ToastContainer />
      <GlobalStyle />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contest/:contestId" element={<Contest />} />
        <Route path="/contest/:contestId/add" element={<Add />} />
      </Routes>
    </>
  );
}
