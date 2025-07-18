import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../components/ui/button";
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

import { subscribeToService } from "../lib/subscriptionApi";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../components/MainLayout";
import { getServie } from "../lib/serviceApi";

const StreamsDetail = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [stream, setStream] = useState(null);
    const [loading, setLoading] = useState(true);
    const [duration, setDuration] = useState("1_month");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getServie(id);
                setStream(res.product);
                setLoading(false);
            } catch (error) {
                console.error("Error loading service details:", error);
                setStream(null);
                toast.error("Failed to load service details");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleBuy = async () => {
        if (!stream) return;

        setIsProcessing(true);

        const payload = {
            product_id: stream.id,
            duration: duration
        };

        try {
            const res = await subscribeToService(payload);
            if (!res || !res.subscription) {
                throw new Error(res?.message || "Subscription failed");
            }
            toast.success("Subscription successful!");
            setIsDialogOpen(false);
            navigate("/my-subscriptions"); // change if you have a subscriptions page
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to subscribe");
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

    if (!stream) {
        return (
            <div className="text-center mt-20">
                <p>Service not found.</p>
                <Button asChild>
                    <Link to="/streams"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link>
                </Button>
            </div>
        );
    }
    const priceBasedOnRole  = user?.role === 'seals' ? stream.price_wholesale : stream.price;

    const basePrice = parseFloat(priceBasedOnRole );
   const durationMap = {
    '1_month': 1,
    '3_months': 3,
    '6_months': 6,
    '1_year': 12,
};

const total = (basePrice * durationMap[duration]).toFixed(2);


    return (
        <MainLayout>
            <main className="container pt-24 pb-12">
                <div className="mb-4">
                    <Button variant="ghost" asChild>
                        <Link to="/servces"><ArrowLeft className="h-4 w-4 mr-2" />Back</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                        <img
                            src={stream.image}
                            alt={stream.service_name_ar}
                            className="rounded-lg w-100 h-100"
                        />
                        <h1 className="text-3xl font-bold">{stream.name_ar}</h1>
                        <h2 className="text-2xl font-bold">${priceBasedOnRole}</h2>
                        <p className="text-muted-foreground">{stream.description}</p>
                    </div>

                    <div className="bg-card p-6 rounded-lg shadow-md sticky top-24">
                        <h2 className="text-xl font-semibold mb-2">Subscribe</h2>

                        {/* Duration Selection */}
                        <div className="mb-4">
                            <Label htmlFor="duration">Subscription Duration</Label>
                            <Select value={duration} onValueChange={setDuration}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Duration" />
                                </SelectTrigger>
                                <SelectContent className="max-h-60 bg-black">
                                    <SelectItem value="1_month">1 Month</SelectItem>
                                    <SelectItem value="3_months">3 Months</SelectItem>
                                    <SelectItem value="6_months">6 Months</SelectItem>
                                    <SelectItem value="1_year">1 Year</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Total Price */}
                        <div className="border-t mt-4 pt-4">
                            <p className="flex justify-between mb-2">
                                <span>Total:</span>
                                <span className="font-bold">${total}</span>
                            </p>
                            {user && (
                                <Button className="w-full" onClick={() => setIsDialogOpen(true)}>
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Subscribe Now
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Confirmation Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-black text-white">
                    <DialogHeader>
                        <DialogTitle>Confirm Subscription</DialogTitle>
                        <DialogDescription>
                            Subscribe to <strong>{stream.name_ar}</strong> for <strong>{duration.replace("_", " ")}</strong> at <strong>${total}</strong>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <p><strong>Duration:</strong> {duration.replace("_", " ")}</p>
                        <p><strong>Total:</strong> ${total}</p>
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

export default StreamsDetail;
