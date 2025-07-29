import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";

import { Button } from "../ui/button";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/Dialog";
import { getsubscribeByUser } from "../../lib/subscriptionApi";
import { toast } from "sonner";
import { getAllUserSub, newSub } from "../../lib/userSub";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";

const SubscriptionPage = () => {
  const [usersSeals, setUsersSeals] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    subscription_id: "",
    total: 0,
    user_id: "",
  });

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

    const fetchUsersSeals = async () => {
      setLoading(true);
      try {
        const res = await getAllUserSub();
        if (!res) {
          toast.error("Not Found User");
        }
        setUsersSeals(res);
      } catch (error) {
        toast.error("Failed to load usersSeals");
        console.error("Failed to load usersSeals", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersSeals();
    fetchSubscriptions();
  }, [currentPage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const newUser = async () => {
    if (!formData.subscription_id) {
      return toast.error("Please Try Agin");
    }

    if (!formData.total) {
      return toast.error("Please Add Total");
    }

    setIsProcessing(true);

    const payload = {
      subscription_id: formData.subscription_id,
      total: formData.total,
    };

    try {
      const res = await newSub(formData.user_id, payload);
      if (!res || !res.user) {
        console.log(res);
        throw new Error(res?.message || "Create User  failed");
      }
      toast.success(" successful!");
      setIsDialogOpen(false);
      // change if you have a subscriptions page
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
                            : sub.status === "pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }
                      >
                        {sub.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setExpandedId((prev) =>
                            prev === sub.id ? null : sub.id
                          );
                        }}
                      >
                        {expandedId === sub.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsDialogOpen(true);
                          setFormData((prev) => ({
                            ...prev,
                            subscription_id: sub.id,
                          }));
                        }}
                      >
                        Add User
                      </Button>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Product Info */}
                  {expandedId === sub.id && sub.product && sub.accounts && (
                    <TableRow className="bg-muted">
                      <TableCell>
                        <div>
                          <p className="font-bold text-lg">
                            {sub.product.name_ar}
                          </p>
                          <p>
                            <strong>Price:</strong> ${sub.product.wholesale}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <h2>{sub.accounts.email} </h2>
                        <h2>{sub.accounts.password} </h2>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* ✅ added input fields here */}
            <div className="space-y-2">
              <Label htmlFor="user_id">Select User</Label>
              <select
                name="user_id"
                id="user_id"
                value={formData.user_id}
                onChange={handleInputChange}
                className="w-full rounded border px-3 py-2 bg-white"
              >
                <option value="">Please Select User</option>
                {usersSeals.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.phone} : {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="total">total</Label>
              <Input
                type="number"
                name="total"
                value={formData.total}
                onChange={handleInputChange}
                placeholder="Enter total"
                className="w-full p-2 rounded  border-gray-600 mt-1 "
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={newUser} disabled={isProcessing}>
              {isProcessing && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isProcessing ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPage;
