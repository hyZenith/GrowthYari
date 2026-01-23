"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Video, MapPin, Linkedin } from "lucide-react";

interface User {
    id: string;
    name: string;
    image?: string;
    bio?: string;
    industry?: string;
    status?: "ONLINE" | "BUSY" | "OFFLINE";
    headline?: string;
    location?: string;
    experienceLevel?: string;
    linkedinUrl?: string;
}

interface UserCardProps {
    user: User;
    onConnect: (userId: string) => void;
    disabled?: boolean;
}

export function UserCard({ user, onConnect, disabled }: UserCardProps) {
    // Defaults for missing data to match the mockup style
    const role = user.headline || "Professional";
    const location = user.location || "India";
    const experience = user.experienceLevel || "Mid Level (3-5 years)";
    const industry = user.industry || "Technology";

    // Status Colors
    const getStatusColor = () => {
        switch (user.status) {
            case "ONLINE": return "bg-emerald-500";
            case "BUSY": return "bg-amber-400";
            default: return "bg-gray-300"; // OFFLINE
        }
    };

    return (
        <Card className="w-full flex flex-col p-5 hover:shadow-md transition-shadow border-emerald-500/20 bg-white">
            <div className="flex items-start gap-4 mb-3">
                <div className="relative">
                    <Avatar className="h-14 w-14 border border-gray-100">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback className="bg-emerald-50 text-emerald-600 font-semibold">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {/* Online Status Dot */}
                    <span className="absolute bottom-0 right-0 h-4 w-4 bg-white rounded-full flex items-center justify-center p-[2px]">
                        <span className={`h-full w-full rounded-full ${getStatusColor()} border-2 border-white`} />
                    </span>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 truncate pr-2 text-lg">{user.name}</h3>
                        {user.status === 'ONLINE' && (
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 text-[10px] h-5 px-1.5 hover:bg-emerald-100">
                                Live
                            </Badge>
                        )}
                        {user.status === 'BUSY' && (
                            <Badge variant="secondary" className="bg-amber-50 text-amber-600 text-[10px] h-5 px-1.5 hover:bg-amber-100">
                                Busy
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 font-medium truncate">{role}</p>
                    <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{location}</span>
                    </div>
                </div>
            </div>

            <div className="mb-4 flex-grow">
                <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
                    {user.bio || "Passionate about connecting and sharing knowledge in the industry. Let's chat!"}
                </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-orange-50/50 text-orange-700 border-orange-100 hover:bg-orange-50 rounded-md font-medium">
                    {industry}
                </Badge>
                <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100 rounded-md font-medium">
                    {experience}
                </Badge>
            </div>

            {/* Tags/Skills row if needed, for now using just the badges above to match mockup clean look */}
            <div className="mt-auto flex items-center gap-3">
                <Button
                    className={`flex-1 gap-2 text-white shadow-sm ${user.status === 'ONLINE' ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-gray-400 cursor-not-allowed hover:bg-gray-400'}`}
                    onClick={() => onConnect(user.id)}
                    disabled={disabled || user.status !== "ONLINE"}
                >
                    <Video className="h-4 w-4" />
                    {user.status === "BUSY" ? "Busy" : user.status === "OFFLINE" ? "Offline" : "Connect"}
                </Button>

                <Button variant="outline" size="icon" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 w-10 shrink-0">
                    <Linkedin className="h-5 w-5" />
                </Button>
            </div>
        </Card>
    );
}
