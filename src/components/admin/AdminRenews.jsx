import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/Dialog";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import {
  Loader2,
  ChevronDown,
  ChevronUp,
  SubtitlesIcon,
  DollarSign,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { changeStatus } from "../../lib/subscriptionApi";
import { toast } from "sonner";
import { Label } from "../ui/Label";
import { Separator } from "../ui/Separator";
import { deleteAccSub, newAccSub, updateAccSub } from "../../lib/accountSub";
import { Input } from "../ui/Input";
import { getRenewsByAdmin } from "../../lib/renew";
// Removed useNavigate as it's no longer needed for data refresh
// import { useNavigate } from 'react-router-dom';

const AdminRenews = () => {
  const [renews, setRenews] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  // const navigate = useNavigate(); // Removed

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    subscription_id: "",
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // New state for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [accountToDeleteId, setAccountToDeleteId] = useState(null);

  // Function to fetch renews data
  const fetchRenews = async () => {
    setLoading(true);
    try {
      const res = await getRenewsByAdmin(currentPage);
      const data = res.renews.data || [];

      setRenews(data);
      setCurrentPage(res.renews.current_page);
      setLastPage(res.renews.last_page);
      setTotal(res.renews.total);
    } catch (error) {
      console.error("Failed to load renews:", error);
      toast.error("Failed to load renews."); // Added toast error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRenews();
  }, [currentPage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      toast.error("Please enter email and password");
      return;
    }

    setIsProcessing(true);

    try {
      if (formData.account_id) {
        // If account exists, update it
        const res = await updateAccSub(formData.account_id, formData);
        if (res.error) {
          toast.error(res.error);
          return;
        }
        toast.success("Account updated successfully");
      } else {
        // If no account, create one
        const res = await newAccSub(formData);
        if (res.error) {
          toast.error(res.error);
          return;
        }
        toast.success("Account created successfully");
      }

      setIsDialogOpen(false);
      setFormData({ email: "", password: "", subscription_id: "" }); // Reset form data
      fetchRenews(); // Refresh data after CUD operation
    } catch (err) {
      console.error("Error:", err);
      toast.error("Operation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleStatusRole = async (id, newRole) => {
    try {
      const response = await changeStatus(id, { status: newRole });

      const updatstaut = response.subscription;
      const updatstauts = renews.map((u) =>
        u.id === updatstaut.id ? updatstaut : u
      );
      setRenews(updatstauts);

      toast.success(`Status updated to ${newRole}`);
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update status");
    }
  };

  // Function to open the delete confirmation dialog
  const confirmDeleteAccount = (accountId) => {
    setAccountToDeleteId(accountId);
    setIsDeleteDialogOpen(true);
  };

  // Function to handle the actual deletion after confirmation
  const handleDeleteAccount = async () => {
    if (!accountToDeleteId) return; // Should not happen if dialog is opened correctly

    setIsProcessing(true); // Assuming you want to show processing state for delete too
    try {
      await deleteAccSub(accountToDeleteId); // API call
      toast.success("Account deleted successfully");
      setIsDeleteDialogOpen(false); // Close the dialog
      setAccountToDeleteId(null); // Clear the ID
      fetchRenews(); // Refresh data after deletion
    } catch (err) {
      console.error("Failed to delete account:", err);
      toast.error("Failed to delete account");
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
        <h2 className="text-2xl font-bold">Renews Management</h2>
      </div>

      {renews.length === 0 ? (
        <p>You have no renews yet.</p>
      ) : (
        <>
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Duration</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renews.map((renew) => (
                <React.Fragment key={renew.id}>
                  <TableRow>
                    <TableCell>{renew.subscription.id}</TableCell>
                    <TableCell>
                      <Badge>
                        {renew.subscription.duration.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(
                        renew.subscription.starts_at
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(
                        renew.subscription.ends_at
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          renew.subscription.status === "active"
                            ? "text-green-600"
                            : renew.subscription.status === "pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }
                      >
                        {renew.subscription.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="cursor-pointer text-blue-600">
                        {renew.subscription.iptv}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="cursor-pointer text-blue-600">
                        {renew.subscription.location}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setExpandedId((prev) =>
                            prev === renew.subscription.id
                              ? null
                              : renew.subscription.id
                          )
                        }
                      >
                        {expandedId === renew.subscription.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>

                  {/* Expanded Product Info */}
                  {expandedId === renew.subscription.id &&
                    renew.subscription.product &&
                    renew.subscription.user && (
                      <TableRow className="bg-muted">
                        <TableCell>
                          <div>
                            <p className="font-bold text-lg">
                              {renew.subscription.product.name_en}
                            </p>
                            <p>
                              <strong>Price:</strong> $
                              {renew.subscription.product.price}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell> {renew.subscription.user.name} </TableCell>
                        <TableCell> {renew.subscription.user.email} </TableCell>
                        <TableCell>
                          <Select
                            defaultValue={renew.subscription.status}
                            onValueChange={(val) =>
                              toggleStatusRole(renew.subscription.id, val)
                            }
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
                          {renew.subscription.accounts ? (
                            <div className="space-y-2">
                              <p>
                                <strong>Email:</strong>{" "}
                                {renew.subscription.accounts.email}
                              </p>
                              <p>
                                <strong>Password:</strong>{" "}
                                {renew.subscription.accounts.password}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setFormData({
                                      email: renew.subscription.accounts.email,
                                      password:
                                        renew.subscription.accounts.password,
                                      subscription_id: renew.subscription.id,
                                      account_id:
                                        renew.subscription.accounts.id, // Pass account ID for update
                                    });
                                    setIsDialogOpen(true);
                                  }}
                                >
                                  Update
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    confirmDeleteAccount(
                                      renew.subscription.accounts.id
                                    )
                                  } // Use custom confirmation
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              onClick={() => {
                                setFormData({
                                  email: "",
                                  password: "",
                                  subscription_id: renew.subscription.id,
                                });
                                setIsDialogOpen(true);
                              }}
                            >
                              Create Account
                            </Button>
                          )}
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
              Page {currentPage} of {lastPage} — Total: {total} renews
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

      {/* Account Create/Update Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black text-white">
          <DialogHeader>
            <DialogTitle>
              {formData.account_id ? "Update Account" : "Create Account"}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 bg-black rounded-lg shadow text-white"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
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
                <Label htmlFor="password">Password</Label>
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing
                  ? "Saving..."
                  : formData.account_id
                  ? "Update Account"
                  : "Create Account"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Account Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-black text-white">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this account? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isProcessing}
            >
              {isProcessing ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRenews;
