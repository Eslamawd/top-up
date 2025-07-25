import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User, Home, Package, LifeBuoy, HelpCircle, Settings, Menu } from "lucide-react";
import { Button } from "./ui/button";
import Header from "./Header";
import ChatBot from "./ChatBot";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";
import SearchBar from "./ui/header/SearchBar";


const footerLinks = {
  services: [
    { name: "Streaming Services", href: "/services?category=streaming" },
    { name: "Gaming Services", href: "/services?category=gaming" },
    { name: "Social Media", href: "/services?category=social" },
    { name: "Digital Utilities", href: "/services?category=utilities" },
  ],
  support: [
    { name: "FAQ", href: "/support?tab=faq" },
    { name: "Help Center", href: "/support?tab=guides" },
    { name: "Community", href: "/support?tab=community" },
  ],
  // Social links section removed as per user's implied structure
};


const MainLayout = ({ children, showFooter = true }) => {
  const { user } = useAuth();
  const location = useLocation();

    useEffect(() => {
    // Scroll to top whenever the route changes
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
  
      
      {/* Header */}
      <Header />

      
      
      {/* Main Content with top padding for header */}
      <main className="flex-grow pt-20 pb-16 md:pb-0">
        {children}
      </main>
      
      {/* Floating Chat Bot - positioned above mobile navigation */}
      <ChatBot />
      
      {/* Mobile Navigation */}
      
      {/* Footer */}
      {showFooter && (
        <footer className="bg-background border-t border-border py-8 mt-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and Description - now spanning 2 columns on medium screens and up */}
        <div className="col-span-1 md:col-span-2 w-full space-y-4">
          <img src='/vite.png' alt="TopUPLB Logo" className="mr-2 h-10" /> {/* Added h-10 for consistent height */}
          <p className="text-gray-400">Your one-stop shop for digital services with instant delivery and amazing support.</p>
        </div>

        {/* Services Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Services</h3>
          <ul className="space-y-2">
            {footerLinks.services.map((item, i) => (
              <li key={i}>
                <a href={item.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
          <ul className="space-y-2">
            {footerLinks.support.map((item, i) => (
              <li key={i}>
                <a href={item.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* The fourth column is implicitly empty as per the new structure */}
      </div>

            <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-muted-foreground text-sm">© 2023 TopUplb.com. All rights reserved.</p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Subtle Admin Button */}
    
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
          </div>
        </footer>
      )}
    </div>
  );
};

export default MainLayout;
