import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Badge } from "../components/ui/badge"; // Assuming you have a Badge component
import { toast } from "sonner";
import { loadOrder } from "../lib/orderApi";
import { Loader2 } from "lucide-react"; // For loading spinner

const Checkout = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null);
  // Added error state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    links: [],
  });

  const fetchOrders = async (page) => {
    try {
      setLoading(true);
      const res = await loadOrder(page); // تأكد أن دالة getAllOrders تقبل page
      const data = res.orders?.data || [];

      setOrders(data);

      setPagination({
        currentPage: res.orders.current_page,
        lastPage: res.orders.last_page,
        total: res.orders.total,
        links: res.orders.links,
      });
    } catch (error) {
      toast.error("فشل في تحميل الطلبات");
      setError(error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(pagination.currentPage);
  }, []);

  // Helper function to format date
  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleString(); // Formats date and time based on user's locale
  };

  return (
    <>
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Your Orders</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">
                  Loading orders...
                </span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold text-destructive mb-2">
                  Error Loading Orders
                </h3>
                <p className="text-muted-foreground">{error}</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold mb-2">No Orders Found</h3>
                <p className="text-muted-foreground">
                  You haven't placed any orders yet.
                </p>
              </div>
            ) : (
              <div className="space-y-6 mt-16">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border rounded-lg p-4 shadow-sm bg-card"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 pb-3 border-b border-dashed">
                      <div className="mb-2 sm:mb-0">
                        <h4 className="font-semibold text-lg">
                          OrderId: {order.id}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Placed on: {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          className={`text-xs font-medium bg-green-100 text-green-800`}
                        >
                          ProductId: {order.product_id}{" "}
                          {/* This seems to be product_id, not payment status */}
                        </Badge>
                        {/* Display product name only once, if product exists */}
                        {order.product && (
                          <Badge
                            className={`text-xs font-medium bg-blue-100 text-blue-800`}
                          >
                            Product: {order.product.name_ar}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Total Price:</span>
                        <span className="font-bold text-primary">
                          ${parseFloat(order.total_price).toFixed(2)}
                        </span>
                      </div>

                      {order.product ? ( // Check if product exists before rendering its details
                        <div className="flex items-start gap-4 p-4">
                          <img
                            src={order.product.image} // Corrected: use order.product
                            alt={order.product.name_ar} // Corrected: use order.product
                            className="w-20 h-20 object-cover rounded border"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://placehold.co/80x80/cccccc/000000?text=No+Image";
                            }} // Fallback image
                          />
                          <div>
                            <h5 className="font-semibold text-base">
                              Product Details:
                            </h5>
                            <p className="text-sm">
                              Name: {order.product.name_ar}
                            </p>
                            <p className="text-sm">
                              Price: ${order.product.price}
                            </p>
                            {/* Add more product details here if available */}
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground pt-3 border-t">
                          No product details available for this order.
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      Data from Order: {order.response}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 text-sm">
              <span>
                صفحة {pagination.currentPage} من {pagination.lastPage}
              </span>
              <div className="space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pagination.currentPage === 1}
                  onClick={() => fetchOrders(pagination.currentPage - 1)}
                >
                  السابق
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pagination.currentPage === pagination.lastPage}
                  onClick={() => fetchOrders(pagination.currentPage + 1)}
                >
                  التالي
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Checkout;
