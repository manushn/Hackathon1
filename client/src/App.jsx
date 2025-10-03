import { lazy } from "react"

import { BrowserRouter as Router, Routes, Route ,Navigate} from 'react-router-dom';
import ProtectedRoute from "./components/protection/ProtectedRoute";

const HomePage=lazy(()=>import("./Pages/Home"));
const LoginPage=lazy(()=>import("./Pages/Login"))
const AdminPage=lazy(()=>import("./Pages/admin/AdminDash"))
const AdminDoctorManage=lazy(()=>import("./Pages/admin/ManageDoctors"));
const AdminDoctorAdding=lazy(()=>import("./Pages/admin/DoctorAdding"));


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage/>}/>

        <Route path='/admindashboard' element={
          //<ProtectedRoute>
            <AdminPage/>
          //</ProtectedRoute>

        }/>

        <Route path='/managedoctors' element={
          //<ProtectedRoute>
            <AdminDoctorManage/>
          //</ProtectedRoute>

        }/>

        <Route path='/adddoctors' element={
          //<ProtectedRoute>
            <AdminDoctorAdding/>
          //</ProtectedRoute>

        }/>

      </Routes>
      
    </Router>
  )
}

export default App
