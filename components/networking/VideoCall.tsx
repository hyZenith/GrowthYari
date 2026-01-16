"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";

interface VideoCallProps {
    socket: Socket;
    remoteUserId: string;
    isInitiator: boolean;
    onEndCall: () => void;
    currentUser: any;
}

const ICE_SERVERS = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        // Add TURN servers here for production
    ],
};

export function VideoCall({ socket, remoteUserId, isInitiator, onEndCall }: VideoCallProps) {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const localStream = useRef<MediaStream | null>(null);
    const iceCandidatesQueue = useRef<RTCIceCandidateInit[]>([]);

    useEffect(() => {
        let startupTimer: NodeJS.Timeout;

        async function startCall() {
            try {
                let stream: MediaStream | null = null;
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                } catch (err) {
                    console.warn("Failed to get video/audio, trying audio only...", err);
                    try {
                        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                        setIsVideoOff(true);
                        toast.warning("Camera not found. Switching to audio only.");
                    } catch (audioErr) {
                        console.error("Failed to get audio", audioErr);
                        setError("No camera or microphone found. Please connect a device.");
                        toast.error("No media devices found");
                        return;
                    }
                }

                if (!stream) return;

                localStream.current = stream;

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                const pc = new RTCPeerConnection(ICE_SERVERS);
                peerConnection.current = pc;

                // Add tracks
                stream.getTracks().forEach((track) => {
                    pc.addTrack(track, stream);
                });

                // Handle remote stream
                pc.ontrack = (event) => {
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = event.streams[0];
                    }
                };

                // Handle ICE candidates
                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit("signal", { toUserId: remoteUserId, signal: { type: "candidate", candidate: event.candidate } });
                    }
                };

                // Signaling Handlers
                socket.on("signal", async (data) => {
                    if (data.fromUserId !== remoteUserId) return;
                    const signal = data.signal;

                    if (signal.type === "offer") {
                        if (pc.signalingState !== "stable") {
                            // Collision handling or unexpected state
                            console.warn("Received offer in non-stable state", pc.signalingState);
                            return;
                        }

                        await pc.setRemoteDescription(new RTCSessionDescription(signal.offer));

                        // Process queued candidates
                        while (iceCandidatesQueue.current.length > 0) {
                            const candidate = iceCandidatesQueue.current.shift();
                            if (candidate) {
                                try {
                                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                                } catch (e) {
                                    console.error("Error adding queued ICE candidate", e);
                                }
                            }
                        }

                        const answer = await pc.createAnswer();
                        await pc.setLocalDescription(answer);
                        socket.emit("signal", { toUserId: remoteUserId, signal: { type: "answer", answer } });

                    } else if (signal.type === "answer") {
                        if (pc.signalingState === "stable") {
                            console.warn("Received answer but connection is already stable. Ignoring.");
                            return;
                        }
                        await pc.setRemoteDescription(new RTCSessionDescription(signal.answer));
                        // Process queued candidates
                        while (iceCandidatesQueue.current.length > 0) {
                            const candidate = iceCandidatesQueue.current.shift();
                            if (candidate) {
                                try {
                                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                                } catch (e) {
                                    console.error("Error adding queued ICE candidate", e);
                                }
                            }
                        }

                    } else if (signal.type === "candidate") {
                        const candidate = signal.candidate;
                        if (pc.remoteDescription && pc.remoteDescription.type) {
                            try {
                                await pc.addIceCandidate(new RTCIceCandidate(candidate));
                            } catch (e) {
                                console.error("Error adding ICE candidate", e);
                            }
                        } else {
                            // Queue it
                            iceCandidatesQueue.current.push(candidate);
                        }
                    }
                });

                // If initiator, create offer
                if (isInitiator) {
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    socket.emit("signal", { toUserId: remoteUserId, signal: { type: "offer", offer } });
                }

            } catch (err) {
                console.error("Error accessing media devices or setting up WebRTC:", err);
                setError("Failed to initialize call.");
            }
        }

        // Debounce call start to prevent double-firing in Strict Mode
        startupTimer = setTimeout(startCall, 100);

        return () => {
            clearTimeout(startupTimer);
            // Cleanup
            if (localStream.current) {
                localStream.current.getTracks().forEach((track) => track.stop());
            }
            if (peerConnection.current) {
                peerConnection.current.close();
            }
            socket.off("signal");
        };
    }, [socket, remoteUserId, isInitiator]);

    const toggleMute = () => {
        if (localStream.current) {
            localStream.current.getAudioTracks().forEach(track => track.enabled = !track.enabled);
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (localStream.current) {
            localStream.current.getVideoTracks().forEach(track => track.enabled = !track.enabled);
            setIsVideoOff(!isVideoOff);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10">
                {/* Remote Video (Main) */}
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                />

                {/* Local Video (PiP) */}
                <div className="absolute top-4 right-4 w-48 aspect-video bg-gray-900 rounded-md overflow-hidden border border-white/20 shadow-lg">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted // Muted locally to avoid feedback
                        className="w-full h-full object-cover"
                    />
                    {error && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white text-xs text-center p-2">
                            {error}
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 p-4 rounded-full backdrop-blur-md">
                    <Button
                        variant={isMuted ? "destructive" : "secondary"}
                        size="icon"
                        className="rounded-full h-12 w-12"
                        onClick={toggleMute}
                    >
                        {isMuted ? <MicOff /> : <Mic />}
                    </Button>

                    <Button
                        variant={isVideoOff ? "destructive" : "secondary"}
                        size="icon"
                        className="rounded-full h-12 w-12"
                        onClick={toggleVideo}
                    >
                        {isVideoOff ? <VideoOff /> : <Video />}
                    </Button>

                    <Button
                        variant="destructive"
                        size="icon"
                        className="rounded-full h-16 w-16"
                        onClick={onEndCall}
                    >
                        <PhoneOff className="h-8 w-8" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
