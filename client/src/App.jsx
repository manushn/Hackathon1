import { lazy } from "react"

import { BrowserRouter as Router, Routes, Route ,Navigate} from 'react-router-dom';
import ProtectedRoute from "./components/protection/ProtectedRoute";
import ClientProtectionRoute from "./components/protection/ClientProtectionRoute";

const HomePage=lazy(()=>import("./Pages/Home"));
const LoginPage=lazy(()=>import("./Pages/Login"))
const AdminPage=lazy(()=>import("./Pages/admin/AdminDash"))
const AdminDoctorManage=lazy(()=>import("./Pages/admin/ManageDoctors"));
const AdminDoctorAdding=lazy(()=>import("./Pages/admin/DoctorAdding"));

const Verifyaccound=lazy(()=>import("./Pages/clientp/Verifyaccound"));
const Bookappointment=lazy(()=>import("./Pages/clientp/BookAppoinments"));


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

        <Route path="/verifyaccount" element={<Verifyaccound/>}/>
        <Route path="/bookappointment" element={<Bookappointment/>}/>

        <Route path="*" element={<Navigate to="/"/>}/>  

      </Routes>
      
    </Router>
  )
}

export default App
