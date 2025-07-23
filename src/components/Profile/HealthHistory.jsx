import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const HealthHistory = ({ expanded = false, showOnlyRecent = false }) => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [countdowns, setCountdowns] = useState({});
    const navigate = useNavigate();
    const { user, token, isAuthenticated, signOut } = useAuth();

    // Helper function to safely parse dates
    const safeDateParse = (dateString, fallback = new Date()) => {
        try {
            if (!dateString) return fallback;
            const date = new Date(dateString);
            return isNaN(date.getTime()) ? fallback : date;
        } catch {
            return fallback;
        }
    };

    // Fetch user orders from backend
    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!isAuthenticated()) {
                    setError('Please log in to view your test history');
                    setLoading(false);
                    navigate('/login');
                    return;
                }

                const response = await axios.get('http://localhost:5000/api/v1/orders/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.success) {
                    let transformedTests = transformOrdersToTests(response.data.orders || []);

                    // Sort by date descending
                    transformedTests.sort((a, b) => {
                        const dateA = safeDateParse(a.date).getTime();
                        const dateB = safeDateParse(b.date).getTime();
                        return dateB - dateA;
                    });

                    // If showOnlyRecent is true, take only the last 2 completed tests
                    if (showOnlyRecent) {
                        const completedTests = transformedTests.filter(test =>
                            test.status === 'completed' && test.downloadable
                        );
                        transformedTests = completedTests.slice(0, 2);
                    }

                    setTests(transformedTests);
                } else {
                    setError(response.data.message || 'Failed to fetch orders');
                }
            } catch (err) {
                console.error('Error fetching user orders:', err);
                setError(err.response?.data?.message || 'Failed to fetch test history');
                if (err.response?.status === 401) {
                    signOut();
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated()) {
            fetchUserOrders();

            // Set up polling to check for updates every 30 seconds
            const interval = setInterval(fetchUserOrders, 30000);
            return () => clearInterval(interval);
        } else {
            setLoading(false);
            setError('Please log in to view your test history');
        }
    }, [navigate, token, isAuthenticated, signOut, showOnlyRecent]);

    // Transform orders data to match the existing tests structure
    const transformOrdersToTests = (orders) => {
        if (!orders || !Array.isArray(orders)) {
            return [];
        }

        return orders.map(order => {
            const testNames = order.cartItems?.map(item => item.testName).join(', ') || 'Unknown Test';
            const labName = order.cartItems?.[0]?.lab || 'Unknown Lab';

            let status, downloadable;
            const now = new Date();
            const createdAt = safeDateParse(order.createdAt, now);
            const timeSlot = safeDateParse(order.patientInfo?.timeSlot);

            switch ((order.status || '').toLowerCase()) {
                case 'pending':
                    status = 'scheduled';
                    downloadable = false;
                    break;
                case 'approved':
                    status = 'scheduled';
                    downloadable = false;
                    break;
                case 'report submitted':
                case 'completed':
                    status = 'completed';
                    downloadable = !!order.reportUrl;
                    break;
                case 'cancelled':
                case 'denied':
                    status = 'cancelled';
                    downloadable = false;
                    break;
                default:
                    status = 'scheduled';
                    downloadable = false;
            }

            // Determine test date based on status
            let testDate;
            if (status === 'scheduled') {
                if (order.status.toLowerCase() === 'approved' && order.patientInfo?.timeSlot) {
                    testDate = timeSlot;
                } else {
                    // Default to tomorrow for pending tests
                    testDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                }
            } else {
                testDate = createdAt;
            }

            return {
                id: order._id,
                name: testNames,
                lab: labName,
                date: testDate.toISOString().split('T')[0],
                status,
                downloadable,
                reportUrl: order.reportUrl || null,
                originalOrder: order,
                totalPrice: order.totalPrice || 0,
                paymentMethod: order.paymentMethod || 'N/A',
                orderStatus: order.status || 'N/A',
                technicianNotes: order.technicianNotes || '',
                labNotes: order.labNotes || ''
            };
        });
    };

    const calculateCountdown = (targetDate) => {
        const now = new Date();
        const target = safeDateParse(targetDate);
        const difference = target - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

            if (days > 0) {
                return `${days}d ${hours}h remaining`;
            } else if (hours > 0) {
                return `${hours}h ${minutes}m remaining`;
            } else {
                return `${minutes}m remaining`;
            }
        }
        return 'Test due now';
    };

    useEffect(() => {
        const updateCountdowns = () => {
            const newCountdowns = {};
            tests.forEach(test => {
                if (test.status === 'scheduled') {
                    newCountdowns[test.id] = calculateCountdown(test.date);
                }
            });
            setCountdowns(newCountdowns);
        };

        updateCountdowns();
        const interval = setInterval(updateCountdowns, 1000 * 60);
        return () => clearInterval(interval);
    }, [tests]);

    const handleDownload = async (test) => {
        try {
            if (!test.reportUrl) {
                alert('Report download will be available once the report is uploaded by the lab.');
                return;
            }

            const response = await axios.get(`http://localhost:5000/api/orders/download-report/${test.id}`, {
                headers: { 'Authorization': `Bearer ${token}` },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${test.name.replace(/\s+/g, '_')}_Report.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download report. Please try again later.');
        }
    };

    const handleReschedule = (testId) => {
        alert('Reschedule functionality will be available soon. Please contact support for now.');
    };

    const handleViewDetails = (test) => {
        navigate(`/orders/${test.id}`, { state: { order: test.originalOrder } });
    };

    const getStatusColor = (status, orderStatus) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'scheduled':
                return (orderStatus || '').toLowerCase() === 'approved'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status, orderStatus) => {
        switch (status) {
            case 'completed': return 'Completed';
            case 'scheduled':
                return (orderStatus || '').toLowerCase() === 'approved'
                    ? 'Approved'
                    : 'Pending';
            case 'cancelled':
                return (orderStatus || '').toLowerCase() === 'cancelled'
                    ? 'Cancelled'
                    : 'Denied';
            default: return status;
        }
    };

    if (loading) {
        return (
            <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6 mx-2 sm:mx-0">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">
                    {showOnlyRecent ? 'Recent Reports' : 'Lab Test History'}
                </h2>
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                    <span className="ml-2 text-gray-600">Loading your test history...</span>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6 mx-2 sm:mx-0">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">
                    {showOnlyRecent ? 'Recent Reports' : 'Lab Test History'}
                </h2>
                <div className="text-center py-8">
                    <div className="text-red-500 text-lg mb-2">⚠️ Error</div>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mr-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Retry
                    </button>
                    {error.includes('log in') && (
                        <button
                            onClick={() => {
                                signOut();
                                navigate('/login');
                            }}
                            className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            Go to Login
                        </button>
                    )}
                </div>
            </section>
        );
    }

    if (tests.length === 0) {
        return (
            <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6 mx-2 sm:mx-0">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">
                    {showOnlyRecent ? 'Recent Reports' : 'Lab Test History'}
                </h2>
                <div className="text-center py-8">
                    <div className="text-gray-400 text-6xl mb-4">🔬</div>
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                        {showOnlyRecent ? 'No Recent Reports Found' : 'No Test History Found'}
                    </h3>
                    <p className="text-gray-500">
                        {showOnlyRecent ? 'You have no recently completed tests.' : 'You haven\'t placed any lab test orders yet.'}
                    </p>
                    {!showOnlyRecent && (
                        <button
                            onClick={() => navigate('/lab-tests')}
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Book a Test Now
                        </button>
                    )}
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6 mx-2 sm:mx-0">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                    {showOnlyRecent ? 'Recent Reports' : 'Lab Test History'}
                </h2>
                {!showOnlyRecent && (
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {tests.length} test{tests.length !== 1 ? 's' : ''}
                    </span>
                )}
            </div>

            <div className="space-y-3 sm:space-y-4">
                {tests.map(test => {
                    const testDate = safeDateParse(test.date);
                    const formattedDate = testDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });

                    return (
                        <div key={test.id} className="border border-gray-100 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4">
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900 text-base sm:text-lg mb-1">
                                        {test.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-1">
                                        Lab: {test.lab}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Order ID: {test.id}
                                    </p>
                                </div>
                                <div className="flex flex-col items-start sm:items-end mt-2 sm:mt-0">
                                    <span className="text-sm text-gray-500 mb-1">
                                        {formattedDate}
                                    </span>
                                    <span className="text-sm font-medium text-gray-700">
                                        ₹{test.totalPrice}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 sm:gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">Status:</span>
                                        <span className={`px-2 py-1 rounded-full text-xs sm:text-sm ${getStatusColor(test.status, test.orderStatus)}`}>
                                            {getStatusText(test.status, test.orderStatus)}
                                        </span>
                                    </div>

                                    {test.status === 'scheduled' && (
                                        test.orderStatus?.toLowerCase() === 'approved' ? (
                                            <div className="text-orange-600 font-medium text-xs sm:text-sm">
                                                {countdowns[test.id]}
                                            </div>
                                        ) : (
                                            <div className="text-blue-600 font-medium text-xs sm:text-sm">
                                                Awaiting approval
                                            </div>
                                        )
                                    )}
                                </div>

                                <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
                                    {test.downloadable && test.reportUrl ? (
                                        <button
                                            onClick={() => handleDownload(test)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm w-full sm:w-auto"
                                        >
                                            Download Report
                                        </button>
                                    ) : test.status === 'scheduled' && test.orderStatus?.toLowerCase() === 'pending' ? (
                                        <button
                                            onClick={() => handleReschedule(test.id)}
                                            className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors text-sm w-full sm:w-auto"
                                        >
                                            Reschedule
                                        </button>
                                    ) : test.status === 'completed' && !test.reportUrl ? (
                                        <button
                                            disabled
                                            className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed text-sm w-full sm:w-auto"
                                        >
                                            Report Pending
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleViewDetails(test)}
                                            className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm w-full sm:w-auto"
                                        >
                                            View Details
                                        </button>
                                    )}
                                </div>
                            </div>

                            {(test.technicianNotes || test.labNotes) && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    {test.technicianNotes && (
                                        <p className="text-sm text-gray-600 mb-1">
                                            <span className="font-medium">Note:</span> {test.technicianNotes}
                                        </p>
                                    )}
                                    {test.labNotes && (
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Lab Note:</span> {test.labNotes}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default HealthHistory;