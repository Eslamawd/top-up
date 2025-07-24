
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { AnimatePresence } from 'motion/react'
import { AuthProvider } from './context/AuthContext'
import NotFound from './Pages/NotFound'


import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import ResetPassword from './Pages/ResetPassword'
import AdminPanel from './Pages/AdminPanal'
import Services from './Pages/Services'
import ServiceDetail from './Pages/ServiceDetail'

import Checkout from './Pages/Checkout'
import Account from './Pages/Account'
import Payment from './Pages/Payment'
import { User } from 'lucide-react'
import UserRoute from './components/UserRoute'
import Categories from './Pages/Categories'
import CategoriesDetail from './Pages/CategoriesDetail'
import SealsPanel from './Pages/SealsPanel'
import StreamsDetail from './Pages/StreamsDetail'
import MySubscriptions from './Pages/MySubscriptions'

function App() {


  return (
    <>
    <AuthProvider>
                  <BrowserRouter>
                 
                    <AnimatePresence mode="wait">
                      <Routes>
                       
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/services/:id" element={<ServiceDetail />} />
                        <Route path="/categories/:id" element={<CategoriesDetail />} />
                        <Route path="/categories/" element={<Categories/>} />
                        <Route path="/streams/:id" element={<StreamsDetail />} />

                       
                        <Route element={
                          <UserRoute />
                        }>
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/my-subscriptions" element={<MySubscriptions />} />
                        <Route path="/payment" element={<Payment/>} />
                        </Route>

                        
                     
                        
                        <Route path="/reset-password" element={<ResetPassword />} />

                             

                         <Route path="/admin/*" element={
                        
                            <AdminPanel />
                          
                        } />
                         <Route path="/seals/*" element={
                        
                            <SealsPanel/>
                          
                        } />

                     

                     
                    
                        
                        {/* 404 route */}
                        <Route path="*" element={<NotFound/>} />
                    
                      </Routes>
                    </AnimatePresence>
                  
                  </BrowserRouter>
                  </AuthProvider>

    </>
  )
}

export default App
