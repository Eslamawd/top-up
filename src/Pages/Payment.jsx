
import  { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Copy, Check, AlertCircle, CreditCard, ExternalLink, Clock, User, LogIn } from "lucide-react";
import MainLayout from "../components/MainLayout";
import { toast } from "sonner";
import { getBalanceUser } from "../lib/walletApi";
import { addNewPay } from "../lib/paymentApi";




function Payment() {
  const [userBalance, setUserBalance] = useState(0);
  const [wishMoneyAccount] = useState('WISH-9988776655');
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('wish-money');





   const fetchUserBalance = async () => {

    try {
      const response = await getBalanceUser()
      const safeBalance = Math.max(0, response.balance || 0);

      if (userBalance !== 0 && safeBalance !== userBalance) {
        setUserBalance(userBalance);

        if (safeBalance < 10) {
          toast.warning('Your balance is low', {
            description: 'Please add funds to continue making purchases.'
          });
        }

      
      }

      setUserBalance(safeBalance);
    } catch (error) {
      console.error('Error fetching user balance:', error);
      toast.error('Failed to fetch balance');
    } 
  };

    useEffect(() => {

    fetchUserBalance();

    }, []);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(wishMoneyAccount).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleWishMoneySubmit = async(e) => {
    const formData = {
      'balance': amount,
    }

    try {
      
    e.preventDefault();
    setIsProcessing(true);
    const res =  await addNewPay(formData)
    if (res.payment) {
    // هنا يتم إرسال الطلب إلى الـ API
    setTimeout(() => {
      toast(`Send New  ${res.payment.balance}`);
      setIsProcessing(false);
    }, 2000);
  }
      
    } catch (error) {
      console.log(error)
    }
  };



  return (
    <MainLayout>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="container py-8"
          >
            <h1 className="text-3xl font-bold mb-8">Add Funds</h1>
            
            <div className="max-w-xl mx-auto">
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <div>
                      <h2 className="text-lg font-medium">Your Current Balance</h2>
                      <div className="text-3xl font-bold mt-2">${userBalance || 0}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                  <CardDescription>Select a payment method to add funds to your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
                    <TabsList className="grid grid-cols-3 mb-6">
                      <TabsTrigger value="wish-money">Wish Money</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="wish-money" className="space-y-4">
                      <div className="bg-primary/5 p-4 rounded-md mb-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Send Requist To add money</p>
                        
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleCopyAccount}
                          >
                            {copied ? (
                              <Check className="h-4 w-4 mr-2" />
                            ) : (
                              <Copy className="h-4 w-4 mr-2" />
                            )}
                            {copied ? "Copied" : "Copy"}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2 mb-6 p-3 bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 rounded-md">
                        <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium">Important:</p>
                          <p>Include your registered username in the payment notes so we can identify your payment.</p>
                        </div>
                      </div>
                      
                      <form onSubmit={handleWishMoneySubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="wm-amount">Amount You Sent</Label>
                          <Input
                            id="wm-amount"
                            type="text"
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder="Enter amount"
                            required
                          />
                        </div>
                        
                        
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={isProcessing}
                        >
                          {isProcessing ? "Processing..." : "Confirm Payment"}
                        </Button>
                      </form>
                    </TabsContent>
                    
                  
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </MainLayout>
  )
}

export default Payment