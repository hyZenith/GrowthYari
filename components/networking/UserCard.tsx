"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Video } from "lucide-react";

interface User {
    id: string;
    name: string;
    image?: string;
    bio?: string;
    industry?: string;
    status?: "ONLINE" | "BUSY";
}

interface UserCardProps {
    user: User;
    onConnect: (userId: string) => void;
    disabled?: boolean;
}

export function UserCard({ user, onConnect, disabled }: UserCardProps) {
    return (
        <Card className="w-full max-w-sm hover:shadow-lg transition-shadow bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <h3 className="font-semibold text-lg leading-none">{user.name}</h3>
                    <span className="text-sm text-muted-foreground">{user.industry || "Tech Enthusiast"}</span>
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                    {user.bio || "No bio available."}
                </p>
                <div className="mt-3 flex gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">React</Badge>
                    <Badge variant="secondary" className="text-xs">Next.js</Badge>
                </div>
            </CardContent>
            <CardFooter className="pt-2">
                <Button
                    className="w-full gap-2"
                    onClick={() => onConnect(user.id)}
                    disabled={disabled || user.status === "BUSY"}
                    variant={user.status === "BUSY" ? "secondary" : "default"}
                >
                    <Video className="h-4 w-4" />
                    {user.status === "BUSY" ? "Busy" : "Connect"}
                </Button>
            </CardFooter>
        </Card>
    );
}
