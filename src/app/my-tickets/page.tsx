"use client";
import React, { useEffect, useState } from 'react';
import { apiCall } from '@/helper/apiCall';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import Loading from '@/components/Loading';

interface ITransactionItem {
    id: number;
    ticketId: number;
    quantity: number;
    ticket: {
        id: number;
        eventId: number;
        name: string;
        price: number;
        available_seat: number;
    };
}

interface ITransaction {
    id: number;
    userId: number;
    eventId: number;
    totalPrice: number;
    transaction_code: string;
    payment_proof: string;
    status: string;
    createdAt: string;
    transactionItems: ITransactionItem[];
    event: {
        id: number;
        name: string;
        startDate: string;
        endDate: string;
        location: string;
        banner: string;
    };
}

const MyTicketsPage = () => {
    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Debug current state
    console.log('Current transactions state:', transactions);

    useEffect(() => {
        const fetchMyTickets = async () => {
            try {
                setLoading(true);
                // call backend route for user transactions
                    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                    if (!token) {
                        // no token -> redirect to sign in
                        router.push('/sign-in');
                        return;
                    }

                    // call backend route for user transactions with explicit header as fallback
                    const response = await apiCall.get('/transaction/user-transactions', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    
                    // Debug full response structure
                    console.log('Full response:', {
                        hasData: !!response.data,
                        hasResult: !!response.data?.result,
                        resultType: typeof response.data?.result,
                        hasResultData: !!response.data?.result?.data,
                        fullResponse: response.data
                    });
                    
                    // Debug log untuk melihat response
                    console.log('API Response:', response.data);
                    
                if (response.data?.result?.data) {
                    const transactionsArray = response.data.result.data;
                    console.log('Raw transactions data:', transactionsArray);
                    
                    // Filter hanya transaksi dengan status DONE
                    const doneTransactions = transactionsArray.filter(
                        (transaction: ITransaction) => transaction.status === 'DONE'
                    );
                    
                    console.log('Filtered DONE transactions:', doneTransactions);
                    setTransactions(doneTransactions);
                } else {
                    setTransactions([]);
                    setError('Failed to fetch tickets.');
                }
            } catch (err: any) {
                // Log detailed error for debugging
                console.error('fetchMyTickets error:', err);
                const status = err?.response?.status || err?.status;
                
                if (status === 404) {
                    // Handle 404 gracefully by setting transactions to an empty array
                    setTransactions([]);
                } else {
                    const respData = err?.response?.data;
                    const backendMessage = respData?.result?.message || respData?.message || respData?.error || null;
                    if (status === 401) {
                        router.push('/sign-in');
                        return;
                    }
                    if (backendMessage) {
                        setError(`Server: ${backendMessage} (status ${status || 'unknown'})`);
                    } else if (err.message) {
                        setError(err.message);
                    } else {
                        setError('An error occurred while fetching your tickets.');
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMyTickets();
    }, [router]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Tickets</h1>
                {transactions.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-lg shadow-md">
                        <p className="text-gray-500 text-lg">Belum ada transaksi.</p>
                        <button
                            onClick={() => router.push('/tickets')}
                            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                        >
                            Cari Event
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {transactions?.map((transaction) => (
                            <div key={transaction.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
                                <div className="relative w-full md:w-64 aspect-square flex-shrink-0">
                                    <Image
                                        src={transaction.event?.banner || '/placeholder-image.jpg'}
                                        alt={transaction.event?.name || 'Event'}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 256px"
                                    />
                                </div>
                                <div className="p-6 flex-grow flex flex-col justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {transaction.event?.name || 'Event Name Not Available'}
                                        </h2>
                                        <p className="text-gray-600 mt-1">
                                            {transaction.event?.startDate ? 
                                                new Date(transaction.event.startDate).toLocaleDateString('en-US', 
                                                    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
                                                ) : 'Date not available'
                                            }
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            {transaction.event?.location || 'Location not available'}
                                        </p>
                                        <div className="mt-4 border-t pt-4">
                                            <h3 className="font-semibold">Tickets:</h3>
                                            <ul className="list-disc list-inside text-gray-700">
                                                {transaction.transactionItems?.map(item => (
                                                    <li key={item.id}>{item.quantity}x {item.ticket?.name || 'Ticket'}</li>
                                                )) || 'No tickets found'}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="text-center">
                                            <QRCode value={transaction.transaction_code || ''} size={100} />
                                            <p className="text-xs text-gray-500 mt-2">Scan at entry</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Transaction Code:</p>
                                            <p className="font-mono text-gray-800">{transaction.transaction_code}</p>
                                            <p className="text-sm text-gray-500 mt-2">Status:</p>
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                transaction.status === 'DONE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {transaction.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTicketsPage;
