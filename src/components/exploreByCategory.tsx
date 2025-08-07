"use client"
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Category, Artist } from '@/types/types';
import { categoryService, artistService } from '@/helper/exploreService';

const ExploreByCategory: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [currentArtistIndex, setCurrentArtistIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const mockCategories: Category[] = [
        { id: '1', name: 'Folk', image: '/images/dami1.png', eventCount: 25 },
        { id: '2', name: 'Classic', image: '/images/dami1.png', eventCount: 18 },
        { id: '3', name: 'Pop', image: '/images/dami1.png', eventCount: 42 },
        { id: '4', name: 'Jazz', image: '/images/dami1.png', eventCount: 15 },
        { id: '5', name: 'Rock', image: '/images/dami1.png', eventCount: 33 }
    ];

    const mockArtists: Artist[] = [
        { id: '1', name: 'Taylor Swift', profileImage: '/images/konser/taylor.png', genre: 'Pop', followers: 50000 },
        { id: '2', name: 'Ed Sheeran', profileImage: '/images/konser/justin.png', genre: 'Folk', followers: 35000 },
        { id: '3', name: 'Dua Lipa', profileImage: '/images/konser/sila.png', genre: 'Pop', followers: 28000 },
        { id: '4', name: 'John Mayer', profileImage: '/images/konser/justin.png', genre: 'Rock', followers: 22000 },
        { id: '5', name: 'Billie Eilish', profileImage: '/images/konser/dion.png', genre: 'Pop', followers: 45000 },
        { id: '6', name: 'The Weeknd', profileImage: '/images/konser/taylor.png', genre: 'R&B', followers: 38000 }
    ];

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const fetchedCategories = await categoryService.getCategories();
                const fetchedArtists = await artistService.getArtists();
                
                setCategories(fetchedCategories.length > 0 ? fetchedCategories : mockCategories);
                setArtists(fetchedArtists.length > 0 ? fetchedArtists : mockArtists);
            } catch (error) {
                console.error('Error loading data:', error);
                setCategories(mockCategories);
                setArtists(mockArtists);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleCategoryClick = (categoryId: string) => {
        window.location.href = `/events?category=${categoryId}`;
    };

    const handleArtistClick = (artistId: string) => {
        window.location.href = `/events?artist=${artistId}`;
    };
    
    // Logic untuk menggeser artist dengan responsif
    const artistsToShow = 5;
    const nextArtists = () => {
        setCurrentArtistIndex(prev => Math.min(prev + 1, artists.length - artistsToShow));
    };

    const prevArtists = () => {
        setCurrentArtistIndex(prev => Math.max(prev - 1, 0));
    };

    const visibleArtists = artists.slice(currentArtistIndex, currentArtistIndex + artistsToShow);

    if (loading) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="mb-12">
                        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="mb-8">
                        <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
                        <div className="flex gap-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex-shrink-0">
                                    <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-gray-200 rounded-full mb-3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            {/* Explore by Category Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore by category</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            onClick={() => handleCategoryClick(category.id)}
                            className="relative group cursor-pointer overflow-hidden rounded-lg aspect-square"
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src={category.image || '/images/default-category.png'}
                                    alt={category.name}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 opacity-80"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h3 className="text-white font-semibold text-lg md:text-xl lg:text-2xl text-center drop-shadow-lg">
                                        {category.name}
                                    </h3>
                                </div>
                                <div className="absolute inset-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                            </div>
                            {category.eventCount && (
                                <div className="absolute top-2 right-2 bg-white bg-opacity-90 text-gray-800 text-xs px-2 py-1 rounded-full">
                                    {category.eventCount} events
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Artists Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Artists</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={prevArtists}
                            disabled={currentArtistIndex === 0}
                            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                            onClick={nextArtists}
                            disabled={currentArtistIndex >= artists.length - artistsToShow}
                            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                <div className="relative overflow-hidden">
                    <div
                        className="flex transition-transform duration-300 ease-in-out gap-4"
                        style={{ transform: `translateX(-${currentArtistIndex * 100 / artistsToShow}%)` }}
                    >
                        {artists.map((artist) => (
                            <div
                                key={artist.id}
                                onClick={() => handleArtistClick(artist.id)}
                                className="group cursor-pointer flex-shrink-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
                            >
                                <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 mx-auto mb-3">
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-400 to-purple-500 p-1">
                                        <div className="w-full h-full rounded-full bg-gray-300 overflow-hidden relative">
                                            <Image
                                                src={artist.profileImage || '/images/default-artist.png'}
                                                alt={artist.name}
                                                fill
                                                className="object-cover rounded-full"
                                            />
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 rounded-full group-hover:bg-opacity-10 transition-all duration-300"></div>
                                </div>
                                <div className="text-center">
                                    <h3 className="font-medium text-gray-900 text-sm group-hover:text-purple-600 transition-colors truncate">
                                        {artist.name}
                                    </h3>
                                    {artist.genre && (
                                        <p className="text-xs text-gray-500 mt-1 truncate">{artist.genre}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExploreByCategory;