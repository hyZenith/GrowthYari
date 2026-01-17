"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { UserCard } from "@/components/networking/UserCard";
import { IncomingCallModal } from "@/components/networking/IncomingCallModal";
import { VideoCall } from "@/components/networking/VideoCall";
import { Button } from "@/components/ui/button";
import { toggleNetworking } from "@/actions/networking";
import { Loader2, Power, WifiOff, Search, Zap, ChevronDown, Filter } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner"; // Assuming sonner or similar

interface YariConnectClientProps {
    token: string;
    currentUser: any;
    initialNetworkingAvailable: boolean;
}

export default function YariConnectClient({ token, currentUser, initialNetworkingAvailable }: YariConnectClientProps) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [availableUsers, setAvailableUsers] = useState<any[]>([]);
    const [isNetworking, setIsNetworking] = useState(initialNetworkingAvailable);

    // Call States
    const [incomingCall, setIncomingCall] = useState<any | null>(null);
    const [activeCall, setActiveCall] = useState<{ userId: string; isInitiator: boolean } | null>(null);

    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        // Connect to Realtime Server
        // Note: NEXT_PUBLIC_REALTIME_URL should be defined in env, defaulting to localhost:3001
        const socketUrl = process.env.NEXT_PUBLIC_REALTIME_URL || "http://localhost:3001";

        const newSocket = io(socketUrl, {
            auth: { token },
            transports: ["websocket"], // Force WebSocket
            reconnectionAttempts: 5,
        });

        socketRef.current = newSocket;
        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("Connected to messaging server");
            if (isNetworking) {
                newSocket.emit("join-networking", { networkingAvailable: true });
            }
        });

        newSocket.on("users-update", (users: any[]) => {
            // Filter out self
            setAvailableUsers(users.filter(u => u.id !== currentUser.id && u.status === "ONLINE"));
        });

        newSocket.on("incoming-call", (data) => {
            setIncomingCall(data.from);
        });

        newSocket.on("call-accepted", (data) => {
            // I am the caller, and my call was accepted
            setActiveCall({ userId: data.fromUserId, isInitiator: true }); // Wait, fromUserId in call-accepted is receiver? 
            // In server.ts: io.to(caller.socketId).emit("call-accepted", { fromUserId: user.id });
            // user.id is the receiver.
        });

        newSocket.on("call-rejected", (data) => {
            toast.error("Call rejected");
            setActiveCall(null);
        });

        newSocket.on("call-ended", () => {
            toast.info("Call ended");
            setActiveCall(null);
            setIncomingCall(null);
            window.location.reload(); // Simple cleanup for WebRTC context
        });

        newSocket.on("call-error", (data) => {
            toast.error(data.message);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [token, currentUser.id]);

    useEffect(() => {
        // Handle networking toggle effect on socket
        if (!socketRef.current) return;

        if (isNetworking) {
            socketRef.current.emit("join-networking", { networkingAvailable: true });
        } else {
            socketRef.current.emit("leave-networking");
        }
    }, [isNetworking]);

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
        window.location.reload(); // Refresh to clean WebRTC state ensure fresh start
    };

    const handleToggleNetworking = async () => {
        const newState = !isNetworking;
        setIsNetworking(newState);
        await toggleNetworking(newState);
    };

    if (activeCall && socket) {
        return (
            <VideoCall
                socket={socket}
                // roomId={activeCall.userId} // Not used in p2p direct, but good for context
                remoteUserId={activeCall.userId}
                isInitiator={activeCall.isInitiator}
                onEndCall={handleEndCall}
                currentUser={currentUser}
            />
        );
    }

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <div className="flex flex-col items-center justify-center text-center mb-8">
                <div className="flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-semibold tracking-[0.2em] text-emerald-600 uppercase mb-4">
                        YariConnect
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                        Find Your Next <span className="font-serif italic text-emerald-600">Meaningful Connection</span>
                    </h1>
                    <p className="text-muted-foreground mt-4 max-w-2xl text-lg">
                        Connect with professionals who share your interests and can help
                        accelerate your career growth.
                    </p>
                </div>

                <Button
                    onClick={handleToggleNetworking}
                    variant={isNetworking ? "destructive" : "default"} // Green for "Go Online"? Default usually primary. "destructive" for Go Offline.
                    className={isNetworking ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "bg-green-600 hover:bg-green-700 mt-6"}
                >
                    {isNetworking ? (
                        <>
                            <Power className="mr-2 h-4 w-4" />
                            Go Offline
                        </>
                    ) : (
                        <>
                            <Power className="mr-2 h-4 w-4" />
                            Go Online
                        </>
                    )}
                </Button>

            </div>

            {/* Filter Section Prototype */}
            <div className="bg-white border text-card-foreground shadow-sm rounded-xl p-4 mb-8">
                <div className="flex flex-col gap-4">
                    {/* Top Row: Search and Filters */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, skills, or interests..."
                                className="pl-9 bg-gray-50/50 border-gray-200"
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                            <Button variant="outline" className="min-w-[140px] justify-between font-normal text-muted-foreground">
                                All Industries <ChevronDown className="h-4 w-4 opacity-50" />
                            </Button>
                            <Button variant="outline" className="min-w-[140px] justify-between font-normal text-muted-foreground">
                                All Levels <ChevronDown className="h-4 w-4 opacity-50" />
                            </Button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gray-100" />

                    {/* Bottom Row: Status and Toggle */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 self-start sm:self-center">
                            <Zap className="h-5 w-5 text-emerald-600 fill-emerald-600" />
                            <span className="font-semibold text-gray-700">Connect Now</span>
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-medium">
                                4 online
                            </Badge>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                            <span className="text-sm text-muted-foreground">Show online only</span>
                            <div className="w-9 h-5 bg-gray-200 rounded-full relative cursor-pointer hover:bg-gray-300 transition-colors">
                                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {!isNetworking ? (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-70">
                    <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
                        <WifiOff className="h-10 w-10" />
                    </div>
                    <h2 className="text-2xl font-semibold">You are currently offline</h2>
                    <p className="max-w-md mt-2 text-muted-foreground">
                        Enable networking to discover other professionals and receive connection requests.
                    </p>
                    <Button onClick={handleToggleNetworking} className="mt-8" size="lg">
                        Start Networking
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {availableUsers.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                            <Loader2 className="h-8 w-8 animate-spin mb-4 opacity-50" />
                            <p>Looking for available professionals...</p>
                        </div>
                    ) : (
                        availableUsers.map((user) => (
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
