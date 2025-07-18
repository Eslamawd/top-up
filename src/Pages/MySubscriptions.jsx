import React, { useEffect, useState } from 'react';
import MainLayout from '../components/MainLayout';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { getsubscribeByUser } from '../lib/subscriptionApi';

const MySubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
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
        setCurrentPage(res.data.current_page);
        setLastPage(res.last_page);
        setTotal(res.total);
      } catch (error) {
        console.error("Failed to load subscriptions",error);
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
    <MainLayout>
      <div className="container pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-6">My Subscriptions</h1>

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
                        <TableCell colSpan={2}>
                          <div className="flex items-start gap-4 p-4">
                            <img
                              src={sub.product.image}
                              alt={sub.product.name_ar}
                              className="w-20 h-20 object-cover rounded border"
                            />
                            <div>
                              <p className="font-bold text-lg">{sub.product.name_ar}</p>
                              <p className="text-muted-foreground mb-2">{sub.product.description}</p>
                              <p>
                                <strong>Price:</strong> ${sub.product.price}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                         <TableCell>
                              <h2>{sub.accounts.email} </h2> 
                             <h2>{sub.accounts.password}  </h2> 
                          </TableCell>
                      </TableRow>
                    )}
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
    </MainLayout>
  );
};

export default MySubscriptions;
