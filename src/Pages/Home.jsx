import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { Link, useNavigate } from "react-router-dom";
import { CreditCard, Clock, ArrowRight } from "lucide-react";

import { Card, CardContent } from "../components/ui/Card";

import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { loadServices } from "../lib/serviceApi";
import { toast } from "sonner";
import FooterTopFeatures from "../components/ui/MainFoter";

const categories = [
  {
    id: 31,
    title: "Microsoft",
    description: "The store offers the Microsoft app of products.",
    image: "/microsoft.png",
  },
  {
    id: 61,
    title: "Social Medias",
    description: "The store offers the Life Social Medias of products.",
    image: "/social.png",
  },
  {
    id: 50,
    title: "Gaming",
    description: "The store offers the Gaming app of products.",
    image: "/gaming.png",
  },
  {
    id: 45,
    title: "Life Chat",
    description: "The store offers the Life Chat any app of products.",
    image: "/mobile.png",
  },
  {
    id: 57,
    title: "Stream",
    description: "The store offers the Streams any app of products.",
    image: "/stream.png",
  },
  {
    id: 53,
    title: "Gift Cards",
    description: "The store Gift Cards the Life Chat any app of products.",
    image: "/gift.png",
  },
  {
    id: 58,
    title: "Finance",
    description: "The store Finance of products.",
    image: "/Finance.png",
  },
  {
    id: 59,
    title: "Telecom",
    description: "The store offers the Telecom Chat any app of products.",
    image: "/Telecom.png",
  },
];

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData] = await Promise.all([loadServices()]);

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="space-y-16"
    >
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-primary/5 py-16 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1  gap-12 justify-center items-center">
            <div className="space-y-8 ">
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Topup Lb sells original <br /> codes & activation keys
              </motion.h1>
              <motion.p
                className="text-xl text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Get instant access to premium digital services with guaranteed
                delivery and 24/7 support.
              </motion.p>

              <motion.div
                className="flex flex-col w-full items-center justify-center sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link to="/services">
                  <Button size="lg" className="w-full sm:w-auto">
                    Shop Now
                  </Button>
                </Link>
                {user ? null : (
                  <Link
                    to="/register"
                    className="hover:text-white hover:bg-blue-950 font-medium flex justify-center items-center text-center mt-auto rounded-xl border border-gray-400 px-4 p-2 m-1 w-30 sm:w-auto"
                  >
                    Sign Up
                  </Link>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our wide range of digital services designed to make your
              online experience better.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {categories.map((cat, index) => (
              <Link key={index} to={`/categories/${cat.id}`}>
                <Card className="bg-card h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 h-full bg-blue-950 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 text-left">
                        <h2 className="text-xl font-semibold mb-1 text-white">
                          {cat.title}
                        </h2>
                        <p className="text-gray-300 mt-2 text-sm">
                          {cat.description}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <img
                          src={cat.image}
                          alt={cat.title}
                          className="w-16 h-16 object-contain"
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
            ))}
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
            <h2 className="text-3xl font-bold mb-4">Featured Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Check out our most popular digital services with instant delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Card
                key={service.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{service.name_en}</h3>
                    <span className="text-lg font-bold">${service.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {service.category.name_en}
                    </span>
                    {user ? (
                      service.subscription ? (
                        <Button
                          size="sm"
                          onClick={() => navigate(`/streams/${service.id}`)}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Subscribe Now
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => navigate(`/services/${service.id}`)}
                        >
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
        <FooterTopFeatures />
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="bg-primary text-primary-foreground p-8 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-primary-foreground/90 mb-6">
                  Create an account today and get access to all our premium
                  digital services.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                {user ? null : (
                  <Link to="/register" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="w-full sm:w-auto"
                    >
                      Sign Up Now
                    </Button>
                  </Link>
                )}
                <Link to="/services" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className=" border-white  hover:bg-white/20 w-full sm:w-auto"
                  >
                    Browse Services
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </motion.div>
  );
}

export default Home;
