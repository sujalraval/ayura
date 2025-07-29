import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import ProfileHeader from '../components/Profile/ProfileHeader';
import HealthHistory from '../components/Profile/HealthHistory';
import HealthInsights from '../components/Profile/HealthInsights';
import FamilyHealth from '../components/Profile/FamilyHealth';
import Orders from '../components/Profile/Orders';

function Profile() {
    const { user, signOut } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [logoutError, setLogoutError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    const handleLogout = async () => {
        if (confirm('Are you sure you want to logout?')) {
            setIsLoggingOut(true);
            setLogoutError(null);

            try {
                await signOut();
                localStorage.removeItem('authToken');
                sessionStorage.clear();
                window.location.href = '/login';
            } catch (error) {
                console.error('Logout failed:', error);
                let errorMessage = 'Logout failed. Please try again.';
                if (error.code === 'auth/network-request-failed') {
                    errorMessage = 'Network error. Please check your connection.';
                } else if (error.code === 'auth/too-many-requests') {
                    errorMessage = 'Too many attempts. Please wait and try again.';
                } else if (error.message) {
                    errorMessage = `Logout failed: ${error.message}`;
                }
                setLogoutError(errorMessage);
            } finally {
                setIsLoggingOut(false);
            }
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#E23744]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Profile Header with Tabs */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 sm:pt-6 pb-3 sm:pb-4">
                        <div className="mb-4 sm:mb-0">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Health Profile</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Welcome back, {user.name || user.displayName || 'User'}!
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="flex items-center">
                                <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-[#E23744]/10 text-[#E23744] truncate max-w-xs sm:max-w-none">
                                    {user.email}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide">
                            {['overview', 'orders', 'family'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`whitespace-nowrap py-3 sm:py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                                            ? 'border-[#E23744] text-[#E23744]'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } transition-colors duration-200`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                {/* Tab Content */}
                <div className="space-y-6 sm:space-y-8">
                    {activeTab === 'overview' && (
                        <>
                            <ProfileHeader />

                            {/* Overview Grid - Responsive Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                                {/* Recent Orders - Takes 2 columns on large screens */}
                                <div className="lg:col-span-2">
                                    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                                        <HealthHistory showOnlyRecent={true} />
                                    </div>
                                </div>

                                {/* Health Insights - Takes 1 column on large screens */}
                                <div className="lg:col-span-1">
                                    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Insights</h3>
                                        <HealthInsights />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'orders' && <Orders />}
                    {activeTab === 'family' && <FamilyHealth />}
                </div>

                {/* Logout Card - Responsive */}
                <div className="mt-8 sm:mt-12 max-w-sm sm:max-w-md mx-auto">
                    <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                        <div className="p-4 sm:p-6 lg:p-8">
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[#E23744]/10 mb-3 sm:mb-4">
                                    <svg className="h-5 w-5 sm:h-6 sm:w-6 text-[#E23744]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </div>
                                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">End Session</h3>
                                <p className="text-sm text-gray-500 mb-4 sm:mb-6">
                                    Secure logout from your health account
                                </p>

                                {logoutError && (
                                    <div className="mb-4 p-3 bg-red-50 rounded-lg text-red-600 text-sm">
                                        {logoutError}
                                    </div>
                                )}

                                <button
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#E23744] hover:bg-[#c5313d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E23744] transition-colors duration-300 disabled:opacity-70"
                                >
                                    {isLoggingOut ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Signing out...
                                        </>
                                    ) : 'Sign out'}
                                </button>

                                {logoutError && (
                                    <button
                                        onClick={() => {
                                            localStorage.clear();
                                            sessionStorage.clear();
                                            window.location.href = '/login';
                                        }}
                                        className="mt-3 w-full text-center text-sm text-gray-500 hover:text-[#E23744] underline transition-colors duration-200"
                                    >
                                        Can't sign out? Clear all data
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Profile;
