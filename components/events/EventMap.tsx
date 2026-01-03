"use client";

import { ExternalLink } from "lucide-react";

interface EventMapProps {
    location: string;
}

export function EventMap({ location }: EventMapProps) {
    const encodedLocation = encodeURIComponent(location);

    // Public Google Maps Embed URL (doesn't require an API key for basic search view)
    const mapUrl = `https://maps.google.com/maps?q=${encodedLocation}&t=&z=13&ie=UTF8&iwloc=&output=embed`;


    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900">
                    <h2 className="text-xl font-semibold">Location</h2>
                    <span className="text-sm text-slate-500">{location}</span>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
                <iframe
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={mapUrl}
                    title={`Map showing ${location}`}
                ></iframe>
            </div>

        </div>
    );
}
