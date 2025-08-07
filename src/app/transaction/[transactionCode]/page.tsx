'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiCall } from '@/helper/apiCall';
import { toast } from 'sonner';
import { showError } from '@/helper/interceptor';

interface TransactionDetail {
    id: number;
    transactionCode: string;
    eventName: string;
    totalPrice: number;
    status: string;
    orderItems: {
        ticketName: string;
        quantity: number;
        subTotal: number;
    }[];
    createdAt: string;
    paymentProof?: string;
    buyer?: {
        id: number;
        name: string;
        email: string;
    };
}

const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(amount);
};

const TransactionPage = () => {
    const params = useParams();
    const router = useRouter();
    const transactionCode = params.transactionCode as string;
    
    const [transaction, setTransaction] = useState<TransactionDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        const fetchTransactionDetail = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await apiCall.get(`/transaction/${transactionCode}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTransaction(response.data.result.data);
                // Set timer if transaction is pending payment
                const tx = response.data.result.data;
                if (tx && tx.status === 'PENDING_PAYMENT') {
                    // Assume createdAt is ISO string
                    const created = new Date(tx.createdAt).getTime();
                    const now = Date.now();
                    const deadline = created + 2 * 60 * 60 * 1000; // 2 hours in ms
                    const left = Math.max(0, Math.floor((deadline - now) / 1000));
                    setTimeLeft(left);
                }
            } catch (error) {
                showError(error);
                toast.error('Failed to load transaction details');
            } finally {
                setLoading(false);
            }
        };

        if (transactionCode) {
            fetchTransactionDetail();
        }
    }, [transactionCode]);

    // Timer effect
    useEffect(() => {
        if (!transaction || transaction.status !== 'PENDING_PAYMENT') return;
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [transaction, timeLeft]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Please upload only JPG, JPEG, or PNG files');
                return;
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                toast.error('File size must be less than 5MB');
                return;
            }

            setPaymentProof(file);
            
            // Create preview URL
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleUploadPaymentProof = async () => {
        if (!paymentProof || !transaction) {
            toast.error('Please select a payment proof image');
            return;
        }

        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('paymentProof', paymentProof);

            const response = await apiCall.patch(
                `/transaction/upload-payment/${transaction.id}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            toast.success('Payment proof uploaded successfully!');
            
            // Update transaction status
            setTransaction(prev => prev ? {
                ...prev,
                status: 'PENDING_CONFIRMATION',
                paymentProof: response.data.result.data.paymentProof
            } : null);
            
            // Clear the file input
            setPaymentProof(null);
            setPreviewUrl('');
            
        } catch (error) {
            showError(error);
            toast.error('Failed to upload payment proof');
        } finally {
            setUploading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING_PAYMENT':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'PENDING_CONFIRMATION':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'CONFIRMED':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PENDING_PAYMENT':
                return 'Menunggu Pembayaran';
            case 'PENDING_CONFIRMATION':
                return 'Menunggu Konfirmasi';
            case 'CONFIRMED':
                return 'Pembayaran Terkonfirmasi';
            case 'CANCELLED':
                return 'Dibatalkan';
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600 mb-4"></div>
                    <p className="text-gray-800 text-xl font-semibold">Loading transaction details...</p>
                </div>
            </div>
        );
    }

    if (!transaction) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.664 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Transaction Not Found</h2>
                    <p className="text-gray-600 mb-4">The transaction you're looking for doesn't exist or you don't have access to it.</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-blue-100"></div>
            </div>
            <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-10"></div>
            <div className="absolute top-40 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-10"></div>
            
            <div className="container mx-auto max-w-4xl relative z-10 px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        Transaction Details
                    </h1>
                    <p className="text-gray-600 text-lg">Complete your payment to secure your tickets</p>
                </div>

                {/* Transaction Info */}
                <div className="bg-white shadow-xl border border-gray-200 p-8 rounded-3xl mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-6 border-b border-gray-200">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{transaction.eventName}</h2>
                            <p className="text-gray-600">Transaction Code: <span className="font-mono font-bold text-purple-600">{transaction.transactionCode}</span></p>
                            <p className="text-gray-600">Date: {new Date(transaction.createdAt).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(transaction.status)}`}>
                                {getStatusText(transaction.status)}
                            </span>
                        </div>
                    </div>

                    {/* Buyer Information */}
                    {transaction.buyer && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-lg font-bold text-gray-800 mb-3">Buyer Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Name</p>
                                    <p className="font-semibold text-gray-800">{transaction.buyer.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-semibold text-gray-800">{transaction.buyer.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Order Items */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Order Items</h3>
                        <div className="space-y-3">
                            {transaction.orderItems.map((item, index) => (
                                <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-gray-800">{item.ticketName}</p>
                                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-lg text-purple-600">{formatPrice(item.subTotal)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total Payment */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 p-6 rounded-xl">
                        <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-gray-800">Total Payment</span>
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                {formatPrice(transaction.totalPrice)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Payment Instructions & Upload Section */}
                {transaction.status === 'PENDING_PAYMENT' && (
                    <div className="bg-white shadow-xl border border-gray-200 p-8 rounded-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">Complete Your Payment</h3>
                        </div>

                        {/* Countdown Timer */}
                        <div className="mb-6 text-center">
                            <span className="inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-semibold">
                                {timeLeft > 0
                                    ? `Time left to upload payment proof: ${Math.floor(timeLeft / 3600)}:${String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0')}:${String(timeLeft % 60).padStart(2, '0')}`
                                    : 'Upload time expired!'}
                            </span>
                        </div>

                        {/* Bank Transfer Instructions */}
                        <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl">
                            <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Bank Transfer Instructions
                            </h4>
                            <div className="space-y-3 text-blue-700">
                                <p>Please transfer the total amount to one of the following bank accounts:</p>
                                <div className="bg-white p-4 rounded-lg border border-blue-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="font-semibold">Bank BCA</p>
                                            <p className="font-mono text-lg">1234567890</p>
                                            <p className="text-sm">a.n. Loka Adicara Platform</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Bank Mandiri</p>
                                            <p className="font-mono text-lg">0987654321</p>
                                            <p className="text-sm">a.n. Loka Adicara Platform</p>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm"><strong>Important:</strong> Please include your transaction code <span className="font-mono bg-white px-2 py-1 rounded">{transaction.transactionCode}</span> in the transfer description.</p>
                            </div>
                        </div>

                        {/* Payment Proof Upload */}
                        <div className="space-y-6">
                            <h4 className="font-bold text-gray-800 text-xl">Upload Payment Proof</h4>
                            
                            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-purple-400 transition-colors">
                                <input
                                    type="file"
                                    id="payment-proof"
                                    accept="image/jpeg,image/jpg,image/png"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <label htmlFor="payment-proof" className="cursor-pointer">
                                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-700 mb-2">Click to upload payment proof</p>
                                    <p className="text-gray-500 text-sm">JPG, JPEG, or PNG (Max 5MB)</p>
                                </label>
                            </div>

                            {/* Preview */}
                            {previewUrl && (
                                <div className="mt-6">
                                    <h5 className="font-semibold text-gray-800 mb-3">Preview:</h5>
                                    <div className="relative inline-block">
                                        <img 
                                            src={previewUrl} 
                                            alt="Payment proof preview"
                                            className="max-w-md max-h-64 object-contain rounded-lg border border-gray-200 shadow-md"
                                        />
                                        <button
                                            onClick={() => {
                                                setPaymentProof(null);
                                                setPreviewUrl('');
                                            }}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Upload Button */}
                            <button
                                onClick={handleUploadPaymentProof}
                                disabled={!paymentProof || uploading || timeLeft <= 0}
                                className={`w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 ${(!paymentProof || uploading || timeLeft <= 0) ? 'disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none' : ''}`}
                            >
                                {uploading ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Uploading...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-3">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        Upload Payment Proof
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Confirmation Message */}
                {transaction.status === 'PENDING_CONFIRMATION' && (
                    <div className="bg-white shadow-xl border border-gray-200 p-8 rounded-3xl">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Proof Submitted</h3>
                            <p className="text-gray-600 mb-4">
                                Your payment proof has been submitted and is under review. 
                                We will confirm your payment within 1-2 business days.
                            </p>
                            <p className="text-sm text-blue-600">
                                You will receive a confirmation email once your payment is verified.
                            </p>
                        </div>
                    </div>
                )}

                {/* Confirmed Message */}
                {transaction.status === 'CONFIRMED' && (
                    <div className="bg-white shadow-xl border border-gray-200 p-8 rounded-3xl">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Confirmed!</h3>
                            <p className="text-gray-600 mb-6">
                                Your payment has been confirmed. Your tickets are now ready!
                            </p>
                            <button
                                onClick={() => router.push('/tickets')}
                                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                            >
                                View My Tickets
                            </button>
                        </div>
                    </div>
                )}

                {/* Back to Dashboard */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionPage;
