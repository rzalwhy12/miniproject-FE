import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './Navbar';

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
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'file') {
            const files = (e.target as HTMLInputElement).files;
            if (files && files[0]) setProfileImage(files[0]);
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => formData.append(key, value));
        if (profileImage) formData.append('profileImage', profileImage);

        try {
            const res = await fetch('/api/signup', {
                method: 'POST',
                body: formData,
            });
            if (!res.ok) throw new Error('Sign up failed');
            // Redirect ke login setelah sukses
            router.push('/akun'); // pastikan ini ke halaman login
        } catch (err: any) {
            setError(err.message || 'Sign up failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        
        <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
            <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">Create Your Account</h2>
            {error && <div className="text-red-500 text-center">{error}</div>}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                <input
                    name="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none transition bg-white"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
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
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-semibold shadow-lg hover:scale-105 transition-all flex items-center justify-center ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
                {loading ? (
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                ) : null}
                {loading ? 'Processing...' : 'Sign Up'}
            </button>
            <div className="text-center text-sm text-gray-500 mt-4">
                Already have an account? <span className="text-pink-600 font-semibold">Login</span>
            </div>
        </form>
    );
};

export default SignUp;