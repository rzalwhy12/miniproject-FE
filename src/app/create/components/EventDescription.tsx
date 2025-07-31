"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Settings } from "lucide-react";

interface EventDescriptionProps {
    description: string;
    syaratKetentuan: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const EventDescription: React.FC<EventDescriptionProps> = ({
    description,
    syaratKetentuan,
    onChange
}) => {
    return (
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
            <CardContent className="p-8">
                <div className="space-y-6">
                    <div className="space-y-3">
                        <Label className="text-lg font-semibold text-gray-800 flex items-center">
                            <Edit className="w-5 h-5 mr-2" />
                            Event Description
                        </Label>
                        <textarea
                            name="description"
                            placeholder="Tell the world about your amazing event..."
                            value={description}
                            onChange={onChange}
                            rows={4}
                            className="w-full p-4 bg-white/90 border border-gray-300 text-gray-800 placeholder:text-gray-500 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                            required
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-lg font-semibold text-gray-800 flex items-center">
                            <Settings className="w-5 h-5 mr-2" />
                            Terms & Conditions
                        </Label>
                        <textarea
                            name="syaratKetentuan"
                            placeholder="Enter terms and conditions for your event..."
                            value={syaratKetentuan}
                            onChange={onChange}
                            rows={4}
                            className="w-full p-4 bg-white/90 border border-gray-300 text-gray-800 placeholder:text-gray-500 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default EventDescription;
