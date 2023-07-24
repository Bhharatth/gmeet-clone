import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MeetingPage from "./components/MeetingPage";
import LandingPage from "./components/LandingPage";

function App() {
  const [count, setCount] = useState(0)

  return (
   <Router>
    <Routes>
      <Route path="/meeting/:roomId" element={<MeetingPage/>}/>
      <Route path="*" element={<LandingPage/>}/>
    </Routes>
   </Router>
  )
}

export default App
