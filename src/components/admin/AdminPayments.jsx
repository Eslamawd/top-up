import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { TableBody, TableHeader, TableRow,   TableHead,TableCell, Table } from '../ui/table'
import { addPaymentBalance, loadPayments } from '../../lib/paymentApi'
import { toast } from 'sonner'
import { AlertTriangle, Loader2, Mail, Plus, UserIcon, Wallet } from 'lucide-react'
import { Button } from '../ui/button'

function AdminPayments() {

    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state for fetch f

    const handlDeposit = async (id) => {
        try {
            const res = addPaymentBalance(id)
            if (res.message) {
                toast.success(`${res.message}`)
            }
            
        } catch (error) {
            console.log(error)
            
        }
    }


      useEffect(() => {
        const fetchPay = async () => {
          try {
            const response = await loadPayments()
            setPayments(response?.payments.data || []);
            setLoading(false);
            if (response.payments.data.length === 0) {
              toast.info("No Pay found");
            }
          } catch (error) {
            setError("Failed to load payments. Please try again later.");
            console.error("Failed to fetch Pay", error);
          }
        };
    
        fetchPay();
      }, []);



  return (
    
     <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payments Management</h2>
      </div>


         <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Payments Management</CardTitle>
         
          
        </CardHeader>
        <CardContent>
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
                ) : payments.length === 0 ? (
                      <div className="text-center py-12">
                        <h2 className="text-xl font-bold mb-4">No Services Found</h2>
                        </div>): (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>phone</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments?.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        {payment?.user.name}
                      </TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {payment.user?.email}
                      </TableCell>
                      <TableCell>
                        {payment?.user?.phone}
                      </TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">${ payment?.balance || 0.00}</span>
                      </TableCell>
                  
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                     
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handlDeposit(payment.id)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            {payment.balance}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
  )
}

export default AdminPayments