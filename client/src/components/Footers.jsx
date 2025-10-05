import React from 'react'
import "../Pages/css/Home.css"
function Footers() {
  return (
    <div>
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
          <p>Email: mcareonline24@gmail.com</p>
          <p>Phone: +91 6382360895</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MCare | Built during Hackathon</p>
      </div>
    </footer>
      
    </div>
  )
}

export default Footers
