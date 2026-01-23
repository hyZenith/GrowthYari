"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import { Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import {
    Mic, MicOff, Video, VideoOff, ScreenShare, PhoneOff,
    MonitorUp, MonitorOff, Volume2, VolumeX, RefreshCw, Activity
} from "lucide-react";

interface VideoCallProps {
    socket: Socket;
    remoteUserId: string;
    isInitiator: boolean;
    onEndCall: () => void;
    currentUser: any;
    iceServers: RTCIceServer[];
}

export function VideoCall({ socket, remoteUserId, isInitiator, onEndCall, currentUser, iceServers }: VideoCallProps) {
    // State
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [remoteVolume, setRemoteVolume] = useState(1.0);
    const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>("new");
    const [localAudioLevel, setLocalAudioLevel] = useState(0);
    const [remoteAudioLevel, setRemoteAudioLevel] = useState(0);

    // Stream State (React-controlled)
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

    // Refs for Media & WebRTC
    const localAudioRef = useRef<MediaStreamTrack | null>(null);
    const localVideoRef = useRef<MediaStreamTrack | null>(null); // Current active video track (camera or screen)
    const cameraStreamRef = useRef<MediaStream | null>(null); // Keep camera stream handy to revert to

    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const iceCandidatesQueue = useRef<RTCIceCandidateInit[]>([]);

    // HTML Elements
    const localVideoElement = useRef<HTMLVideoElement | null>(null);
    const remoteVideoElement = useRef<HTMLVideoElement | null>(null);
    // Consolidated remote media: No separate audio element needed
    const audioContextRef = useRef<AudioContext | null>(null);
    const isMountedRef = useRef(true);

    // Volume Ref to avoid dependency loops
    const remoteVolumeRef = useRef(remoteVolume);

    // Update volume ref when state changes
    // Update volume ref when state changes
    useEffect(() => {
        remoteVolumeRef.current = remoteVolume;
        if (remoteVideoElement.current) {
            remoteVideoElement.current.volume = remoteVolume;
        }
    }, [remoteVolume]);

    // --- Mock Stream Helper ---
    const createMockStream = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext("2d");

        if (!ctx) throw new Error("Canvas context not available");

        // Clean white background
        ctx.fillStyle = "#f5f5f5";
        ctx.fillRect(0, 0, 640, 480);

        const stream = canvas.captureStream(30);
        const track = stream.getVideoTracks()[0];

        // Use a loop to animate
        let angle = 0;
        const draw = () => {
            if (track.readyState === "ended") return;

            // Background
            ctx.fillStyle = "#1e1e1e";
            ctx.fillRect(0, 0, 640, 480);

            // Bouncing Ball / Animation
            angle += 0.05;
            const x = 320 + Math.sin(angle) * 100;
            const y = 240 + Math.cos(angle * 1.5) * 80;

            ctx.beginPath();
            ctx.arc(x, y, 40, 0, Math.PI * 2);
            ctx.fillStyle = "#10b981"; // Emerald-500
            ctx.fill();

            // Text Overlay
            ctx.font = "30px sans-serif";
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "center";
            ctx.fillText("Mock Camera Active", 320, 240);
            ctx.font = "20px sans-serif";
            ctx.fillStyle = "#9ca3af";
            ctx.fillText("Device in use / blocked", 320, 280);

            requestAnimationFrame(draw);
        };
        draw();

        // Label it for debugging
        // track.label is read-only, so we just return the stream
        return stream;
    };

    // --- Cleanup Function ---
    const cleanupCall = useCallback(() => {
        console.log("Cleaning up call resources...");

        // Stop all tracks
        if (localAudioRef.current) localAudioRef.current.stop();
        if (localVideoRef.current) localVideoRef.current.stop();
        if (cameraStreamRef.current) {
            cameraStreamRef.current.getTracks().forEach(t => t.stop());
        }

        // Remove socket listeners
        socket.off("signal");
        socket.off("call-ended");

        // Close PeerConnection
        if (peerConnection.current) {
            peerConnection.current.ontrack = null;
            peerConnection.current.onicecandidate = null;
            peerConnection.current.onconnectionstatechange = null;
            peerConnection.current.close();
        }

        // Reset refs
        localAudioRef.current = null;
        localVideoRef.current = null;
        cameraStreamRef.current = null;
        peerConnection.current = null;

        // Clear Audio Context
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }
        audioContextRef.current = null;

    }, [socket]);

    // --- Safe Play Helper ---
    const safePlay = async (element: HTMLMediaElement | null, stream: MediaStream | null) => {
        if (!element || !stream) return;

        try {
            element.srcObject = stream;
            // Play only if not already playing? safe to call play() again usually, but let's be strict
            if (element.paused) {
                await element.play();
            }
        } catch (err: any) {
            if (err.name === 'AbortError') {
                // Ignore AbortError: The play() request was interrupted by a new load request.
                // This is expected if the stream changes quickly or component unmounts.
                return;
            }
            console.warn("Auto-play failed:", err);
        }
    };

    // --- Remote Video/Audio Handling ---
    useEffect(() => {
        const video = remoteVideoElement.current;
        if (!video || !remoteStream) return;

        console.log("🎥 Attaching Remote Stream to Video Element", remoteStream.id, remoteStream.getTracks().map(t => `${t.kind}:${t.enabled}`));

        // Assign and Play
        safePlay(video, remoteStream);
        video.volume = remoteVolumeRef.current; // Ensure volume is set

        // Cleanup: Pause and clear srcObject
        return () => {
            if (video) {
                video.pause();
                video.srcObject = null;
            }
        };
    }, [remoteStream]);


    // --- Audio Doctor (Analysis Only) ---
    useEffect(() => {
        if (!remoteStream || !isMountedRef.current) return;

        const audioTrack = remoteStream.getAudioTracks()[0];
        if (!audioTrack) return;

        // Initialize Audio Context for Analysis
        const initAudioDoctor = async () => {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            const ctx = audioContextRef.current;
            if (ctx.state === 'suspended') await ctx.resume();

            try {
                // Check if already connected to this specific stream? 
                // Hard to check, but creating new nodes is cheap enough for a call start.
                // Better: Check if context is valid.

                const source = ctx.createMediaStreamSource(remoteStream);
                const gainNode = ctx.createGain();
                const analyser = ctx.createAnalyser();

                gainNode.gain.value = remoteVolumeRef.current * 3.0; // Use Ref here
                source.connect(gainNode);
                gainNode.connect(analyser);
                // DO NOT connect to ctx.destination here if the <audio> element is playing separately to avoid echo/double audio
                // UNLESS the <audio> element is muted or not used? 
                // Using separate <audio> for playback is safer for echo cancellation.
                // So we ONLY use this chain for ANALYSIS.
                // gainNode.connect(ctx.destination); // REMOVED to avoid double audio / echo

                const dataArray = new Uint8Array(analyser.frequencyBinCount);
                const checkRemote = () => {
                    if (!isMountedRef.current) return;
                    analyser.getByteFrequencyData(dataArray);
                    let sum = 0;
                    for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
                    const avg = sum / dataArray.length;
                    setRemoteAudioLevel(avg);
                    requestAnimationFrame(checkRemote);
                };
                checkRemote();

            } catch (e) {
                console.error("Audio Doctor Analysis Setup Error", e);
            }
        };

        initAudioDoctor();

    }, [remoteStream]); // Removed remoteVolume dependency


    // --- Initialize Call ---
    useEffect(() => {
        isMountedRef.current = true;
        let mounted = true;

        const processQueuedCandidates = async (pc: RTCPeerConnection) => {
            while (iceCandidatesQueue.current.length > 0) {
                const c = iceCandidatesQueue.current.shift();
                if (c) {
                    try {
                        await pc.addIceCandidate(new RTCIceCandidate(c));
                    } catch (e) {
                        console.error("Error adding queued candidate", e);
                    }
                }
            }
        };

        const initialize = async () => {
            console.log("🚀 Starting initialization...");
            try {
                // ... (Device enumeration and setup - kept mostly same) ...
                const devices = await navigator.mediaDevices.enumerateDevices();

                // 0. Hardware Preference
                const preferredMic = devices.find(d => d.kind === 'audioinput' && d.label.includes('Realtek') && !d.label.includes('AI'))
                    || devices.find(d => d.kind === 'audioinput' && d.label.includes('Microphone Array'));
                const hasVideo = devices.some(d => d.kind === 'videoinput');

                // 1. Peer Connection
                const pc = new RTCPeerConnection({
                    iceServers: iceServers,
                    iceTransportPolicy: "all"
                });
                peerConnection.current = pc;

                // 2. Local Media
                let localAudioTrack: MediaStreamTrack | null = null;
                let localVideoTrack: MediaStreamTrack | null = null;
                let localCameraStream: MediaStream | null = null;

                // ... (Mic Request) ...
                try {
                    const preferredMicId = preferredMic?.deviceId;
                    const audioStream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            deviceId: preferredMicId ? { exact: preferredMicId } : undefined,
                            echoCancellation: true,
                            noiseSuppression: true,
                            autoGainControl: true
                        }
                    });
                    localAudioTrack = audioStream.getAudioTracks()[0];
                } catch (audioErr) {
                    try {
                        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                        localAudioTrack = audioStream.getAudioTracks()[0];
                    } catch (e) {
                        toast.error("Microphone not available.");
                    }
                }

                // ... (Video Request) ...
                if (hasVideo && isVideoEnabled) {
                    try {
                        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
                        localVideoTrack = videoStream.getVideoTracks()[0];
                        localCameraStream = videoStream;
                        cameraStreamRef.current = localCameraStream;
                    } catch (videoErr: any) {
                        console.warn("Camera failed", videoErr);

                        // FALLBACK: If device in use (NotReadableError)
                        if (videoErr.name === 'NotReadableError' || videoErr.name === 'TrackStartError') {
                            console.log("⚠️ Camera blocked/in-use. Swapping to MOCK CAMERA.");
                            toast.warning("Camera in use! Using Mock Camera fallback.");
                            try {
                                const mockStream = createMockStream();
                                localVideoTrack = mockStream.getVideoTracks()[0];
                                localCameraStream = mockStream;
                                cameraStreamRef.current = mockStream;
                            } catch (mockErr) {
                                console.error("Mock stream creation failed", mockErr);
                            }
                        }
                    }
                }

                if (!mounted) {
                    pc.close();
                    localAudioTrack?.stop();
                    localVideoTrack?.stop();
                    return;
                }

                // Initial State Sync
                if (localAudioTrack) localAudioTrack.enabled = !isMuted;
                if (localVideoTrack) localVideoTrack.enabled = isVideoEnabled;

                localAudioRef.current = localAudioTrack;
                localVideoRef.current = localVideoTrack;

                // 4. WebRTC Events
                pc.onicecandidate = (e) => {
                    if (e.candidate) {
                        socket.emit("signal", { toUserId: remoteUserId, signal: { type: "candidate", candidate: e.candidate } });
                    }
                };

                pc.onconnectionstatechange = () => {
                    setConnectionState(pc.connectionState);
                    if (pc.connectionState === "connected") {
                        toast.success("Call connected.");
                    }
                };

                // IMPORTANT: Track Handling
                pc.ontrack = (event) => {
                    const stream = event.streams[0];
                    console.log(`🎵 Incoming Track: ${event.track.kind}`, stream.id);

                    // If we already have the stream, we might need to force a re-render or re-attach 
                    // if the track was added later. 
                    // However, creating a new MediaStream reference is a safe way to trigger effects.
                    if (peerConnection.current) {
                        // Ensure the stream has all tracks
                        const visualTracks = stream.getVideoTracks();
                        const audioTracks = stream.getAudioTracks();
                        if (visualTracks.length > 0 || audioTracks.length > 0) {
                            // Trigger state update
                            setRemoteStream(stream);
                            // Force re-attach if needed by re-setting state with new object reference?
                            // Actually, let's just create a new wrapper if needed, 
                            // but usually passing the same stream is fine IF we handle the effect right.
                            // To be 100% sure, we can set it to the stream.
                        }
                    }
                };

                // Add Tracks
                const combinedStream = new MediaStream();
                if (localAudioTrack) pc.addTrack(localAudioTrack, combinedStream);
                if (localVideoTrack) pc.addTrack(localVideoTrack, combinedStream);

                // Show Local Preview
                if (localVideoElement.current && localCameraStream) {
                    localVideoElement.current.srcObject = localCameraStream;
                }

                // Signaling & Stats (kept similar but concise here) ...
                socket.off("signal");
                socket.on("signal", async (data: { fromUserId: string, signal: any }) => {
                    if (data.fromUserId !== remoteUserId) return;
                    const signal = data.signal;
                    try {
                        if (signal.type === "offer") {
                            if (pc.signalingState !== "stable") return;
                            await pc.setRemoteDescription(new RTCSessionDescription(signal.offer));
                            const answer = await pc.createAnswer();
                            await pc.setLocalDescription(answer);
                            socket.emit("signal", { toUserId: remoteUserId, signal: { type: "answer", answer } });
                            processQueuedCandidates(pc);
                        } else if (signal.type === "answer") {
                            await pc.setRemoteDescription(new RTCSessionDescription(signal.answer));
                            processQueuedCandidates(pc);
                        } else if (signal.type === "candidate") {
                            if (pc.remoteDescription) {
                                await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
                            } else {
                                iceCandidatesQueue.current.push(signal.candidate);
                            }
                        }
                    } catch (e) { console.error("Signaling error", e); }
                });

                // Initiator Offer
                if (isInitiator) {
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    socket.emit("signal", { toUserId: remoteUserId, signal: { type: "offer", offer } });
                }

                // Listen for remote end call
                socket.on("call-ended", () => {
                    toast.info("Call ended by remote user.");
                    onEndCall();
                });

            } catch (err) {
                console.error("Initialization Failed:", err);
                onEndCall();
            }
        };

        initialize();

        return () => {
            isMountedRef.current = false;
            mounted = false;
            cleanupCall();
        };
    }, [isInitiator, remoteUserId, socket, iceServers, cleanupCall, onEndCall]);

    // ... (Keep existing actions: toggleMute, toggleVideo, startScreenShare, etc.) ...

    const handleHangup = () => {
        socket.emit("end-call", { toUserId: remoteUserId });
        onEndCall();
    };

    const toggleMute = () => {
        if (localAudioRef.current) {
            const enabled = !localAudioRef.current.enabled;
            localAudioRef.current.enabled = enabled;
            setIsMuted(!enabled);
        }
    };

    const toggleVideo = async () => {
        if (isScreenSharing) {
            await stopScreenShare();
            return;
        }
        const enabled = !isVideoEnabled;
        setIsVideoEnabled(enabled);
        if (localVideoRef.current) {
            localVideoRef.current.enabled = enabled;
        }
    };

    const startScreenShare = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
            const screenTrack = stream.getVideoTracks()[0];
            if (!peerConnection.current) return;
            const sender = peerConnection.current.getSenders().find(s => s.track?.kind === "video");
            if (sender) {
                await sender.replaceTrack(screenTrack);
                localVideoRef.current = screenTrack; // Update ref
                setIsScreenSharing(true);
                if (localVideoElement.current) localVideoElement.current.srcObject = stream;
                screenTrack.onended = () => stopScreenShare();
            }
        } catch (err) { console.error("Screen share failed", err); }
    };

    const stopScreenShare = async () => {
        if (!peerConnection.current || !cameraStreamRef.current) return;
        if (localVideoRef.current && isScreenSharing) localVideoRef.current.stop();
        const cameraTrack = cameraStreamRef.current.getVideoTracks()[0];
        cameraTrack.enabled = isVideoEnabled;
        const videoSender = peerConnection.current.getSenders().find(s => s.track?.kind === 'video') || peerConnection.current.getSenders().find(s => !s.track);
        if (videoSender) await videoSender.replaceTrack(cameraTrack);
        localVideoRef.current = cameraTrack;
        setIsScreenSharing(false);
        if (localVideoElement.current) localVideoElement.current.srcObject = cameraStreamRef.current;
    };

    // Test functions
    const testAudioOutput = () => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            osc.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.2);
            toast.info("Beep!");
        } catch (e) { }
    };

    const forceAudioRefresh = () => {
        // Just re-trigger state update if stream exists
        if (remoteStream) {
            const video = remoteVideoElement.current;
            if (video) safePlay(video, remoteStream);
        }
    };


    return (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-6xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 group">

                {/* Connection Status Overlay */}
                {connectionState !== "connected" && (
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/60 rounded-full text-xs font-medium text-white/80">
                        <Activity className="w-3 h-3 animate-pulse text-amber-500" />
                        <span>{connectionState.charAt(0).toUpperCase() + connectionState.slice(1)}</span>
                    </div>
                )}

                {/* Remote Video (Main) */}
                <video
                    ref={remoteVideoElement}
                    // Remove autoPlay to force manual control via effect
                    playsInline
                    muted={false}
                    className="w-full h-full object-contain bg-neutral-900"
                    // Add Click-to-Play fallback
                    onClick={() => safePlay(remoteVideoElement.current, remoteStream)}
                />



                {/* Local Video (PiP) */}
                <div className="absolute top-4 right-4 w-48 sm:w-64 aspect-video bg-neutral-800 rounded-lg overflow-hidden border border-white/20 shadow-xl transition-all hover:scale-105">
                    <video
                        ref={localVideoElement}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover ${!isVideoEnabled && !isScreenSharing ? 'hidden' : ''}`}
                    />
                    {!isVideoEnabled && !isScreenSharing && (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-neutral-900">
                            <VideoOff className="w-8 h-8 opacity-50" />
                        </div>
                    )}
                    {/* ... (Mic Indicators: kept same) ... */}
                </div>

                {/* ... (Remote Audio Level / Controls: kept same) ... */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 p-4 rounded-2xl backdrop-blur-xl border border-white/10 transition-transform duration-300 md:translate-y-0 translate-y-2 opacity-100 hover:opacity-100">
                    <Button
                        variant={isMuted ? "destructive" : "secondary"}
                        size="icon"
                        className="rounded-full h-14 w-14 shadow-lg transition-transform hover:scale-110 bg-white"
                        onClick={toggleMute}
                    >
                        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </Button>

                    <Button
                        variant={!isVideoEnabled && !isScreenSharing ? "destructive" : "secondary"}
                        size="icon"
                        className="rounded-full h-14 w-14 shadow-lg transition-transform hover:scale-110 bg-white"
                        onClick={toggleVideo}
                    >
                        {isScreenSharing ? <Video className="w-6 h-6" /> : (isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />)}
                    </Button>

                    <Button
                        variant={isScreenSharing ? "default" : "secondary"}
                        size="icon"
                        className={`rounded-full h-14 w-14 shadow-lg transition-transform hover:scale-110 bg-white ${isScreenSharing ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`}
                        onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                    >
                        {isScreenSharing ? <MonitorOff className="w-6 h-6" /> : <MonitorUp className="w-6 h-6" />}
                    </Button>

                    <div className="w-px h-8 bg-white/20 mx-2" />

                    <Button
                        variant="destructive"
                        size="icon"
                        className="rounded-full h-16 w-16 bg-red-600 hover:bg-red-700 shadow-lg transition-transform hover:scale-110"
                        onClick={handleHangup}
                    >
                        <PhoneOff className="h-8 w-8" />
                    </Button>
                </div>

            </div>
        </div>
    );
}


