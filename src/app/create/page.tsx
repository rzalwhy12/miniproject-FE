"use client";
import React, { useState } from "react";

const CreateEventPage = () => {
    const [form, setForm] = useState({
        name: "",
        city: "",
        venue: "",
        date: "",
        price: "",
        image: null as File | null,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, files } = e.target as any;
        if (name === "image") {
            setForm((prev) => ({ ...prev, image: files[0] }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("city", form.city);
            formData.append("venue", form.venue);
            formData.append("date", form.date);
            formData.append("price", form.price);
            if (form.image) formData.append("image", form.image);

            const res = await fetch("/api/events", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                setMessage("Event created successfully!");
                setForm({
                    name: "",
                    city: "",
                    venue: "",
                    date: "",
                    price: "",
                    image: null,
                });
            } else {
                setMessage("Failed to create event.");
            }
        } catch (err) {
            setMessage("Error occurred.");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Create Event</h1>
            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                <input
                    type="text"
                    name="name"
                    placeholder="Event Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <input
                    type="text"
                    name="venue"
                    placeholder="Venue"
                    value={form.venue}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <input
                    type="datetime-local"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <input
                    type="text"
                    name="price"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full"
                />
                <button
                    type="submit"
                    className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600"
                    disabled={loading}
                >
                    {loading ? "Uploading..." : "Create Event"}
                </button>
                {message && <p className="text-center mt-2">{message}</p>}
            </form>
        </div>
    );
};

export default CreateEventPage;