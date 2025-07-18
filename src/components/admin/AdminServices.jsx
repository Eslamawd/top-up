// src/components/admin/AdminServices.jsx

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { PlusCircle, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { Input } from "../ui/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/Dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { toast } from "sonner";

import CreateServiceForm from "./customization/CreateServiceForm";
import UpdateServiceForm from "./customization/UpdateServiceForm";
import { deleteService, loadServices } from "../../lib/serviceApi";

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  
  const [filteredServices, setFilteredServices] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
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

  const handleEditService = (service) => {
    setSelectedService(service);
    setIsNew(false);
    setIsUpdate(true);
    setIsDialogOpen(true);
  };

  const handleAddNewService = () => {
    setIsNew(true);
    setIsUpdate(false);
    setSelectedService(null);
    setIsDialogOpen(true);
  };

  const handleDeleteService = (service) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteService = async () => {
    if (!selectedService) return;
    setIsDeleting(true);
    try {
      await deleteService(selectedService.id);
      toast.success("Service deleted");
      setIsDeleteDialogOpen(false);
      setSelectedService(null);
      setServices((prev) => prev.filter((serv) => serv.id !== selectedService.id));
    } catch (err) {
      console.error("Error deleting service:", err);
      toast.error("Failed to delete service");
    } finally {
      setIsDeleting(false);
    }
  };

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Service Management</h2>
        <Button onClick={handleAddNewService}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      <div className="relative flex-grow mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

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

          <ServiceList
            services={filteredServices}
            onEdit={handleEditService}
            onDelete={handleDeleteService}
          />
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

     

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>{isNew ? "Add New Service" : "Update Service"}</DialogTitle>
            <DialogDescription>
              {isNew ? "Fill in the details to create a new service." : "Edit the service details."}
            </DialogDescription>
          </DialogHeader>

          {isNew ? (
            <CreateServiceForm
              onSuccess={(newService) => {
                setServices((prev) => [...prev, newService]);
                setIsDialogOpen(false);
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          ) : (
            <UpdateServiceForm
              service={selectedService}
              onSuccess={(updatedService) => {
                setServices((prev) =>
                  prev.map((serv) => (serv.id === updatedService.id ? updatedService : serv))
                );
                setIsDialogOpen(false);
              }}
              onCancel={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-red-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedService?.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteService}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminServices;

const ServiceList = ({ services, onEdit, onDelete }) => {
  if (services.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No services found. Add a new service to get started.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service) => (
        <Card key={service.id} className="overflow-hidden">
          <div className="aspect-video relative bg-gray-100">
            {service.image && (
              <img
                src={service.image}
                alt={service.name_ar}
                className="w-full h-full object-cover"
              
              />
            )}
          </div>

          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-lg">{service.name_ar}</CardTitle>
          </CardHeader>

          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {service?.category?.name_ar}
            </p>

            <div className="flex items-center justify-between mt-2">
              <span className="font-semibold">${parseFloat(service.price).toFixed(2)}</span>
              <div className="flex space-x-1">
                <Button size="sm" variant="outline" onClick={() => onEdit(service)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => onDelete(service)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
