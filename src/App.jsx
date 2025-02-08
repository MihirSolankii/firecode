import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'
import { AuthProvider } from './context/AuthContext'
import { Route, Router, Routes } from 'react-router-dom'
import Login from './component/Login'
import Signup from './component/Signup'
import SignupSuccess from './component/SignupSuccess'
import ProtectedRoute from './routes/ProtectedRoutes'
import DashBoard from './component/DashBoard'
import AdminPage from './component/AdminPage'
import AdminRoute from './routes/AdminRoute'
import NotFound from './component/NotFound'
import Notpage from './component/Notpage'
import LeetifyLanding from './HomePageComponent/Home'
import ProblemList from './component/ProblemList'
import CodeRoom from './sharing/CodeRoom'
import RoomSelection from './component/ws/RoomSelection'
import CollaborationRoom from './component/ws/CollaborationRoom'
export const API_URL = "http://localhost:3000";
function App() {
  const token = localStorage.getItem('token')
  return (
<AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/signup-success" element={<SignupSuccess />} /> */}
        <Route path="/" element={<DashBoard/>}/>
        <Route path="/protected" element={<NotFound/>}/>
        <Route path ="*" element={<Notpage/>}/>
        <Route
          path="/dashboard"
          element={
            
              <DashBoard/>
           
          }
        />
         <Route 
          path="/room-selection/:roomId" 
          element={<RoomSelection token={token} />} 
        />
         <Route 
          path="/collaboration/:roomId" 
          element={<CollaborationRoom token={token} />} 
        />
        {/* <Route path='/sharing' element={<CodeRoom/>}/> */}
        <Route path='/dashboard/:id' element={<ProblemList/>}/>

        <Route
          path="/admin"
          element={
           <AdminRoute>
              <AdminPage />
              </AdminRoute>
          }
        />
      </Routes>
    </AuthProvider>
    
  )
}

export default App
