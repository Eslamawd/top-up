import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MainLayout from "../components/MainLayout";
import { Search, Loader2 } from "lucide-react"; // Added Loader2 icon
import { Input } from "../components/ui/Input";

import { toast } from "sonner";
import ServiceCard from "../components/services/ServiceCard";
import { loadServices } from "../lib/serviceApi";

const ServicesPage = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state for fetch failures

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchData = async (page = 1) => {
            setLoading(true);
            setError(null);
            try {
                const [servicesData] = await Promise.all([
                    loadServices(page),
                   
                ]);

                if (servicesData && Array.isArray(servicesData.products.data)) {
                    setServices(servicesData.products.data);
                    setFilteredServices(servicesData.products.data);
                    setCurrentPage(servicesData.products.current_page);
                    setLastPage(servicesData.products.last_page);
                    setTotal(servicesData.products.total);
                } else {
                    // Handle case where servicesData.services is not an array
                    setServices([]);
                    setFilteredServices([]);
                    toast.warning("No services found from the API.");
                }

            } catch (err) {
                console.error("Error loading data:", err);
                setError("Failed to load services. Please try again later.");
                toast.error("Failed to load services.");
            } finally {
                setLoading(false);
            }
        };

        fetchData(currentPage);
        window.scrollTo(0, 0);
    }, [currentPage]); // Empty dependency array means this runs once on mount

    // Effect for filtering based on search query and selected category
    useEffect(() => {
        let currentFiltered = services;

      
        // Apply search query filter
        if (searchQuery) {
            currentFiltered = currentFiltered.filter(
                service =>
                    (service.name_ar && service.name_ar.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (service.name_en && service.name_en.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        setFilteredServices(currentFiltered);
     
    }, [searchQuery, services]);


    return (
        <MainLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="container py-8"
            >
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Our Services</h1>
                    <p className="text-muted-foreground">
                        Explore our wide range of services designed to meet your needs.
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search for services..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
  
                </div>

                {/* Content Display based on Loading/Error/Data */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading services...</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <h2 className="text-xl font-bold text-destructive mb-4">Error Loading Services</h2>
                        <p className="text-muted-foreground mb-6">{error}</p>
                        {/* Optionally add a retry button */}
                        {/* <Button onClick={() => window.location.reload()}>Retry</Button> */}
                    </div>
                ) : filteredServices.length === 0 ? (
                    <div className="text-center py-12">
                        <h2 className="text-xl font-bold mb-4">No Services Found</h2>
                        <p className="text-muted-foreground">
                            {searchQuery 
                                ? "Your search and filter returned no results."
                                : "There are no services available at the moment."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredServices.map(service => (
                            <ServiceCard
                                key={service.id}
                                service={service}
                            />
                        ))}
                    </div>
                    
                )}
             
    <div className="flex justify-center items-center gap-2 mt-8">
        <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
            Prev
        </button>

        <span className="text-sm text-muted-foreground">
            Page {currentPage} of {lastPage}  — Total: {total} services
        </span>

        <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, lastPage))}
            disabled={currentPage === lastPage}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
            Next
        </button>
    </div>


            </motion.div>
        </MainLayout>
    );
};

export default ServicesPage;