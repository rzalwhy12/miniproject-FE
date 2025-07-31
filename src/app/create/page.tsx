"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Plus, Edit, Trash2, Sparkles, Zap, Calendar, MapPin, Settings, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const CreateEventPage = () => {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        description: "",
        location: "",
        startDate: "",
        endDate: "",
        statusEvent: "PUBLISHED",
        category: "CONFERENCE",
        syaratKetentuan: "",
        image: null as File | null,
    });

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

    const [tickets, setTickets] = useState([
        { id: 1, name: "Regular", price: "200000", description: "Regular ticket" }
    ]);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Enum options from backend
    const statusOptions = [
        { value: "PUBLISHED", label: "Published" },
        { value: "DRAFT", label: "Draft" },
        { value: "CANCELLED", label: "Cancelled" }
    ];

    const categoryOptions = [
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, files } = e.target as any;
        if (name === "image") {
            const file = files[0];
            if (file) {
                // Check file size (10MB limit)
                const maxSize = 10 * 1024 * 1024;
                if (file.size > maxSize) {
                    setMessage("Ukuran file terlalu besar. Maksimal 10MB.");
                    return;
                }
                // Check file type
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                if (!allowedTypes.includes(file.type)) {
                    setMessage("Format file tidak didukung. Gunakan JPG, PNG, atau WebP.");
                    return;
                }
                console.log('Image selected:', {
                    name: file.name,
                    type: file.type,
                    size: (file.size / 1024 / 1024).toFixed(2) + 'MB'
                });
                setMessage("");
            }
            setForm((prev) => ({ ...prev, image: file }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleTicketChange = (id: number, field: string, value: string) => {
        setTickets(tickets.map(ticket =>
            ticket.id === id ? { ...ticket, [field]: value } : ticket
        ));
    };

    const addTicket = () => {
        const newId = Math.max(...tickets.map(t => t.id)) + 1;
        setTickets([...tickets, { id: newId, name: "", price: "", description: "" }]);
    };

    const removeTicket = (id: number) => {
        setTickets(tickets.filter(ticket => ticket.id !== id));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            // Validasi required fields
            if (!form.name || !form.description || !form.location || !form.startDate || !form.endDate) {
                setMessage("Mohon isi semua field yang wajib diisi!");
                setLoading(false);
                return;
            }

            // Validasi tanggal
            const startDate = new Date(form.startDate);
            const endDate = new Date(form.endDate);

            if (startDate >= endDate) {
                setMessage("Tanggal selesai harus setelah tanggal mulai!");
                setLoading(false);
                return;
            }

            // Format tanggal untuk backend (ISO string)
            const formattedStartDate = startDate.toISOString();
            const formattedEndDate = endDate.toISOString();

            // Buat FormData untuk mengirim file dan data
            const formData = new FormData();

            // Tambahkan data event
            formData.append('name', form.name);
            formData.append('description', form.description);
            formData.append('startDate', formattedStartDate);
            formData.append('endDate', formattedEndDate);
            formData.append('location', form.location);
            formData.append('statusEvent', form.statusEvent);
            formData.append('category', form.category);
            formData.append('organizerId', '1'); // Default organizer ID
            formData.append('syaratKetentuan', form.syaratKetentuan);

            // Tambahkan ticket types sebagai JSON string
            formData.append('ticketTypes', JSON.stringify(tickets));

            // Tambahkan file image jika ada
            if (form.image) {
                formData.append('image', form.image);
                console.log('Image file added:', form.image.name, form.image.size);
            }

            console.log('Sending FormData with image:', form.image ? 'Yes' : 'No');

            const backendUrl = process.env.NEXT_PUBLIC_URL_DATABASE || 'http://localhost:4004';

            // Coba beberapa endpoint yang mungkin
            const endpoints = [
                '/api/events',
                '/events/create',
                '/events'
            ];

            let success = false;
            let lastError = null;

            for (const endpoint of endpoints) {
                try {
                    console.log(`Trying endpoint: ${backendUrl}${endpoint}`);

                    const res = await fetch(`${backendUrl}${endpoint}`, {
                        method: "POST",
                        body: formData, // Kirim FormData, bukan JSON
                        // Jangan set Content-Type header, biarkan browser yang set untuk multipart/form-data
                    });

                    console.log(`Response status: ${res.status}`);

                    const result = await res.json();
                    console.log('Response data:', result);

                    if (res.ok) {
                        // Check different response formats
                        if (result.success || result.result?.success || res.status === 201) {
                            setMessage("Event berhasil dibuat!");
                            setForm({
                                name: "",
                                description: "",
                                location: "",
                                startDate: "",
                                endDate: "",
                                statusEvent: "PUBLISHED",
                                category: "CONFERENCE",
                                syaratKetentuan: "",
                                image: null,
                            });
                            setTickets([{ id: 1, name: "Regular", price: "200000", description: "Regular ticket" }]);
                            success = true;
                            break;
                        }
                    }

                    lastError = result.message || result.result?.message || `HTTP ${res.status}`;

                } catch (endpointError: any) {
                    console.error(`Error with endpoint ${endpoint}:`, endpointError);
                    lastError = endpointError.message || 'Network error';
                    continue;
                }
            }

            if (!success) {
                setMessage(`Gagal membuat event: ${lastError || 'Semua endpoint gagal'}`);
            }
        } catch (err) {
            console.error('Error:', err);
            setMessage("Terjadi kesalahan saat menghubungi server.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)`,
                    backgroundSize: '20px 20px'
                }}></div>
            </div>

            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Hero Section with Image Upload */}
                    <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
                        <div className="h-72 bg-gradient-to-br from-purple-100/50 via-white/60 to-cyan-100/50 relative flex items-center justify-center group">
                            {/* Animated Border */}
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-200/30 via-pink-200/30 to-cyan-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            {form.image ? (
                                <div className="relative w-full h-full group">
                                    <img
                                        src={URL.createObjectURL(form.image)}
                                        alt="Event preview"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <p className="text-sm font-medium">Image Preview</p>
                                        <p className="text-xs opacity-80">{form.image.name}</p>
                                        <p className="text-xs opacity-60">{(form.image.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <p className="text-white text-sm font-medium">Click to change image</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-gray-700 relative z-10">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
                                        <Upload className="w-10 h-10 text-white" />
                                    </div>
                                    <p className="text-xl font-semibold mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                        Upload Event Visual
                                    </p>
                                    <p className="text-sm text-gray-600 mb-1">Drag & drop or click to upload</p>
                                    <p className="text-xs text-gray-500">JPG, PNG, WebP • Max 10MB • 1920×1080 recommended</p>
                                </div>
                            )}
                            <input
                                type="file"
                                name="image"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            />
                            <Button
                                type="button"
                                size="sm"
                                className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 border-0 shadow-lg z-30"
                            >
                                <Zap className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Event Basic Info */}
                        <CardContent className="p-8 bg-gradient-to-br from-white/60 to-gray-50/60 backdrop-blur-sm">
                            <div className="space-y-6">
                                <div className="relative">
                                    <Input
                                        type="text"
                                        name="name"
                                        placeholder="Event Name"
                                        value={form.name}
                                        onChange={handleChange}
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
                                            onChange={handleChange}
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
                                            onChange={handleChange}
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
                                        onChange={handleChange}
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
                                            onChange={handleChange}
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
                                            onChange={handleChange}
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
                        </CardContent>
                    </Card>

                    {/* Tickets Section */}
                    <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
                        <CardContent className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800">Ticket Categories</h3>
                                </div>
                                <Button
                                    type="button"
                                    onClick={addTicket}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Ticket
                                </Button>
                            </div>

                            {tickets.map((ticket, index) => (
                                <div key={ticket.id} className="relative mb-6 last:mb-0">
                                    <div className="bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 hover:border-purple-300 transition-all duration-300 shadow-sm">
                                        {/* Ticket Number Badge */}
                                        <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                                            {index + 1}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-sm text-gray-700 font-medium">Ticket Name</Label>
                                                <Input
                                                    type="text"
                                                    placeholder="e.g., VIP Access"
                                                    value={ticket.name}
                                                    onChange={(e) => handleTicketChange(ticket.id, "name", e.target.value)}
                                                    className="bg-white/90 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm text-gray-700 font-medium">Price (IDR)</Label>
                                                <Input
                                                    type="number"
                                                    placeholder="200000"
                                                    value={ticket.price}
                                                    onChange={(e) => handleTicketChange(ticket.id, "price", e.target.value)}
                                                    className="bg-white/90 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                                                />
                                            </div>
                                            <div className="flex items-end">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => removeTicket(ticket.id)}
                                                    className="w-full bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="mt-4 space-y-2">
                                            <Label className="text-sm text-gray-700 font-medium">Description</Label>
                                            <Input
                                                type="text"
                                                placeholder="Describe what's included with this ticket"
                                                value={ticket.description}
                                                onChange={(e) => handleTicketChange(ticket.id, "description", e.target.value)}
                                                className="bg-white/90 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Description Section */}
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
                                        value={form.description}
                                        onChange={handleChange}
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
                                        value={form.syaratKetentuan}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full p-4 bg-white/90 border border-gray-300 text-gray-800 placeholder:text-gray-500 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-6 pt-8">
                        <div className="flex items-center text-gray-600">
                            <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
                            <p className="text-sm">
                                Ready to launch your extraordinary event?
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="bg-white/80 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-6 py-3"
                            >
                                Save Draft
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg px-8 py-3 relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <span className="relative flex items-center">
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                            Creating Event...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-4 h-4 mr-2" />
                                            Launch Event
                                        </>
                                    )}
                                </span>
                            </Button>
                        </div>
                    </div>

                    {message && (
                        <div className={`p-6 rounded-xl backdrop-blur-sm border shadow-lg ${
                            message.includes("berhasil")
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"
                        }`}>
                            <div className="flex items-center">
                                {message.includes("berhasil") ? (
                                    <Sparkles className="w-5 h-5 mr-3 text-green-600" />
                                ) : (
                                    <Zap className="w-5 h-5 mr-3 text-red-600" />
                                )}
                                <span className="font-medium">{message}</span>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CreateEventPage;