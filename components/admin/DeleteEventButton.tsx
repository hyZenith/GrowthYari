"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { deleteEvent } from "@/app/actions/admin-events";

interface DeleteEventButtonProps {
    eventId: string;
    eventTitle: string;
}

export function DeleteEventButton({ eventId, eventTitle }: DeleteEventButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<"CONFIRM" | "DOUBLE_CONFIRM" | "DELETING">("CONFIRM");

    const openModal = () => {
        setIsOpen(true);
        setStep("CONFIRM");
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const handleFirstConfirm = () => {
        setStep("DOUBLE_CONFIRM");
    };

    const handleFinalDelete = async () => {
        setStep("DELETING");
        try {
            const result = await deleteEvent(eventId);
            if (!result.success) {
                alert("Failed to delete event. Please try again.");
                setStep("CONFIRM"); // Reset to try again
            } else {
                closeModal();
            }
        } catch (error) {
            console.error("Error deleting event:", error);
            alert("An error occurred.");
            setStep("CONFIRM");
        }
    };

    return (
        <>
            <button
                onClick={openModal}
                className="group flex items-center justify-center rounded-full p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                title="Delete Event"
            >
                <Trash2 className="h-4 w-4" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5 transition-all animate-in fade-in zoom-in-95 duration-200">

                        {/* Modal Header */}
                        <div className={`flex items-center justify-between border-b px-6 py-4 ${step === "DOUBLE_CONFIRM" ? "bg-red-50 border-red-100" : "bg-white border-slate-100"
                            }`}>
                            <h3 className={`text-lg font-semibold ${step === "DOUBLE_CONFIRM" ? "text-red-700" : "text-slate-900"
                                }`}>
                                {step === "DOUBLE_CONFIRM" ? "Final Warning" : "Delete Event"}
                            </h3>
                            <button onClick={closeModal} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {step === "CONFIRM" && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 rounded-lg bg-amber-50 p-4 text-amber-800">
                                        <AlertTriangle className="h-6 w-6 shrink-0 text-amber-600" />
                                        <p className="text-sm font-medium">This action cannot be undone.</p>
                                    </div>
                                    <p className="text-slate-600">
                                        Are you sure you want to delete the event <span className="font-semibold text-slate-900">"{eventTitle}"</span>?
                                        All associated registration data will also be permanently removed.
                                    </p>
                                </div>
                            )}

                            {step === "DOUBLE_CONFIRM" && (
                                <div className="space-y-4 text-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-4">
                                        <Trash2 className="h-8 w-8 text-red-600" />
                                    </div>
                                    <p className="text-slate-700 font-medium">
                                        Please confirm one last time. You are about to permanently delete <span className="font-bold text-slate-900">"{eventTitle}"</span>.
                                    </p>
                                </div>
                            )}

                            {step === "DELETING" && (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600"></div>
                                    <p className="mt-4 text-slate-500 font-medium">Deleting event...</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        {step !== "DELETING" && (
                            <div className="flex items-center justify-end gap-3 bg-slate-50 px-6 py-4 border-t border-slate-100">
                                <button
                                    onClick={closeModal}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white hover:text-slate-900 transition-colors"
                                >
                                    Cancel
                                </button>
                                {step === "CONFIRM" ? (
                                    <button
                                        onClick={handleFirstConfirm}
                                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition-colors"
                                    >
                                        Delete Event
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleFinalDelete}
                                        className="rounded-lg bg-red-600 px-6 py-2 text-sm font-bold text-white shadow-red-200 hover:bg-red-700 shadow-lg transition-all"
                                    >
                                        Yes, Permanently Delete
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
