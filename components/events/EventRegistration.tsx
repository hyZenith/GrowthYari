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

interface Ticket {
    id: string;
    title: string;
    description: string | null;
    price: number;
}

interface EventRegistrationProps {
    eventId: string;
    isRegistered: boolean;
    isLoggedIn: boolean;
    userDetails: UserDetails | null;
    tickets?: Ticket[];
    includeGst?: boolean;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

export function EventRegistration({ eventId, isRegistered: initialStatus, isLoggedIn, userDetails, tickets = [], includeGst = false }: EventRegistrationProps) {
    const [isRegistered, setIsRegistered] = useState(initialStatus);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
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

    // Auto-select if only one ticket
    useEffect(() => {
        if (tickets.length === 1 && !selectedTicketId) {
            setSelectedTicketId(tickets[0].id);
        }
    }, [tickets]);

    async function handleRegister() {
        if (!isLoggedIn) {
            router.push("/auth/login?redirect=/events");
            return;
        }

        let currentPrice = 0;
        let finalTicketId = selectedTicketId;

        // If tickets exist, ensure one is selected
        if (tickets.length > 0) {
            if (!selectedTicketId) {
                showToast("Please select a ticket type", "error");
                return;
            }
            const selectedTicket = tickets.find(t => t.id === selectedTicketId);
            if (selectedTicket) {
                currentPrice = selectedTicket.price;
                if (includeGst) {
                    currentPrice = Math.round((currentPrice * 1.18) * 100) / 100; // Client-side estimate for display/check. Backend works on base price.
                    // Wait, create-order expects amount? No, backend recalculates based on ID. 
                    // So we just need to send ticketId. 
                    // But for the confirmation or UI, we should show the total.
                    // Actually, let's keep currentPrice as Base here for logic, or use a separate variable?
                    // The backend ignores our amount. So we don't need to change logic here EXCEPT for display?
                    // Wait, previously I calculated `currentPrice` for `amount` body.
                    // `body: JSON.stringify({ ... amount: currentPrice })`.
                    // Does backend uses it?
                    // Backend: `const { eventId, ticketId } = await req.json();` ... `price = ticket.price`.
                    // Backend ignores `amount` from body. So we are safe.
                    // BUT, I should update the UI to show the user the REAL amount they will pay.
                }
            }
        } else {
            // No tickets - assume free event? (Verified by backend check isFree)
            currentPrice = 0;
        }

        setLoading(true);

        try {
            // 1. If Free Event (Price 0) -> Direct Register
            if (currentPrice === 0) {
                const result = await registerForEvent(eventId, finalTicketId); // Pass ticketId
                if (result.success) {
                    setIsRegistered(true);
                    showToast("Thank you for Registering!", "success");
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
                body: JSON.stringify({ eventId, ticketId: finalTicketId, amount: currentPrice }), // Pass ticket details
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
                            razorpay_signature: response.razorpay_signature,
                            ticketId: finalTicketId // Pass ticketId for verification record
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
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

            paymentObject.on('payment.failed', function (response: any) {
                alert("Payment Failed: " + response.error.description);
                setLoading(false);
            });

            // Handle user closing/dismissing the payment modal (handled in options.modal.ondismiss)



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
                    Are you sure you want to cancel your registration?
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
            {/* Ticket Selection */}
            {tickets.length > 0 && (
                <div className="mb-6 space-y-3">
                    <p className="text-sm font-medium text-slate-700">Select Ticket Type</p>
                    <div className="grid gap-3">
                        {tickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                onClick={() => setSelectedTicketId(ticket.id)}
                                className={`cursor-pointer rounded-lg border p-3 transition-all ${selectedTicketId === ticket.id
                                    ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
                                    : "border-slate-200 hover:border-emerald-300"
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-slate-900">{ticket.title}</p>
                                        {ticket.description && <p className="text-xs text-slate-500">{ticket.description}</p>}
                                    </div>
                                    <div className="font-bold text-emerald-700 text-right">
                                        {ticket.price === 0 ? "Free" : `₹${ticket.price}`}
                                        {ticket.price > 0 && includeGst && (
                                            <div className="text-[10px] text-slate-500 font-normal">
                                                + 18% GST = ₹{Math.round(ticket.price * 1.18)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full rounded-lg bg-emerald-700 px-8 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-200"
            >
                {loading ? "Processing..." : (
                    tickets.length > 0 && selectedTicketId
                        ? (() => {
                            const t = tickets.find(t => t.id === selectedTicketId);
                            if (!t) return "Register Now";
                            const total = includeGst ? Math.round(t.price * 1.18) : t.price;
                            return `Pay ₹${total} & Register`;
                        })()
                        : "Register Now" // simplified fallback
                )}
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
