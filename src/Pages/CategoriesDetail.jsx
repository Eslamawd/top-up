import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { loadAllProductWithCat } from '../lib/categoryApi';
import { toast } from 'sonner';
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";

import MainLayout from '../components/MainLayout';
import ServiceCard from '../components/services/ServiceCard';

function CategoriesDetail() {
  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [children, setChildren] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Products pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Children pagination
  const [childrenPage, setChildrenPage] = useState(1);
  const [childrenLastPage, setChildrenLastPage] = useState(1);
  const [childrenTotal, setChildrenTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await loadAllProductWithCat(id, currentPage, childrenPage);

        setCategory(res.category);

        setProducts(res.products?.data || []);
        setCurrentPage(res.products?.current_page || 1);
        setLastPage(res.products?.last_page || 1);
        setTotal(res.products?.total || 0);

        setChildren(res.children?.data || []);
        setChildrenPage(res.children?.current_page || 1);
        setChildrenLastPage(res.children?.last_page || 1);
        setChildrenTotal(res.children?.total || 0);
      } catch (error) {
        console.error("Error loading service details:", error);
        setError("فشل في تحميل البيانات. حاول مرة أخرى.");
        toast.error("فشل في تحميل البيانات.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentPage, childrenPage]);

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          خدمات داخل فئة: {category?.name_en || ''}
        </h1>
        <p className="text-muted-foreground">
          {category?.description || "استكشف مجموعة الخدمات المتاحة داخل هذه الفئة."}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">جارٍ تحميل البيانات...</span>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-destructive mb-4">حدث خطأ أثناء التحميل</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
        </div>
      ) : (
        <>
          {/* عرض الفئات الفرعية */}
          {children.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">فئات فرعية</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {children.map(child => (
                  <Link to={`/categories/${child.id}`} key={child.id}>
                    <Card className="bg-card h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="bg-primary/10 rounded-full flex items-center justify-center">
                          <img
                            src={child.image}
                            alt={child.name_en}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          {child.name_ar}
                        </h3>
                        <div className="text-primary font-medium flex items-center mt-auto">
                          تصفح الخدمات
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pagination للفئات الفرعية */}
              <div className="flex justify-center items-center gap-2 mt-6">
                <Button
                  onClick={() => setChildrenPage(prev => Math.max(prev - 1, 1))}
                  disabled={childrenPage === 1}
                >
                  Prev
                </Button>

                <span className="text-sm text-muted-foreground">
                  صفحة {childrenPage} من {childrenLastPage} — عدد: {childrenTotal} فئة
                </span>

                <Button
                  onClick={() => setChildrenPage(prev => Math.min(prev + 1, childrenLastPage))}
                  disabled={childrenPage === childrenLastPage}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* عرض المنتجات */}
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((item) => (
                  <ServiceCard key={item.id} service={item} />
                ))}
              </div>

              {/* Pagination للمنتجات */}
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </Button>

                <span className="text-sm text-muted-foreground">
                  صفحة {currentPage} من {lastPage} — عدد: {total} خدمة
                </span>

                <Button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, lastPage))}
                  disabled={currentPage === lastPage}
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              لا توجد خدمات داخل هذه الفئة.
            </p>
          )}
        </>
      )}
    </MainLayout>
  );
}

export default CategoriesDetail;
