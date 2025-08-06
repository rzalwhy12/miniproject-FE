"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiCall } from '@/helper/apiCall';
import { useAppSelector } from '@/lib/redux/hook';

const TransactionPage = ({ params }: { params: { transactionCode: string } }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    // Example: get ticketTypeId, qty from query
    const ticketTypeId = searchParams.get("ticketTypeId");
    const qty = searchParams.get("qty");


    // Get user info from Redux (or fallback to localStorage)
    const userRedux = useAppSelector((state) => state.account);
    const [userInfo, setUserInfo] = useState({
        name: userRedux.name || '',
        phone: '',
        address: '',
        email: '',
    });
    const [ticketInfo, setTicketInfo] = useState<any>(null);
    const [ticketType, setTicketType] = useState("e-ticket");
    const [insurance, setInsurance] = useState(false);
    const [voucher, setVoucher] = useState("");
    const [voucherValue, setVoucherValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);
            try {
                // Fetch user profile (replace endpoint as needed)
                const userId = userRedux.id || localStorage.getItem('userId');
                let userProfile = { name: userRedux.name, phone: '', address: '', email: '' };
                if (userId) {
                    const res = await apiCall.get(`/user/${userId}`);
                    const u = res.data?.result || res.data?.data || {};
                    userProfile = {
                        name: u.name || '',
                        phone: u.phone || '',
                        address: u.address || '',
                        email: u.email || '',
                    };
                }
                setUserInfo(userProfile);

                // Fetch ticket/event info (replace endpoint as needed)
                if (ticketTypeId) {
                    const res = await apiCall.get(`/ticket-type/${ticketTypeId}`);
                    const t = res.data?.result || res.data?.data || {};
                    setTicketInfo({
                        event: t.event?.name || t.eventName || '-',
                        date: t.event?.startDate ? new Date(t.event.startDate).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }) : '-',
                        time: t.event?.startDate ? new Date(t.event.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-',
                        location: t.event?.location || '-',
                        price: Number(t.price) || 0,
                        qty: Number(qty) || 1,
                        bookingFee: 20.25, // TODO: fetch from backend if available
                        orderNumber: params.transactionCode,
                    });
                }
            } catch (err: any) {
                setError(err.message || 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [ticketTypeId, qty, userRedux.id]);

    const totalPrice = ticketInfo ? (ticketInfo.price * ticketInfo.qty + ticketInfo.bookingFee - voucherValue) : 0;

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }
    if (error || !ticketInfo) {
        return <div className="flex justify-center items-center min-h-screen text-red-500">{error || 'Data not found'}</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8 px-4 flex flex-col items-center">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-8">
                {/* Progress Bar */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="bg-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">{ticketInfo.date?.split(' ')[0] || '-'}<br /><span className="text-xs">{ticketInfo.date?.split(' ')[1] || ''}</span></div>
                        <div>
                            <div className="font-bold text-lg">{ticketInfo.event}</div>
                            <div className="text-sm text-gray-500">Seat quantity: {ticketInfo.qty}</div>
                            <div className="text-sm text-gray-500">Price: $ {ticketInfo.price}</div>
                            <div className="text-sm text-gray-500">{ticketInfo.time}</div>
                            <div className="text-sm text-gray-500">{ticketInfo.location}</div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-gray-500 text-sm">Time left to complete order</span>
                        <span className="text-pink-500 text-2xl font-bold">09:55</span>
                        <button className="mt-2 px-4 py-1 border rounded-lg text-gray-700">Change Date</button>
                    </div>
                </div>
                {/* Steps */}
                <div className="flex justify-between items-center mb-8">
                    {['Location & Date', 'Seat', 'Order Overview', 'Payment', 'Download'].map((step, idx) => (
                        <div key={step} className="flex flex-col items-center flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${idx < 2 ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-400'}`}>{idx + 1}</div>
                            <span className={`text-xs ${idx < 2 ? 'text-pink-500 font-bold' : 'text-gray-400'}`}>{step}</span>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left: User & Ticket Info */}
                    <div className="flex-1 bg-gray-50 rounded-2xl p-6 border">
                        <div className="mb-8">
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">1. Your Information <span className="text-gray-400 cursor-pointer">✏️</span></h3>
                            <div className="flex flex-col gap-2 text-gray-700">
                                <div><span className="font-semibold">{userInfo.name}</span></div>
                                <div>📞 {userInfo.phone}</div>
                                <div>📍 {userInfo.address}</div>
                                <div>✉️ {userInfo.email}</div>
                            </div>
                        </div>
                        <div className="mb-8">
                            <h3 className="font-bold text-lg mb-2">2. How do you want your tickets?</h3>
                            <div className="flex gap-4 mb-2">
                                <button onClick={() => setTicketType('e-ticket')} className={`px-4 py-2 rounded-lg border ${ticketType === 'e-ticket' ? 'bg-pink-500 text-white' : 'bg-white text-gray-700'}`}>E-ticket</button>
                                <button onClick={() => setTicketType('paper-ticket')} className={`px-4 py-2 rounded-lg border ${ticketType === 'paper-ticket' ? 'bg-pink-500 text-white' : 'bg-white text-gray-700'}`}>Paper ticket</button>
                            </div>
                            <div className="text-xs text-gray-500 mb-1">E-ticket: You can save it as a PDF on your mobile plus tickets will be saved in ConcertHub app.</div>
                            <div className="text-xs text-gray-500">Paper ticket: Will be sent to your chosen address. $3.99, 3-5 workdays</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="insurance" checked={insurance} onChange={e => setInsurance(e.target.checked)} />
                            <label htmlFor="insurance" className="text-sm text-gray-700">Missed events ensurance <span className="text-gray-400 cursor-pointer">ℹ️</span></label>
                        </div>
                    </div>
                    {/* Right: Payment Details */}
                    <div className="w-full md:w-80 bg-white rounded-2xl p-6 border shadow-sm flex flex-col gap-4">
                        <div className="text-gray-700 mb-2">
                            <div className="text-sm">Order number</div>
                            <div className="font-bold">{ticketInfo.orderNumber}</div>
                        </div>
                        <div className="text-gray-700 mb-2">
                            <div className="text-sm">Ticket price: {ticketInfo.event}, {ticketInfo.date}</div>
                            <div className="font-bold">$ {ticketInfo.price} × {ticketInfo.qty}</div>
                        </div>
                        <div className="text-gray-700 mb-2">
                            <div className="text-sm">Booking fee</div>
                            <div className="font-bold">{ticketInfo.bookingFee}</div>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="voucher" className="text-sm text-gray-700">Masukan kode kupon/voucher</label>
                            <div className="flex gap-2 mt-1">
                                <input id="voucher" type="text" value={voucher} onChange={e => setVoucher(e.target.value)} className="flex-1 px-2 py-1 border rounded-lg" placeholder="Kode kupon/voucher" />
                                <button onClick={() => setVoucherValue(100)} className="px-3 py-1 bg-pink-500 text-white rounded-lg">Terapkan</button>
                            </div>
                            {voucherValue > 0 && <div className="text-green-600 text-xs mt-1">Voucher applied: -${voucherValue}</div>}
                        </div>
                        <div className="bg-gray-900 text-white rounded-xl p-4 flex flex-col gap-2">
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Final price</span>
                                <span className="text-pink-400">$ {totalPrice.toFixed(2)}</span>
                            </div>
                            <button className="mt-2 w-full py-3 bg-pink-500 rounded-lg font-bold text-lg hover:bg-pink-600 transition">Submit & Pay</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionPage;
