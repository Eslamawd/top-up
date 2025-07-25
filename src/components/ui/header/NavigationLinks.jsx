import React from 'react' 
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Settings, User, ShoppingBag, MessageCircle, LogOut, LogIn } from 'lucide-react';
import { Button } from "../button";

import { useAuth } from '../../../context/AuthContext';


function NavigationLinks() {

    const navegate = useNavigate();

    const { user, logout } = useAuth();



     const handleWhatsAppRedirect = () => {
               window.open(`https://wa.me/`, '_blank');
           };


    const handleLogout = () => { 
       logout().then(() => {
       navegate('/'); // Redirect to home page
       }).catch((error) => {
        console.error('Logout failed:', error);
      // Optionally, you can show an error message to the user
        alert('Logout failed. Please try again.');
       });
            };

  return (
    <nav className="hidden md:flex items-center space-x-4">
     
   
      {user && user?.role === 'admin' ? (
        <Link to="/admin" className=' hover:text-white hover:bg-blue-950 font-medium flex items-center mt-auto rounded-full border border-gray-400 px-4 py-2 w-fit'>
            <Settings className="h-4 w-4" />
            <span>Admin</span>
        
        </Link>
      ) : user?.role === 'seals' ? (
          <Link to="/seals" className=' hover:text-white hover:bg-blue-950 font-medium flex items-center mt-auto rounded-full border border-gray-400 px-4 py-2 w-fit'>
            <Settings className="h-4 w-4" />
            <span>Seller</span>
      
        </Link>
      ) : null

    }
      
    
          <Link to="/" className='text-blue-950 hover:text-blue-400 font-medium flex items-center mt-auto    px-4 py-2 w-fit'>
              <span>Home</span>
          </Link>
          <Link to="/about" className='text-blue-950 hover:text-blue-400 font-medium flex items-center mt-auto    px-4 py-2 w-fit'>
              <span>About us</span>
          </Link>
          <Link to="/services" className='text-blue-950 hover:text-blue-400 font-medium flex items-center mt-auto    px-4 py-2 w-fit'>
              <span>Services</span>
          </Link>
          <Link to="/contact" className='text-blue-950 hover:text-blue-400 font-medium flex items-center mt-auto    px-4 py-2 w-fit'>
              <span>Contact us</span>
          </Link>
          
        
    </nav>
  )
}

export default NavigationLinks