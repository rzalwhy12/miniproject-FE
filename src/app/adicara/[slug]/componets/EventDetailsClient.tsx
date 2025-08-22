'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EventDetail, Ticket as TicketType, Review, Suggestion } from '../../../../types/types';
import { MapPin, Star } from 'lucide-react';
import { apiCall } from '@/helper/apiCall';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hook';
import { userLogin } from '@/lib/redux/features/accountSlice';
import { toast } from 'sonner';

interface EventDetailsClientProps {
  eventData: EventDetail;
}

const EventDetailsClient: React.FC<EventDetailsClientProps> = ({ eventData }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  // Retrieve state from Redux, but initialize id from localStorage as a fallback
  const { isLogin, id: reduxId } = useAppSelector((state) => state.account);


  useEffect(() => {
    // Get user ID from localStorage on component mount
    const userIdFromStorage = localStorage.getItem('userId');
    const storedId = userIdFromStorage ? Number(userIdFromStorage) : null;

    if (storedId) {
      // If there's an ID in storage, use it.
      // If Redux doesn't have the user info, dispatch it.
      if (!reduxId || reduxId === 0) {
        const name = localStorage.getItem('name');
        const role = localStorage.getItem('role');
        if (name && role) {
          dispatch(userLogin({ id: storedId, name, role }));
        }
      }
    } else {
      // If no ID in storage, rely on what Redux gives (which might be 0 if not logged in)
    }
  }, [reduxId, dispatch]);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState({ reviews: true, suggestions: true });
  const [error, setError] = useState<{ reviews: string | null, suggestions: string | null }>({ reviews: null, suggestions: null });

  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (!eventData.id) return;
    // Fetch Reviews
    apiCall.get(`/review/event/${eventData.id}`)
      .then(res => {
        const arr = Array.isArray(res.data.result) ? res.data.result : res.data.result?.data || [];
        setReviews(arr);
      })
      .catch(err => {
        console.error("Failed to fetch reviews:", err);
        setError(prev => ({ ...prev, reviews: "Could not load reviews." }));
      })
      .finally(() => {
        setLoading(prev => ({ ...prev, reviews: false }));
      });

    // Fetch Suggestions
    apiCall.get('/event')
      .then(res => {
        const allEvents = res.data?.result?.data || [];
        const filteredSuggestions = allEvents
          .filter((event: Suggestion) => event.id !== eventData.id)
          .slice(0, 4);
        setSuggestions(filteredSuggestions);
      })
      .catch(err => {
        console.error("Failed to fetch suggestions:", err);
        setError(prev => ({ ...prev, suggestions: "Could not load suggestions." }));
      })
      .finally(() => {
        setLoading(prev => ({ ...prev, suggestions: false }));
      });
  }, [eventData.id]);

  const [qtySelector, setQtySelector] = useState<{ open: boolean; ticket: TicketType | null }>({ open: false, ticket: null });
  const [selectedQty, setSelectedQty] = useState(1);

  const handleViewTicketClick = (ticket: TicketType) => {
    console.log('View Ticket button clicked.');
    console.log('Is user logged in?', isLogin);
    if (!isLogin) {
      toast.error('You must be logged in to purchase tickets.');
      router.push('/sign-in');
      return;
    }
    if (Number(ticket.quota) > 0) {
      console.log('Opening ticket quantity modal...');
      setQtySelector({ open: true, ticket });
      setSelectedQty(1);
    } else {
      console.log('Ticket is sold out.');
    }
  };

  const handleQtyConfirm = async () => {
    if (!qtySelector.ticket) {
      toast.error("An error occurred. Please select a ticket.");
      return;
    }

    const { ticket } = qtySelector;
    // Store the selected ticket info in localStorage as orderItems array
    const checkoutData = {
      eventId: eventData.id,
      createdAt: Date.now(), // Add timestamp for checkout expiration
      orderItems: [
        {
          ticketTypeId: ticket.id,
          quantity: selectedQty
        }
      ]
    };
    localStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    router.push(`/checkout/${eventData.slug}`);
  };

  const handleReviewSubmit = async () => {
    if (!isLogin) {
      alert('You must be logged in to leave a review.');
      router.push('/sign-in');
      return;
    }

    if (newReviewRating === 0 || newReviewComment.trim() === '') {
      alert('Please provide a rating and a comment.');
      return;
    }

    setIsSubmittingReview(true);

    try {
      const payload = {
        eventId: Number(eventData.id),
        rating: Number(newReviewRating),
        comment: newReviewComment,
      };
      const token = localStorage.getItem('token');
      const res = await apiCall.post('/review/create', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success(res.data.result.message);

      const reviewsRes = await apiCall.get(`/review/event/${eventData.id}`);
      const arr = Array.isArray(reviewsRes.data.result) ? reviewsRes.data.result : reviewsRes.data.result?.data || [];
      setReviews(arr);

      setNewReviewRating(0);
      setNewReviewComment('');
    } catch (error: any) {
      console.error('Failed to submit review:', error);
      alert(error?.message || 'There was an error submitting your review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (isNaN(num)) return "N/A";
    return `Rp${num.toLocaleString('id-ID')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return { day, month, year };
  };

  const formatSuggestionDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const [mapQuery, setMapQuery] = useState(eventData.location);
  const [searchInput, setSearchInput] = useState(eventData.location);

  return (
    <div className="bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto py-8 px-3 sm:px-4">
        {/* Banner Section */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-8">
          <img src={eventData.banner} alt={eventData.name} className="w-full h-64 sm:h-72 md:h-96 object-cover object-center" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 md:p-10">
            <h1 className="text-white text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight break-words">{eventData.name}</h1>
            <p className="text-pink-400 text-lg sm:text-xl mt-2 font-medium">{eventData.category}</p>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl">
          {/* Ticket Selection Section */}
          <div className="space-y-4 my-8">
            {eventData.ticketTypes.map((ticket) => {
              const { day, month, year } = formatDate(eventData.startDate);
              const isSoldOut = ticket.quota <= 0;
              return (
                <div key={ticket.id} className="flex flex-col sm:flex-row items-center bg-white border border-gray-200 rounded-2xl p-4 shadow-md transition-all hover:shadow-lg hover:border-pink-300">
                  <div className={`text-center p-4 rounded-xl mr-0 sm:mr-6 mb-4 sm:mb-0 shrink-0 ${isSoldOut ? 'bg-gray-200 text-gray-500' : 'bg-blue-600 text-white'}`}>
                    <p className="text-4xl font-bold">{day}</p>
                    <p className="text-lg">{month}</p>
                    <p className="text-sm">{year}</p>
                  </div>
                  <div className="flex-grow grid grid-cols-2 sm:grid-cols-4 gap-4 items-center text-center sm:text-left w-full min-w-0">
                    <div>
                      <p className="font-bold text-lg sm:text-xl text-gray-800 break-words">{ticket.name}</p>
                      <p className={`text-md font-semibold ${isSoldOut ? 'text-red-600' : 'text-green-600'}`}>{isSoldOut ? 'Sold Out' : 'Available'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Price</p>
                      <p className="font-semibold text-base sm:text-lg">{formatPrice(ticket.price)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Time</p>
                      <p className="font-semibold text-base sm:text-lg">{formatTime(eventData.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Location</p>
                      <p className="font-semibold text-base sm:text-lg break-words">{eventData.location}</p>
                    </div>
                  </div>
                  <div className="ml-0 sm:ml-6 mt-4 sm:mt-0 w-full sm:w-auto">
                    <button
                      onClick={() => handleViewTicketClick(ticket)}
                      disabled={isSoldOut}
                      className={`w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg font-semibold text-white transition-transform transform hover:scale-105 ${isSoldOut ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600'}`}
                    >
                      View Ticket
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Qty Selector Modal (outside ticket list loop) */}
          {qtySelector.open && qtySelector.ticket && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Select Quantity</h2>
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-semibold">Qty:</span>
                  <input
                    type="number"
                    min={1}
                    max={qtySelector.ticket.quota}
                    value={selectedQty}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedQty(Math.max(1, Math.min(qtySelector.ticket!.quota, Number(e.target.value))))}
                    className="w-20 px-3 py-2 border rounded-lg text-center"
                  />
                  <span className="text-gray-500">/ {qtySelector.ticket.quota} available</span>
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={() => setQtySelector({ open: false, ticket: null })} className="px-4 py-2 bg-gray-200 rounded-lg font-semibold">Cancel</button>
                  <button onClick={handleQtyConfirm} className="px-4 py-2 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600">Confirm</button>
                </div>
              </div>
            </div>
          )}

          {/* Address & Map Section */}
          <div className="my-12">
            <div className="flex items-center gap-3 text-gray-800 mb-4">
              <MapPin className="w-6 h-6 text-pink-500" />
              <p className="text-base sm:text-lg break-words"><strong>Address:</strong> {eventData.location}</p>
            </div>
            <div className="rounded-2xl overflow-hidden border-2 border-gray-200">
              {/* Google Maps Embed with Search Bar */}
              {/* Mobile: Search bar outside the map */}
              <div className="md:hidden p-3">
                <form
                  className="flex flex-col sm:flex-row items-stretch bg-white rounded-lg shadow-md p-2 gap-2"
                  onSubmit={e => {
                    e.preventDefault();
                    if (searchInput) {
                      setMapQuery(searchInput);
                    }
                  }}
                >
                  <input
                    name="search"
                    type="text"
                    value={searchInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 flex-1 min-w-0"
                    placeholder="Search location..."
                  />
                  <div className="flex gap-2 sm:w-auto">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-semibold w-full sm:w-auto"
                    >
                      Search
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold w-full sm:w-auto"
                      onClick={() => {
                        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`);
                      }}
                    >
                      Open in Google Maps
                    </button>
                  </div>
                </form>
              </div>

              <div className="relative w-full h-64 sm:h-72">
                {/* Desktop/Tablet: overlay search bar */}
                <form
                  className="hidden md:flex absolute top-3 right-3 z-10 bg-white rounded-lg shadow-md p-1 gap-2 items-stretch w-[700px] lg:w-[860px]"
                  onSubmit={e => {
                    e.preventDefault();
                    if (searchInput) {
                      setMapQuery(searchInput);
                    }
                  }}
                >
                  <input
                    name="search"
                    type="text"
                    value={searchInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)}
                    className="px-3 h-11 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 flex-1"
                    placeholder="Search location..."
                  />
                  <button
                    type="submit"
                    className="px-4 h-11 bg-pink-500 text-white rounded-r-lg hover:bg-pink-600 font-semibold"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    className="px-4 h-11 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold ml-2"
                    onClick={() => {
                      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`);
                    }}
                  >
                    Open in Google Maps
                  </button>
                </form>

                <iframe
                  title="Event Location Map"
                  width="100%"
                  height="100%"
                  className="w-full h-64 sm:h-72 rounded-2xl border-0"
                  style={{ filter: 'grayscale(0.2)' }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                ></iframe>
              </div>
            </div>
          </div>

          {/* Top Reviews Section */}
          <div className="my-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Top reviews on this concert</h2>

            {/* Review Submission Form */}
            <div className="bg-gray-100 p-6 rounded-2xl mb-8 border border-gray-200">
              <h3 className="font-bold text-xl mb-4 text-gray-700">Leave a Review</h3>
              <div className="flex items-center mb-4">
                <span className="mr-4 text-lg">Your Rating:</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-8 h-8 cursor-pointer ${i < newReviewRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      onClick={() => setNewReviewRating(i + 1)}
                    />
                  ))}
                </div>
              </div>
              <textarea
                className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                rows={4}
                placeholder="Share your experience..."
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
              ></textarea>
              <button
                onClick={handleReviewSubmit}
                disabled={isSubmittingReview}
                className="mt-4 px-8 py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 disabled:bg-gray-400 transition-all"
              >
                {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>

            <div className="space-y-8">
              {loading.reviews && <p>Loading reviews...</p>}
              {error.reviews && <p className="text-red-500">{error.reviews}</p>}
              {!loading.reviews && !error.reviews && reviews.length === 0 && (
                <p className="text-gray-500">No reviews for this event yet.</p>
              )}
              {reviews.map((review: any) => (
                <div key={review.id} className="flex items-start gap-3 sm:gap-5">
                  <img src={review.user.avatar || '/images/dami1.png'} alt={review.user.name} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover shadow-md" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg">{review.user.name}</p>
                    <div className="flex items-center my-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <p className="text-gray-600 leading-relaxed break-words">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions Section */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Suggestions for you</h2>
            {loading.suggestions && <p>Loading suggestions...</p>}
            {error.suggestions && <p className="text-red-500">{error.suggestions}</p>}
            {!loading.suggestions && !error.suggestions && suggestions.length === 0 && (
              <p className="text-gray-500">No other events to suggest.</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {suggestions.map(suggestion => (
                <Link href={`/adicara/${suggestion.slug}`} key={suggestion.id}>
                  <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-2xl transition-shadow cursor-pointer group h-full flex flex-col">
                    <div className="w-full overflow-hidden">
                      <img src={suggestion.banner} alt={suggestion.name} className="w-full aspect-[16/9] object-cover transform group-hover:scale-105 transition-transform" loading="lazy" />
                    </div>
                    <div className="p-4 sm:p-5 text-center bg-white flex-grow">
                      <p className="font-bold text-base sm:text-lg break-words">{suggestion.name}</p>
                      <p className="text-sm sm:text-md text-gray-600 break-words">{suggestion.location}</p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">{formatSuggestionDate(suggestion.startDate)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetailsClient;
