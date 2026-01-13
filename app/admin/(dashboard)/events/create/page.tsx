"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { createEvent } from "@/app/actions/admin-events";
import { Input } from "@/components/ui/Input";
import ImageUpload from "@/components/ui/ImageUpload";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { CategorySelector } from "@/components/admin/CategorySelector";
import { motion, AnimatePresence } from "motion/react";
import { Trash2, Plus, Ticket, Loader2 } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="flex w-full justify-center items-center gap-2 rounded-md bg-emerald-700 px-3 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
        >
            {pending ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Event...
                </>
            ) : (
                'Create Event'
            )}
        </button>
    );
}

export default function CreateEventPage() {
    const [imageUrl, setImageUrl] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isFree, setIsFree] = useState(true);
    const [tickets, setTickets] = useState<{ title: string; description: string; price: string }[]>([]);

    const addTicket = () => {
        setTickets([...tickets, { title: "", description: "", price: "" }]);
    };

    const removeTicket = (index: number) => {
        setTickets(tickets.filter((_, i) => i !== index));
    };

    const updateTicket = (index: number, field: string, value: string) => {
        const newTickets = [...tickets];
        newTickets[index] = { ...newTickets[index], [field]: value };
        setTickets(newTickets);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6 md:mb-8">
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">Add New Event</h1>
                <p className="text-sm md:text-base text-slate-500">Create a new event for GrowthYari.</p>
            </div>

            <form action={createEvent} className="space-y-5 md:space-y-6 bg-white p-5 md:p-8 rounded-lg border border-slate-200 shadow-sm">
                <div className="grid grid-cols-1 gap-5 md:gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium text-slate-900">
                            Event Title
                        </label>
                        <Input id="title" name="title" placeholder="e.g. Resilience Workshop 2024" required />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="hostedBy" className="text-sm font-medium text-slate-900">
                            Hosted By
                        </label>
                        <Input id="hostedBy" name="hostedBy" placeholder="e.g. GrowthYari" defaultValue="GrowthYari" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium text-slate-900">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900">
                        Categories
                    </label>
                    <CategorySelector
                        selectedCategories={selectedCategories}
                        onChange={setSelectedCategories}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-900">
                        Event Image
                    </label>
                    <div className="mt-2">
                        <ImageUpload value={imageUrl} onChange={setImageUrl} />
                        <input type="hidden" name="imageUrl" value={imageUrl} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="date" className="text-sm font-medium text-slate-900">
                            Date & Time
                        </label>
                        <DateTimePicker name="date" required />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="capacity" className="text-sm font-medium text-slate-900">
                            Capacity (Optional)
                        </label>
                        <Input id="capacity" name="capacity" type="number" placeholder="Leave blank for unlimited" />
                    </div>


                    <div className="space-y-4">
                        <label className="text-sm font-medium text-slate-900 block">
                            Event Type
                        </label>
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="isFree"
                                    value="true"
                                    checked={isFree}
                                    onChange={() => {
                                        setIsFree(true);
                                        setTickets([]);
                                    }}
                                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-600 border-gray-300"
                                />
                                <span className="text-sm text-slate-700">Free Event</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="isFree"
                                    value="false"
                                    checked={!isFree}
                                    onChange={() => setIsFree(false)}
                                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-600 border-gray-300"
                                />
                                <span className="text-sm text-slate-700">Paid Event</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Ticket Management Section */}
                <AnimatePresence>
                    {!isFree && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className="mt-5 md:mt-6 rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white p-5 md:p-6 shadow-sm">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 md:mb-5">
                                    <div className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                                            <Ticket className="h-4 w-4 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-slate-900">Ticket Types</h3>
                                            <p className="text-xs text-slate-500">Add pricing options for attendees</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addTicket}
                                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Add Ticket
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <AnimatePresence mode="popLayout">
                                        {tickets.map((ticket, index) => (
                                            <motion.div
                                                key={`ticket-${index}`}
                                                layout
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, x: -20, scale: 0.9 }}
                                                transition={{ duration: 0.2, ease: "easeOut" }}
                                                className="group relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all"
                                            >
                                                {/* Delete Button */}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTicket(index)}
                                                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>

                                                {/* Ticket Number Badge */}
                                                <div className="absolute left-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                                                    {index + 1}
                                                </div>

                                                <div className="ml-8 space-y-3">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 block">
                                                                Ticket Name
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="e.g. Early Bird, VIP, Standard"
                                                                value={ticket.title}
                                                                onChange={(e) => updateTicket(index, "title", e.target.value)}
                                                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 block">
                                                                Price (₹)
                                                            </label>
                                                            <div className="relative">
                                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                                                                <input
                                                                    type="number"
                                                                    placeholder="0"
                                                                    value={ticket.price}
                                                                    onChange={(e) => updateTicket(index, "price", e.target.value)}
                                                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-7 pr-3 py-2 text-sm font-bold text-emerald-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                                                    required
                                                                    min="0"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 block">
                                                            Description (Optional)
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g. Includes lunch, front-row seating, exclusive swag"
                                                            value={ticket.description}
                                                            onChange={(e) => updateTicket(index, "description", e.target.value)}
                                                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    {tickets.length === 0 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex flex-col items-center justify-center py-8 text-center"
                                        >
                                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                                <Ticket className="h-6 w-6 text-slate-400" />
                                            </div>
                                            <p className="text-sm font-medium text-slate-600">No tickets added yet</p>
                                            <p className="text-xs text-slate-400 mt-1">Click "Add Ticket" to create pricing options</p>
                                        </motion.div>
                                    )}
                                </div>
                                <input type="hidden" name="tickets" value={JSON.stringify(tickets)} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="mode" className="text-sm font-medium text-slate-900">
                            Mode
                        </label>
                        <select
                            id="mode"
                            name="mode"
                            className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        >
                            <option value="ONLINE">Online</option>
                            <option value="OFFLINE">Offline</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="status" className="text-sm font-medium text-slate-900">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="SCHEDULED">Scheduled</option>
                            <option value="UPCOMING">Upcoming</option>
                            <option value="ONGOING">Ongoing</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="meetingUrl" className="text-sm font-medium text-slate-900">
                        Meeting URL (for Online)
                    </label>
                    <Input id="meetingUrl" name="meetingUrl" type="url" placeholder="https://..." />
                </div>

                <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium text-slate-900">
                        Location Address (for Offline)
                    </label>
                    <Input id="location" name="location" placeholder="123 Growth St, City" />
                </div>

                <div className="pt-4">
                    <SubmitButton />
                </div>
            </form>
        </div>
    );
}
