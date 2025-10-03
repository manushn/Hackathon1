import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import "./css/AdminDash.css";
import "./css/AddDoctors.css";

function DoctorAdding() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [phone_no, setPhoneNo] = useState("");
  const [experience, setExperience] = useState("");
  const [degree, setDegree] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [profile, setProfile] = useState(null);

  const [Isloading, setIsloading] = useState(false);

  const navigate = useNavigate();

   const handlePhoneNumber = (e) => {
    const value = e.target.value;

    
    if (/^\d*$/.test(value)) {
        if(phone_no.length<=10){
            setPhoneNo(value);
        }
    }
  };

  const handleExperience = (e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
        if(experience.length<=2){
            setExperience(value);
        }
      
    }
  }

const handleAddDoctor = async () => {
    if(Isloading) return;
  try {
    const formData = new FormData();
    formData.append("first_name", firstname);
    formData.append("last_name", lastname);
    formData.append("city", city);
    formData.append("email", email);
    formData.append("phone_no", phone_no);
    formData.append("experience", experience);
    formData.append("degree", degree);
    formData.append("specialization", specialization);

    if (profile) {
      formData.append("profile", profile);
    }
    setIsloading(true);
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/adddoctor`, 
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.success) {
        alert("Doctor added successfully");
        navigate("/managedoctors");
     
    } else {
      alert(response.data.emessage || response.data.message);
    }
  } catch (error) {
    console.error(error);
    alert("Error adding doctor: " + error.response?.data?.message || error.message);
  }finally{setIsloading(false)}
};
  return (
    <div className="doctor-add-main">
      <Header />

      <div className="doctor-add-body">
        
        <div className="doctor-add-body-head">
            <h2>Add Doctors</h2>
            <button onClick={()=>{navigate("/managedoctors")}}>Back</button>
        </div>

        <div className="doctor-add-form-main">
          <div className="doctor-add-form">
            
            <div className="doctor-add-form-top">
              
              
                <div>
                  <img
                    src={
                      profile
                        ? URL.createObjectURL(profile)
                        : "/upload/defauladoc.png"
                    }
                    alt="profile"
                    
                  />
                </div>
                
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={(e) => setProfile(e.target.files[0])}
                  />
                  
               
              
            </div>

            
            <div className="doctor-add-form-bottom">
              <div className="dadd-form-con">
                <label>Prefix</label>
                <input type="text" value="Dr" disabled />
              </div>

              <div className="dadd-form-con">
                <label>First Name</label>
                <input
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </div>

              <div className="dadd-form-con">
                <label>Last Name</label>
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
              </div>

              <div className="dadd-form-con">
                <label>City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="dadd-form-con">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="dadd-form-con">
                <label>Phone No</label>
                <input
                  type="text"
                  value={phone_no}
                  maxLength={10}
                  onChange={(e) => handlePhoneNumber(e)}
                />
              </div>

              <div className="dadd-form-con">
                <label>Experience (in years)</label>
                <input
                  type="text"
                  value={experience}
                  maxLength={2}
                  onChange={(e) => handleExperience(e)}
                />
              </div>

              <div className="dadd-form-con">
                <label>Degree</label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value.toUpperCase())}
                />
              </div>

              <div className="dadd-form-con">
                <label>Specialization</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                />
              </div>
            </div>

            
            <div className="dadd-form-btn">
              <button onClick={()=>{handleAddDoctor()}}>Add Doctor</button>
            </div>
          </div>
        </div>
      </div>

      
      <div className="admindash-router">
        <div className="router-con-main">
          <div className="router-con" onClick={() => navigate("/admindashboard")}>
            <img
              src="https://cdn-icons-png.flaticon.com/128/8899/8899687.png"
              alt="home icons"
            />
          </div>

          <div className="router-con">
            <img
              src="https://cdn-icons-png.flaticon.com/128/17385/17385021.png"
              alt="Schedule icons"
            />
          </div>

          <div
            className="router-con-active"
            onClick={() => navigate("/managedoctors")}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/128/3952/3952988.png"
              alt="Doctors icons"
            />
          </div>

          <div className="router-con">
            <img
              src="https://cdn-icons-png.flaticon.com/128/3953/3953226.png"
              alt="Settings icons"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorAdding;
