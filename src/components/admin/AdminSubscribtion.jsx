import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "../ui/Dialog";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from '../ui/button';
import { Loader2, ChevronDown, ChevronUp, SubtitlesIcon, DollarSign } from 'lucide-react';
import { Badge } from '../ui/badge';
import { changeStatus, getAllSubCount, getRevnueSub, getsubscribeByAdmin } from '../../lib/subscriptionApi';
import { toast } from 'sonner';
import { Label } from '../ui/Label';
import { Separator } from '../ui/Separator';
import { newAccSub } from '../../lib/accountSub';
import { Input } from '../ui/Input';
import { useNavigate } from 'react-router-dom';

const AdminSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [expandedId, setExpandedId] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [totalSub, setTotalSub] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    subscription_id: ''
})



  
      const [isDialogOpen, setIsDialogOpen] = useState(false);
      const [isProcessing, setIsProcessing] = useState(false);


      const handleInputChange = (e) => {
    const { name, value } = e.target;
  
      setFormData((prev) => ({ ...prev, [name]: value }));
  
  };


        const handleSubmit = async (e) => {
           e.preventDefault();
       
           if (!formData.email.trim() || !formData.password.trim()) {
             toast.error(" Please Create New email or pass");
             return;
           }
       
       
           setIsProcessing(true);
           try {
             const res = await newAccSub(formData);
             if (res && res.account) {
               toast.success(`Create New Account Successfully`);
               toast.success(` Account : ${res.account.email} `);
               setIsProcessing(false)
               setIsDialogOpen(false)
               navigate(`/admin/subscriptions`);
              
             }
           } catch (err) {
             console.error("Error creating Account:", err);
             toast.error("حدث خطأ أثناء الإنشاء");
           } finally {
             setIsProcessing(false);
           }
         };
       
  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        const res = await getsubscribeByAdmin(currentPage);
        const data = res.subscriptions.data || [];

        setSubscriptions(data);
        setCurrentPage(res.subscriptions.current_page);
        setLastPage(res.subscriptions.last_page);
        setTotal(res.subscriptions.total);
      } catch (error) {
        console.error("Failed to load subscriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [SubCount, revenueResponse] = await Promise.all([
        
          getAllSubCount(),
          getRevnueSub(),
        ]);
  
        if (SubCount && SubCount.count >= 0) {
          setTotalSub(SubCount.count);
        } else {
          setTotalSub(0);
          toast.error("No users found");
        }
  
  
        if (revenueResponse && revenueResponse.count >= 0) {
          setRevenue(revenueResponse.count);
        } else {
          setRevenue(0);
          toast.error("No revenue data found");
        }
  
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Something went wrong while fetching dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  const toggleStatusRole = async (id, newRole) => {
    try {
      const response = await changeStatus(id, { status: newRole });
  
      const updatstaut = response.subscription;
      const updatstauts = subscriptions.map((u) => (u.id === updatstaut.id ? updatstaut : u));
      setSubscriptions(updatstauts);
    
  
      toast.success(`Role updated to ${newRole}`);
    } catch (error) {
      console.error("Failed to update role", error);
      toast.error("Failed to update role");
    }
  };

  const userPercentChange = totalSub > 0 ? `+${((totalSub / 100) * 5).toFixed(2)}%` : "0%";
  const revenuePercentChange = revenue > 0 ? `+${((revenue / 100) * 5).toFixed(2)}%` : "0%";
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
      <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Subscriptions Management</h2>
      </div>


       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <SubtitlesIcon className="h-4 w-4 text-muted-foreground" />
            Total Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
          ) : (
            <motion.div 
              className="text-2xl font-bold"
              key={totalSub}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {totalSub.toLocaleString()}
            </motion.div>
          )}
          <p className="text-xs text-gray-500">{userPercentChange} from last month</p>
        </CardContent>
      </Card>
    
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
          ) : (
            <motion.div 
              className="text-2xl font-bold"
              key={revenue}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              ${revenue.toLocaleString()}
            </motion.div>
          )}
          <p className="text-xs text-gray-500">{revenuePercentChange} from last month</p>
        </CardContent>
      </Card>
    </div>
        {subscriptions.length === 0 ? (
          <p>You have no subscriptions yet.</p>
        ) : (
          <>
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => (
                  <React.Fragment key={sub.id}>
                    <TableRow>
                      <TableCell>{sub.id}</TableCell>
                      <TableCell>
                        <Badge>{sub.duration.replace('_', ' ')}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(sub.starts_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(sub.ends_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            sub.status === 'active'
                              ? 'text-green-600'
                              : sub.status ==='pending'
                              ? 'text-yellow-600' 
                              : 'text-red-600'
                          }
                        >
                          {sub.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setExpandedId((prev) =>
                              prev === sub.id ? null : sub.id 
                            )
                          }
                        >
                          {expandedId === sub.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Product Info */}
                    {expandedId === sub.id && sub.product && sub.user && (
                      <TableRow className="bg-muted">
                        <TableCell>
                           
                            <div>
                              <p className="font-bold text-lg">{sub.product.name_ar}</p>
                              <p>
                                <strong>Price:</strong> ${sub.product.price}
                              </p>
                         
                          </div>
                     
                        
                         </TableCell>
                     
                            <TableCell> {sub.user.name} </TableCell>
                            <TableCell> {sub.user.email} </TableCell>
                            <TableCell> 
                               
                                 <Select
                                        defaultValue={sub.status}
                                        onValueChange={(val) => toggleStatusRole(sub.id, val)}
                                        >
                                        <SelectTrigger className="w-[110px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-black text-white">
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="expired">Expired</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                        </SelectContent>
                                        </Select>
                             
                                
                                 </TableCell>

                                 <TableCell>
                                  {
                                    sub.accounts ? <>
                                    <p>{sub.accounts.email}</p>
                                    <p>{sub.accounts.password}</p>
                                    </> : 
                                      <Button
                                    onClick={
                                        () => {                  
                                             setFormData((prev) => ({ ...prev, subscription_id: sub.id }));
                                             setIsDialogOpen(true)
                                            }}
                                    >
                                        Create Account
                                    </Button>
                                    
                                  }
                                  
                                 </TableCell>
                     
                       
                         
                       
                      </TableRow>
                    ) 
                }
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {lastPage} — Total: {total} subscriptions
              </span>
              <Button
                disabled={currentPage === lastPage}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(lastPage, prev + 1))
                }
              >
                Next
              </Button>
            </div>
          </>
        )}

         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-black text-white">
                    <DialogHeader>
                        <DialogTitle>Confirm Account Subscription</DialogTitle>
                   
                    </DialogHeader>

                      <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-black rounded-lg shadow text-white">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                           <div className="space-y-2">
                             <Label htmlFor="name_en">Email </Label>
                             <Input
                               id="email"
                               name="email"
                               type="email"
                               value={formData.email}
                               onChange={handleInputChange}
                               placeholder="Example: www@gmail.com"
                               required
                             />
                           </div>
                           <div className="space-y-2">
                             <Label htmlFor="name_en">Password</Label>
                             <Input
                               id="password"
                               name="password"
                               type="text"
                               value={formData.password}
                               onChange={handleInputChange}
                               placeholder="Example: 123445"
                               required
                             />
                           </div>
                   
                      
                          
                         </div>
                   
                         <Separator />
                   
                         <div className="flex justify-end space-x-2">
                           <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isProcessing}>
                             Cancel
                           </Button>
                           <Button type="submit" disabled={isProcessing}>
                             {isProcessing ? "Saving..." : "Create Account"}
                           </Button>
                         </div>
                       </form>

                </DialogContent>
            </Dialog>
      </div>
  );
};

export default AdminSubscriptions;
