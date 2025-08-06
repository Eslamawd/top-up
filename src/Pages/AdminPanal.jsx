import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Routes, Route, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/button";

import {
  Users,
  Package,
  ShoppingCart,
  TicketCheck,
  BarChart3,
  LucidePartyPopper,
  LogOut,
  StarsIcon,
  AppWindow,
  RedoIcon,
} from "lucide-react";
import AdminDashboard from "../components/admin/AdminDashboard";
import { AdminOrders } from "../components/admin/AdminOrders";
import AdminCustomersPage from "../components/admin/AdminCustomersPage";
import AdminServices from "../components/admin/AdminServices";
import { useAuth } from "../context/AuthContext";
import AdminCategory from "../components/admin/AdminCategory";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminPayments from "../components/admin/AdminPayments";
import AdminSubscriptions from "../components/admin/AdminSubscribtion";
import AdminSync from "../components/admin/AdminSync";
import AdminRenews from "../components/admin/AdminRenews";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPendingCounts = async () => {
      setIsLoading(false);
    };
    fetchPendingCounts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleLogout = () => {
    logout()
      .then(() => {
        navigate("/"); // Redirect to home page
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        // Optionally, you can show an error message to the user
        alert("Logout failed. Please try again.");
      });
  };

  return (
    <ProtectedRoute>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="container py-8"
      >
        <div className="flex justify-between items-center mt-16 mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <div className="flex items-center gap-3">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              className="flex gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-8">
                <nav className="space-y-2">
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-primary"
                  >
                    <div className="rounded-lg w-10 h-8 bg-blue-950 flex items-center justify-center text-white">
                      <BarChart3 className=" h-4 w-4 " />
                    </div>
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/customers"
                    className="flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-primary"
                  >
                    <div className="rounded-lg w-10 h-8 bg-blue-950 flex items-center justify-center text-white">
                      <Users className="h-4 w-4" />
                    </div>
                    Customers
                  </Link>

                  <Link
                    to="/admin/categories"
                    className="flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-primary"
                  >
                    <div className="rounded-lg w-10 h-8 bg-blue-950 flex items-center justify-center text-white">
                      <TicketCheck className="h-4 w-4 " />
                    </div>
                    Category
                  </Link>

                  <Link
                    to="/admin/services"
                    className="flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-primary"
                  >
                    <div className="rounded-lg w-10 h-8 bg-blue-950 flex items-center justify-center text-white">
                      <Package className="h-4 w-4 " />
                    </div>
                    Services
                  </Link>
                  <Link
                    to="/admin/payments"
                    className="flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-primary"
                  >
                    <div className="rounded-lg w-10 h-8 bg-blue-950 flex items-center justify-center text-white">
                      <LucidePartyPopper className=" h-4 w-4 " />
                    </div>
                    Payments
                  </Link>
                  <Link
                    to="/admin/subscriptions"
                    className="flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-primary"
                  >
                    <div className="rounded-lg w-10 h-8 bg-blue-950 flex items-center justify-center text-white">
                      <StarsIcon className=" h-4 w-4 " />
                    </div>
                    subscriptions
                  </Link>

                  <Link
                    to="/admin/orders"
                    className="flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-primary"
                  >
                    <div className="rounded-lg w-10 h-8 bg-blue-950 flex items-center justify-center text-white">
                      <ShoppingCart className=" h-4 w-4 " />
                    </div>
                    Orders
                  </Link>

                  <Link
                    to="/admin/sync"
                    className="flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-primary"
                  >
                    <div className="rounded-lg w-10 h-8 bg-blue-950 flex items-center justify-center text-white">
                      <AppWindow className=" h-4 w-4 " />
                    </div>
                    Sync
                  </Link>
                  <Link
                    to="/admin/renews"
                    className="flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-primary"
                  >
                    <div className="rounded-lg w-10 h-8 bg-blue-950 flex items-center justify-center text-white">
                      <RedoIcon className=" h-4 w-4 " />
                    </div>
                    Renews
                  </Link>
                </nav>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-4">
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/customers" element={<AdminCustomersPage />} />
              <Route path="/categories" element={<AdminCategory />} />
              <Route path="/orders" element={<AdminOrders />} />
              <Route path="/services" element={<AdminServices />} />
              <Route path="/payments" element={<AdminPayments />} />
              <Route path="/subscriptions" element={<AdminSubscriptions />} />
              <Route path="sync" element={<AdminSync />} />
              <Route path="renews" element={<AdminRenews />} />
              <Route
                path="/reports"
                element={<div>Reports and Analytics</div>}
              />
              <Route path="/settings" element={<div>Admin Settings</div>} />
            </Routes>
          </div>
        </div>
      </motion.div>
    </ProtectedRoute>
  );
};

export default AdminPanel;
