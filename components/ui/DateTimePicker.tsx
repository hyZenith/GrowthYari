"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
    name: string;
    required?: boolean;
    defaultValue?: string;
    className?: string;
}

export function DateTimePicker({ name, required, defaultValue, className }: DateTimePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(defaultValue ? new Date(defaultValue) : null);
    const [viewDate, setViewDate] = useState(new Date(selectedDate || new Date()));
    const [tempTime, setTempTime] = useState<string>(selectedDate ? formatTime(selectedDate) : "09:00 AM");

    const containerRef = useRef<HTMLDivElement>(null);
    const timeListRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDateSelect = (day: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        // Preserve time if already selected
        if (tempTime) {
            const [time, period] = tempTime.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            newDate.setHours(hours, minutes);
        }
        setSelectedDate(newDate);
    };

    const handleTimeSelect = (timeStr: string) => {
        setTempTime(timeStr);
        if (selectedDate) {
            const newDate = new Date(selectedDate);
            const [time, period] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            newDate.setHours(hours, minutes);
            setSelectedDate(newDate);
        }
    };

    function formatTime(date: Date) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    const times = [];
    for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 60; j += 30) {
            const hour = i === 0 ? 12 : i > 12 ? i - 12 : i;
            const period = i >= 12 ? 'PM' : 'AM';
            const timeStr = `${hour.toString().padStart(2, '0')}:${j.toString().padStart(2, '0')} ${period}`;
            times.push(timeStr);
        }
    }

    const isoValue = selectedDate ? selectedDate.toISOString().slice(0, 16) : "";

    return (
        <div className={cn("relative", className)} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex h-10 w-full items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all",
                    !selectedDate && "text-slate-500"
                )}
            >
                <CalendarIcon className="h-4 w-4 text-slate-400" />
                <span>
                    {selectedDate
                        ? `${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${formatTime(selectedDate)}`
                        : "Pick a Date"}
                </span>
            </button>

            <input type="hidden" name={name} value={isoValue} required={required} />

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute left-0 top-full z-50 mt-2 flex overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-slate-200"
                    >
                        {/* Calendar Section */}
                        <div className="w-72 p-4 border-r border-slate-100">
                            <div className="mb-4 flex items-center justify-between">
                                <h4 className="text-sm font-bold text-slate-900">
                                    {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                </h4>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))}
                                        className="rounded-full p-1 hover:bg-slate-100 text-slate-600"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))}
                                        className="rounded-full p-1 hover:bg-slate-100 text-slate-600"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="mb-2 grid grid-cols-7 text-center">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                    <span key={`${day}-${i}`} className="text-[10px] font-bold text-slate-400">{day}</span>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {Array.from({ length: new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay() }).map((_, i) => (
                                    <div key={`empty-${i}`} />
                                ))}
                                {Array.from({ length: new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                                    const day = i + 1;
                                    const isSelected = selectedDate &&
                                        selectedDate.getDate() === day &&
                                        selectedDate.getMonth() === viewDate.getMonth() &&
                                        selectedDate.getFullYear() === viewDate.getFullYear();
                                    const isToday = new Date().toDateString() === new Date(viewDate.getFullYear(), viewDate.getMonth(), day).toDateString();

                                    return (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => handleDateSelect(day)}
                                            className={cn(
                                                "relative flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-all",
                                                isSelected ? "bg-emerald-600 text-white" : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700",
                                                isToday && !isSelected && "border border-emerald-200"
                                            )}
                                        >
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Time Section */}
                        <div className="w-32 flex flex-col bg-slate-50">
                            <div className="p-3 border-b border-slate-100 text-center">
                                <Clock className="h-4 w-4 mx-auto text-emerald-600" />
                            </div>
                            <div
                                ref={timeListRef}
                                className="flex-1 overflow-y-auto no-scrollbar scroll-smooth"
                                style={{ maxHeight: '280px' }}
                            >
                                {times.map((time) => {
                                    const isSelected = tempTime === time;
                                    return (
                                        <button
                                            key={time}
                                            type="button"
                                            onClick={() => handleTimeSelect(time)}
                                            className={cn(
                                                "w-full px-4 py-2.5 text-xs font-semibold text-center transition-all",
                                                isSelected
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : "text-slate-600 hover:bg-white hover:text-emerald-600"
                                            )}
                                        >
                                            {time}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
