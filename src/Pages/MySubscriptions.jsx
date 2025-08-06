import React, { useEffect, useState } from "react";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/Dialog";
import { Button } from "../components/ui/button";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { getsubscribeByUser } from "../lib/subscriptionApi";
import { Label } from "../components/ui/Label";
import { renewSubscription } from "../lib/renew";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const MySubscriptions = () => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [sub, setSub] = useState(null);
  const [duration, setDuration] = useState("1_month");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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
        console.error("Failed to load subscriptions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [currentPage]);

  const priceBasedOnRole =
    user?.role === "seals" ? sub?.product.price_wholesale : sub?.product.price;

  const basePrice = parseFloat(priceBasedOnRole);
  const durationMap = {
    "1_month": 1,
    "3_months": 3,
    "6_months": 6,
    "1_year": 12,
  };

  const totalRenew = (basePrice * durationMap[duration]).toFixed(2);

  const handleBuy = async () => {
    if (!sub) return;

    setIsProcessing(true);

    const payload = {
      subscription_id: sub.id,
      duration: duration,
    };

    try {
      const res = await renewSubscription(payload);

      toast.success(`${res.message}`);
      setIsDialogOpen(false);
      setSub(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to subscribe");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="container pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-6">My Subscriptions</h1>

        {subscriptions.length === 0 ? (
          <p>You have no subscriptions yet.</p>
        ) : (
          <>
            <Table className="w-full mt-16">
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
                        <Badge>{sub.duration.replace("_", " ")}</Badge>
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
                            sub.status === "active"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {sub.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const today = new Date();
                          const endsAt = new Date(sub.ends_at);
                          const diffTime = endsAt - today;
                          const diffDays = Math.ceil(
                            diffTime / (1000 * 60 * 60 * 24)
                          );

                          return diffDays <= 7 ? (
                            <Button
                              className="px-2 py-1 bg-blue-500 text-white rounded"
                              onClick={() => {
                                setIsDialogOpen(true);
                                setSub(sub);
                              }}
                            >
                              Renew
                            </Button>
                          ) : (
                            <span>{diffDays}:Renew days</span>
                          );
                        })()}
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
                    {expandedId === sub.id && sub.product && (
                      <TableRow className="bg-muted">
                        <TableCell colSpan={2}>
                          <div className="flex items-start gap-4 p-4">
                            <img
                              src={sub.product.image}
                              alt={sub.product.name_en}
                              className="w-20 h-20 object-cover rounded border"
                            />
                            <div>
                              <p className="font-bold text-lg">
                                {sub.product.name_en}
                              </p>
                              <p className="text-muted-foreground mb-2">
                                {sub.product.description}
                              </p>
                              <p>
                                <strong>Price:</strong> ${sub.product.price}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const today = new Date();
                            const endsAt = new Date(sub.ends_at);
                            return today === endsAt
                              ? null
                              : sub.accounts && (
                                  <>
                                    <h2>{sub.accounts.email} </h2>
                                    <h2>{sub.accounts.password} </h2>
                                  </>
                                );
                          })()}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white ">
          <DialogHeader>
            <DialogTitle>Confirm Renew</DialogTitle>
            <DialogDescription>
              <strong>{duration.replace("_", " ")}</strong> at{" "}
              <strong>${totalRenew}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <p>
              <strong>Duration:</strong> {duration.replace("_", " ")}
            </p>
            <p>
              <strong>Total:</strong> ${totalRenew}
            </p>
          </div>

          {/* Duration Selection */}
          <div className="mb-4">
            <Label htmlFor="duration">Subscription Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select Duration" />
              </SelectTrigger>
              <SelectContent className="max-h-60 bg-white">
                <SelectItem value="1_month">1 Month</SelectItem>
                <SelectItem value="3_months">3 Months</SelectItem>
                <SelectItem value="6_months">6 Months</SelectItem>
                <SelectItem value="1_year">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBuy} disabled={isProcessing}>
              {isProcessing && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isProcessing ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MySubscriptions;
