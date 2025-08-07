'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiCall } from '@/helper/apiCall';
import { toast } from 'sonner';
import { showError } from '@/helper/interceptor';

interface OrderItem {
  eventName: string;
  ticketName: string;
  ticketTypeId: number;
  quantity: number;
  price: number;
}

interface OrderSummary {
  eventId: number;
  items: OrderItem[];
  subtotal: number;
  voucherDiscount: number;
  pointsDiscount: number;
  total: number;
}

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(amount);
};

const CheckoutPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [voucherCode, setVoucherCode] = useState('');
  const [usePoint, setUsePoint] = useState(false);
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    noTlp: string;
    totalPoint: number;
  } | null>(null);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [selectedVoucherId, setSelectedVoucherId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const token = localStorage.getItem('token');

        const checkoutDataRaw = localStorage.getItem('checkoutData');
        if (!checkoutDataRaw) return toast.error('Tidak ada data checkout');

        const checkoutData = JSON.parse(checkoutDataRaw);

        const ticketDetails = await Promise.all(
          checkoutData.orderItems.map(async (item: any) => {
            const res = await apiCall.get(`/ticket/${item.ticketTypeId}`);
            const ticket = res.data.result.data;

            return {
              eventName: ticket.event.name,
              ticketName: ticket.name,
              ticketTypeId: ticket.id,
              quantity: item.quantity,
              price: ticket.price * item.quantity
            };
          })
        );

        const subtotal = ticketDetails.reduce(
          (acc, curr) => acc + curr.price,
          0
        );

        const resUser = await apiCall.get('/account/get-data', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const user = resUser.data.result.data;
        setUserInfo({
          name: user.name,
          email: user.email,
          noTlp: user.noTlp,
          totalPoint: user.totalPoint
        });

        setOrderSummary({
          eventId: checkoutData.eventId,
          items: ticketDetails,
          subtotal,
          voucherDiscount: 0,
          pointsDiscount: 0,
          total: subtotal
        });
      } catch (err) {
        showError(err);
      }
    };

    fetchCheckoutData();
    // Fetch vouchers specific to this event
    const fetchEventVouchers = async () => {
      try {
        const checkoutDataRaw = localStorage.getItem('checkoutData');
        if (!checkoutDataRaw) return;

        const checkoutData = JSON.parse(checkoutDataRaw);
        const eventId = checkoutData.eventId;

        const res = await apiCall.get(`/voucher/event/${eventId}`);
        setVouchers(res.data.result.data || []);
      } catch (err) {
        // If event-specific voucher endpoint doesn't exist, fall back to general vouchers
        try {
          const res = await apiCall.get('/voucher');
          const allVouchers = res.data.result.data || [];

          // Filter vouchers that are applicable to this event
          const checkoutDataRaw = localStorage.getItem('checkoutData');
          if (checkoutDataRaw) {
            const checkoutData = JSON.parse(checkoutDataRaw);
            const eventId = checkoutData.eventId;

            const eventVouchers = allVouchers.filter(
              (voucher: any) => !voucher.eventId || voucher.eventId === eventId
            );
            setVouchers(eventVouchers);
          }
        } catch (fallbackErr) {
          // ignore error
        }
      }
    };
    fetchEventVouchers();
  }, []);

  const handleApplyVoucher = async () => {
    try {
      if (!voucherCode || !orderSummary) return;

      const token = localStorage.getItem('token');
      const res = await apiCall.post(
        '/voucher/apply',
        {
          eventId: orderSummary.eventId,
          voucherCode
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const discount = res.data.result.discount;
      toast.success(res.data.result.data);

      setOrderSummary((prev) =>
        prev
          ? {
              ...prev,
              voucherDiscount: discount,
              total:
                prev.subtotal - discount - (usePoint ? prev.pointsDiscount : 0)
            }
          : prev
      );
    } catch (err) {
      showError(err);
    }
  };

  // Recalculate discounts when voucher or point changes
  useEffect(() => {
    if (!orderSummary || !userInfo) return;

    let voucherDiscount = 0;
    if (selectedVoucherId && vouchers.length > 0) {
      const selected = vouchers.find((v) => v.id === selectedVoucherId);
      if (selected) {
        // Treat discount as percentage
        voucherDiscount = Math.floor(
          (orderSummary.subtotal * (selected.discount || 0)) / 100
        );
      }
    }
    // Remove the else if clause that was keeping old voucher discount

    const pointDiscount = usePoint
      ? Math.min(
          userInfo.totalPoint,
          Math.max(0, orderSummary.subtotal - voucherDiscount)
        )
      : 0;

    const finalTotal = Math.max(
      0,
      orderSummary.subtotal - voucherDiscount - pointDiscount
    );

    setOrderSummary((prev) =>
      prev
        ? {
            ...prev,
            voucherDiscount,
            pointsDiscount: pointDiscount,
            total: finalTotal
          }
        : prev
    );
  }, [usePoint, selectedVoucherId, vouchers]);

  const handleSubmitOrder = async () => {
    try {
      if (!orderSummary) return;

      const token = localStorage.getItem('token');

      const payload: any = {
        eventId: orderSummary.eventId,
        useCoupon: !!voucherCode,
        usePoint: usePoint,
        pointsUsed: usePoint ? orderSummary.pointsDiscount : 0,
        orderItems: orderSummary.items.map((item) => ({
          ticketTypeId: item.ticketTypeId,
          quantity: item.quantity
        }))
      };
      if (voucherCode) payload.couponCode = voucherCode;
      if (selectedVoucherId) payload.voucherId = selectedVoucherId;

      const res = await apiCall.post('/transaction/create', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success('Checkout berhasil!');
      router.push(`/transaction/${res.data.result.transactionCode}`);
    } catch (err) {
      showError(err);
    }
  };

  if (!orderSummary || !userInfo) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-800 text-xl font-semibold">
            Loading checkout...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-blue-100"></div>
      </div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-10"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-10"></div>
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-10"></div>

      <div className="container mx-auto max-w-6xl relative z-10 px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Secure Checkout
          </h1>
          {orderSummary.items.length > 0 && (
            <div className="mb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {orderSummary.items[0].eventName}
              </h2>
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Event Checkout
              </div>
            </div>
          )}
          <p className="text-gray-600 text-lg mb-6">
            Complete your purchase with our advanced payment system
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 bg-white shadow-xl border border-gray-200 p-8 rounded-3xl hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">
                Order Summary
              </h2>
            </div>

            <div className="space-y-6 mb-10">
              {orderSummary.items.map((item, index) => (
                <div
                  key={item.ticketTypeId}
                  className="group bg-gray-50 border border-gray-200 p-6 rounded-2xl hover:bg-gray-100 hover:border-purple-300 transition-all duration-300 transform hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-xl text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                        {item.eventName}
                      </p>
                      <p className="text-gray-600 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-purple-500 rounded-full"></span>
                        {item.ticketName} (x{item.quantity})
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-4">
              {/* Kupon (input manual) */}
              <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
                <label className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c1.063 0 2.079.421 2.828 1.172l1.656 1.656a4 4 0 010 5.656l-1.656 1.656A4.003 4.003 0 0112 14H7a4 4 0 01-4-4V7a4 4 0 014-4z"
                    />
                  </svg>
                  Coupon Code
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) =>
                      setVoucherCode(e.target.value.toUpperCase())
                    }
                    placeholder="Enter coupon code"
                    className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Voucher (pilihan dari backend) */}
              {vouchers.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
                  <label className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                    Available Vouchers
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vouchers.map((voucher) => (
                      <div
                        key={voucher.id}
                        className={`relative overflow-hidden bg-white p-6 rounded-2xl border cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-sm ${
                          selectedVoucherId === voucher.id
                            ? 'border-purple-400 shadow-lg shadow-purple-400/25 bg-gradient-to-br from-purple-50 to-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                        onClick={() =>
                          setSelectedVoucherId(
                            selectedVoucherId === voucher.id ? null : voucher.id
                          )
                        }
                      >
                        <div className="relative z-10">
                          <div className="font-bold text-xl text-gray-800 mb-3">
                            {voucher.name}
                          </div>
                          <div className="text-gray-600 mb-3 text-sm">
                            {voucher.description}
                          </div>
                          <div className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold text-lg">
                            Discount: {voucher.discount}%
                          </div>
                          {selectedVoucherId === voucher.id && (
                            <div className="mt-3 flex items-center gap-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                              <span className="text-purple-600 font-bold text-sm">
                                Selected
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full blur-xl"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Points */}
              {userInfo.totalPoint > 0 && (
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      type="checkbox"
                      id="use-points"
                      checked={usePoint}
                      onChange={(e) => setUsePoint(e.target.checked)}
                      className="w-5 h-5 rounded accent-purple-600 focus:ring-purple-500 focus:ring-2"
                    />
                    <label
                      htmlFor="use-points"
                      className="flex-grow text-lg font-bold text-gray-800 flex items-center gap-2"
                    >
                      <svg
                        className="w-5 h-5 text-yellow-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                      Use Points for Payment
                    </label>
                  </div>
                  <div className="ml-8 space-y-2">
                    <p className="text-gray-600">
                      Available Points:{' '}
                      <span className="text-yellow-600 font-bold">
                        {userInfo.totalPoint}
                      </span>
                    </p>
                    {usePoint && (
                      <div className="space-y-1">
                        <p className="text-green-600 font-semibold flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Points Used: {orderSummary.pointsDiscount}
                        </p>
                        <p className="text-green-600 font-semibold flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Discount: -{formatPrice(orderSummary.pointsDiscount)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white shadow-xl border border-gray-200 p-8 rounded-3xl hover:shadow-2xl transition-all duration-500 h-fit">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">
                Payment Details
              </h2>
            </div>

            <div className="space-y-4 mb-8">
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                <p className="text-gray-600 mb-1">
                  <span className="font-semibold text-gray-800">Name:</span>
                </p>
                <p className="text-purple-600 font-bold">{userInfo.name}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                <p className="text-gray-600 mb-1">
                  <span className="font-semibold text-gray-800">Email:</span>
                </p>
                <p className="text-purple-600 font-bold">{userInfo.email}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                <p className="text-gray-600 mb-1">
                  <span className="font-semibold text-gray-800">Phone:</span>
                </p>
                <p className="text-purple-600 font-bold">{userInfo.noTlp}</p>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    id="use-coins"
                    checked={usePoint}
                    onChange={(e) => setUsePoint(e.target.checked)}
                    className="w-5 h-5 rounded accent-purple-600 focus:ring-purple-500 focus:ring-2"
                  />
                  <label
                    htmlFor="use-coins"
                    className="text-gray-800 font-semibold flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5 text-yellow-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                    Bayar dengan Coins
                  </label>
                </div>
                <p className="text-gray-600 text-sm">
                  Available:{' '}
                  <span className="text-yellow-600 font-bold">
                    {userInfo.totalPoint} coins
                  </span>
                </p>
                {usePoint && (
                  <div className="mt-2 text-sm">
                    <p className="text-green-600 font-semibold">
                      Coins digunakan: {orderSummary.pointsDiscount}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 text-lg">Subtotal</span>
                <span className="text-gray-800 font-bold text-lg">
                  {formatPrice(orderSummary.subtotal)}
                </span>
              </div>
              {orderSummary.voucherDiscount > 0 && (
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-green-600 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Voucher Discount
                  </span>
                  <span className="text-green-600 font-bold text-lg">
                    -{formatPrice(orderSummary.voucherDiscount)}
                  </span>
                </div>
              )}
              {orderSummary.pointsDiscount > 0 && (
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-yellow-600 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                    Coins Used
                  </span>
                  <span className="text-yellow-600 font-bold text-lg">
                    -{formatPrice(orderSummary.pointsDiscount)}
                  </span>
                </div>
              )}

              {/* Summary after discounts */}
              {(orderSummary.voucherDiscount > 0 ||
                orderSummary.pointsDiscount > 0) && (
                <div className="bg-gray-50 p-3 rounded-lg border-t border-gray-300">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Subtotal setelah diskon:</span>
                    <span className="font-semibold">
                      {formatPrice(
                        orderSummary.subtotal -
                          orderSummary.voucherDiscount -
                          orderSummary.pointsDiscount
                      )}
                    </span>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 p-4 rounded-xl flex flex-col items-center">
                <span className="text-2xl font-bold text-gray-800 mb-2">
                  Total Pembayaran
                </span>
                <span
                  className={`text-2xl font-bold mb-1 ${
                    orderSummary.total === 0
                      ? 'text-green-600'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent'
                  }`}
                >
                  {orderSummary.total === 0
                    ? 'GRATIS'
                    : formatPrice(orderSummary.total)}
                </span>
                {orderSummary.total === 0 && (
                  <p className="text-green-600 text-sm mt-1 text-center">
                    Pembelian gratis dengan voucher dan coins!
                  </p>
                )}
              </div>
              <button
                onClick={handleSubmitOrder}
                className="w-full mt-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-xl rounded-2xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                disabled={orderSummary.total < 0}
              >
                <div className="flex items-center justify-center gap-3">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  {orderSummary.total === 0
                    ? 'Confirm Order'
                    : 'Secure Payment'}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
