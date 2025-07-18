import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/badge"; // Assuming you have a Badge component
import { toast } from "sonner";
import { loadOrder } from "../lib/orderApi";
import MainLayout from "../components/MainLayout";
import { Loader2 } from "lucide-react"; // For loading spinner

const Checkout = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true); // Added loading state
    const [error, setError] = useState(null);   // Added error state

    useEffect(() => {
        const fetchOrdersData = async () => { // Renamed from fetchServices for clarity
            setLoading(true);
            setError(null);
            try {
                const res = await loadOrder();
                // console.log(res); // Remove this line in production

                if (res.orders && Array.isArray(res.orders)) {
                    setOrders(res.orders);
                } else {
                    setOrders([]); // Ensure orders is an empty array if no data or invalid data
                    toast.warning("No orders found.");
                }
            } catch (err) {
                console.error("Error loading orders:", err);
                setError("Failed to load your orders. Please try again.");
                toast.error("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrdersData();
    }, []);

    // Helper function to format date
    const formatDate = (isoString) => {
        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        return date.toLocaleString(); // Formats date and time based on user's locale
    };

    // Helper to get status badge variant
    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            case 'wait': // ZDDK specific status
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <MainLayout>
            <div className="container py-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Your Orders</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        {loading ? (
                            <div className="flex justify-center items-center h-48">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <span className="ml-2 text-muted-foreground">Loading orders...</span>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <h3 className="text-xl font-bold text-destructive mb-2">Error Loading Orders</h3>
                                <p className="text-muted-foreground">{error}</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-12">
                                <h3 className="text-xl font-bold mb-2">No Orders Found</h3>
                                <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order) => (
                                    <div key={order.id} className="border rounded-lg p-4 shadow-sm bg-card">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 pb-3 border-b border-dashed">
                                            <div className="mb-2 sm:mb-0">
                                                <h4 className="font-semibold text-lg">Order #{order.id}</h4>
                                                <p className="text-sm text-muted-foreground">Placed on: {formatDate(order.created_at)}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <Badge className={`text-xs font-medium ${getStatusBadgeVariant(order.payment_status)}`}>
                                                    Payment: {order.payment_status}
                                                </Badge>
                                                {order.zddk_status && (
                                                    <Badge className={`text-xs font-medium ${getStatusBadgeVariant(order.zddk_status)}`}>
                                                        ZDDK Status: {order.zddk_status}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium">Total Price:</span>
                                                <span className="font-bold text-primary">${parseFloat(order.total_price).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm text-muted-foreground">
                                                <span className="font-medium">Paid with:</span>
                                                <span>{order.payment_method}</span>
                                            </div>
                                            {order.used_balance && parseFloat(order.used_balance) > 0 && (
                                                <div className="flex justify-between text-sm text-muted-foreground">
                                                    <span className="font-medium">Used Balance:</span>
                                                    <span>${parseFloat(order.used_balance).toFixed(2)}</span>
                                                </div>
                                            )}
                                        </div>

                                        {order.services && order.services.length > 0 && (
                                            <div className="space-y-3 pt-3 border-t">
                                                <h5 className="font-semibold text-base">Services Included:</h5>
                                                {order.services.map((service) => (
                                                    <div key={service.id} className="flex justify-between items-center text-sm bg-muted/20 p-2 rounded-md">
                                                        <span className="font-medium">
                                                            {service.title} (x{service.pivot.quantity})
                                                        </span>
                                                        <span className="text-muted-foreground">
                                                            ${(parseFloat(service.pivot.price) * service.pivot.quantity).toFixed(2)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {!order.services || order.services.length === 0 && (
                                            <p className="text-sm text-muted-foreground pt-3 border-t">No services listed for this order.</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
};

export default Checkout;