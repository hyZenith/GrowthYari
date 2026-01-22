"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { UserCard } from "@/components/networking/UserCard";
import { IncomingCallModal } from "@/components/networking/IncomingCallModal";
import { VideoCall } from "@/components/networking/VideoCall";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Zap, ChevronDown, PhoneOff } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner"; // Assuming sonner or similar

interface YariConnectClientProps {
    token: string;
    currentUser: any;
    initialNetworkingAvailable: boolean;
}

// Mock Data for Demo Filters
const INDUSTRIES = ["Technology", "Healthcare", "Finance", "Education", "Marketing"];
const LEVELS = ["Junior", "Mid-Level", "Senior", "Executive"];

export default function YariConnectClient({ token, currentUser, initialNetworkingAvailable }: YariConnectClientProps) {
    const [socket, setSocket] = useState<Socket | null>(null);

    // Core Data
    const [baseUsers, setBaseUsers] = useState<any[]>([]); // All eligible users from DB
    const [onlineUsersMap, setOnlineUsersMap] = useState<Map<string, any>>(new Map()); // Realtime status

    // UI State
    const [iceServers, setIceServers] = useState<RTCIceServer[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters
    const [showIndustryFilter, setShowIndustryFilter] = useState(false);
    const [showLevelFilter, setShowLevelFilter] = useState(false);
    const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
    const [selectedLevel, setSelectedLevel] = useState("All Levels");
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    // Call States
    const [incomingCall, setIncomingCall] = useState<any | null>(null);
    const [activeCall, setActiveCall] = useState<{ userId: string; isInitiator: boolean } | null>(null);

    const socketRef = useRef<Socket | null>(null);

    // 1. Fetch ICE Servers & Base User List
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch ICE Servers
                const iceRes = await fetch('/api/yariconnect/ice-servers');
                const iceData = await iceRes.json();
                if (iceData.iceServers) setIceServers(iceData.iceServers);

                // Fetch Members
                const membersRes = await fetch('/api/yariconnect/members');
                const membersData = await membersRes.json();
                if (membersData.members) {
                    setBaseUsers(membersData.members);
                }
            } catch (err) {
                console.error("Failed to load initial data", err);
                toast.error("Failed to load networking data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // 2. Connect to Realtime Server
    useEffect(() => {
        const socketUrl = process.env.NEXT_PUBLIC_REALTIME_URL || "http://localhost:3001";

        const newSocket = io(socketUrl, {
            auth: { token },
            transports: ["websocket"],
            reconnectionAttempts: 5,
        });

        socketRef.current = newSocket;
        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("Connected to messaging server");
            // No manual join emit needed, server handles it from token
        });

        newSocket.on("users-update", (users: any[]) => {
            // Convert array to map for easy lookup
            const statusMap = new Map();
            users.forEach(u => statusMap.set(u.id, u));
            setOnlineUsersMap(statusMap);
        });

        newSocket.on("incoming-call", (data) => {
            setIncomingCall(data.from);
        });

        newSocket.on("call-accepted", (data) => {
            setActiveCall({ userId: data.fromUserId, isInitiator: true });
        });

        newSocket.on("call-rejected", (data) => {
            toast.error("Call rejected");
            setActiveCall(null);
        });

        newSocket.on("call-ended", () => {
            toast.info("Call ended");
            setActiveCall(null);
            setIncomingCall(null);
        });

        newSocket.on("call-error", (data) => {
            toast.error(data.message);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [token, currentUser.id]);

    const handleConnect = (userId: string) => {
        if (!socketRef.current) return;
        socketRef.current.emit("call-request", { toUserId: userId });
        toast.info("Calling...");
    };

    const handleAcceptCall = () => {
        if (!socketRef.current || !incomingCall) return;
        socketRef.current.emit("call-accepted", { toUserId: incomingCall.id });
        setActiveCall({ userId: incomingCall.id, isInitiator: false });
        setIncomingCall(null);
    };

    const handleRejectCall = () => {
        if (!socketRef.current || !incomingCall) return;
        socketRef.current.emit("call-rejected", { toUserId: incomingCall.id });
        setIncomingCall(null);
    };

    const handleEndCall = () => {
        if (!socketRef.current || !activeCall) return;
        socketRef.current.emit("end-call", { toUserId: activeCall.userId });
        setActiveCall(null);
    };

    // 3. Compute Displayed Users
    const getDisplayedUsers = () => {
        // Merge Base List with Realtime Status
        let mergedUsers = baseUsers.map(user => {
            const realtimeData = onlineUsersMap.get(user.id);
            return {
                ...user,
                status: realtimeData ? realtimeData.status : "OFFLINE"
            };
        });

        // Filter: Online Only
        if (showOnlineOnly) {
            mergedUsers = mergedUsers.filter(u => u.status !== "OFFLINE");
        }

        // Apply Demo Filters
        if (selectedIndustry !== "All Industries") {
            mergedUsers = mergedUsers.filter(u => u.industry === selectedIndustry);
        }
        if (selectedLevel !== "All Levels") {
            // Crude mock match
            mergedUsers = mergedUsers.filter(u => u.experienceLevel?.includes(selectedLevel) || u.experienceLevel === selectedLevel);
        }

        // Sort: ONLINE > BUSY > OFFLINE
        mergedUsers.sort((a, b) => {
            const statusPriority = { "ONLINE": 0, "BUSY": 1, "OFFLINE": 2 };
            // @ts-ignore
            return statusPriority[a.status] - statusPriority[b.status];
        });

        // Filter out current user
        mergedUsers = mergedUsers.filter(u => u.id !== currentUser.id);

        return mergedUsers;
    };

    const displayedUsers = getDisplayedUsers();

    // Calculate online count excluding current user if they are online
    const onlineCount = onlineUsersMap.has(currentUser.id) ? onlineUsersMap.size - 1 : onlineUsersMap.size;

    if (activeCall && socket) {
        return (
            <VideoCall
                socket={socket}
                remoteUserId={activeCall.userId}
                isInitiator={activeCall.isInitiator}
                onEndCall={handleEndCall}
                currentUser={currentUser}
                iceServers={iceServers}
            />
        );
    }

    return (
        <div className="container mx-auto p-6 min-h-screen">
            {/* --- Updated Header Section --- */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                <div className="flex flex-col gap-4">
                    {/* Top Row: Search and Filters */}
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, skills, or interests..."
                                className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-emerald-500"
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            {/* Industry Dropdown (Demo) */}
                            <div className="relative">
                                <Button
                                    variant="outline"
                                    className="w-full md:w-[160px] justify-between font-normal text-muted-foreground bg-white"
                                    onClick={() => { setShowIndustryFilter(!showIndustryFilter); setShowLevelFilter(false); }}
                                >
                                    {selectedIndustry} <ChevronDown className="h-4 w-4 opacity-50" />
                                </Button>
                                {showIndustryFilter && (
                                    <div className="absolute top-full mt-1 w-[200px] z-20 bg-white border rounded-lg shadow-lg py-1">
                                        <div
                                            className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                                            onClick={() => { setSelectedIndustry("All Industries"); setShowIndustryFilter(false); }}
                                        >
                                            All Industries
                                        </div>
                                        {INDUSTRIES.map(i => (
                                            <div
                                                key={i}
                                                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                                                onClick={() => { setSelectedIndustry(i); setShowIndustryFilter(false); }}
                                            >
                                                {i}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Level Dropdown (Demo) */}
                            <div className="relative">
                                <Button
                                    variant="outline"
                                    className="w-full md:w-[140px] justify-between font-normal text-muted-foreground bg-white"
                                    onClick={() => { setShowLevelFilter(!showLevelFilter); setShowIndustryFilter(false); }}
                                >
                                    {selectedLevel} <ChevronDown className="h-4 w-4 opacity-50" />
                                </Button>
                                {showLevelFilter && (
                                    <div className="absolute top-full mt-1 w-[160px] z-20 bg-white border rounded-lg shadow-lg py-1">
                                        <div
                                            className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                                            onClick={() => { setSelectedLevel("All Levels"); setShowLevelFilter(false); }}
                                        >
                                            All Levels
                                        </div>
                                        {LEVELS.map(l => (
                                            <div
                                                key={l}
                                                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                                                onClick={() => { setSelectedLevel(l); setShowLevelFilter(false); }}
                                            >
                                                {l}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100" />

                    {/* Bottom Row: Status and Toggle */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 self-start sm:self-center">
                            <Zap className="h-5 w-5 text-emerald-600 fill-emerald-600" />
                            <span className="font-semibold text-gray-800 text-lg">Connect Now</span>
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-medium px-2.5 py-0.5 pointer-events-none">
                                {onlineCount} online
                            </Badge>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowOnlineOnly(!showOnlineOnly)}>
                                <span className="text-sm text-gray-600 font-medium select-none">Show online only</span>
                                <div className={`w-10 h-6 rounded-full relative transition-colors duration-200 ease-in-out cursor-pointer ${showOnlineOnly ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${showOnlineOnly ? 'left-5' : 'left-1'}`} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Instant Connect Banner */}
            <div className="bg-gradient-to-r from-gray-50 to-emerald-50/30 border border-emerald-100/50 rounded-xl p-6 mb-8 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-xl font-bold text-emerald-950">Instant Connect</h2>
                            <Badge className="bg-emerald-500 hover:bg-emerald-600">Live</Badge>
                        </div>
                        <p className="text-gray-600">
                            Connect instantly with verified professionals who are live right now. Get matched randomly or filter by industry.
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <div className="text-center md:text-right mb-1">
                            <div className="text-2xl font-bold text-gray-900 leading-none">{onlineCount}</div>
                            <div className="text-xs text-muted-foreground">Professionals Online</div>
                        </div>
                        <Button className="bg-emerald-700 hover:bg-emerald-800 text-white min-w-[200px] shadow-lg shadow-emerald-900/10">
                            <PhoneOff className="mr-2 h-4 w-4 rotate-180" />
                            Connect Randomly
                        </Button>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mb-4 opacity-50" />
                    <p>Loading professionals...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayedUsers.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center text-muted-foreground opacity-70">
                            <Search className="h-10 w-10 mb-4 opacity-20" />
                            <p className="text-lg font-medium text-gray-500">No professionals found</p>
                            <p className="text-sm">Try adjusting your filters.</p>
                        </div>
                    ) : (
                        displayedUsers.map((user) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                onConnect={handleConnect}
                            />
                        ))
                    )}
                </div>
            )}

            {incomingCall && (
                <IncomingCallModal
                    caller={incomingCall}
                    onAccept={handleAcceptCall}
                    onReject={handleRejectCall}
                />
            )}
        </div>
    );
}
