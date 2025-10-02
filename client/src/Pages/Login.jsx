import React, { useState,useEffect } from 'react'
import Header from '../components/header'
import "./css/Login.css"
function Login() {
  const [Doc_id,setDocid]=useState("");
  const [Otp,setOtp]=useState("");
  const [IsOtp,setIsotp]=useState(false);
  const [timer, setTimer] = useState(30); 
  const [canResend, setCanResend] = useState(false);

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

  const handleresend = () => {
   
    setTimer(60);
    setCanResend(false);
  };


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
          onChange={(e)=>{e.target.value.trim()}}/>
          {IsOtp&&(
            <div className="otpform">
              <label>Enter OTP</label>
              <input 
              type='text'
              value={Otp}
              onChange={(e)=>{e.target.value.trim()}}
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
              <button>Submit</button>
              </>
            ):(
              <>
              <button>Send OTP</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
