import React from 'react'
import "../Pages/css/Home.css"
import { useNavigate } from 'react-router-dom';

function header() {
    const navigate=useNavigate();
  return (
    <div className="home-head">
            <div className="head-logo">
                <img src="/images/mcarelogo.png" alt="Logo" />
                <h2>MCare</h2>
            </div>
            {sessionStorage.getItem("Token")?(
                <div className="head-btn">
                    <button onClick={()=>{
                        sessionStorage.removeItem("Token");
                        sessionStorage.removeItem("Role");
                        sessionStorage.removeItem("Username");
                        navigate("/")}}>Logout</button>
                </div>
            ):(
                <div className="head-btn">
                    <button onClick={()=>{navigate("/")}}>Back To Home</button>
                </div>
            )
            }
            
    </div>
  )
}

export default header
