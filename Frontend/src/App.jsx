import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import "./style.scss"
const App = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login />}/>
      <Route path='/register' element={<Register />}/>
    </Routes>
  )
}

export default App
