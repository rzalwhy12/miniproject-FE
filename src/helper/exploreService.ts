// API services for categories and artists
import { apiCall } from '@/helper/apiCall';
import { Category, Artist } from '@/types/types';

export const categoryService = {
    // Get all categories
    getCategories: async (): Promise<Category[]> => {
        try {
            const response = await apiCall.get('/api/categories');
            return response.data.result || response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    // Get category by ID
    getCategoryById: async (id: string): Promise<Category> => {
        try {
            const response = await apiCall.get(`/api/categories/${id}`);
            return response.data.result || response.data;
        } catch (error) {
            console.error('Error fetching category:', error);
            throw error;
        }
    },

    // Get events by category
    getEventsByCategory: async (categoryId: string) => {
        try {
            const response = await apiCall.get(`/api/events?category=${categoryId}`);
            return response.data.result || response.data;
        } catch (error) {
            console.error('Error fetching events by category:', error);
            throw error;
        }
    }
};

export const artistService = {
    // Get all artists
    getArtists: async (): Promise<Artist[]> => {
        try {
            const response = await apiCall.get('/api/artists');
            return response.data.result || response.data;
        } catch (error) {
            console.error('Error fetching artists:', error);
            throw error;
        }
    },

    // Get artist by ID
    getArtistById: async (id: string): Promise<Artist> => {
        try {
            const response = await apiCall.get(`/api/artists/${id}`);
            return response.data.result || response.data;
        } catch (error) {
            console.error('Error fetching artist:', error);
            throw error;
        }
    },

    // Get events by artist
    getEventsByArtist: async (artistId: string) => {
        try {
            const response = await apiCall.get(`/api/events?artist=${artistId}`);
            return response.data.result || response.data;
        } catch (error) {
            console.error('Error fetching events by artist:', error);
            throw error;
        }
    },

    // Search artists
    searchArtists: async (query: string): Promise<Artist[]> => {
        try {
            const response = await apiCall.get(`/api/artists/search?q=${encodeURIComponent(query)}`);
            return response.data.result || response.data;
        } catch (error) {
            console.error('Error searching artists:', error);
            throw error;
        }
    }
};
