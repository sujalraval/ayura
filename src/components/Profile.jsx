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
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#E23744]" style={{ marginTop: '120px' }}></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Spacer */}
            <div className="h-24 md:h-28"></div>

            {/* Navigation Tabs */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-24 md:top-28 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-6 md:space-x-8 overflow-x-auto scrollbar-hide">
                        {['overview', 'orders', 'family'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-shrink-0 py-4 px-1 border-b-2 font-medium text-sm md:text-base transition-colors duration-200 ${activeTab === tab
                                    ? 'border-[#E23744] text-[#E23744]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 md:pb-8">
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Profile Header */}
                        <ProfileHeader />

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Recent Orders - 8 columns on large screens */}
                            <div className="lg:col-span-8">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-full">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-semibold text-gray-900">Recent Orders</h3>
                                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Last 5 orders</span>
                                        </div>
                                        <div className="min-h-[300px]">
                                            <HealthHistory showOnlyRecent={true} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Health Insights - 4 columns on large screens */}
                            <div className="lg:col-span-4">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-full">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-xl font-semibold text-gray-900">Health Insights</h3>
                                            <span className="text-sm text-gray-500 bg-blue-100 px-3 py-1 rounded-full">Overview</span>
                                        </div>
                                        <div className="min-h-[300px]">
                                            <HealthInsights />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900">All Orders</h2>
                                <span className="text-sm text-gray-500 bg-green-100 px-3 py-1 rounded-full">Complete History</span>
                            </div>
                            <Orders />
                        </div>
                    </div>
                )}

                {activeTab === 'family' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900">Family Health</h2>
                                <span className="text-sm text-gray-500 bg-purple-100 px-3 py-1 rounded-full">Family Members</span>
                            </div>
                            <FamilyHealth />
                        </div>
                    </div>
                )}

                {/* Logout Card */}
                <div className="mt-12 max-w-md mx-auto">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                        <div className="p-6 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#E23744]/10 mb-4">
                                <svg className="h-6 w-6 text-[#E23744]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">End Session</h3>
                            <p className="text-sm text-gray-500 mb-6">
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
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#E23744] hover:bg-[#c5313d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E23744] transition-colors duration-300 disabled:opacity-70"
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
        </div>
    );
}

export default Profile;
