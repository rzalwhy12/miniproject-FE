"use client"
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Category } from '@/types/types';
import { apiCall } from '@/helper/apiCall';

const ExploreByCategory: React.FC<{ onLoaded?: () => void }> = ({ onLoaded }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    console.log('ExploreByCategory mounted');

    useEffect(() => {
        console.log('ExploreByCategory useEffect dijalankan');
        apiCall.get('/event')
            .then(res => {
                console.log('ExploreByCategory API response:', res);
                const events = res.data?.result?.data || [];
                const uniqueCategories = Array.from(
                    new Set(
                        events.map((e: any) =>
                            typeof e.category === 'string'
                                ? e.category
                                : (e.category?.name || '')
                        )
                    )
                ).filter((c) => c);
                setCategories(
                    uniqueCategories.map((name, idx) => ({
                        id: String(idx),
                        name: String(name),
                        image: '',
                        eventCount: events.filter((e: any) => (typeof e.category === 'string' ? e.category : (e.category?.name || '')) === name).length,
                    }))
                );
                setLoading(false);
                onLoaded?.();
                console.log('ExploreByCategory loading selesai');
            })
            .catch((error) => {
                console.log('ExploreByCategory API error:', error);
                setLoading(false);
                onLoaded?.();
                console.log('ExploreByCategory loading error');
            });
    }, []); // Remove onLoaded dependency

    const handleCategoryClick = (categoryName: string) => {
        router.push(`/tickets?category=${encodeURIComponent(categoryName)}`);
    };

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
                    
                    
                </div>
            </div>
        );
    }

    // Navigasi kategori
    const categoriesToShow = 5;
    const nextCategories = () => {
        setCurrentCategoryIndex(prev => Math.min(prev + 1, categories.length - categoriesToShow));
    };
    const prevCategories = () => {
        setCurrentCategoryIndex(prev => Math.max(prev - 1, 0));
    };
    const visibleCategories = categories.slice(currentCategoryIndex, currentCategoryIndex + categoriesToShow);

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            {/* Explore by Category Section */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Explore by category</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={prevCategories}
                            disabled={currentCategoryIndex === 0}
                            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                            onClick={nextCategories}
                            disabled={currentCategoryIndex >= categories.length - categoriesToShow}
                            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {visibleCategories.map((category) => (
                        <div
                            key={category.id}
                            onClick={() => handleCategoryClick(category.name)}
                            className="relative group cursor-pointer overflow-hidden rounded-lg aspect-square"
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src={category.image || '/images/sign-up/bg.jpg'}
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

        </div>
    );
};

export default ExploreByCategory;