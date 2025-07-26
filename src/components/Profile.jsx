import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, loading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        // Check if user just logged in (token in URL)
        const urlParams = new URLSearchParams(window.location.search);
        const hasToken = urlParams.get('token');

        if (hasToken) {
            setShowWelcome(true);
            // Auto-hide welcome message after 3 seconds
            setTimeout(() => setShowWelcome(false), 3000);
        }
    }, []);

    useEffect(() => {
        if (!loading && !isAuthenticated()) {
            console.log('❌ User not authenticated, redirecting to login');
            navigate('/login');
        }
    }, [loading, isAuthenticated, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
                <div className="bg-white rounded-lg p-8 shadow-lg">
                    <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-600">Loading your profile...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect to login
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
            {/* Welcome Message */}
            {showWelcome && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
                    Welcome back, {user.name}! 🎉
                </div>
            )}

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                        <div className="flex items-center space-x-6">
                            <img
                                src={user.avatar || '/default-avatar.png'}
                                alt={user.name}
                                className="w-24 h-24 rounded-full border-4 border-emerald-200"
                            />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                    Welcome, {user.name}! 👋
                                </h1>
                                <p className="text-gray-600 text-lg">{user.email}</p>
                                <div className="flex items-center mt-2">
                                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {user.role || 'User'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-xl p-6 shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Account Status</h3>
                            <p className="text-3xl font-bold text-emerald-600">Active</p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Member Since</h3>
                            <p className="text-3xl font-bold text-emerald-600">
                                {user.createdAt ? new Date(user.createdAt).getFullYear() : 'Recently'}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-md">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Last Login</h3>
                            <p className="text-sm text-gray-600">
                                {user.lastLoginAt
                                    ? new Date(user.lastLoginAt).toLocaleDateString()
                                    : 'Today'
                                }
                            </p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <button className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-lg transition-colors">
                                Update Profile
                            </button>
                            <button className="bg-teal-500 hover:bg-teal-600 text-white p-4 rounded-lg transition-colors">
                                Health Records
                            </button>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transition-colors">
                                Appointments
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

















// import { useState, useEffect } from 'react';
// import { useAuth } from '../components/AuthContext';
// import ProfileHeader from '../components/Profile/ProfileHeader';
// import HealthHistory from '../components/Profile/HealthHistory';
// import HealthInsights from '../components/Profile/HealthInsights';
// import FamilyHealth from '../components/Profile/FamilyHealth';
// import Orders from '../components/Profile/Orders';
// function Profile() {
//     const { user, signOut } = useAuth();
//     const [isLoggingOut, setIsLoggingOut] = useState(false);
//     const [logoutError, setLogoutError] = useState(null);
//     const [activeTab, setActiveTab] = useState('overview');

//     const handleLogout = async () => {
//         if (confirm('Are you sure you want to logout?')) {
//             setIsLoggingOut(true);
//             setLogoutError(null);

//             try {
//                 await signOut();
//                 localStorage.removeItem('authToken');
//                 sessionStorage.clear();
//                 window.location.href = '/login';
//             } catch (error) {
//                 console.error('Logout failed:', error);
//                 let errorMessage = 'Logout failed. Please try again.';
//                 if (error.code === 'auth/network-request-failed') {
//                     errorMessage = 'Network error. Please check your connection.';
//                 } else if (error.code === 'auth/too-many-requests') {
//                     errorMessage = 'Too many attempts. Please wait and try again.';
//                 } else if (error.message) {
//                     errorMessage = `Logout failed: ${error.message}`;
//                 }
//                 setLogoutError(errorMessage);
//             } finally {
//                 setIsLoggingOut(false);
//             }
//         }
//     };

//     if (!user) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#E23744]"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 pb-12">
//             {/* Profile Header with Tabs */}
//             <div className="bg-white shadow-sm">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-6 pb-4">
//                         <div>
//                             <h1 className="text-2xl font-bold text-gray-900">My Health Profile</h1>
//                             <p className="text-sm text-gray-500 mt-1">
//                                 Welcome back, {user.name || user.displayName || 'User'}!
//                             </p>
//                         </div>
//                         <div className="mt-4 md:mt-0">
//                             <div className="flex items-center space-x-2">
//                                 <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#E23744]/10 text-[#E23744]">
//                                     {user.email}
//                                 </span>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Navigation Tabs */}
//                     <div className="border-b border-gray-200">
//                         <nav className="-mb-px flex space-x-8 overflow-x-auto">
//                             {['overview', 'orders', 'history', 'family', 'insights'].map((tab) => (
//                                 <button
//                                     key={tab}
//                                     onClick={() => setActiveTab(tab)}
//                                     className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab
//                                         ? 'border-[#E23744] text-[#E23744]'
//                                         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                                         }`}
//                                 >
//                                     {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                                 </button>
//                             ))}
//                         </nav>
//                     </div>
//                 </div>
//             </div>

//             <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 {/* Tab Content */}
//                 <div className="space-y-8">
//                     {activeTab === 'overview' && (
//                         <>
//                             <ProfileHeader />
//                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                                 <HealthHistory showOnlyRecent={true} />
//                                 <HealthInsights />
//                             </div>
//                         </>
//                     )}

//                     {activeTab === 'history' && <HealthHistory expanded={true} />}
//                     {activeTab === 'family' && <FamilyHealth />}
//                     {activeTab === 'insights' && <HealthInsights expanded={true} />}
//                     {activeTab === 'orders' && <Orders />}

//                 </div>

//                 {/* Logout Card */}
//                 <div className="mt-12 max-w-md mx-auto">
//                     <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
//                         <div className="p-6 sm:p-8">
//                             <div className="text-center">
//                                 <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#E23744]/10 mb-4">
//                                     <svg className="h-6 w-6 text-[#E23744]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                                     </svg>
//                                 </div>
//                                 <h3 className="text-lg font-medium text-gray-900 mb-1">End Session</h3>
//                                 <p className="text-sm text-gray-500 mb-6">
//                                     Secure logout from your health account
//                                 </p>

//                                 {logoutError && (
//                                     <div className="mb-4 p-3 bg-red-50 rounded-lg text-red-600 text-sm">
//                                         {logoutError}
//                                     </div>
//                                 )}

//                                 <button
//                                     onClick={handleLogout}
//                                     disabled={isLoggingOut}
//                                     className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#E23744] hover:bg-[#c5313d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E23744] transition-colors duration-300 disabled:opacity-70"
//                                 >
//                                     {isLoggingOut ? (
//                                         <>
//                                             <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                             </svg>
//                                             Signing out...
//                                         </>
//                                     ) : 'Sign out'}
//                                 </button>

//                                 {logoutError && (
//                                     <button
//                                         onClick={() => {
//                                             localStorage.clear();
//                                             sessionStorage.clear();
//                                             window.location.href = '/login';
//                                         }}
//                                         className="mt-3 w-full text-center text-sm text-gray-500 hover:text-[#E23744] underline transition-colors duration-200"
//                                     >
//                                         Can't sign out? Clear all data
//                                     </button>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// }

// export default Profile;