import React from 'react'

import Header from '../../components/header'
import "./css/verifyaccount.css"
import { useState } from 'react';
import axios from 'axios';

import {useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


function Verifyaccount() {
    const Token =sessionStorage.getItem("Token");
    const navigate=useNavigate();

    const [email,setEmail]=useState("")
    const [otp,setOtp]=useState("");
    const [patientName,setpatientName]=useState("");
    const [age,setage]=useState("");
    const [ContactNo,setContactNo]=useState("");
    const [address,setAddress]=useState("");

    const [Isotop,setIsStop]=useState(false);
    const [Isverified,setIsverified]=useState(false);
    const [Isloading,setIsloading]=useState(false);
    const [IsEdit,setIsEdit]=useState(true);


    useEffect(()=>{
    
    if(Token){
        navigate("/bookappointment")
    }
},[])

    const handlePhoneNumber = (e) => {
    const value = e.target.value;
    

    if (/^\d*$/.test(value)) {
        if(value.length<=10){
            setContactNo(value);
        }
    }
  };

  const handleage = (e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
        if(value.length<=2){
            setage(value);
        }
      
    }
  }

  const handleSendotp=async()=>{
    if(Isloading) return;
    if(!email){
        alert("Please enter your email address")
        return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address");
        return;
    }
    

    try{
        setIsloading(true);
        const response= await axios.post(`${import.meta.env.VITE_BACKEND_URL}/patient-otp`,{
            email:email
        });

        if(response.data.emessage){
            alert(response.data.emessage)
        }

        if(response.data.success==true){
            setIsStop(true);
            setIsloading(false);
            alert("OTP sent to your email address")
        }   
    }catch(err){
        console.log("Error in sending otp:",err)
    }finally{setIsloading(false)}
  }

  const handleverifyotp=async()=>{
    if(Isloading) return;
    if(!otp){
        alert("Please enter your details")
        return
    }   
    if(!email||!otp){
        alert("Please enter your details")
        return
    }

    try{
        const response= await axios.post(`${import.meta.env.VITE_BACKEND_URL}/verify-otp`,{
            email:email,otp:otp
        });

        if(response.data.emessage){
            alert(response.data.emessage)
        }

        if(response.data.patient){
            if(response.data.patient.length==0){
                setIsverified(true);
                setIsEdit(false);
                return
            }else{
            setpatientName(response.data.patient.patient_name)
            setage(response.data.patient.age)
            setContactNo(response.data.patient.contact_no)
            setAddress(response.data.patient.address)
            setIsverified(true);
            setIsEdit(true);
            }
        }

    setIsloading(true);
    }catch(err){
        console.log("Error in verifying otp:",err)
    }finally{setIsloading(false)}
  };

  const handleregister=async()=>{
    if(Isloading) return;
    if(!Isverified) return;

    if(!patientName||!age||!ContactNo||!address){
        alert("Please enter your details")
        return
    }
    try{
        setIsloading(true);
        const response= await axios.post(`${import.meta.env.VITE_BACKEND_URL}/register-patient`,{
            patient_name:patientName,age:age,email:email,contact_no:ContactNo,address:address
        });

        if(response.data.emessage){
            alert(response.data.emessage)
        }

        if(response.data.success==true){
            alert("Patient registered successfully")
            setIsEdit(true);
            sessionStorage.setItem("Token",response.data.token);
            sessionStorage.setItem("Role",response.data.role);
            sessionStorage.setItem("Username",response.data.username);
            navigate("/bookappointment");
        }   
    }catch(err){
        console.log("Error in registering patient:",err)
    }finally{setIsloading(false)}
  }


  return (
    <div className="verify-account-main">
        <Header/>
        <div className="verify-account-body">
            <div className="verify-account-form-main">
                <h1>Verify Your Account</h1>
                <p>Please verify your account before booking.</p>
                <div className="verify-form">
                    <div className="email-send">
                        <input
                        type="text"
                        placeholder='Enter your email address'
                        value={email}
                        onChange={(e)=>{setEmail(e.target.value.toLowerCase().trim())}}
                        disabled={Isotop}
                        />
                        {!Isverified&&(
                            <>
                            {Isotop?(
                                <button onClick={()=>{handleSendotp()}}>{Isloading?('Sending OTP'):("Resend OTP")}</button>
                            ):(
                                <button onClick={()=>{handleSendotp()}}>{Isloading?('Sending OTP'):('Send OTP')}</button>
                            )}
                            </>
                        )}
                        
                        
                    </div>

                    <div className="verify-details">
                        <input
                        type="text"
                        placeholder='Enter the OTP'
                        value={otp}
                        onChange={(e)=>{setOtp(e.target.value)}}
                        disabled={Isverified}
                        />
                        {Isotop&&(
                            Isverified?(
                                <button style={{backgroundColor:"green",cursor:"not-allowed",color:"white"}} disabled>Verified</button>
                            ):(
                                <button onClick={()=>{handleverifyotp()}}>Verify OTP</button>
                            )
                        )}
                        
                        
                    </div>

                    <div className="verify-details">
                        <input
                        type="text"
                        placeholder='Patient Name'
                        value={patientName}
                        onChange={(e)=>{setpatientName(e.target.value)}}
                        disabled={IsEdit}       
                        />
                    </div>

                    <div className="verify-details">
                        <input
                        type="text"
                        placeholder='Age'
                        value={age}
                        onChange={(e)=>{handleage(e)}}   
                        disabled={IsEdit}    
                        />
                    </div>

                    <div className="verify-details">
                        <input
                        type="text"
                        placeholder='Contact Number'
                        value={ContactNo}
                        onChange={(e)=>{handlePhoneNumber(e)}} 
                        disabled={IsEdit}      
                        />
                    </div>

                    <div className="verify-details">
                        <input
                        type="text"
                        placeholder='Address'
                        value={address}
                        onChange={(e)=>{setAddress(e.target.value)}}   
                        disabled={IsEdit}    
                        />
                    </div>

                    <div className="verify-submit">
                        <button onClick={()=>{handleregister()}}>Continue</button>
                    </div>

                </div>
                
            </div>
        </div>  
    </div>
  )
}

export default Verifyaccount
