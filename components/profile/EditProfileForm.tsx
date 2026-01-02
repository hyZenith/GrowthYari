"use client";

import { useState } from "react";
import { updateProfile } from "@/app/actions/profile";

interface User {
    name: string;
    email: string;
    phone?: string | null;
    bio?: string | null;
}

export function EditProfileForm({ user, onClose }: { user: User, onClose: () => void }) {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const result = await updateProfile(formData);
        setLoading(false);

        if (result.success) {
            onClose();
        } else {
            alert(result.error);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <h2 className="mb-4 text-xl font-bold text-slate-900">Edit Profile</h2>

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Full Name</label>
                        <input
                            name="name"
                            defaultValue={user.name}
                            required
                            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                        <input
                            name="phone"
                            defaultValue={user.phone || ""}
                            placeholder="+91 9876543210"
                            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Bio</label>
                        <textarea
                            name="bio"
                            defaultValue={user.bio || ""}
                            rows={3}
                            placeholder="Tell us a bit about yourself..."
                            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-slate-700">Email</label>
                        <input
                            value={user.email}
                            disabled
                            className="mt-1 block w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500 shadow-sm"
                        />
                        <p className="mt-1 text-xs text-slate-500">Email cannot be changed.</p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
