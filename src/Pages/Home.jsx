import React, { useEffect, useState } from 'react'
import MainLayout from '../components/MainLayout'
import { motion } from 'framer-motion';

import { Link, useNavigate } from "react-router-dom";
import { 
  PlayCircle, 
  ShoppingCart, 
  Zap, 
  Shield, 
  Search,
  CreditCard,
  Clock,
  ArrowRight,
  Star,
  Gamepad2,
  ThumbsUp,
  TicketPercentIcon,
  DollarSignIcon,
  BatteryFull,
  DicesIcon
} from "lucide-react";

import { Card, CardContent } from '../components/ui/Card';

import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { loadServices } from '../lib/serviceApi';
import { toast } from 'sonner';



function Home() {
  const { user } = useAuth()  
  const navigate = useNavigate();
  const [services, setServices] = useState([]);




  useEffect(() => {
        const fetchData = async () => {
          
            try {
                const [servicesData, ] = await Promise.all([
                    loadServices(),
                ]);

                if (servicesData && Array.isArray(servicesData.products.data)) {
                    setServices(servicesData.products.data);
                } else {
                    // Handle case where servicesData.services is not an array
                    setServices([]);
                    toast.warning("No services found from the API.");
                }

              
            
            } catch (err) {
                console.error("Error loading data:", err);
                toast.error("Failed to load services.");
            } 
        };

        fetchData();
    }, []); // Empty dependency array means this runs once on mount




    
  // Show purchase confirmation dialog



  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="space-y-16"
      >
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 to-primary/5 py-16 md:py-28">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <motion.h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Buy Streaming, Gaming, and Social Media Services Instantly
                </motion.h1>
                <motion.p 
                  className="text-xl text-muted-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Get instant access to premium digital services with guaranteed delivery and 24/7 support.
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link to="/services">
                    <Button size="lg" className="w-full sm:w-auto">
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      View Services
                    </Button>
                  </Link>
               
                  <Link to="/register" className='hover:text-white hover:bg-blue-950 font-medium flex items-center mt-auto rounded-full border border-gray-400 px-4 p-2 m-1 w-fit' >
                   <PlayCircle className="mr-2 h-5 w-5" />
                    Get Started
                  </Link>
                </motion.div>
                
             
              </div>
              
              <motion.div 
                className="rounded-xl overflow-hidden shadow-2xl border relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className='flex flex-row w-full h-full'>
                <img 
                  src="social.png" 
                  alt="Digital Services" 
                  className=" w-full h-auto object-cover"
                />

                
                <img 
                  src="mobile.png" 
                  alt="Digital Services" 
                  className="w-full h-auto object-cover"
                />
               
                </div>
              </motion.div>
            </div>
          </div>
        </section>




        {/* Categories Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Browse by Category
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore our wide range of digital services designed to make your online experience better.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
             
                <Link to={`/categories`}>
                    <Card className="bg-card h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-6 h-full bg-blue-950 flex flex-col justify-between">
                        
                        {/* الصف العلوي: صورة يمين + عنوان ووصف يسار */}
                        <div className="flex justify-between items-start mb-4">
                          {/* النص على اليسار */}
                          <div className="flex-1 text-left">
                            <h2 className="text-xl font-semibold mb-1 text-white">
                              Microsoft
                            </h2>
                            <p className="text-gray-300 mt-2 text-sm">
                              The store offers the Microsoft app of products.
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <img
                              src="/microsoft.png"
                              alt="Microsoft"
                              className="w-full h-auto object-cover"
                            />
                          </div>
                        </div>
                          <div className="text-gray-200 font-medium flex items-center mt-auto rounded-full border border-gray-400 px-4 py-2 w-fit">
                            Browse Services
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </div>
                      </CardContent>
                    </Card>
                </Link>
                <Link to={`/categories`}>
                    <Card className="bg-card h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-6 h-full bg-blue-950 flex flex-col justify-between">
                        
                        {/* الصف العلوي: صورة يمين + عنوان ووصف يسار */}
                        <div className="flex justify-between items-start mb-4">
                          {/* النص على اليسار */}
                          <div className="flex-1 text-left">
                            <h2 className="text-xl font-semibold mb-1 text-white">
                               Social Medias
                            </h2>
                            <p className="text-gray-300 mt-2 text-sm">
                              The store offers the Life Social Medias of products.
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <img
                              src="/social.png"
                              alt="mobile"
                              className="w-"
                            />
                          </div>
                        </div>
                          <div className="text-gray-200 font-medium flex items-center mt-auto rounded-full border border-gray-400 px-4 py-2 w-fit">
                            Browse Services
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </div>
                      </CardContent>
                    </Card>
                </Link>
                <Link to={`/categories`}>
                    <Card className="bg-card h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-6 h-full bg-blue-950 flex flex-col justify-between">
                        
                        {/* الصف العلوي: صورة يمين + عنوان ووصف يسار */}
                        <div className="flex justify-between items-start mb-4">
                          {/* النص على اليسار */}
                          <div className="flex-1 text-left">
                            <h2 className="text-xl font-semibold mb-1 text-white">
                              Gaming
                            </h2>
                            <p className="text-gray-300 mt-2 text-sm">
                              The store offers the Gaming app of products.
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <img
                              src="/gaming.png"
                              alt="Gaming"
                              className="w-"
                            />
                          </div>
                        </div>
                          <div className="text-gray-200 font-medium flex items-center mt-auto rounded-full border border-gray-400 px-4 py-2 w-fit">
                            Browse Services
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </div>
                      </CardContent>
                    </Card>
                </Link>
                <Link to={`/categories`}>
                    <Card className="bg-card h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-6 h-full bg-blue-950 flex flex-col justify-between">
                        
                        {/* الصف العلوي: صورة يمين + عنوان ووصف يسار */}
                        <div className="flex justify-between items-start mb-4">
                          {/* النص على اليسار */}
                          <div className="flex-1 text-left">
                            <h2 className="text-xl font-semibold mb-1 text-white">
                              Life Chat
                            </h2>
                            <p className="text-gray-300 mt-2 text-sm">
                              The store offers the Life Chat any app of products.
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <img
                              src="/mobile.png"
                              alt="mobile"
                              className="w-"
                            />
                          </div>
                        </div>
                          <div className="text-gray-200 font-medium flex items-center mt-auto rounded-full border border-gray-400 px-4 py-2 w-fit">
                            Browse Services
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </div>
                      </CardContent>
                    </Card>
                </Link>
                <Link to={`/categories`}>
                    <Card className="bg-card h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-6 h-full bg-blue-950 flex flex-col justify-between">
                        
                        {/* الصف العلوي: صورة يمين + عنوان ووصف يسار */}
                        <div className="flex justify-between items-start mb-4">
                          {/* النص على اليسار */}
                          <div className="flex-1 text-left">
                            <h2 className="text-xl font-semibold mb-1 text-white">
                              Stream
                            </h2>
                            <p className="text-gray-300 mt-2 text-sm">
                              The store offers the Streams any app of products.
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <img
                              src="/stream.png"
                              alt="mobile"
                              className="w-"
                            />
                          </div>
                        </div>
                          <div className="text-gray-200 font-medium flex items-center mt-auto rounded-full border border-gray-400 px-4 py-2 w-fit">
                            Browse Services
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </div>
                      </CardContent>
                    </Card>
                </Link>
                <Link to={`/categories`}>
                    <Card className="bg-card h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-6 h-full bg-blue-950 flex flex-col justify-between">
                        
                        {/* الصف العلوي: صورة يمين + عنوان ووصف يسار */}
                        <div className="flex justify-between items-start mb-4">
                          {/* النص على اليسار */}
                          <div className="flex-1 text-left">
                            <h2 className="text-xl font-semibold mb-1 text-white">
                              Gift Cards
                            </h2>
                            <p className="text-gray-300 mt-2 text-sm">
                              The store Gift Cards the Life Chat any app of products.
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <img
                              src="/gift.png"
                              alt="Gift"
                              className="w-"
                            />
                          </div>
                        </div>
                          <div className="text-gray-200 font-medium flex items-center mt-auto rounded-full border border-gray-400 px-4 py-2 w-fit">
                            Browse Services
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </div>
                      </CardContent>
                    </Card>
                </Link>
                <Link to={`/categories`}>
                    <Card className="bg-card h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-6 h-full bg-blue-950 flex flex-col justify-between">
                        
                        {/* الصف العلوي: صورة يمين + عنوان ووصف يسار */}
                        <div className="flex justify-between items-start mb-4">
                          {/* النص على اليسار */}
                          <div className="flex-1 text-left">
                            <h2 className="text-xl font-semibold mb-1 text-white">
                              Finance
                            </h2>
                            <p className="text-gray-300 mt-2 text-sm">
                              The store Finance of products.
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <img
                              src="/Finance.png"
                              alt="Finance"
                              className="w-"
                            />
                          </div>
                        </div>
                          <div className="text-gray-200 font-medium flex items-center mt-auto rounded-full border border-gray-400 px-4 py-2 w-fit">
                            Browse Services
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </div>
                      </CardContent>
                    </Card>
                </Link>
                <Link to={`/categories`}>
                    <Card className="bg-card h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-6 h-full bg-blue-950 flex flex-col justify-between">
                        
                        {/* الصف العلوي: صورة يمين + عنوان ووصف يسار */}
                        <div className="flex justify-between items-start mb-4">
                          {/* النص على اليسار */}
                          <div className="flex-1 text-left">
                            <h2 className="text-xl font-semibold mb-1 text-white">
                              Telecom
                            </h2>
                            <p className="text-gray-300 ml-0 mt-2 text-sm">
                              The store offers the Telecom Chat any app of products.
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <img
                              src="/Telecom.png"
                              alt="Telecom"
                              className="w-"
                            />
                          </div>
                        </div>
                          <div className="text-gray-200 font-medium flex items-center mt-auto rounded-full border border-gray-400 px-4 py-2 w-fit">
                            Browse Services
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </div>
                      </CardContent>
                    </Card>
                </Link>

            </div>
            
          </div>
           <Link to="/categories">
                <Button size="lg" variant="outline" className="mt-5">
                  View All Categories
                  <ArrowRight className="ml-2  h-4 w-4" />
                </Button>
              </Link>
        </section>

        {/* Featured Services Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Featured Services
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Check out our most popular digital services with instant delivery.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => (
                <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-48">
                    <img 
                      src={service.image} 
                      alt={service.name} 
                      className="w-full h-full object-cover"
                    />
                  
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{service.name_ar}</h3>
                      <span className="text-lg font-bold">${service.price}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {service.category.name_ar}
                      </span>
                {user ? (
  service.subscription ? (
    <Button size="sm" onClick={() => navigate(`/streams/${service.id}`)}>
      <Clock className="h-4 w-4 mr-2" />
      Subscribe Now
    </Button>
  ) : (
    <Button size="sm" onClick={() => navigate(`/services/${service.id}`)}>
      <CreditCard className="h-4 w-4 mr-2" />
      Order Now
    </Button>
  )
                        ) : (
                          <Button size="sm" onClick={() => navigate(`/login`)}>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Order Now
                          </Button>
                        )}

                     
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Link to="/services">
                <Button size="lg" variant="outline">
                  View All Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Why Choose TopUpLb
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We provide the best digital services with instant delivery and excellent support.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              
            <Card className="p-6 bg-blue-950 text-white flex flex-col items-center justify-center">
                <div className="bg-primary/10 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Instant Delivery
                </h3>
                <p className="text-muted-foreground">
                  Get your services delivered instantly after purchase. No waiting needed.
                </p>
              </Card>

              
            <Card className="p-6 bg-blue-950 text-white flex flex-col items-center justify-center">
                <div className="bg-primary/10 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Secure Payments
                </h3>
                <p className="text-muted-foreground">
                  All transactions are secure and encrypted for your peace of mind.
                </p>
              </Card>

              
            <Card className="p-6 bg-blue-950 text-white flex flex-col items-center justify-center">
                <div className="bg-primary/10 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  24/7 Support
                </h3>
                <p className="text-muted-foreground">
                  Our dedicated support team is always ready to assist you with any issues.
                </p>
              </Card>
              
            <Card className="p-6 bg-blue-950 text-white flex flex-col items-center justify-center">
                <div className="bg-primary/10 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <TicketPercentIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Discounts
                </h3>
                <p className="text-muted-foreground">
Automatic discounts for regular customers                </p>
              </Card>
              
            <Card className="p-6 bg-blue-950 text-white flex flex-col items-center justify-center">
                <div className="bg-primary/10 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Time
                </h3>
                <p className="text-muted-foreground">
                  You spend a minimum of time and effort on finding a key  
                  </p>
              </Card>
              
            <Card className="p-6 bg-blue-950 text-white flex flex-col items-center justify-center">
                <div className="bg-primary/10 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <DollarSignIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Significant
                </h3>
                <p className="text-muted-foreground">
                  Our prices allow you to save a significant part of your funds
                  </p>
              </Card>
            <Card className="p-6 bg-blue-950 text-white flex flex-col items-center justify-center">
                <div className="bg-primary/10 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <BatteryFull className="h-16 w-16 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Purchased key instantly
                </h3>
                <p className="text-muted-foreground">
                  You receive the purchased key instantly, without any waiting.
                  </p>
              </Card>
            <Card className="p-6 bg-blue-950 text-white flex flex-col items-center justify-center">
            <div className="bg-primary/10 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
              <DicesIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Store offers</h3>
            <p className="text-gray-400">
              The store offers the widest range of products.
            </p>
          </Card>

            </div>
          </div>
        </section>

       

        {/* CTA Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Card className="bg-primary text-primary-foreground p-8 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                  <p className="text-primary-foreground/90 mb-6">
                    Create an account today and get access to all our premium digital services.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  { user ? null : (

                  <Link to="/register" className="w-full sm:w-auto">
                    <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                      Sign Up Now
                    </Button>
                  </Link>
                  )

                  }
                  <Link to="/services" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className=" border-white  hover:bg-white/20 w-full sm:w-auto">
                      Browse Services
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </section>

   
      </motion.div>
    </MainLayout>
  )
}

export default Home