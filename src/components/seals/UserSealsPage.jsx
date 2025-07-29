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
import { Loader2, ChevronDown, ChevronUp, PlusCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/Dialog";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { getUserSub, newUserSub } from "../../lib/userSub";
import { useNavigate } from "react-router-dom";

const UserSealsPage = () => {
  const navigate = useNavigate();
  const [usersSeals, setUsersSeals] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    const fetchUsersSeals = async () => {
      setLoading(true);
      try {
        const res = await getUserSub(currentPage);
        const data = res.data || [];

        setUsersSeals(data);
        setCurrentPage(res.current_page);
        setLastPage(res.last_page);
        setTotal(res.total);
      } catch (error) {
        toast.error("Failed to load usersSeals");
        console.error("Failed to load usersSeals", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersSeals();
  }, [currentPage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name" || name === "phone") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const newUser = async () => {
    if (!formData.name) {
      return toast.error("Please Add Username");
    }

    if (!formData.phone) {
      return toast.error("Please Add Phone");
    }

    setIsProcessing(true);

    const payload = {
      name: formData.name,
      phone: formData.phone,
    };

    try {
      const res = await newUserSub(payload);
      if (!res || !res.user) {
        console.log(res);
        throw new Error(res?.message || "Create User  failed");
      }
      console.log(res);
      toast.success(" successful!");
      setIsDialogOpen(false);
      navigate("/seals/user-seals"); // change if you have a subscriptions page
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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">UsersSeals Management</h2>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
        {usersSeals.length === 0 ? (
          <p>You have no usersSeals yet.</p>
        ) : (
          <>
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>name</TableHead>
                  <TableHead>phone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersSeals.map((user) => (
                  <React.Fragment key={user.id}>
                    <TableRow>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.phone}</TableCell>

                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setExpandedId((prev) =>
                              prev === user.id ? null : user.id
                            )
                          }
                        >
                          {expandedId === user.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Product Info */}
                    {expandedId === user.id &&
                      Array.isArray(user.all_subs) &&
                      user.all_subs.length > 0 &&
                      user.all_subs.map((sub) => (
                        <React.Fragment key={sub.id}>
                          <TableRow className="bg-muted">
                            <TableCell>
                              <div className="flex justify-between">
                                <div>
                                  <p className="font-bold ">
                                    email : {sub.subscription?.accounts?.email}
                                  </p>
                                  <p>
                                    password :
                                    {sub.subscription?.accounts?.password}
                                  </p>
                                  <br />
                                  <p>Duration :{sub.subscription?.duration}</p>
                                  <br />
                                  <p>status :{sub.subscription?.status}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-between">
                                <div>
                                  <p className="font-bold ">
                                    Name Product :
                                    {sub.subscription?.product?.name_en ||
                                      sub.subscription?.product?.name_ar}
                                    <br />
                                    Price Product :
                                    {sub.subscription?.product?.price_wholesale}
                                  </p>
                                  <p>Total: {sub.total}</p>
                                </div>
                              </div>
                            </TableCell>
                            {sub.order ? (
                              <TableCell>
                                <div className="flex justify-between">
                                  <div>
                                    <p className="font-bold ">
                                      Name Product :
                                      {sub.order?.product?.name_en ||
                                        sub.order?.product?.name_ar}
                                      <br />
                                      Price Product :
                                      {sub.order?.product?.price_wholesale}
                                    </p>
                                    <p>{sub.order.response}</p>
                                    <p>Total: {sub.total}</p>
                                  </div>
                                </div>
                              </TableCell>
                            ) : null}
                          </TableRow>
                        </React.Fragment>
                      ))}
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
                Page {currentPage} of {lastPage} — Total: {total} UsersSeals
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
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* ✅ added input fields here */}
            <div>
              <Label htmlFor="name">User Name</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter User Name"
                className="w-full p-2 rounded bg-white border border-gray-600 mt-1 "
              />
            </div>

            <div>
              <Label htmlFor="phone">phone</Label>
              <Input
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone"
                className="w-full p-2 rounded bg-white border border-gray-600 mt-1 "
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
    </>
  );
};

export default UserSealsPage;
