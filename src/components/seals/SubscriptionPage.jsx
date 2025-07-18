import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../ui/table';

import { Button } from '../ui/button';
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '../ui/badge';
import { getsubscribeByUser } from '../../lib/subscriptionApi';
import { toast } from 'sonner';

const SubscriptionPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [expandedId, setExpandedId] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);




  
   
  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        const res = await getsubscribeByUser(currentPage);
        const data = res.data || [];

        setSubscriptions(data);
        setCurrentPage(res.current_page);
        setLastPage(res.last_page);
        setTotal(res.total);
      } catch (error) {
        toast.error("Failed to load subscriptions");
        console.error("Failed to load subscriptions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [currentPage]);


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
                  <TableHead>Account</TableHead>
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
                    {expandedId === sub.id && sub.product && sub.accounts && (
                      <TableRow className="bg-muted">
                        <TableCell>
                           
                            <div>

                              <p className="font-bold text-lg">{sub.product.name_ar}</p>
                              <p>
                                <strong>Price:</strong> ${sub.product.wholesale}
                              </p>
                         
                          </div>
                     
                        
                         </TableCell>
                     
                            <TableCell>
                               <h2>{sub.accounts.email} </h2> 
                               <h2>{sub.accounts.password}  </h2> 
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

       
      </div>
  );
};

export default SubscriptionPage;
