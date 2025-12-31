"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
    message: string;
    type?: ToastType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export function Toast({
    message,
    type = "info",
    isVisible,
    onClose,
    duration = 2000,
}: ToastProps) {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    const icons = {
        success: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
        error: <AlertCircle className="h-5 w-5 text-red-600" />,
        info: <Info className="h-5 w-5 text-blue-600" />,
    };

    const colors = {
        success: "bg-emerald-50 border-emerald-100",
        error: "bg-red-50 border-red-100",
        info: "bg-blue-50 border-blue-100",
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-x-0 top-8 z-[100] flex justify-center px-4 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className={cn(
                            "pointer-events-auto flex items-center gap-3 rounded-2xl border bg-white/90 p-4 pr-3 shadow-2xl backdrop-blur-xl ring-1 ring-black/5 min-w-[320px] max-w-md",
                            colors[type]
                        )}
                    >
                        <div className="flex-shrink-0">{icons[type]}</div>
                        <p className="flex-1 text-sm font-semibold text-slate-800">
                            {message}
                        </p>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
