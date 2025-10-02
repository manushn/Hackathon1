import React, { useState,useEffect } from 'react'
import Header from '../components/header'
import axios from "axios"
import { useNavigate } from 'react-router-dom'

import "./css/Login.css"
function Login() {

  const navigate=useNavigate();

  const [Doc_id,setDocid]=useState("");
  const [Otp,setOtp]=useState("");
  const [IsOtp,setIsotp]=useState(false);
  const [timer, setTimer] = useState(90); 
  const [canResend, setCanResend] = useState(false);
  const [Emessage,setEmessage]=useState("");
  const [Isloading,setIsloading]=useState(false);

  useEffect(() => {
    let interval;
    if (IsOtp && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [IsOtp, timer]);

   useEffect(() => {
    if (Emessage) {
      const timeout = setTimeout(() => {
        setEmessage("");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [Emessage]);

  const handleresend = () => {
   
    setTimer(90);
    setCanResend(false);
  };

  const handleOtp=async(req,res)=>{
    if(Isloading) return;
    if(!Doc_id){
      setEmessage("Please Enter Your Doctors Id")
      return
    }
    try{

      const response= await axios.post(`${import.meta.env.VITE_BACKEND_URL}/doctor-otp`,{
        doc_id:Doc_id
      });
      if(response.data.emessage){
        setEmessage(response.data.emessage)
      }
      if(response.data.success==true){
        setIsotp(true)

      }

    }catch(err){
      console.log("Errro in handleOtp:",err)
    }finally{setIsloading(false)}
    

  }

  const handleLogin=async(req,res)=>{
    if(Isloading) return;
    if(!Otp){
      setEmessage("Please Enter your OTP.")
      return
    }
    if(!Doc_id||!Otp){
      setEmessage("Please Enter Your details.")
      return
    }
    try{

      const response= await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login-otp`,{
        doc_id:Doc_id,otp:Otp
      });
      if(response.data.emessage){
        setEmessage(response.data.emessage)
      }
      if(response.data.success==true){
        sessionStorage.setItem("Token",response.data.token)
        navigate("/admindashboard")

      }

    }catch(err){
      console.log("Errro in handleOtp:",err)
    }finally{setIsloading(false)}
    

  }

  return (
    <div className="login-main">
      <Header/>
      <div className="login-form-main">
       
        <div className="login-form-main-con">
           <h2>Welcome Back</h2>
          <label>Enter Doctors ID</label>
          <input 
          type="text"
          value={Doc_id} 
          disabled={IsOtp}
          onChange={(e)=>{setDocid(e.target.value.trim())}}/>
          {IsOtp&&(
            <div className="otpform">
              <label>Enter OTP</label>
              <input 
              type='text'
              value={Otp}
              onChange={(e)=>{setOtp(e.target.value.trim())}}
              />
              <div className="resend-otp">
                {canResend ? (
                  <button onClick={handleresend}>Resend OTP</button>
                ) : (
                  <p>Resend OTP in {timer}s</p>
                )}
              </div>
            </div>
          )}
          <div className="login-btn">
            {IsOtp?(
              <>
              <button onClick={()=>{handleLogin()}}>Submit</button>
              </>
            ):(
              <>
              <button onClick={()=>{handleOtp()}}>Send OTP</button>
              </>
            )}
          </div>
        </div>
      </div>
      {Emessage&&(
        <div className="emessage-main">
          <div className="emessage-con">
            <p>{Emessage}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login
