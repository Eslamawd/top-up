import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { toast } from "sonner";
import { 
  User,
  Package,
  CreditCard,
  Settings,
  Bell,
  LogOut,
  Shield,
  History,
  Calendar,
  Clock,
  Key,
  Copy,
  Loader2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getBalanceUser } from "../lib/walletApi";
import { loadPaymentByUser } from "../lib/paymentApi";

function Account() {
    const { user, logout } = useAuth()
    const [ balance, setBalance ] = useState(0)
    const [ payments, setPayments ] = useState([])
    const [ isLoading, setIsLoading ] = useState(true)
    const navigate = useNavigate()


    useEffect(() => {

        const fetchBalance = async () => {
            try {
            const res = await getBalanceUser()
            const payAll = await loadPaymentByUser()
            if (res.balance) {
                setBalance(res.balance)
            }
            if (payAll.payments.data) {
                setPayments(payAll.payments.data)
            }
            setIsLoading(false);
             } catch (error) {
                  console.error('Error fetching user balance:', error);
                  toast.error('Failed to fetch balance');
                } 
        }
        fetchBalance()
    },[])


    const handleLogout = () => { 
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
          className="container mx-auto px-4 py-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="bg-primary/10 text-primary p-3 rounded-full">
                <User size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Account</h1>
                <p className="text-muted-foreground">Manage your profile and preferences</p>
              </div>
            </div>
           
          </div>
  
          <Tabs defaultValue="profile" className="space-y-10 pb-9">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-6 space-x-4 space-y-4">
              <TabsTrigger value="profile" >Profile</TabsTrigger>
              <TabsTrigger value="orders" >Orders</TabsTrigger>
              <TabsTrigger value="payments" >Payments</TabsTrigger>
              <TabsTrigger value="settings" >Settings</TabsTrigger>
            </TabsList>
  
            <TabsContent value="profile" className="space-8 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <p>{user.name || "Not set"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                      <p>{user.email || "Not set"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                      <p>{user.phone || "Not set"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Account Balance</label>
                      <p>${balance}</p>
                    </div>
                  </div>
            
                </CardContent>
              </Card>
  
           
              
          
            </TabsContent>
  
            <TabsContent value="orders" className="space-y-6">
              <Card className="space-y-4 mt-8 pt-10">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
            
                  <div className="flex justify-center mt-6">
                    <Button >
                      <Link to="/checkout">
                        <History className="mr-2 h-4 w-4" />
                        View All Orders
                      </Link>
                    </Button>
                    <Button >
                      <Link to="/my-subscriptions">
                        <History className="mr-2 h-4 w-4" />
                        View All Subscriptions
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
           
            </TabsContent>
  
            <TabsContent value="payments" className="space-y-6">
             
              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                </CardHeader>
                <CardContent>
                 
                    {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-2 text-muted-foreground">Loading Pay...</span>
                    </div>
                ) : payments.length === 0 ? (
                    <div className="text-center py-12">
                        <h2 className="text-xl font-bold mb-4">No Payments Found</h2>
                        <p className="text-muted-foreground">You have not made any payments yet.</p>
                    </div>
                ) : ( 
                  <div className="space-y-4">
                    {payments.map((payment) => (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4" key={payment.id}>
                      <div>
                        <h3 className="font-medium">Invoice #{payment.id}</h3>
                        <p className="text-sm text-muted-foreground">{payment.created_at}</p>
                      </div>
                      <div className="flex flex-col mt-3 sm:mt-0 sm:text-right">
                        <span className="text-sm font-medium">${payment.balance}</span>
                        <Button size="sm" variant="ghost" className="mt-2">Download</Button>
                      </div>
                    </div>
                    ))}
                </div>
                )}
                   
                </CardContent>
              </Card>
            </TabsContent>
  
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4">
                      <div>
                        <h3 className="font-medium">Language</h3>
                        <p className="text-sm text-muted-foreground">Change your preferred language</p>
                      </div>
                      <Button size="sm" variant="outline" className="mt-2 sm:mt-0">English (US)</Button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4">
                      <div>
                        <h3 className="font-medium">Timezone</h3>
                        <p className="text-sm text-muted-foreground">Set your local timezone</p>
                      </div>
                      <Button size="sm" variant="outline" className="mt-2 sm:mt-0">(UTC-05:00) Eastern Time</Button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4">
                      <div>
                        <h3 className="font-medium">Delete Account</h3>
                        <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                      </div>
                      <Button size="sm" variant="destructive" className="mt-2 sm:mt-0">Delete Account</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button variant="outline" className="mr-2">Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            
            </TabsContent>
              
                <Button 
                  variant="destructive" 
                  onClick={handleLogout}
                  className="flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
            
          </Tabs>
        </motion.div>
      </MainLayout>
    );
}

export default Account