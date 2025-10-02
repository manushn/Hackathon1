import { lazy } from "react"

import { BrowserRouter as Router, Routes, Route ,Navigate} from 'react-router-dom';

const HomePage=lazy(()=>import("./Pages/Home"));
const LoginPage=lazy(()=>import("./Pages/Login"))

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
      </Routes>
    </Router>
  )
}

export default App
