"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, X } from "lucide-react";

const PREDEFINED_CATEGORIES = [
    "Entrepreneurship",
    "Product Management",
    "Engineering",
    "Design",
    "Marketing",
    "Community",
    "Leadership"
];

interface CategorySelectorProps {
    selectedCategories: string[];
    onChange: (categories: string[]) => void;
}

export function CategorySelector({ selectedCategories = [], onChange }: CategorySelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleCategory = (category: string) => {
        if (selectedCategories.includes(category)) {
            onChange(selectedCategories.filter((c) => c !== category));
        } else {
            onChange([...selectedCategories, category]);
        }
    };

    const removeCategory = (category: string) => {
        onChange(selectedCategories.filter((c) => c !== category));
    };

    return (
        <div className="flex flex-col gap-3" ref={containerRef}>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                    <span className="text-slate-500">
                        {selectedCategories.length === 0 ? "Select categories..." : `${selectedCategories.length} selected`}
                    </span>
                    <ChevronDown className={`ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                    <div className="absolute top-full z-50 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg">
                        <div className="p-1">
                            {PREDEFINED_CATEGORIES.map((category) => (
                                <div
                                    key={category}
                                    onClick={() => toggleCategory(category)}
                                    className="relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-slate-100 hover:text-slate-900"
                                >
                                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                        {selectedCategories.includes(category) && <Check className="h-4 w-4 text-emerald-600" />}
                                    </span>
                                    {category}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Selected Tags */}
            {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((category) => (
                        <div
                            key={category}
                            className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                        >
                            {category}
                            <button
                                type="button"
                                onClick={() => removeCategory(category)}
                                className="ml-1 rounded-full p-0.5 hover:bg-emerald-100 text-emerald-600"
                            >
                                <X className="h-3 w-3" />
                                <span className="sr-only">Remove {category}</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Hidden input for form submission compatibility if needed */}
            <input type="hidden" name="categories" value={JSON.stringify(selectedCategories)} />
        </div>
    );
}
