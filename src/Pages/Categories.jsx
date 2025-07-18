import React, { useEffect, useState } from "react";
import MainLayout from '../components/MainLayout'
import { loadCategory } from "../lib/categoryApi";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/button";

function Categories() {



    const [categories, setCategories] = useState([]);
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
                const [ categoriesRes] = await Promise.all([
                  
                    loadCategory(page)
                ]);

                if (categoriesRes && Array.isArray(categoriesRes.categories.data)) {
                     setCategories(categoriesRes.categories.data);
                    setCurrentPage(categoriesRes.categories.current_page);
                    setLastPage(categoriesRes.categories.last_page);
                    setTotal(categoriesRes.categories.total);
                } else {
                    // Handle case where servicesData.services is not an array
                    setCategories([]);
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



  return (
    <MainLayout>
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
                ) :(

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link to={`/categories/${category.id}`} key={category.id}>
                  <Card className="bg-card h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="bg-primary/10 rounded-full  flex items-center justify-center ">
                        <img 
                          src={category.image}
                          alt={category.name_en}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {category.name_ar}
                      </h3>
                     
                      <div className="text-primary font-medium flex items-center mt-auto">
                        Browse Services
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
                )}
            
          </div>
             <div className="flex justify-center items-center gap-2 mt-8">
        <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
            Prev
        </Button>

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

        </section>
    </MainLayout>
  )
}

export default Categories