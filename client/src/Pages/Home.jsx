import React from 'react'
import "./css/Home.css"
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate=useNavigate();
  return (
    <div>
      <div className="home-full-main">
        <div className="home-head">
            <div className="head-logo">
                <img src="/images/mcarelogo.png" alt="Logo" />
                <h2>MCare</h2>
            </div>
            <div className="head-btn">
              <button onClick={()=>{navigate("/login")}}>Login</button>
            </div>
        </div>

        <div className="home-body1">
          <div className="home-body1-left">
            <h1>Find Your Doctor And make an appoinment.</h1>
            <div className="appoinment-btn">
                <h3>Book an appoinment </h3>
                <h2>{"->"}</h2>
            </div>
          </div>

          <div className="home-body1-right">
            <img src="/images/Doctordash.png" alt="doctor" />
          </div>
        </div>

        <div className="home-body2">
          <div className="home-body2-title">
            <h2>Browse By Specialties</h2>
          </div>
          <div className="home-body2-bottom">
            <div className="home-body2-imgf">
              <img src="images/general.webp" alt="general" />
              <p>General</p>
            </div>

            <div className="home-body2-imgf">
              <img src="images/dermatology.webp" alt="general" />
              <p>Dermatology</p>
            </div>

            <div className="home-body2-imgf">
              <img src="images/ent.webp" alt="general" />
              <p>ENT</p>
            </div>

            <div className="home-body2-imgf">
              <img src="images/gynacology.webp" alt="general" />
              <p>Gynacology</p>
            </div>

            <div className="home-body2-imgf">
              <img src="images/cardiology.webp" alt="general" />
              <p>Cardiology</p>
            </div>
            
            <div className="home-body2-imgf">
              <img src="images/dentist.webp" alt="general" />
              <p>Dentist</p>
            </div>
            
            <div className="home-body2-imgf">
              <img src="images/neurology.webp" alt="general" />
              <p>Neurology</p>
            </div>
            
            <div className="home-body2-imgf">
              <img src="images/disbetics.webp" alt="general" />
              <p>Diabetology</p>
            </div>
            
            <div className="home-body2-imgf">
              <img src="images/endrocrinilogy.webp" alt="general" />
              <p>Endocrinology</p>
            </div>
            
            
            <div className="home-body2-imgf">
              <img src="images/gastero.webp" alt="general" />
              <p>Gastroenterology</p>
            </div>
            
            <div className="home-body2-imgf">
              <img src="images/infectionusdisease.webp" alt="general" />
              <p>Infectious Disease</p>
            </div>

            <div className="home-body2-imgf">
              <img src="images/lapproscopic.webp" alt="general" />
              <p>General & Laproscopic</p>
            </div>
            
            <div className="home-body2-imgf">
              <img src="images/mediclonology.webp" alt="general" />
              <p>MedicalnOnology</p>
            </div>

            <div className="home-body2-imgf">
              <img src="images/neprology.webp" alt="general" />
              <p>Nephrology</p>
            </div>

            <div className="home-body2-imgf">
              <img src="images/ophthalmology.webp" alt="general" />
              <p>Ophthalmology</p>
            </div>

            <div className="home-body2-imgf">
              <img src="images/ortho.webp" alt="general" />
              <p>Orthopaedics</p>
            </div>

            <div className="home-body2-imgf">
              <img src="images/physictrics.webp" alt="general" />
              <p>Psychiatry</p>
            </div>

            <div className="home-body2-imgf">
              <img src="images/paediatrics.webp" alt="general" />
              <p>Paediatrics</p>
            </div>

            <div className="home-body2-imgf">
              <img src="images/psychology.webp" alt="general" />
              <p>Psychology</p>
            </div>

            <div className="home-body2-imgf">
              <img src="images/pulmonology.webp" alt="general" />
              <p>Pulmonology/ Resipiratory</p>
            </div>



          </div>
          
        </div>

        <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <h2>MCare</h2>
          <p>For educational purposes only. Hackathon project.</p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/#specialties">Specialties</a></li>
            <li><a href="/#appointment">Appointments</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contact</h3>
          <p>Email: support@mcare.com</p>
          <p>Phone: +91 6382360895</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MCare | Built during Hackathon</p>
      </div>
    </footer>
      </div>
    </div>
  )
}

export default Home
