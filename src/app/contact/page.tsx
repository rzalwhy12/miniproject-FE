"use client"
import React, { useState } from "react";
import { Mail, MessageCircle, Phone, ChevronDown } from "lucide-react";

interface FAQItem {
    id: number;
    question: string;
    answer: string;
    isOpen: boolean;
}

const ContactPage: React.FC = () => {
    const [faqs, setFaqs] = useState<FAQItem[]>([
        {
            id: 1,
            question: "When will I get my tickets?",
            answer: "We offer product and body measurements on each of our products pages, just click on 'Size Guide' to find your best fit. Measuring guides are included.",
            isOpen: false
        },
        {
            id: 2,
            question: "Where is my ticket?",
            answer: "Your tickets will be sent to your email address or available in your account dashboard. Please check your spam folder if you don't see them in your inbox.",
            isOpen: false
        },
        {
            id: 3,
            question: "How and when will I receive my money back?",
            answer: "Refunds are processed within 5-7 business days after cancellation approval. The money will be returned to your original payment method.",
            isOpen: false
        },
        {
            id: 4,
            question: "How can I cancel my order?",
            answer: "You can cancel your order within 24 hours of purchase by going to your account dashboard and selecting the order you want to cancel. After 24 hours, cancellation policies may vary based on the event organizer.",
            isOpen: false
        },
        {
            id: 5,
            question: "When will I get my tickets?",
            answer: "Tickets are typically delivered 24-48 hours before the event. For some events, tickets may be available immediately after purchase.",
            isOpen: false
        }
    ]);

    const [showAllFAQs, setShowAllFAQs] = useState(false);

    const toggleFAQ = (id: number) => {
        setFaqs(faqs.map(faq =>
            faq.id === id ? { ...faq, isOpen: !faq.isOpen } : { ...faq, isOpen: false }
        ));
    };

    const displayedFAQs = showAllFAQs ? faqs : faqs.slice(0, 5);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Customer Service Section */}
                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                    <h1 className="text-2xl font-semibold text-indigo-600 mb-6">Customer Service</h1>

                    <div className="mb-8">
                        <h2 className="text-xl font-medium text-gray-900 mb-4">How can we help you?</h2>
                        <p className="text-gray-600 mb-6">
                            Have a question? We may already have the answer for you! Check out our Frequently Asked Questions (FAQ) section below.
                        </p>
                    </div>

                    {/* FAQ Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-indigo-600 mb-6">Frequently asked questions</h3>

                        <div className="space-y-4">
                            {displayedFAQs.map((faq) => (
                                <div key={faq.id} className="border border-gray-200 rounded-lg">
                                    <button
                                        onClick={() => toggleFAQ(faq.id)}
                                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors duration-200"
                                    >
                                        <span className="font-medium text-gray-900">Q: {faq.question}</span>
                                        <ChevronDown
                                            className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${faq.isOpen ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </button>

                                    {faq.isOpen && (
                                        <div className="px-6 pb-4">
                                            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* See More Button */}
                        <div className="text-center mt-6">
                            <button
                                onClick={() => setShowAllFAQs(!showAllFAQs)}
                                className="text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
                            >
                                {showAllFAQs ? 'See Less' : 'See More'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Self-Help Center Section */}
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <div className="mb-8">
                        <h2 className="text-xl font-medium text-gray-900 mb-2">Can't find what you are looking for?</h2>
                        <p className="text-indigo-600 font-medium">Our self-help center is the fastest place to get help.</p>
                    </div>

                    {/* Contact Options */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Send Email */}
                        <div className="bg-gray-100 rounded-lg p-6 text-center hover:bg-gray-200 transition-colors duration-200 cursor-pointer">
                            <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center">
                                <Mail className="w-8 h-8 text-pink-500" />
                            </div>
                            <h3 className="font-medium text-gray-900">Send Us an Email</h3>
                        </div>

                        {/* Live Chat */}
                        <div className="bg-gray-100 rounded-lg p-6 text-center hover:bg-gray-200 transition-colors duration-200 cursor-pointer">
                            <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center">
                                <MessageCircle className="w-8 h-8 text-pink-500" />
                            </div>
                            <h3 className="font-medium text-gray-900">Live Chat</h3>
                        </div>

                        {/* Call Us */}
                        <div className="bg-gray-100 rounded-lg p-6 text-center hover:bg-gray-200 transition-colors duration-200 cursor-pointer">
                            <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center">
                                <Phone className="w-8 h-8 text-pink-500" />
                            </div>
                            <h3 className="font-medium text-gray-900">Call Us</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
