import React from 'react'
import Header from '../../components/header'
import { useNavigate } from 'react-router-dom'
import "./css/AdminDash.css"
import Footers from '../../components/Footers'

function AdminDash() {
    const navigate=useNavigate()
  return (
    <div className="admindash-main">
        <Header/>
        <div className="admindash-body">
            <h2>Dashboard</h2>
            <div className="admindash-body-card">
                <div className="admindash-body-card-con">
                    <p>Total Appoinments</p>
                    <h1>1250</h1>
                </div>
                <div className="admindash-body-card-con">
                    <p>Active Doctors</p>
                    <h1>35</h1>
                </div>
                <div className="admindash-body-card-con">
                    <p>Registered Patients</p>
                    <h1>873</h1>
                </div>
            </div>

            <div className="admindash-body-actions">
                <h3>Quick Actions</h3>
                <div className="admindash-body-actions-btn">
                    <button onClick={()=>{navigate("/manageappoinments")}} >View Appoinments</button>
                    <button onClick={()=>{navigate("/managedoctors")}}>Manage Doctors</button>
                </div>
                
            </div>
        </div>
        <div className="admindash-router">
        <div className="router-con-main">
            <div className="router-con-active" onClick={()=>{navigate("/admindashboard")}}>
            <img src="https://cdn-icons-png.flaticon.com/128/8899/8899687.png" alt="home icons" />

            </div>
            
            <div className="router-con" onClick={()=>{navigate("/manageappoinments")}}>
                <img src="https://cdn-icons-png.flaticon.com/128/17385/17385021.png" alt="Schedule icons" />
                
            </div>
            <div className="router-con" onClick={()=>{navigate("/managedoctors")}}>
                <img src="https://cdn-icons-png.flaticon.com/128/3952/3952988.png" alt="Doctors icons" />
                
            </div>
            <div className="router-con">
                <img src="https://cdn-icons-png.flaticon.com/128/3953/3953226.png" alt="Settings icons" />
                
            </div>
        </div>
            
        </div>
        <Footers/>
    </div>
  )
}

export default AdminDash
