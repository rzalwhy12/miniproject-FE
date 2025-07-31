"use client";
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

// Import komponen yang sudah dipecah
import {
    EventImageUpload,
    EventBasicInfo,
    TicketSection,
    EventDescription,
    EventFormActions,
    BackgroundElements
} from "@/app/create/components";

// Import custom hooks dan utils
import { useCreateEvent } from "@/hooks/useCreateEvent";
import { submitEvent } from "@/utils/eventSubmission";

const CreateEventPage = () => {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();

    // Menggunakan custom hook untuk mengelola state
    const {
        form,
        tickets,
        loading,
        message,
        setLoading,
        setMessage,
        handleChange,
        handleTicketChange,
        addTicket,
        removeTicket,
        resetForm
    } = useCreateEvent();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/sign-in');
        }
    }, [isAuthenticated, authLoading, router]);

    // Show loading screen while checking authentication
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg animate-pulse">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Loading...</h2>
                    <p className="text-gray-600">Checking authentication status</p>
                </div>
            </div>
        );
    }

    // Don't render the form if not authenticated (will redirect)
    if (!isAuthenticated) {
        return null;
    }

    // Handler untuk submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await submitEvent(form, tickets, user, setLoading, setMessage, resetForm);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 relative overflow-hidden">
            <BackgroundElements />

            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Hero Section with Image Upload */}
                    <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
                        <EventImageUpload
                            image={form.image}
                            onImageChange={handleChange}
                        />

                        {/* Event Basic Info */}
                        <CardContent className="p-8 bg-gradient-to-br from-white/60 to-gray-50/60 backdrop-blur-sm">
                            <EventBasicInfo
                                form={form}
                                onChange={handleChange}
                            />
                        </CardContent>
                    </Card>

                    {/* Tickets Section */}
                    <TicketSection
                        tickets={tickets}
                        onTicketChange={handleTicketChange}
                        onAddTicket={addTicket}
                        onRemoveTicket={removeTicket}
                    />

                    {/* Description Section */}
                    <EventDescription
                        description={form.description}
                        syaratKetentuan={form.syaratKetentuan}
                        onChange={handleChange}
                    />

                    {/* Action Buttons and Message */}
                    <EventFormActions
                        loading={loading}
                        message={message}
                        onSubmit={handleSubmit}
                    />
                </form>
            </div>
        </div>
    );
};

export default CreateEventPage;