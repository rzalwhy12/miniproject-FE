"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, Settings, Sparkles, Globe } from "lucide-react";
import { EventForm, StatusOption, CategoryOption } from "@/types/event";

interface EventBasicInfoProps {
    form: EventForm;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const EventBasicInfo: React.FC<EventBasicInfoProps> = ({ form, onChange }) => {
    const statusOptions: StatusOption[] = [
        { value: "PUBLISHED", label: "Published" },
        { value: "DRAFT", label: "Draft" },
        { value: "CANCELLED", label: "Cancelled" }
    ];

    const categoryOptions: CategoryOption[] = [
        { value: "CONFERENCE", label: "Conference" },
        { value: "WORKSHOP", label: "Workshop" },
        { value: "SEMINAR", label: "Seminar" },
        { value: "BOOTCAMP", label: "Bootcamp" },
        { value: "COMPETITION", label: "Competition" },
        { value: "FESTIVAL", label: "Festival" },
        { value: "MUSIC", label: "Music" },
        { value: "SPORTS", label: "Sports" },
        { value: "TECH", label: "Tech" },
        { value: "ART", label: "Art" },
        { value: "EDUCATION", label: "Education" },
        { value: "CHARITY", label: "Charity" },
        { value: "LAINNYA", label: "Lainnya" }
    ];

    return (
        <div className="space-y-6">
            <div className="relative">
                <Input
                    type="text"
                    name="name"
                    placeholder="Event Name"
                    value={form.name}
                    onChange={onChange}
                    className="text-3xl font-bold border-none p-0 h-auto bg-transparent placeholder:text-gray-500 text-gray-800 focus:ring-0 focus:border-none"
                    required
                />
                <div className="flex items-center mt-2 text-gray-600">
                    <Globe className="w-4 h-4 mr-2" />
                    <p className="text-sm">By Event Organizer</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-sm text-gray-700 flex items-center font-medium">
                        <Calendar className="w-4 h-4 mr-2" />
                        Start Date & Time
                    </Label>
                    <Input
                        type="datetime-local"
                        name="startDate"
                        value={form.startDate}
                        onChange={onChange}
                        className="bg-white/80 border-gray-300 text-gray-800 focus:border-purple-500 focus:ring-purple-500/20"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-sm text-gray-700 flex items-center font-medium">
                        <Calendar className="w-4 h-4 mr-2" />
                        End Date & Time
                    </Label>
                    <Input
                        type="datetime-local"
                        name="endDate"
                        value={form.endDate}
                        onChange={onChange}
                        className="bg-white/80 border-gray-300 text-gray-800 focus:border-purple-500 focus:ring-purple-500/20"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-sm text-gray-700 flex items-center font-medium">
                    <MapPin className="w-4 h-4 mr-2" />
                    Event Location
                </Label>
                <Input
                    type="text"
                    name="location"
                    placeholder="Enter complete event location"
                    value={form.location}
                    onChange={onChange}
                    className="bg-white/80 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-sm text-gray-700 flex items-center font-medium">
                        <Settings className="w-4 h-4 mr-2" />
                        Event Status
                    </Label>
                    <select
                        name="statusEvent"
                        value={form.statusEvent}
                        onChange={onChange}
                        className="w-full h-10 px-3 py-2 bg-white/80 border border-gray-300 text-gray-800 rounded-md focus:border-purple-500 focus:ring-purple-500/20 focus:ring-2"
                        required
                    >
                        {statusOptions.map(option => (
                            <option key={option.value} value={option.value} className="bg-white text-gray-800">
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <Label className="text-sm text-gray-700 flex items-center font-medium">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Category
                    </Label>
                    <select
                        name="category"
                        value={form.category}
                        onChange={onChange}
                        className="w-full h-10 px-3 py-2 bg-white/80 border border-gray-300 text-gray-800 rounded-md focus:border-purple-500 focus:ring-purple-500/20 focus:ring-2"
                        required
                    >
                        {categoryOptions.map(option => (
                            <option key={option.value} value={option.value} className="bg-white text-gray-800">
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default EventBasicInfo;
