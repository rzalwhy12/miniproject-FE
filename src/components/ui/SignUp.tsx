import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const initialState = {
    name: '',
    username: '',
    email: '',
    gender: '',
    birthDate: '',
    password: ''
};

const SignUp: React.FC = () => {
    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const res = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error('Sign up failed');
            router.push('/signin');
        } catch (err: any) {
            setError(err.message || 'Sign up failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="text-red-500 text-center text-sm">{error}</div>}
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                    name="username"
                    placeholder="Choose a username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                <input
                    name="birthDate"
                    type="date"
                    value={form.birthDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                />
            </div>
            
            <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition-all flex items-center justify-center ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
                {loading ? (
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                ) : null}
                {loading ? 'Creating Account...' : 'Create Account'}
            </button>
        </form>
    );
};

export default SignUp;