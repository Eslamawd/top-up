import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "../ui/Card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "../ui/table";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Clock, CheckCircle, Info } from "lucide-react";
import { format } from "date-fns";
import { toast } from 'sonner';
import { getAllOrders } from '../../lib/adminApi';
import { useNavigate } from 'react-router-dom';
import { updateOrder } from '../../lib/orderApi';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

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
      const res = await getAllOrders(page); // تأكد أن دالة getAllOrders تقبل page
      const data = res.orders?.data || [];

      setOrders(data);
      setPendingOrders(data.filter(o => o.payment_status === 'pending'));
      setCompletedOrders(data.filter(o => o.payment_status === 'completed'));

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

  useEffect(() => {
    fetchOrders(pagination.currentPage);
  }, []);

  const resolveOrder = async (order) => {
    try {
      await updateOrder(order.id, { payment_status: 'completed' });
      toast.success("تم تحديث حالة الطلب");

      fetchOrders(pagination.currentPage); // إعادة تحميل نفس الصفحة
    } catch (error) {
      toast.error("فشل في تحديث الطلب");
    }
  };

  const displayOrders = activeTab === "pending"
    ? pendingOrders
    : activeTab === "completed"
      ? completedOrders
      : orders;

  const renderUserFields = (fields) => (
    <ul className="text-xs space-y-1 mt-2 text-muted-foreground">
      {fields.map((f, idx) => (
        <li key={idx}><strong>{f.field_name}:</strong> {f.value}</li>
      ))}
    </ul>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>الطلبات</CardTitle>
          <CardDescription>قائمة الطلبات المُقدمة من المستخدمين</CardDescription>
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
                    {displayOrders.map(order => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">{order.id}</TableCell>
                        <TableCell>{order.user?.email}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            onClick={() => navigate(`/services/${order.product.id}`)}
                            className="w-full justify-start"
                          >
                            {order.product.name_ar}
                          </Button>
                        </TableCell>
                        <TableCell>${parseFloat(order.total_price).toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
                            order.payment_status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.payment_status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.payment_status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.payment_status === 'pending' && <Clock className="h-3 w-3" />}
                            {order.payment_status === 'completed' && <CheckCircle className="h-3 w-3" />}
                            {order.payment_status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {order.created_at ? format(new Date(order.created_at), 'PPP') : '—'}
                        </TableCell>
                        <TableCell className="space-y-2">
                          {order.payment_status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => resolveOrder(order)}
                              className="w-full flex items-center gap-1"
                            >
                              <CheckCircle className="h-3 w-3" />
                              مكتمل
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="secondary"
                            className="w-full flex items-center gap-1"
                            onClick={() => {
                              toast.info(
                                <>
                                  <p className="mb-1 text-sm font-semibold">تفاصيل الطلب:</p>
                                  {renderUserFields(order.user_fields)}
                                  {order.response?.msg && (
                                    <p className="text-red-600 mt-2">⚠️ {order.response.msg}</p>
                                  )}
                                </>,
                                { duration: 8000 }
                              );
                            }}
                          >
                            <Info className="h-3 w-3" />
                            التفاصيل
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-6 text-sm">
                  <span>صفحة {pagination.currentPage} من {pagination.lastPage}</span>
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
                      disabled={pagination.currentPage === pagination.lastPage}
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
  );
};

export { AdminOrders };
