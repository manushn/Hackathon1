import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, CheckCircle, Clock, User, Mail, Phone, MapPin } from 'lucide-react';
import Header from '../../components/header';
import Footers from '../../components/Footers';
import './css/AdminDash.css';
import './css/ManageAppoinments.css';

function ManageAppointments() {
  const navigate = useNavigate();
  const Token = sessionStorage.getItem('Token');

  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDays, setAvailableDays] = useState([]);
  const [isPopup, setIsPopup] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);


  const generate60Days = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = [];

    for (let i = 30; i > 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(date);
    }

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }

    return days;
  };

  useEffect(() => {
    setAvailableDays(generate60Days());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setSelectedDate(today);
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/getappointments`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.appointments) {
        setAppointments(response.data.appointments);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      console.log(err);
      if (err.response?.data?.InvalidToken) {
        sessionStorage.clear();
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate && appointments.length > 0) {
      const filtered = appointments.filter((apt) => {
        const aptDate = new Date(apt.date);
        aptDate.setHours(0, 0, 0, 0);
        return isSameDay(aptDate, selectedDate);
      });
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments([]);
    }
  }, [selectedDate, appointments]);


  const deleteAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?'))
      return;

    try {
      if (isLoading) return;
      setIsLoading(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/deleteappointment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        fetchAppointments();
        setIsPopup(false);
        alert('Appointment deleted successfully');
      }
    } catch (err) {
      console.log(err);
      alert('Failed to delete appointment');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDayOfWeek = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isToday = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isSameDay(date, today);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const viewAppointmentDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsPopup(true);
  };

  const getAppointmentCountForDate = (date) => {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      aptDate.setHours(0, 0, 0, 0);
      return isSameDay(aptDate, date);
    }).length;
  };

  return (
    <div className="manage-appointments-main">
      <Header />
      <div className="manage-appointments-body">
        <h1>Manage Appointments</h1>

        <div className="appointments-stats">
          <div className="stat-card">
            <h3>Total Appointments</h3>
            <p>{appointments.length}</p>
          </div>
          <div className="stat-card">
            <h3>Today's Appointments</h3>
            <p>
              {
                appointments.filter((apt) =>
                  isToday(new Date(apt.date))
                ).length
              }
            </p>
          </div>
          <div className="stat-card">
            <h3>Selected Date</h3>
            <p>
              {selectedDate
                ? getAppointmentCountForDate(selectedDate)
                : 0}
            </p>
          </div>
        </div>

        <div className="appointments-calendar-section">
          <h2>Select Date</h2>
          <div className="calendar-container">
            {availableDays.map((day, index) => {
              const isSelected = isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);
              const appointmentCount = getAppointmentCountForDate(day);

              return (
                <button
                  key={index}
                  onClick={() => handleDateSelect(day)}
                  className={`calendar-day ${isSelected ? 'selected' : ''} ${
                    isTodayDate ? 'today' : ''
                  } ${appointmentCount > 0 ? 'has-appointments' : ''}`}
                >
                  <span className="day-name">{getDayOfWeek(day)}</span>
                  <span className="day-number">{day.getDate()}</span>
                  {isTodayDate && !isSelected && (
                    <span className="today-label">Today</span>
                  )}
                  {appointmentCount > 0 && (
                    <span className="appointment-badge">{appointmentCount}</span>
                  )}
                  {isSelected && (
                    <CheckCircle size={14} className="check-icon" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="appointments-list-section">
          <h2>
            Appointments for {selectedDate ? formatDate(selectedDate) : 'Select a date'}
          </h2>
          
          {isLoading ? (
            <p className="loading-text">Loading appointments...</p>
          ) : filteredAppointments.length > 0 ? (
            <div className="appointments-grid">
              {filteredAppointments.map((apt) => (
                <div key={apt._id} className="appointment-card">
                  <div className="appointment-header">
                    <h3>{apt.patientName}</h3>
                    <span className="appointment-time">
                      <Clock size={16} />
                      {apt.slotName}
                    </span>
                  </div>
                  <div className="appointment-details">
                    <p>
                      <Mail size={14} />
                      {apt.patientEmail}
                    </p>
                    <p>
                      <Phone size={14} />
                      {apt.contactNo}
                    </p>
                  </div>
                  <div className="appointment-actions">
                    <button
                      className="btn-view"
                      onClick={() => viewAppointmentDetails(apt)}
                    >
                      View Details
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => deleteAppointment(apt._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-appointments">No appointments for this date</p>
          )}
        </div>
      </div>

      {isPopup && selectedAppointment && (
        <div className="doctor-popup-main">
          <div className="doctor-popup-con-appointment-popup">
            <div className="doctor-popup-head">
              <h2>Appointment Details</h2>
              
            </div>
            <div className="doctor-popup-body">
              <div className="appointment-detail-section">
                <h3>Patient Information</h3>
                <div className="detail-item">
                  <User size={18} />
                  <div>
                    <label>Name:</label>
                    <p>{selectedAppointment.patientName}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <Mail size={18} />
                  <div>
                    <label>Email:</label>
                    <p>{selectedAppointment.patientEmail}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <Phone size={18} />
                  <div>
                    <label>Contact:</label>
                    <p>{selectedAppointment.contactNo}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <MapPin size={18} />
                  <div>
                    <label>Address:</label>
                    <p>{selectedAppointment.address}</p>
                  </div>
                </div>
              </div>

              <div className="appointment-detail-section">
                <h3>Appointment Details</h3>
                <div className="detail-item">
                  <Calendar size={18} />
                  <div>
                    <label>Date:</label>
                    <p>{formatDate(new Date(selectedAppointment.date))}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <Clock size={18} />
                  <div>
                    <label>Time Slot:</label>
                    <p>{selectedAppointment.slotName}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <User size={18} />
                  <div>
                    <label>Doctor:</label>
                    <p>{selectedAppointment.doctor_name}</p>
                  </div>
                </div>
              </div>

              <div className="popup-actions">
                <button
                  className="btn-close"
                  onClick={() => {
                    setIsPopup(false);
                    setSelectedAppointment(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="admindash-router">
        <div className="router-con-main">
          <div className="router-con" onClick={() => navigate('/admindashboard')}>
            <img
              src="https://cdn-icons-png.flaticon.com/128/8899/8899687.png"
              alt="home icons"
            />
          </div>

          <div className="router-con-active">
            <img
              src="https://cdn-icons-png.flaticon.com/128/17385/17385021.png"
              alt="Schedule icons"
            />
          </div>
          <div className="router-con" onClick={() => navigate('/managedoctors')}>
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
      <Footers />
    </div>
  );
}

export default ManageAppointments;