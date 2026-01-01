"use client";

import { useState } from "react";
import { createEvent } from "@/app/actions/admin-events";
import { Input } from "@/components/ui/Input";
import ImageUpload from "@/components/ui/ImageUpload";
import { DateTimePicker } from "@/components/ui/DateTimePicker";

export default function CreateEventPage() {
    const [imageUrl, setImageUrl] = useState("");
    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Add New Event</h1>
                <p className="text-slate-500">Create a new event for GrowthYari.</p>
            </div>

            <form action={createEvent} className="space-y-6 bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

                    <div className="space-y-2">
                        <label htmlFor="price" className="text-sm font-medium text-slate-900">
                            Price involved (₹)
                        </label>
                        <Input
                            id="price"
                            name="price"
                            type="number"
                            defaultValue="0"
                            min="0"
                            placeholder="0 for free"
                            required
                        />
                    </div>
                </div>

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
                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                    >
                        Create Event
                    </button>
                </div>
            </form>
        </div>
    );
}
