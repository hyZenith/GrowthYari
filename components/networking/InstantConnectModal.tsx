"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Zap,
    X,
    Filter,
    Search,
    RotateCcw,
    Users,
    MapPin,
    Video,
    ChevronRight,
    Loader2
} from "lucide-react";

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
    languages?: string[];
    interests?: string[];
    skills?: string[];
    subNiche?: string; // Add if it exists in some contexts, but primarily use others
}

interface InstantConnectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConnect: (userId: string) => void;
    availableUsers: User[];
}

type ViewState = "FILTER" | "SEARCHING" | "EMPTY" | "MATCH";

export function InstantConnectModal({
    isOpen,
    onClose,
    onConnect,
    availableUsers,
}: InstantConnectModalProps) {
    const [view, setView] = useState<ViewState>("FILTER");
    const [filters, setFilters] = useState({
        domain: "",
        subNiche: "",
        location: "",
        language: "",
        interests: [] as string[],
    });
    const [matchedUser, setMatchedUser] = useState<User | null>(null);
    const [matchIndex, setMatchIndex] = useState(0);
    const [filteredPool, setFilteredPool] = useState<User[]>([]);

    // Reset when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setView("FILTER");
        }
    }, [isOpen]);

    const handleFindMatch = () => {
        setView("SEARCHING");

        console.log("=== INSTANT CONNECT: Finding Match with Relaxation ===");
        console.log("Available users online:", availableUsers.length);
        console.log("Filters:", filters);

        setTimeout(() => {
            const domain = filters.domain.toLowerCase();
            const subNiche = filters.subNiche.toLowerCase();
            const location = filters.location.toLowerCase();
            const language = filters.language.toLowerCase();
            const interest = (filters.interests[0] || "").toLowerCase();

            // Function to check if a user matches given criteria
            const checkMatch = (u: User, useSubNiche: boolean, useInterest: boolean, useLocation: boolean, useLanguage: boolean) => {
                // Domain always matches (if provided)
                const dMatch = !filters.domain || u.industry?.toLowerCase() === domain;
                if (!dMatch) return false;

                if (useSubNiche && filters.subNiche) {
                    const snMatch = u.headline?.toLowerCase().includes(subNiche) ||
                        u.skills?.some(s => s.toLowerCase().includes(subNiche)) ||
                        u.interests?.some(i => i.toLowerCase().includes(subNiche));
                    if (!snMatch) return false;
                }

                if (useInterest && interest) {
                    const iMatch = u.interests?.some(i => i.toLowerCase().includes(interest)) ||
                        u.skills?.some(s => s.toLowerCase().includes(interest));
                    if (!iMatch) return false;
                }

                if (useLocation && filters.location) {
                    const lMatch = u.location?.toLowerCase().includes(location);
                    if (!lMatch) return false;
                }

                if (useLanguage && filters.language) {
                    // Logic to check language if available on user object
                    // assuming u.languages exists or assuming optional check
                }

                return true;
            };

            // Progressive Relaxation Order: sub-niche -> interests -> location -> language
            let pool: User[] = [];

            // Step 1: Exact match (all selected filters)
            pool = availableUsers.filter(u => checkMatch(u, true, true, true, true));

            if (pool.length === 0) {
                console.log("Relaxing sub-niche...");
                pool = availableUsers.filter(u => checkMatch(u, false, true, true, true));
            }

            if (pool.length === 0) {
                console.log("Relaxing interests...");
                pool = availableUsers.filter(u => checkMatch(u, false, false, true, true));
            }

            if (pool.length === 0) {
                console.log("Relaxing location...");
                pool = availableUsers.filter(u => checkMatch(u, false, false, false, true));
            }

            if (pool.length === 0) {
                console.log("Relaxing language (Domain only)...");
                pool = availableUsers.filter(u => checkMatch(u, false, false, false, false));
            }

            if (pool.length > 0) {
                setFilteredPool(pool);
                setMatchedUser(pool[0]);
                setMatchIndex(0);
                setView("MATCH");
                console.log(`✓ Match found: ${pool[0].name} (Total pool: ${pool.length})`);
            } else {
                setView("EMPTY");
                console.log("❌ No matches found even after full relaxation");
            }
        }, 2000);
    };


    const handleNextMatch = () => {
        if (filteredPool.length === 0) {
            console.error("No users in filtered pool");
            return;
        }

        if (filteredPool.length === 1) {
            // Only one user, show a toast or just stay on the same user
            console.log("Only one user matches the criteria");
            return;
        }

        const nextIndex = (matchIndex + 1) % filteredPool.length;
        setMatchIndex(nextIndex);
        setMatchedUser(filteredPool[nextIndex]);
        console.log(`Switched to user ${nextIndex + 1} of ${filteredPool.length}`);
    };

    const handleReset = () => {
        setFilters({
            domain: "",
            subNiche: "",
            location: "",
            language: "",
            interests: [],
        });
    };

    const renderHeader = () => (
        <DialogHeader className="pb-4 border-b border-gray-100 flex flex-row items-center gap-2 text-left sm:text-left">
            <div className="bg-emerald-100 p-1.5 rounded-lg shrink-0">
                <Zap className="h-5 w-5 text-emerald-600 fill-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
                <DialogTitle className="text-xl font-bold text-gray-900 leading-tight">Instant Connect</DialogTitle>
                <DialogDescription className="text-xs text-gray-500 mt-0.5">
                    Connect instantly with verified professionals based on your preferences
                </DialogDescription>
            </div>
        </DialogHeader>
    );

    const renderFilterView = () => (
        <div className="space-y-6 py-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="h-4 w-4" />
                <span>Select all filters for better matching</span>
            </div>

            <div className="grid gap-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Domain <span className="text-red-500">*</span></label>
                    <select
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none"
                        value={filters.domain}
                        onChange={(e) => setFilters({ ...filters, domain: e.target.value })}
                    >
                        <option value="">Select domain</option>
                        <option value="Technology">Technology</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Finance">Finance</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Education">Education</option>
                        <option value="Design">Design</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Sub-Niche</label>
                    <select
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none"
                        value={filters.subNiche}
                        onChange={(e) => setFilters({ ...filters, subNiche: e.target.value })}
                    >
                        <option value="">Select sub-niche</option>
                        <option value="Software">Software Engineering</option>
                        <option value="Frontend">Frontend Development</option>
                        <option value="Backend">Backend Development</option>
                        <option value="Growth">Growth Marketing</option>
                        <option value="Product">Product Management</option>
                        <option value="Consulting">Consulting</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <select
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none"
                        value={filters.location}
                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    >
                        <option value="">Select location</option>
                        <option value="Bangalore">Bangalore, India</option>
                        <option value="Mumbai">Mumbai, India</option>
                        <option value="Delhi">Delhi, India</option>
                        <option value="Hyderabad">Hyderabad, India</option>
                        <option value="Pune">Pune, India</option>
                        <option value="Chennai">Chennai, India</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Language</label>
                    <select
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none"
                        value={filters.language}
                        onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                    >
                        <option value="">Select language</option>
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Interest</label>
                    <select
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none"
                        value={filters.interests[0] || ""}
                        onChange={(e) => setFilters({ ...filters, interests: [e.target.value] })}
                    >
                        <option value="">Select interest</option>
                        <option value="React">React</option>
                        <option value="Next.js">Next.js</option>
                        <option value="AI">AI/ML</option>
                        <option value="Startups">Startups</option>
                        <option value="Networking">Networking</option>
                        <option value="Mentorship">Mentorship</option>
                        <option value="Strategy">Strategy</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Users className="h-3.5 w-3.5" />
                    <span>{availableUsers.length} professionals match your filters</span>
                </div>
                <Button
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl py-6 text-lg font-bold shadow-lg shadow-emerald-700/10 gap-2"
                    onClick={handleFindMatch}
                    disabled={!filters.domain}
                >
                    <Zap className="h-5 w-5 fill-white" />
                    Find Match
                </Button>
                <button
                    onClick={handleReset}
                    className="text-sm text-gray-500 hover:text-emerald-700 font-medium transition-colors"
                >
                    Reset Filters
                </button>
            </div>
        </div>
    );

    const renderSearchingView = () => (
        <div className="flex flex-col items-center justify-center py-16 space-y-6">
            <div className="relative">
                <div className="h-24 w-24 rounded-full border-4 border-emerald-100 flex items-center justify-center">
                    <Users className="h-10 w-10 text-emerald-600/50" />
                </div>
                <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>

            <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-gray-900">Finding a match.</h3>
                <p className="text-sm text-gray-500">Searching {availableUsers.length} professionals in {filters.domain || "your area"}</p>
            </div>

            <div className="flex gap-1.5">
                <div className="h-1.5 w-6 bg-emerald-500 rounded-full animate-pulse" />
                <div className="h-1.5 w-6 bg-gray-200 rounded-full" />
                <div className="h-1.5 w-6 bg-gray-200 rounded-full" />
            </div>
        </div>
    );

    const renderEmptyStateView = () => (
        <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center">
            <div className="bg-orange-50 p-4 rounded-full">
                <Search className="h-10 w-10 text-orange-500" />
            </div>
            <div className="max-w-xs space-y-2">
                <h3 className="text-xl font-bold text-gray-900">No matches found</h3>
                <p className="text-sm text-gray-500">No professionals match your current criteria. Try adjusting your filters.</p>
            </div>
            <Button
                variant="outline"
                className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 gap-2"
                onClick={() => setView("FILTER")}
            >
                <RotateCcw className="h-4 w-4" />
                Adjust Filters
            </Button>
        </div>
    );

    const renderMatchView = () => {
        if (!matchedUser) return null;

        return (
            <div className="py-8 space-y-8 flex flex-col items-center">
                <div className="relative group">
                    <div className="absolute -inset-1.5 bg-emerald-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 mr-2" />
                    <Avatar className="h-32 w-32 border-4 border-white shadow-xl relative ring-1 ring-gray-100">
                        <AvatarImage src={matchedUser.image} alt={matchedUser.name} />
                        <AvatarFallback className="bg-emerald-50 text-emerald-700 text-3xl font-bold">
                            {matchedUser.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-1 right-2 h-6 w-6 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                        <div className="h-3.5 w-3.5 bg-emerald-500 rounded-full" />
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black text-gray-900">{matchedUser.name}</h3>
                    <p className="text-gray-500 font-medium">{matchedUser.headline || "Professional"} {matchedUser.subNiche ? `at ${matchedUser.subNiche}` : "at GrowthYari"}</p>

                    <div className="flex flex-wrap justify-center gap-2 pt-2">
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-100 rounded-lg px-2.5 py-1">
                            {matchedUser.industry || "Technology"}
                        </Badge>
                        {matchedUser.experienceLevel && (
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg px-2.5 py-1">
                                {matchedUser.experienceLevel}
                            </Badge>
                        )}
                        <Badge variant="secondary" className="bg-pink-50 text-pink-600 hover:bg-pink-100 rounded-lg px-2.5 py-1 gap-1">
                            <MapPin className="h-3 w-3" />
                            {matchedUser.location || "India"}
                        </Badge>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-2 max-w-sm px-4">
                    {(matchedUser.interests?.length ? matchedUser.interests : ["Strategy Consulting", "Healthcare Operations", "Change Management"]).slice(0, 3).map(interest => (
                        <Badge key={interest} variant="outline" className="bg-emerald-50/50 text-emerald-700 border-emerald-100/50 hover:bg-emerald-50 rounded-lg px-3 py-1.5 font-medium">
                            {interest}
                        </Badge>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4 w-full pt-4">
                    <Button
                        variant="outline"
                        className="rounded-xl border-gray-200 text-gray-700 py-6 font-bold hover:bg-gray-50 flex gap-2"
                        onClick={handleNextMatch}
                    >
                        <ChevronRight className="h-5 w-5" />
                        Next
                    </Button>
                    <Button
                        className="rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white py-6 font-bold flex gap-2 shadow-lg shadow-emerald-700/10"
                        onClick={() => {
                            console.log("=== INSTANT CONNECT: Connect Now Clicked ===");
                            console.log("Matched user:", matchedUser?.id, matchedUser?.name);
                            console.log("onConnect function:", typeof onConnect);

                            if (!matchedUser) {
                                console.error("❌ No matched user to connect to");
                                return;
                            }

                            console.log("✓ Calling onConnect with userId:", matchedUser.id);
                            onConnect(matchedUser.id);
                            console.log("✓ Closing modal");
                            onClose();
                        }}
                    >
                        <Video className="h-5 w-5" />
                        Connect Now
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="p-0 border-none shadow-2xl max-w-[420px] rounded-3xl overflow-hidden bg-white">
                <div className="p-6">
                    {renderHeader()}

                    <div className="min-h-[460px] flex flex-col justify-center">
                        {view === "FILTER" && renderFilterView()}
                        {view === "SEARCHING" && renderSearchingView()}
                        {view === "EMPTY" && renderEmptyStateView()}
                        {view === "MATCH" && renderMatchView()}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

