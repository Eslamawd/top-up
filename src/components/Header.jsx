
import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';

// Import all the components
import Logo from './ui/header/Logo';
import SearchBar from './ui/header/SearchBar';
import NavigationLinks from './ui/header/NavigationLinks';
import UserBalance from './ui/header/UserBalance';
import { Menu, Package, ShoppingCart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
     const [scrolled, setScrolled] = useState(false);
     const { user } = useAuth()
     

  useEffect(() => {
   

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
     <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-4 md:px-8",
        scrolled ? "bg-background/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >

<div className='max-w-7xl mx-auto flex items-center h-10 justify-between bg-blue-950 text-white px-4 py-2 rounded-lg shadow-lg'> 
  <img 
                  src="leftHeader.png" 
                  alt="Digital Services" 
                  className="object-contain h-10"
                />
                
      
        
  <img 
                  src="rightHeader.png" 
                  alt="Digital Services" 
                  className="object-contain h-10"
                />
  
</div>

      <div className="max-w-7xl mx-auto flex items-center h-8  mt-3 justify-between">
        <Logo />

       
        <div className="flex items-center">
          <UserBalance />
          
          <NavigationLinks  />
          
        </div>
      </div>

        <div className="max-w-7xl mx-auto   mt-4 h-8 px-6 py-4 flex items-center justify-between">
        {/* Left */}
        <div className="flex justify-between flex-row ml-0 items-center gap-4">
          <span className="bg-blue-950 text-white ml-0  px-2 items-center text-center py-2 rounded text-sm flex justify-between flex-row font-medium">
            <Menu className='mr-2' />
            CATALOG
          </span>
        </div>

        {/* Center (Navigation Links) */}
       <div className="hidden md:flex relative mx-4 flex-1 max-w-md">
          <SearchBar />
        </div>

        {/* Right */}
        <div className="flex items-center gap-6 text-sm">
          <span className="text-sm text-gray-600 hidden md:inline-block">
            +961(71) 877 772
          </span>
          {
            !user ? (
          <Link to='/login' className="flex items-center gap-1">
            <User className="w-4 h-4" />
            Login
          </Link>
            ) : null
            
          }
          <Link to='/cart' className="flex items-center gap-1">
            <ShoppingCart className="w-4 h-4" />
            Shop cart
          </Link>
        </div>
      </div>


<div className=" hidden md:flex flex-row justify-center h-3.5 items-center   mt-6  p-4">
       <div className=" rounded-4xl bg-blue-50 w-30 mr-2  transition-colors cursor-pointer hover:bg-blue-950 hover:text-gray-50">
          Streaming
        </div>
       <div className=" rounded-4xl bg-blue-50 w-30 mr-2  transition-colors cursor-pointer hover:bg-blue-950 hover:text-gray-50">
          Gaming
        </div>
       <div className=" rounded-4xl bg-blue-50 w-30 mr-2  transition-colors cursor-pointer hover:bg-blue-950 hover:text-gray-50">
          Social media
        </div>
       <div className=" rounded-4xl bg-blue-50 w-30 mr-2  transition-colors cursor-pointer hover:bg-blue-950 hover:text-gray-50">
          Live chat
        </div>
       <div className=" rounded-4xl bg-blue-50 w-30 mr-2  transition-colors cursor-pointer hover:bg-blue-950 hover:text-gray-50">
          See all
        </div>
      
        </div>
    
    </header>
  )
}

export default Header