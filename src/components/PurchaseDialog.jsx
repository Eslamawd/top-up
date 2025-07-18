import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../components/ui/Dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Loader2 } from "lucide-react";

import { toast } from 'sonner';
import { addOrder } from '../lib/orderApi';
import { useAuth } from '../context/AuthContext';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";

const PurchaseDialog = ({
    service,
    open,
    onPurchase,
    onOpenChange,
}) => {
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [extraParamsInput, setExtraParamsInput] = useState({});
    // تم تغيير هذا ليحتوي على الكائن أو المصفوفة أو null
    const [parsedZddkQtyValues, setParsedZddkQtyValues] = useState(null);
    const [parsedZddkRequiredParams, setParsedZddkRequiredParams] = useState([]);

    useEffect(() => {
        if (service) {
            // --- START: MODIFIED ZDDK QTY VALUES PARSING ---
            // لا حاجة لـ JSON.parse() هنا بعد الآن، البيانات تأتي جاهزة
            let qtyValues = service.zddk_qty_values;
            // تأكد أنها كائن أو مصفوفة، وإلا اجعلها null
            if (typeof qtyValues !== 'object' && !Array.isArray(qtyValues)) {
                qtyValues = null;
            }
            setParsedZddkQtyValues(qtyValues);
            // --- END: MODIFIED ZDDK QTY VALUES PARSING ---

            let initialQuantity = 1;
            if (service.is_zddk_product && qtyValues) {
                if (service.product_type === 'amount' && typeof qtyValues === 'object' && qtyValues.min) {
                    initialQuantity = parseInt(qtyValues.min);
                } else if (service.product_type === 'specificPackage' && Array.isArray(qtyValues) && qtyValues.length > 0) {
                    initialQuantity = parseInt(qtyValues[0]); // اختر القيمة الأولى كافتراضية
                }
            }
            setQuantity(initialQuantity);
            
            let initialPrice = 0;
            if (service.is_zddk_product && service.product_type === 'specificPackage') {
                 initialPrice = initialQuantity; // السعر هو الكمية نفسها للباقات المحددة
            } else {
                 initialPrice = initialQuantity * parseFloat(service.price);
            }
            setTotalPrice(initialPrice);


            // --- START: MODIFIED ZDDK REQUIRED PARAMS PARSING ---
            // لا حاجة لـ JSON.parse() هنا بعد الآن، البيانات تأتي جاهزة
            const requiredParams = Array.isArray(service.zddk_required_params) ? service.zddk_required_params : [];
            setParsedZddkRequiredParams(requiredParams);
            // --- END: MODIFIED ZDDK REQUIRED PARAMS PARSING ---

            const initialExtraParams = {};
            requiredParams.forEach(paramName => {
                initialExtraParams[paramName] = '';
            });
            setExtraParamsInput(initialExtraParams);
            
    
        }
    }, [service, open]);

    // تحديث الإجمالي عند تغير الكمية أو السعر
    useEffect(() => {
        if (service) {
            let calculatedPrice = 0;
            if (service.is_zddk_product && service.product_type === 'specificPackage') {
                calculatedPrice = quantity; // السعر هو الكمية نفسها للباقات المحددة
            } else {
                calculatedPrice = quantity * parseFloat(service.price);
            }
            setTotalPrice(calculatedPrice);
        }
    }, [quantity, service]);


    const handleExtraParamChange = (paramName, value) => {
        setExtraParamsInput(prev => ({
            ...prev,
            [paramName]: value,
        }));
    };

    const handlePurchase = async (e) => {
        e.preventDefault();
        if (!service) {
            toast.error("Please select a service.");
            return;
        }

        setIsProcessing(true);

        const collectedExtraParams = {};
        let missingParams = false;
        parsedZddkRequiredParams.forEach(paramName => {
            if (!extraParamsInput[paramName]) {
                toast.error(`Please enter ${paramName}.`);
                missingParams = true;
            }
            collectedExtraParams[paramName] = extraParamsInput[paramName];
        });

        if (missingParams) {
            setIsProcessing(false);
            return;
        }

        const orderData = {
            services: [{
                quantity: quantity,
                id: service.id,
                extra_params: collectedExtraParams
            }]
        };

        try {
            const res = await addOrder(orderData);

            if (res.id) {
                toast.success("Order created successfully!");
                onOpenChange(false);
                onPurchase();
            } else if (res.error) {
                toast.error(`Failed to create order: ${res.error}`);
            } else {
                toast.error("Failed to create order. Please try again.");
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to create order. Please try again.";
            console.error("Error creating order:", err);
            toast.error(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleQuantityChange = (value) => {
        const newQty = parseInt(value);
        setQuantity(isNaN(newQty) ? 0 : newQty);
    };

    if (!service) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-black p-6 rounded-lg shadow-lg">
                <DialogHeader>
                    <DialogTitle>Complete Your Purchase</DialogTitle>
                    <DialogDescription>
                        Review your order details and confirm your purchase.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="bg-muted p-3 rounded-md">
                        <div className="flex justify-between mb-1 text-sm">
                            <span>Service:</span>
                            <span className="font-medium">{service.title}</span>
                        </div>
                        {service.is_zddk_product && parsedZddkQtyValues && (
                            <div className="text-xs  mb-2">
                                {typeof parsedZddkQtyValues === 'object' && parsedZddkQtyValues.min && parsedZddkQtyValues.max && (
                                    <span>الكمية: {parsedZddkQtyValues.min} - {parsedZddkQtyValues.max}</span>
                                )}
                                {Array.isArray(parsedZddkQtyValues) && parsedZddkQtyValues.length > 0 && (
                                    <span>الكميات المتاحة: {parsedZddkQtyValues.join(', ')}</span>
                                )}
                            </div>
                        )}

                        <div className="flex justify-between mb-1 text-sm">
                            <span>Quantity:</span>
                            <span>{quantity}</span>
                        </div>

                        <div className="flex justify-between font-medium border-t pt-2 mt-2">
                            <span>Total:</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        {service.is_zddk_product && Array.isArray(parsedZddkQtyValues) && parsedZddkQtyValues.length > 0 ? (
                            <Select onValueChange={handleQuantityChange} value={String(quantity)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="اختر كمية" />
                                </SelectTrigger>
                                <SelectContent>
                                    {parsedZddkQtyValues.map((value, index) => (
                                        <SelectItem className='bg-black' key={index} value={String(value)}>
                                            {value}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <Input
                                name="quantity"
                                type="number"
                                min={service.is_zddk_product && parsedZddkQtyValues !== null && typeof parsedZddkQtyValues === 'object' && parsedZddkQtyValues.min ? parseInt(parsedZddkQtyValues.min) : 1}
                                max={service.is_zddk_product && parsedZddkQtyValues !== null && typeof parsedZddkQtyValues === 'object' && parsedZddkQtyValues.max ? parseInt(parsedZddkQtyValues.max) : undefined}
                                value={quantity}
                                onChange={(e) => handleQuantityChange(e.target.value)}
                            />
                        )}
                    </div>

                    {service.is_zddk_product && parsedZddkRequiredParams.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-sm mb-2">معلومات إضافية مطلوبة:</h4>
                            {parsedZddkRequiredParams.map((paramName) => (
                                <div className="flex flex-col space-y-2 mb-3" key={paramName}>
                                    <Label htmlFor={paramName}>{paramName}</Label>
                                    <Input
                                        id={paramName}
                                        type="text"
                                        value={extraParamsInput[paramName] || ''}
                                        onChange={(e) => handleExtraParamChange(paramName, e.target.value)}
                                        placeholder={`أدخل ${paramName}`}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
                        Cancel
                    </Button>
                    <Button onClick={handlePurchase} disabled={isProcessing || totalPrice <= 0}>
                        {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isProcessing ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PurchaseDialog;