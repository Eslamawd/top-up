import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Routes, Route } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/button";
import MainLayout from "../components/MainLayout";

import { 
  BarChart3, LogOut, AlertTriangle,
  AlignCenterVertical,
  PlusCircle,
  ServerCrashIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import SubscriptionPage from "../components/seals/SubscriptionPage";

const SealsPanel = () => {
  const navigate = useNavigate();
  const { logout } = useAuth()
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

 
    const handleLogout =  () => {

       logout().then(() => {
       navigate('/'); // Redirect to home page
       }).catch((error) => {
        console.error('Logout failed:', error);
      // Optionally, you can show an error message to the user
        alert('Logout failed. Please try again.');
       });
            };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="container py-8"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Seller Panel</h1>
          <div className="flex items-center gap-3">
            <Button variant="destructive" size="sm" onClick={handleLogout} className="flex gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    onClick={() => navigate("/seals")}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
            

                  
                
                
                </nav>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-4">
            <Routes>
              <Route path="/" element={<SubscriptionPage />} />
            

            </Routes>
          </div>
        </div>
      </motion.div>
    </MainLayout>
 
  );
};

export default SealsPanel;
