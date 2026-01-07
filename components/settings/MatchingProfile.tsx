"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

interface MatchingProfileProps {
    networkingAvailable: boolean;
    setNetworkingAvailable: (val: boolean) => void;
    industry: string;
    setIndustry: (val: string) => void;
    experienceLevel: string;
    setExperienceLevel: (val: string) => void;
    interests: string[];
    setInterests: (val: string[]) => void;
    skills: string[];
    setSkills: (val: string[]) => void;
}

const INDUSTRIES = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'Marketing',
    'Sales', 'Product', 'Design', 'Engineering', 'Consulting',
    'Legal', 'Real Estate'
];

const EXPERIENCE_LEVELS = [
    'Student',
    'Entry Level (0-2 years)',
    'Mid Level (3-5 years)',
    'Senior (6-10 years)',
    'Executive (10+ years)'
];

const SUGGESTED_INTERESTS = ["Startups", "AI", "Blockchain", "Product Management", "Growth Hacking", "Venture Capital", "EdTech", "HealthTech"];
const SUGGESTED_SKILLS = ["JavaScript", "Python", "Product Strategy", "Leadership", "Marketing", "Sales", "Data Analysis", "Machine Learning"];

export function MatchingProfile({
    networkingAvailable, setNetworkingAvailable,
    industry, setIndustry,
    experienceLevel, setExperienceLevel,
    interests, setInterests,
    skills, setSkills
}: MatchingProfileProps) {

    const [interestInput, setInterestInput] = useState("");
    const [skillInput, setSkillInput] = useState("");

    const addInterest = (val: string) => {
        if (val && !interests.includes(val)) {
            setInterests([...interests, val]);
        }
        setInterestInput("");
    };

    const removeInterest = (val: string) => {
        setInterests(interests.filter(i => i !== val));
    };

    const addSkill = (val: string) => {
        if (val && !skills.includes(val)) {
            setSkills([...skills, val]);
        }
        setSkillInput("");
    };

    const removeSkill = (val: string) => {
        setSkills(skills.filter(s => s !== val));
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                    <h3 className="font-semibold text-slate-900">Available for Networking</h3>
                    <p className="text-sm text-slate-500">Allow others to find and connect with you</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={networkingAvailable} onChange={(e) => setNetworkingAvailable(e.target.checked)} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Industry <span className="text-red-500">*</span></label>
                    <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    >
                        <option value="">Select your industry</option>
                        {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Experience Level <span className="text-red-500">*</span></label>
                    <select
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    >
                        <option value="">Select experience level</option>
                        {EXPERIENCE_LEVELS.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                    </select>
                </div>
            </div>

            {/* Interests */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Interests <span className="text-red-500">*</span> (Select at least 3)</label>
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={interestInput}
                        onChange={(e) => setInterestInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest(interestInput))}
                        placeholder="Add custom interest"
                        className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    />
                    <button
                        type="button"
                        onClick={() => addInterest(interestInput)}
                        className="p-2 rounded-lg border border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                    >
                        <Plus className="h-5 w-5" />
                    </button>
                </div>

                {/* Selected Interests */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {interests.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-sm font-medium text-slate-700">
                            {tag}
                            <button onClick={() => removeInterest(tag)} className="hover:text-red-500"><X className="h-3 w-3" /></button>
                        </span>
                    ))}
                </div>

                {/* Suggested Interests */}
                <div className="flex flex-wrap gap-2">
                    {SUGGESTED_INTERESTS.filter(i => !interests.includes(i)).map(tag => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => addInterest(tag)}
                            className="px-3 py-1 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:border-emerald-500 hover:text-emerald-600 bg-white transition-colors"
                        >
                            + {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Skills */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Skills</label>
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(skillInput))}
                        placeholder="Add custom skill"
                        className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    />
                    <button
                        type="button"
                        onClick={() => addSkill(skillInput)}
                        className="p-2 rounded-lg border border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                    >
                        <Plus className="h-5 w-5" />
                    </button>
                </div>

                {/* Selected Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {skills.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-sm font-medium text-slate-700">
                            {tag}
                            <button onClick={() => removeSkill(tag)} className="hover:text-red-500"><X className="h-3 w-3" /></button>
                        </span>
                    ))}
                </div>

                {/* Suggested Skills */}
                <div className="flex flex-wrap gap-2">
                    {SUGGESTED_SKILLS.filter(s => !skills.includes(s)).map(tag => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => addSkill(tag)}
                            className="px-3 py-1 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:border-emerald-500 hover:text-emerald-600 bg-white transition-colors"
                        >
                            + {tag}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
