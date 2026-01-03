"use client";

import { useState, useEffect } from "react";
import { registerForEvent, cancelRegistration } from "@/app/actions/events";
import { useRouter } from "next/navigation";
import { Toast, ToastType } from "../ui/Toast";

interface UserDetails {
    name: string;
    email: string;
    phone: string;
}

interface EventRegistrationProps {
    eventId: string;
    isRegistered: boolean;
    isLoggedIn: boolean;
    price: number;
    userDetails: UserDetails | null;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export function EventRegistration({ eventId, isRegistered: initialStatus, isLoggedIn, price, userDetails }: EventRegistrationProps) {
    const [isRegistered, setIsRegistered] = useState(initialStatus);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const router = useRouter();

    const [toastState, setToastState] = useState<{
        isVisible: boolean;
        message: string;
        type: ToastType;
    }>({
        isVisible: false,
        message: "",
        type: "info",
    });

    const showToast = (message: string, type: ToastType) => {
        setToastState({ isVisible: true, message, type });
    };

    const hideToast = () => {
        setToastState((prev) => ({ ...prev, isVisible: false }));
    };

    useEffect(() => {
        // Load Razorpay Script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    async function handleRegister() {
        if (!isLoggedIn) {
            router.push("/auth/login?redirect=/events");
            return;
        }

        setLoading(true);

        try {
            // 1. If Free Event -> Direct Register
            if (price === 0) {
                const result = await registerForEvent(eventId);
                if (result.success) {
                    setIsRegistered(true);
                    showToast("Thank you Registering for This event", "success");
                    // router.push("/profile");
                } else {
                    showToast(result.error || result.message || "An unknown error occurred", "error");
                }
                setLoading(false);
                return;
            }

            // 2. Paid Event -> Create Order
            const orderRes = await fetch("/api/payments/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventId }),
            });

            const orderData = await orderRes.json();

            if (!orderRes.ok) {
                throw new Error(orderData.error || "Failed to create order");
            }

            // 3. Open Razorpay Modal
            if (!window.Razorpay) {
                alert("Payment system failed to load. Please check your internet connection.");
                setLoading(false);
                return;
            }

            const options = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "GrowthYari",
                description: "Event Registration",
                order_id: orderData.orderId,
                handler: async function (response: any) {
                    // 4. Verify Payment
                    const verifyRes = await fetch("/api/payments/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });

                    const verifyData = await verifyRes.json();

                    if (verifyData.success) {
                        setIsRegistered(true);
                        setMessage("Payment Successful! Registration Complete.");
                        setLoading(false);
                        router.push("/profile");
                    } else {
                        alert("Payment Verification Failed. Please contact support.");
                        setLoading(false);
                    }
                },
                prefill: {
                    name: userDetails?.name || "",
                    email: userDetails?.email || "",
                    contact: userDetails?.phone || "",
                },
                theme: {
                    color: "#059669" // Emerald 600
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

            // Handle modal close by user without payment?
            paymentObject.on('payment.failed', function (response: any) {
                alert("Payment Failed: " + response.error.description);
                setLoading(false);
            });


        } catch (error: any) {
            console.error("Registration Error:", error);
            alert(error.message || "Something went wrong");
            setLoading(false);
        }
    }

    function handleCancel() {
        setShowConfirmModal(true);
    }

    async function confirmCancelRegistration() {
        setLoading(true);
        const result = await cancelRegistration(eventId);
        setLoading(false);
        setShowConfirmModal(false);

        if (result.success) {
            setIsRegistered(false);
            showToast("Registration cancelled", "info");
        } else {
            showToast(result.error || result.message || "Failed to cancel", "error");
        }
    }

    const confirmModal = showConfirmModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 transform transition-all scale-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancel Registration?</h3>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to cancel your registration? This will free up your seat.
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setShowConfirmModal(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        disabled={loading}
                    >
                        No, Keep it
                    </button>
                    <button
                        onClick={confirmCancelRegistration}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                        disabled={loading}
                    >
                        {loading && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                        Yes, Cancel Registration
                    </button>
                </div>
            </div>
        </div>
    ) : null;

    if (isRegistered) {
        return (
            <div className="space-y-4">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-6 py-4 text-emerald-800 font-medium flex justify-between items-center">
                    <span>You are registered for this event</span>
                </div>
                {message && <p className="text-sm text-emerald-600 font-semibold animate-pulse">{message}</p>}

                <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="w-full rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                >
                    {loading ? "Cancelling..." : "Cancel Registration"}
                </button>
                {confirmModal}
                <Toast
                    message={toastState.message}
                    type={toastState.type}
                    isVisible={toastState.isVisible}
                    onClose={hideToast}
                />
            </div>
        );
    }

    return (
        <div>
            <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full rounded-lg bg-emerald-700 px-8 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-200"
            >
                {loading ? "Processing..." : (price > 0 ? `Pay ₹${price} & Register` : "Register Now")}
            </button>
            {confirmModal}
            <Toast
                message={toastState.message}
                type={toastState.type}
                isVisible={toastState.isVisible}
                onClose={hideToast}
            />
        </div >
    );
}
