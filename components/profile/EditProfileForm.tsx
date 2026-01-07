"use client";

import { useState } from "react";
import { updateProfile, updateUsername } from "@/app/actions/profile";

interface User {
    name: string;
    username?: string | null;
    email: string;
    phone?: string | null;
    bio?: string | null;
    location?: string | null;
    headline?: string | null;
    linkedinUrl?: string | null;
    websiteUrl?: string | null;
    twitterUrl?: string | null;
}

export function EditProfileForm({ user, onClose }: { user: User, onClose: () => void }) {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);

        let success = true;
        let errorMessage = "";

        // Handle username update if changed
        const newUsername = formData.get("username") as string;
        if (newUsername && newUsername !== user.username) {
            const usernameResult = await updateUsername(formData);
            if (!usernameResult.success) {
                success = false;
                errorMessage = usernameResult.error || "Failed to update username";
            }
        }

        if (success) {
            const result = await updateProfile(formData);
            if (!result.success) {
                success = false;
                errorMessage = result.error || "Failed to update profile";
            }
        }

        setLoading(false);

        if (success) {
            onClose();
        } else {
            alert(errorMessage);
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
                        <label className="block text-sm font-medium text-slate-700">Username</label>
                        <div className="flex">
                            <span className="inline-flex items-center rounded-l-md border border-r-0 border-slate-300 bg-slate-50 px-3 text-slate-500 sm:text-sm">
                                growthyari.com/u/
                            </span>
                            <input
                                name="username"
                                defaultValue={user.username || ""}
                                placeholder="username"
                                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border border-slate-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm"
                            />
                        </div>
                        <p className="mt-1 text-xs text-slate-500">Only letters, numbers, underscores, and dashes. </p>
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
                        <label className="block text-sm font-medium text-slate-700">Headline</label>
                        <input
                            name="headline"
                            defaultValue={user.headline || ""}
                            placeholder="e.g. Senior Developer"
                            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Location</label>
                        <input
                            name="location"
                            defaultValue={user.location || ""}
                            placeholder="e.g. New York, USA"
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
                            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                        />
                    </div>

                    <div className="space-y-4 pt-2 border-t border-slate-100">
                        <h3 className="text-sm font-medium text-slate-900">Social Links</h3>

                        <div>
                            <label className="block text-xs font-medium text-slate-500">LinkedIn URL</label>
                            <input
                                name="linkedinUrl"
                                defaultValue={user.linkedinUrl || ""}
                                placeholder="https://linkedin.com/in/..."
                                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500">Twitter URL</label>
                                <input
                                    name="twitterUrl"
                                    defaultValue={user.twitterUrl || ""}
                                    placeholder="https://twitter.com/..."
                                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500">Website URL</label>
                                <input
                                    name="websiteUrl"
                                    defaultValue={user.websiteUrl || ""}
                                    placeholder="https://example.com"
                                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
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
