"use client";


import { Pencil } from "lucide-react";

export function ProfileActions({ user }: { user: any }) {
    return (
        <a
            href="/settings"
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
        >
            <Pencil className="h-4 w-4" />
            Edit Profile
        </a>
    );
}
