import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";

import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue
} from "../components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "../components/ui/Dialog";

import { getServie } from "../lib/serviceApi";
import { addOrder } from "../lib/orderApi";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../components/MainLayout";

const ServiceDetail = () => {
    const  { user } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [extraParamsInput, setExtraParamsInput] = useState({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getServie(id);
                const fetched = res.product;
                setService(fetched);

                // Initialize user_fields input
                const initialFields = {};
                (fetched.user_fields || []).forEach(field => {
                    initialFields[field.field_name] = '';
                });
                setExtraParamsInput(initialFields);
            } catch (error) {
                toast.error("Failed to load service details");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleFieldChange = (name, value) => {
        setExtraParamsInput(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleQuantityChange = (value) => {
        const newQty = parseInt(value);
        if (!isNaN(newQty) && newQty > 0) {
            setQuantity(newQty);
        }
    };

    const totalPrice = service ? (quantity * parseFloat(service.price)).toFixed(2) : "0.00";

const handleBuy = async () => {
    if (!service) return;

    // Validate required fields
    for (const field of service.user_fields || []) {
        if (
            field.required &&
            (!extraParamsInput[field.field_name] || extraParamsInput[field.field_name].trim() === "")
        ) {
            toast.error(`Please fill ${field.field_label}`);
            return;
        }
    }

    setIsProcessing(true);

    // 🚀 التحويل الصحيح للشكل المطلوب في Laravel
    const userFieldsArray = Object.entries(extraParamsInput).map(([key, value]) => ({
        field_name: key,
        value: value
    }));

    const payload = {
        product_id: service.id,
        count: quantity,
        user_fields: userFieldsArray
    };

    try {
        const res = await addOrder(payload);
        if (res && res.order) {
            toast.success("Order created successfully!");
            setIsDialogOpen(false);
            navigate("/checkout");
        } else {
            toast.error("Failed to create order");
        }
    } catch (err) {
       toast.error(`${err.response.data.message}`);
    
    } finally {
        setIsProcessing(false);
    }
};

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <Loader2 className="animate-spin h-10 w-10 text-primary" />
            </div>
        );
    }

    if (!service) {
        return (
            <div className="text-center mt-20">
                <p>Service not found.</p>
                <Button asChild>
                    <Link to="/services"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link>
                </Button>
            </div>
        );
    }

    return (
           <MainLayout>
            <main className="container pt-24 pb-12">
                <div className="mb-4">
                    <Button variant="ghost" asChild>
                        <Link to="/services"><ArrowLeft className="h-4 w-4 mr-2" />Back</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                        <img 
                        src={service.image} 
                        alt={service.name_en} 
                        className="rounded-lg w-100 h-100" />
                        <h1 className="text-3xl font-bold">{service.name_en}</h1>
                        <h1 className="text-3xl font-bold">${service.price}</h1>

                        {service.category?.name_ar && (
                            <Badge>{service.category.name_ar}</Badge>
                        )}
                       
                    </div>

                    <div className="bg-card p-6 rounded-lg shadow-md sticky top-24">
                        <h2 className="text-xl font-semibold mb-2">Buy This Service</h2>
                        <div className="mb-4">
                            <Label htmlFor="quantity">Quantity</Label>
                            <div className="flex items-center mt-1">
                                <Button size="icon" onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1}>
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                    id="quantity"
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => handleQuantityChange(e.target.value)}
                                    className="w-20 text-center mx-2"
                                />
                                <Button size="icon" onClick={() => handleQuantityChange(quantity + 1)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Dynamic User Fields */}
                        {service.user_fields?.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="font-semibold text-sm">Extra Info:</h4>
                                {service.user_fields.map(field => (
                                    <div key={field.id}>
                                        <Label htmlFor={field.field_name}>{field.field_label}</Label>

                                        {field.field_type === 4 && field.items_list ? (
                                            <Select
                                                onValueChange={(value) => handleFieldChange(field.field_name, value)}
                                                value={extraParamsInput[field.field_name]}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder={`Select ${field.field_label}`} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {field.items_list.split(",").map((item, idx) => (
                                                        <SelectItem key={idx} value={item.trim()}>
                                                            {item.trim()}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : field.field_type === 3 ? (
                                            <textarea
                                                id={field.field_name}
                                                value={extraParamsInput[field.field_name]}
                                                onChange={(e) => handleFieldChange(field.field_name, e.target.value)}
                                                className="border rounded px-3 py-2 w-full"
                                            />
                                        ) : (
                                            <Input
                                                id={field.field_name}
                                                type={field.field_type === 2 ? "number" : field.field_type === 5 ? "email" : "text"}
                                                value={extraParamsInput[field.field_name]}
                                                onChange={(e) => handleFieldChange(field.field_name, e.target.value)}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="border-t mt-4 pt-4">
                            <p className="flex justify-between mb-2">
                                <span>Total:</span>
                                <span className="font-bold">${totalPrice}</span>
                            </p>
                            {
                                user && (
                                    
                            <Button className="w-full" onClick={() => setIsDialogOpen(true)}>
                                <CreditCard className="h-4 w-4 mr-2" />
                                Buy Now
                            </Button>
                                    
                                )
                            }
                        </div>
                    </div>
                </div>
            </main>

            {/* Confirmation Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className='bg-black'>
                    <DialogHeader>
                        <DialogTitle>Confirm Purchase</DialogTitle>
                        <DialogDescription>Confirm buying {service.name_en} for ${totalPrice}</DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-3">
                        <p><strong>Quantity:</strong> {quantity}</p>
                        {service.user_fields?.length > 0 && (
                            <>
                                <h4 className="font-medium text-sm mt-2">Extra Details:</h4>
                                {service.user_fields.map(field => (
                                    <p key={field.id} className="text-sm">
                                        <strong>{field.field_label}:</strong> {extraParamsInput[field.field_name] || "N/A"}
                                    </p>
                                ))}
                            </>
                        )}
                        <p className="border-t pt-2"><strong>Total:</strong> ${totalPrice}</p>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleBuy} disabled={isProcessing}>
                            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isProcessing ? "Processing..." : "Confirm"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            </MainLayout>
   
    );
};

export default ServiceDetail;
