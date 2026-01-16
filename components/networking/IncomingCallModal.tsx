"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Phone, PhoneOff } from "lucide-react";

interface Caller {
    id: string;
    name: string;
    image?: string;
    bio?: string;
    industry?: string;
}

interface IncomingCallModalProps {
    caller: Caller | null;
    onAccept: () => void;
    onReject: () => void;
}

export function IncomingCallModal({ caller, onAccept, onReject }: IncomingCallModalProps) {
    if (!caller) return null;

    return (
        <Dialog open={!!caller} onOpenChange={() => onReject()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Incoming Call</DialogTitle>
                    <DialogDescription>
                        Someone wants to connect with you!
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 py-4">
                    <Avatar className="h-24 w-24 border-4 border-primary/10">
                        <AvatarImage src={caller.image} />
                        <AvatarFallback className="text-2xl">{caller.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                        <h3 className="text-xl font-bold">{caller.name}</h3>
                        <p className="text-muted-foreground">{caller.industry || "Professional"}</p>
                    </div>
                </div>
                <DialogFooter className="sm:justify-center gap-4">
                    <Button variant="destructive" size="lg" className="gap-2 w-full sm:w-auto" onClick={onReject}>
                        <PhoneOff className="h-5 w-5" />
                        Decline
                    </Button>
                    <Button variant="default" size="lg" className="gap-2 bg-green-600 hover:bg-green-700 w-full sm:w-auto" onClick={onAccept}>
                        <Phone className="h-5 w-5" />
                        Accept
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
