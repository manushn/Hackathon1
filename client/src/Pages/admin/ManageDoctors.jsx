import React, { useEffect } from 'react'
import { useState } from 'react'
import Header from '../../components/header'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import "./css/AdminDash.css"
import "./css/ManageDoctor.css"
import Footers from "../../components/Footers"

function ManageDoctors() {
    const navigate=useNavigate();

    const [searchBox,setsearchBox]=useState("");
    const [doctors,setDoctors]=useState([]);
    const [Isloading,setIsloading]=useState(false);
    const [Ispopup,setIspopup]=useState(false);
    const [selectedDoctor,setSelectedDoctor]=useState([]);

    const fetchDoctors=async()=>{
        try{
            setIsloading(true);
            const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getdoctors`)
            if(response.data.doctors){
                setDoctors(response.data.doctors);
            }else{
                setDoctors([]);
            }
        }catch(err){
            console.log(err);
        }finally{setIsloading(false)}
    }

    const DeleteDoctor=async(id)=>{
        try{
            if(Isloading) return;
            setIsloading(true);
            const response=await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/deletedoctor/${id}`);
            if(response.data.success){
                fetchDoctors();
            }
            if(response.data.emessage){
                alert(response.data.message);
            }
        }catch(err){
            console.log(err);
        }finally{setIsloading(false)}
    };

    const fetchDoctorDetails=async(id)=>{
        if(Isloading) return;   
        setIsloading(true);
        try{
            const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getdoctor/${id}`);
            if(response.data.doctor){
                setSelectedDoctor(response.data.doctor);
                setIspopup(true);
            }
        }catch(err){
            console.log(err);
        }finally{setIsloading(false)} 
    };

    const HandleDoctorSearch=async()=>{
        if(Isloading) return;
        setIsloading(true);
        try{
            if(searchBox.trim()===""){
                fetchDoctors();
                return;
            }
            const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/searchdoctors?query=${searchBox}`);
            if(response.data.doctors){
                setDoctors(response.data.doctors);
            }else{
                setDoctors([]);
            }
        }catch(err){
            console.log(err);
        }finally{setIsloading(false)}
    };
    
    useEffect(()=>{
        const delayDebounceFn = setTimeout(() => {
            HandleDoctorSearch();
          }, 800)       
        return () => clearTimeout(delayDebounceFn)
    },[searchBox])  
      

useEffect(()=>{
    fetchDoctors();
},[])


  return (
    <div className="manage-doctors-main">
        <Header/>
        <div className="manage-doctors-body">
            <h1>Doctors</h1>

            <div className="manage-doctor-head">
               
                <input 
                    type="text"
                    value={searchBox}
                    onChange={(e)=>{setsearchBox(e.target.value)}}
                    placeholder='Search Doctors'
                />

                <button onClick={()=>{navigate("/adddoctors")}}>Add Doctors</button>
               
            </div>

            <div className="manage-doctor-view-table">
                <div className="manage-doctor-view-table-con">
                    <table>
                        <thead>
                            <tr>
                                <th>Profile</th>
                                <th>Name</th>
                                <th>Specialization</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map((doc)=>(
                                <tr key={doc._id}>
                                    <td>
                                        <img src={doc.profile_url}alt="Doctor Profile"/>
                                    </td>
                                    <td>{`Dr. ${doc.first_name} ${doc.last_name}`}</td>
                                    <td>{doc.specialization}</td>
                                    <td>
                                        <button onClick={()=>{DeleteDoctor(doc._id)}}>Delete</button>
                                        <button onClick={()=>{fetchDoctorDetails(doc._id)}}>View</button>
                                    </td>
                                </tr>
                            ))}

                            {doctors.length===0&&(
                                <tr>
                                    <td colSpan="4">{Isloading?("Loading..."):("No doctors found.")}</td>
                                </tr>
                            )}  
                        </tbody>
                    </table>
                </div>
            </div>


        </div>
        {Ispopup&&(
            <div className="doctor-popup-main">
                <div className="doctor-popup-con">
                    <div className="doctor-popup-head">
                        <h2>Doctor Details</h2>
                        <button onClick={()=>{setIspopup(false);setSelectedDoctor([])}}>X</button>
                    </div>
                    <div className="doctor-popup-body">
                        <div className="doctor-popup-body-top">
                            <img src={selectedDoctor.profile_url} alt="Doctor Profile"/>
                        </div>
                        <div className="doctor-popup-body-bottom">
                            <p><strong>Name:</strong> {`Dr. ${selectedDoctor.first_name} ${selectedDoctor.last_name}`}</p>
                            <p><strong>Specialization:</strong> {selectedDoctor.specialization}</p>
                            <p><strong>Degree:</strong> {selectedDoctor.degree}</p>
                            <p><strong>Experience:</strong> {selectedDoctor.experience} years</p>
                            <p><strong>City:</strong> {selectedDoctor.city}</p>
                            <p><strong>Email:</strong> {selectedDoctor.email}</p>
                            <p><strong>Phone No:</strong> {selectedDoctor.phone_no}</p>
                        </div>
                    </div>
                </div>
            </div>  
        )}


        <div className="admindash-router">
        <div className="router-con-main">
            <div className="router-con" onClick={()=>{navigate("/admindashboard")}}>
            <img src="https://cdn-icons-png.flaticon.com/128/8899/8899687.png" alt="home icons" />

            </div>
            
            <div className="router-con">
                <img src="https://cdn-icons-png.flaticon.com/128/17385/17385021.png" alt="Schedule icons" />
                
            </div>
            <div className="router-con-active" onClick={()=>{navigate("/managedoctors")}}>
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

export default ManageDoctors
