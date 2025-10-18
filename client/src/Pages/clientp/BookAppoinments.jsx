import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import "./css/bookappoinments.css"

import Header from '../../components/header'
import { useState } from 'react'
import { useEffect } from 'react';
import { Calendar, CheckCircle } from 'lucide-react';
import Footers from "../../components/Footers";

const Token=sessionStorage.getItem("Token");



function BookAppoinments() {

const navigate=useNavigate();

const [searchBox,setSearchBox]=useState("General");
const [doctors,setDoctors]=useState([]);

const [SelectedDoctorId,setSelectedDoctorId]=useState(null);
const [Ispopup,setIspopup]=useState(false);
const [loadingBooking,setLoadingBooking]=useState(false);

const [selectedDate, setSelectedDate] = useState(null);
const [availableDays, setAvailableDays] = useState([]);
const [selectedSlot, setSelectedSlot] = useState(null);


const generate30Days = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const now = new Date();
    const days = [];

      const startDate = new Date(today);
      if (now.getHours() >= 19) {
        startDate.setDate(startDate.getDate() + 1);
      }


    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
};

useEffect(() => {
    setAvailableDays(generate30Days());
}, []);

const searchDoctors=async()=>{
    try{
        if(searchBox.length<1){
            setSearchBox("General");
            return;
        } 
        const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/csearchdoctors?query=${searchBox}`,
            {
          headers: {
            Authorization: `Bearer ${Token}`,
            "Content-Type": "application/json",
          },
        }

        );
        if(response.data.InvalidToken){
            console.log("Invalid Token dedected Loging out...")
            sessionStorage.removeItem("Token")
            sessionStorage.removeItem("Role")
            sessionStorage.removeItem("Username")
            navigate("/")

        }
        if(response.data.doctors){
            setDoctors(response.data.doctors);
        }else{
            setDoctors([]);
        }
        
    }catch(err){
        console.log(err);
    }
}

    useEffect(()=>{
        const delayDebounceFn = setTimeout(() => {
            searchDoctors();
          }, 800)       
        return () => clearTimeout(delayDebounceFn)
    },[searchBox]) 


    useEffect(()=>{
        if(sessionStorage.getItem("presearch")){
            setSearchBox(sessionStorage.getItem("presearch"));
            sessionStorage.removeItem("presearch");
        }
        searchDoctors();
    },[])

    
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        });
    };

    const getDayOfWeek = (date) => {
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    const isSameDay = (date1, date2) => {
        if (!date1 || !date2) return false;
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    };

    const isToday = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return isSameDay(date, today);
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setSelectedSlot(null); 
    };

    const handleBookAppointment = (doctorId) => {
        setSelectedDoctorId(doctorId);
        setIspopup(true);
        setSelectedDate(null);
        setSelectedSlot(null);
    };

    const handleConfirmBooking = async() => {
        if (selectedDate && selectedSlot) {
            if(loadingBooking) return;
            setLoadingBooking(true);
            const date = new Date(selectedDate);
            const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

            try{
                const response= await axios.post(`${import.meta.env.VITE_BACKEND_URL}/book-appointment`,{
                    doc_id: SelectedDoctorId,
                    date: formatted,
                    slot: selectedSlot,
                    patientemail: sessionStorage.getItem("Username"),
                },
                {
                    headers: {
                    Authorization: `Bearer ${Token}`,
                    "Content-Type": "application/json",
                    },
                }
            );

            if(response.data.InvalidToken){
            console.log("Invalid Token dedected Loging out...")
            sessionStorage.removeItem("Token")
            sessionStorage.removeItem("Role")
            sessionStorage.removeItem("Username")
            navigate("/")

        }
                if(response.data.emessage){
                    alert(response.data.emessage)
                }

                if(response.data.success){
                    alert(`Appointment booked for ${formatDate(selectedDate)} at ${selectedSlot}`);
                    setIspopup(false);
                    setSelectedDoctorId(null);
                    setSelectedDate(null);
                    setSelectedSlot(null);
                    }

                }catch(err){
                    console.log("Error in booking appointment:",err);
                }finally{
                    setLoadingBooking(false);
                }
            
        } else {
            alert('Please select both date and time slot');
        }
    };

    const timeSlots = [
        "10:00 AM - 01:00 PM",
        "04:00 PM - 08:00 PM"
    ];
    let filteredSlots = [...timeSlots];

    if (selectedDate) {
        const now = new Date();
        const isSelectedToday =
        selectedDate.getDate() === now.getDate() &&
        selectedDate.getMonth() === now.getMonth() &&
        selectedDate.getFullYear() === now.getFullYear();

        if (isSelectedToday) {
            const currentHour = now.getHours();

            if (currentHour >= 12) {
                filteredSlots = filteredSlots.filter(slot => slot !== "10:00 AM - 01:00 PM");
            }

            if (currentHour >= 19) {
                filteredSlots = [];
            }
            }
        }

  return (
    <div className="bookappoinments-main">
        <Header/>
        <div className="bookappoinments-con">
            <h2>Find a Doctor</h2>
            <p>Search by Doctors name , speciality to find the right care for you </p>
        
            <div className="bookappoinments-search">
                <img src="https://cdn-icons-png.flaticon.com/128/751/751381.png" alt="search" />
                <input 
                    type="text" 
                    placeholder='Search by Doctors name , speciality'
                    value={searchBox}
                    onChange={(e)=>{setSearchBox(e.target.value)}}
                    />  
            </div>

            <div className="bookappoinments-speciality">
                <h3>Browse by Speciality</h3>
                <div className="appoinments-speciality-con">
                    <div className="speciality-card" onClick={()=>{setSearchBox("General")}}>
                        <p>General</p>
                    </div>
                    <div className="speciality-card" onClick={()=>{setSearchBox("ENT")}}>
                        <p>ENT</p>
                    </div>
                    <div className="speciality-card" onClick={()=>{setSearchBox("Pediatrics")}}>
                        <p>Pediatrics</p>
                    </div>
                    <div className="speciality-card" onClick={()=>{setSearchBox("Dermatology")}}>
                        <p>Dermatology</p>
                    </div>
                    <div className="speciality-card"  onClick={()=>{setSearchBox("Gynacology")}}>
                        <p>Gynacology</p>
                    </div>
                    <div className="speciality-card" onClick={()=>{setSearchBox("Cardiology")}}>
                        <p>Cardiology</p>
                    </div>
                    <div className="speciality-card" onClick={()=>{setSearchBox("Neurology")}}>
                        <p>Neurology</p>
                    </div>
                    <div className="speciality-card" onClick={()=>{setSearchBox("Psychiatry")}}>
                        <p>Psychiatry</p>
                    </div>
                    <div className="speciality-card" onClick={()=>{setSearchBox("Orthopedics")}}>
                        <p>Orthopedics</p>
                    </div>
                    <div className="speciality-card" onClick={()=>{setSearchBox("Urology")}}>
                        <p>Urology</p>
                    </div>
                    <div className="speciality-card" onClick={()=>{setSearchBox("Psychology")}}>
                        <p>Psychology</p>
                    </div>
                    <div className="speciality-card" onClick={()=>{setSearchBox("Dentist")}}>
                        <p>Dentist</p>
                    </div>
                    <div className="speciality-card" onClick={()=>{setSearchBox("Diabetology")}}>
                        <p>Diabetology</p>
                    </div>
                    <div className="speciality-card" onClick={()=>{setSearchBox("Endocrinology")}}>
                        <p>Endocrinology</p>
                    </div>
                    <div className="speciality-card" onClick={()=>{setSearchBox("Gastroenterology")}}>
                        <p>Gastroenterology</p>
                    </div>
                    <div className="speciality-card" onClick={()=>{setSearchBox("Laproscopic")}}>
                        <p>Laproscopic</p>
                    </div>
                    <div className="speciality-card" onClick={()=>{setSearchBox("Infectious Disease")}}>
                        <p>Infectious Disease</p>
                    </div>
                    <div className="speciality-card" onClick={()=>{setSearchBox("Medical onlogy")}}>
                        <p>Medical Oncology</p>
                    </div>
                    <div className="speciality-card" onClick={()=>{setSearchBox("Nephrology")}}>
                        <p>Nephrology</p>
                    </div>
                    <div className="speciality-card" onClick={()=>{setSearchBox("Respiratory")}}>
                        <p>Respiratory</p>
                    </div>
                </div>
            </div>

            <div className="our-doctors-main">
                <h3>Our Doctors</h3>
                <div className="our-doctors-con">
                    {doctors.length>0?(
                        <>
                        {doctors.map((doc)=>(
                            <div className="doc-card" key={doc._id}>
                                <div className="doc-card-img">
                                    <img src={doc.profile_url} alt="doctor" />
                                </div>
                                <div className="doc-card-con">
                                    <h3>{`Dr. ${doc.first_name} ${doc.last_name}`}</h3>
                                    <p>{`${doc.specialization}`}</p>
                                    <p>{`Experience: ${doc.experience}`}</p>
                                    <button onClick={() => handleBookAppointment(doc._id)}>
                                        Book Appointment
                                    </button>
                                </div>
                            </div>
                        ))}
                        </>
                    ):(
                    <p>No doctors found</p>
                    )}
                </div>
            </div>

            {Ispopup && (
                <div className="doctor-popup-main">
                    <div className="doctor-popup-con">
                        <div className="doctor-popup-head">
                            <h2>Pick A Slot</h2>
                            <button 
                                onClick={()=>{setIspopup(false);setSelectedDoctorId(null)}}
            
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="doctor-popup-body" >
                            
                            <div className="doctor-popup-body-calander" style={{ flex: 2, maxHeight: '60vh', overflowY: 'auto' }}>
                                <h3 style={{ marginBottom: '15px', color: '#1976d2' }}>Select Date</h3>
                                <div style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                                    gap: '10px'
                                }}>
                                    {availableDays.map((day, index) => {
                                        const isSelected = isSameDay(day, selectedDate);
                                        const isTodayDate = isToday(day);
                                        
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => handleDateSelect(day)}
                                                style={{
                                                    position: 'relative',
                                                    padding: '12px 8px',
                                                    borderRadius: '8px',
                                                    border: isSelected ? '2px solid #1976d2' : '1px solid #ddd',
                                                    backgroundColor: isSelected 
                                                        ? '#1976d2' 
                                                        : isTodayDate 
                                                            ? '#fff3cd' 
                                                            : 'white',
                                                    color: isSelected ? 'white' : '#333',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    transition: 'all 0.2s',
                                                    fontFamily: 'inherit'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!isSelected) {
                                                        e.currentTarget.style.transform = 'scale(1.05)';
                                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'scale(1)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                            >
                                                <span style={{ 
                                                    fontSize: '10px', 
                                                    fontWeight: '500',
                                                    color: isSelected ? 'rgba(255,255,255,0.8)' : '#666'
                                                }}>
                                                    {getDayOfWeek(day)}
                                                </span>
                                                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                                    {day.getDate()}
                                                </span>
                                                {isTodayDate && !isSelected && (
                                                    <span style={{ fontSize: '9px', color: '#f59e0b', fontWeight: '600' }}>
                                                        Today
                                                    </span>
                                                )}
                                                {isSelected && (
                                                    <CheckCircle 
                                                        size={14} 
                                                        style={{ 
                                                            position: 'absolute', 
                                                            top: '4px', 
                                                            right: '4px',
                                                            color: 'white'
                                                        }}
                                                    />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            
                            <div className="doctor-popup-body-slot" style={{ 
                                flex: 1, 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '15px'
                            }}>
                                <h3 style={{ marginBottom: '10px', color: '#1976d2' }}>Select Time Slot</h3>
                                
                                {selectedDate ? (
                                    <>
                                        <div style={{
                                            padding: '12px',
                                            backgroundColor: '#e3f2fd',
                                            borderRadius: '8px',
                                            marginBottom: '10px'
                                        }}>
                                            <p style={{ fontSize: '12px', color: '#1976d2', margin: 0 }}>
                                                Selected Date:
                                            </p>
                                            <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '4px 0 0 0' }}>
                                                {formatDate(selectedDate)}
                                            </p>
                                        </div>

                                        {filteredSlots.map((slot, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedSlot(slot)}
                                                style={{
                                                    padding: '15px',
                                                    borderRadius: '8px',
                                                    border: selectedSlot === slot ? '2px solid #1976d2' : '1px solid #ddd',
                                                    backgroundColor: selectedSlot === slot ? '#1976d2' : 'white',
                                                    color: selectedSlot === slot ? 'white' : '#333',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                    transition: 'all 0.2s',
                                                    fontFamily: 'inherit'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (selectedSlot !== slot) {
                                                        e.currentTarget.style.borderColor = '#1976d2';
                                                        e.currentTarget.style.backgroundColor = '#f5f5f5';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (selectedSlot !== slot) {
                                                        e.currentTarget.style.borderColor = '#ddd';
                                                        e.currentTarget.style.backgroundColor = 'white';
                                                    }
                                                }}
                                            >
                                                {slot}
                                            </button>
                                        ))}

                                        <button
                                            onClick={handleConfirmBooking}
                                            disabled={!selectedDate || !selectedSlot}
                                            style={{
                                                marginTop: '20px',
                                                padding: '15px',
                                                borderRadius: '8px',
                                                border: 'none',
                                                backgroundColor: selectedDate && selectedSlot ? '#4caf50' : '#ccc',
                                                color: 'white',
                                                cursor: selectedDate && selectedSlot ? 'pointer' : 'not-allowed',
                                                fontSize: '16px',
                                                fontWeight: 'bold',
                                                transition: 'all 0.2s',
                                                fontFamily: 'inherit'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (selectedDate && selectedSlot) {
                                                    e.currentTarget.style.backgroundColor = '#45a049';
                                                    e.currentTarget.style.transform = 'scale(1.02)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (selectedDate && selectedSlot) {
                                                    e.currentTarget.style.backgroundColor = '#4caf50';
                                                    e.currentTarget.style.transform = 'scale(1)';
                                                }
                                            }}
                                        >
                                            {loadingBooking ? 'Booking...' : 'Confirm Booking'}
                                        </button>
                                    </>
                                ) : (
                                    <div style={{
                                        padding: '30px',
                                        textAlign: 'center',
                                        color: '#999',
                                        backgroundColor: '#f9f9f9',
                                        borderRadius: '8px'
                                    }}>
                                        <Calendar size={40} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
                                        <p>Please select a date first</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        <Footers/>
    </div>
  )
}

export default BookAppoinments