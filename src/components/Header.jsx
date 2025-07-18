
import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';

// Import all the components
import Logo from './ui/header/Logo';
import SearchBar from './ui/header/SearchBar';
import NavigationLinks from './ui/header/NavigationLinks';
import UserBalance from './ui/header/UserBalance';
import { Package, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
     const [scrolled, setScrolled] = useState(false);
     

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

      <div className="max-w-7xl mx-auto flex items-center  mt-3 justify-between">
        <Logo />

        <div className="hidden md:flex relative mx-4 flex-1 max-w-md">
          <SearchBar />
        </div>

        <div className="flex items-center">
          <UserBalance />
          
         
          
          <NavigationLinks  />
          
         
        </div>
      </div>

    </header>
  )
}

export default Header