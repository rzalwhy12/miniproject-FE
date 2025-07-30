"use client";
import React from 'react';
import SignUp from '@/components/ui/SignUp';
import Link from 'next/link';

const SignUpPage: React.FC = () => {
    return (
        <>
            {/* Mobile Layout */}
            <div className="lg:hidden min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
                {/* Background Image/Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-indigo-900/20"></div>
                <div className="absolute inset-0 opacity-30">
                    <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent"
                        style={{
                            backgroundImage: `url("https://img-cdn.medkomtek.com/qm65KY5t_G3kLm4vlVoQGDhv9T0=/730x411/smart/filters:quality(100):format(webp)/article/DbZve4OiHN2PXeaj_atmB/original/l9akrjx5lxk1cu240ozw2d6q4p8dhubj.jpg?w=256&q=100")`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',  
                        }}>
                    </div>
                </div>

                {/* Mobile Content */}
                <div className="relative z-10 flex flex-col min-h-screen px-6 py-8">
                    {/* Back Button */}
                    <div className="mb-8">
                        <Link href="/" className="flex items-center text-white text-lg">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </Link>
                    </div>

                    {/* Welcome Text */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-pink-400 mb-4">
                        Join the
                        community
                        </h1>
                        <div className="w-20 h-1 bg-pink-400 mb-6"></div>
                        <p className="text-gray-300 text-base leading-relaxed">
                            Create your account and start discovering amazing events, concerts, and experiences. Join thousands of users who trust us with their entertainment needs.
                        </p>
                    </div>

                    {/* Sign Up Form Card */}
                    <div className="flex-1 flex items-center justify-center">
                        <div className="w-full max-w-sm">
                            <div className="bg-white rounded-2xl shadow-xl p-6">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Create an account</h2>
                                </div>

                                <div className="animate-fade-in">
                                    <SignUp />
                                </div>

                                <div className="mt-4 text-center">
                                    <p className="text-gray-600 text-sm">
                                        Do you have an account?{' '}
                                        <Link
                                            href="/signin"
                                            className="text-pink-500 hover:text-pink-700 font-semibold transition-colors duration-200"
                                        >
                                            Log in
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex min-h-screen">
                {/* Left Side - Welcome Section */}
                <div className="lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
                    {/* Background Image/Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-indigo-900/20"></div>
                    <div className="absolute inset-0 opacity-30">
                        <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent"
                            style={{
                                backgroundImage: `url("https://img-cdn.medkomtek.com/qm65KY5t_G3kLm4vlVoQGDhv9T0=/730x411/smart/filters:quality(100):format(webp)/article/DbZve4OiHN2PXeaj_atmB/original/l9akrjx5lxk1cu240ozw2d6q4p8dhubj.jpg?w=256&q=100")`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',  
                            }}>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col justify-start px-12 pt-20 pb-16">
                        <div className="max-w-md">
                            <h1 className="text-5xl font-bold text-pink-400 mb-4 leading-tight">
                                Join the<br />community
                            </h1>
                            <div className="w-20 h-1 bg-pink-400 mb-8"></div>
                            <p className="text-gray-300 text-lg leading-relaxed">
                                Create your account and start discovering amazing events, concerts, and experiences. Join thousands of users who trust us with their entertainment needs.
                            </p>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-pink-500/10 to-transparent rounded-full blur-3xl"></div>
                        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-2xl"></div>
                    </div>
                </div>

                {/* Right Side - Sign Up Form */}
                <div className="lg:w-1/2 flex items-center justify-center bg-gray-50 px-8 py-12">
                    <div className="w-full max-w-md">
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                                <p className="text-gray-600">Join us today</p>
                            </div>

                            <div className="animate-fade-in">
                                <SignUp />
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-gray-600">
                                    Already have an account?{' '}
                                    <Link
                                        href="/signin"
                                        className="text-pink-500 hover:text-pink-700 font-semibold transition-colors duration-200"
                                    >
                                        Sign in here
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUpPage;
