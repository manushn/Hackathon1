import React from 'react'
import Header from '../../components/header'
import "./css/AdminDash.css"

function AdminDash() {
  return (
    <div className="admindash-main">
        <Header/>
        <div className="admindash-body">
            <h1>Dashboard</h1>
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
                    <button>Manage Appoinments</button>
                    <button>Manage Doctors</button>
                </div>
                
            </div>
        </div>
        <div className="admindash-router">
        <div className="router-con-main">
            <div className="router-con-active">
            <img src="https://cdn-icons-png.flaticon.com/128/8899/8899687.png" alt="home icons" />

            </div>
            
            <div className="router-con">
                <img src="https://cdn-icons-png.flaticon.com/128/17385/17385021.png" alt="Schedule icons" />
                
            </div>
            <div className="router-con">
                <img src="https://cdn-icons-png.flaticon.com/128/3952/3952988.png" alt="Patients icons" />
                
            </div>
            <div className="router-con">
                <img src="https://cdn-icons-png.flaticon.com/128/3953/3953226.png" alt="Schedule icons" />
                
            </div>
        </div>
            
        </div>
    </div>
  )
}

export default AdminDash
