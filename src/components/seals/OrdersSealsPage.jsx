import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/Dialog";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Clock, CheckCircle, Info } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { loadOrder } from "../../lib/orderApi";
import { getAllUserSub, newSub } from "../../lib/userSub";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";

const OrdersSealsPage = () => {
  const [orders, setOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [usersSeals, setUsersSeals] = useState([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    order_id: "",
    total: 0,
    user_id: "",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    links: [],
  });

  const navigate = useNavigate();

  const fetchOrders = async (page) => {
    try {
      setIsLoading(true);
      const res = await loadOrder(page); // تأكد أن دالة getAllOrders تقبل page
      const data = res.orders?.data || [];

      setOrders(data);
      setPendingOrders(data.filter((o) => o.payment_status === "pending"));
      setCompletedOrders(data.filter((o) => o.payment_status === "completed"));

      setPagination({
        currentPage: res.orders.current_page,
        lastPage: res.orders.last_page,
        total: res.orders.total,
        links: res.orders.links,
      });
    } catch (error) {
      toast.error("فشل في تحميل الطلبات");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchUsersSeals = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const newUser = async () => {
    if (!formData.order_id) {
      return toast.error("Please Try Agin");
    }

    if (!formData.total) {
      return toast.error("Please Add Total");
    }

    setIsProcessing(true);

    const payload = {
      order_id: formData.order_id,
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

  useEffect(() => {
    fetchUsersSeals();
    fetchOrders(pagination.currentPage);
  }, []);

  const displayOrders =
    activeTab === "pending"
      ? pendingOrders
      : activeTab === "completed"
      ? completedOrders
      : orders;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>الطلبات</CardTitle>
            <CardDescription>
              قائمة الطلبات المُقدمة من المستخدمين
            </CardDescription>
          </div>
          {pendingOrders.length > 0 && (
            <Badge variant="destructive" className="flex gap-1">
              <Clock className="h-3 w-3" />
              {pendingOrders.length} قيد الانتظار
            </Badge>
          )}
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">الكل</TabsTrigger>
              <TabsTrigger value="pending">قيد الانتظار</TabsTrigger>
              <TabsTrigger value="completed">مكتمل</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : displayOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  لا يوجد طلبات
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>المستخدم</TableHead>
                        <TableHead>المنتج</TableHead>
                        <TableHead>الإجمالي</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>تاريخ الإنشاء</TableHead>
                        <TableHead>أوامر</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-xs">
                            {order.id}
                          </TableCell>
                          <TableCell>{order.user?.email}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              onClick={() =>
                                navigate(`/services/${order.product.id}`)
                              }
                              className="w-full justify-start"
                            >
                              {order.product.name_ar}
                            </Button>
                          </TableCell>
                          <TableCell>
                            ${parseFloat(order.total_price).toFixed(2)}
                          </TableCell>

                          <TableCell>
                            {order.created_at
                              ? format(new Date(order.created_at), "PPP")
                              : "—"}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setIsDialogOpen(true);
                                setFormData((prev) => ({
                                  ...prev,
                                  order_id: order.id,
                                }));
                              }}
                            >
                              Add User
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  <div className="flex justify-between items-center mt-6 text-sm">
                    <span>
                      صفحة {pagination.currentPage} من {pagination.lastPage}
                    </span>
                    <div className="space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={pagination.currentPage === 1}
                        onClick={() => fetchOrders(pagination.currentPage - 1)}
                      >
                        السابق
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={
                          pagination.currentPage === pagination.lastPage
                        }
                        onClick={() => fetchOrders(pagination.currentPage + 1)}
                      >
                        التالي
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="bg-muted/50 p-3 text-xs text-muted-foreground flex justify-between">
          <span>إجمالي الطلبات: {pagination.total}</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              قيد الانتظار: {pendingOrders.length}
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              مكتمل: {completedOrders.length}
            </span>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white ">
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
                className="w-full p-2 rounded  border border-gray-600 mt-1 "
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

export { OrdersSealsPage };
