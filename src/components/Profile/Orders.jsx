import { useAuth } from "../AuthContext";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Orders = () => {
    const { user, token, API_BASE_URL } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("current");
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError(null);
                const apiUrl = API_BASE_URL || 'https://ayuras.life/api/v1';
                const response = await axios.get(`${apiUrl}/orders/user`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                });

                if (response.data.success) {
                    setOrders(response.data.orders || []);
                } else {
                    throw new Error(response.data.message || "Failed to fetch orders");
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                if (error.code === 'ERR_NETWORK' || error.code === 'NETWORK_ERROR') {
                    setError("Unable to connect to server. Please check your internet connection.");
                } else if (error.response?.status === 401) {
                    setError("Session expired. Please log in again.");
                    window.location.href = '/login';
                } else {
                    setError(error.response?.data?.message || error.message || "Failed to fetch orders");
                }
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        if (user && token) {
            fetchOrders();
            const interval = setInterval(fetchOrders, 30000);
            return () => clearInterval(interval);
        } else {
            setLoading(false);
            setError("Please log in to view your orders.");
        }
    }, [user, token, API_BASE_URL]);

    // Function to handle report download
    const handleDownloadReport = (reportUrl) => {
        console.log('Downloading report:', reportUrl);

        // Convert http to https if needed
        const httpsUrl = reportUrl.replace('http://', 'https://');

        // Open in new tab for better user experience
        window.open(httpsUrl, '_blank');
    };

    // Current orders are those without reports or not in final states
    const currentOrders = orders.filter(order =>
        !order.reportUrl &&
        !["completed", "cancelled", "denied", "report submitted"].includes(order.status.toLowerCase())
    );

    // Previous orders are those with reports or in final states
    const previousOrders = orders.filter(order =>
        order.reportUrl ||
        ["completed", "cancelled", "denied", "report submitted"].includes(order.status.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    const displayOrders = activeTab === "current" ? currentOrders : previousOrders;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    className={`py-2 px-4 font-medium ${activeTab === "current"
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => setActiveTab("current")}
                >
                    Current Orders ({currentOrders.length})
                </button>
                <button
                    className={`py-2 px-4 font-medium ${activeTab === "previous"
                            ? "border-b-2 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => setActiveTab("previous")}
                >
                    Previous Orders ({previousOrders.length})
                </button>
            </div>

            {/* Orders List */}
            {displayOrders.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">
                        You don't have any orders in this category
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {displayOrders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
                        >
                            {/* Order Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Order #{order._id.slice(-8)}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${order.status === "pending"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : order.status === "approved"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : order.status === "sample collected"
                                                        ? "bg-purple-100 text-purple-800"
                                                        : order.status === "processing"
                                                            ? "bg-orange-100 text-orange-800"
                                                            : order.status === "report submitted"
                                                                ? "bg-green-100 text-green-800"
                                                                : order.status === "completed"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : order.status === "cancelled"
                                                                        ? "bg-red-100 text-red-800"
                                                                        : order.status === "denied"
                                                                            ? "bg-red-100 text-red-800"
                                                                            : "bg-gray-100 text-gray-800"
                                            }`}
                                    >
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>
                            </div>

                            {/* Order Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-2">Patient Details</h4>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Name</span>
                                            <span className="font-medium">{order.patientInfo?.name || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Relation</span>
                                            <span className="font-medium">{order.patientInfo?.relation || "Self"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Phone</span>
                                            <span className="font-medium">{order.patientInfo?.phone || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-700 mb-2">Order Summary</h4>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Amount</span>
                                            <span className="font-medium text-green-600">₹{order.totalPrice || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Payment Method</span>
                                            <span className="font-medium">{order.paymentMethod || 'COD'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Payment Status</span>
                                            <span className="font-medium">{order.paymentStatus || 'Pending'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tests List */}
                            <div className="mb-4">
                                <h4 className="font-medium text-gray-700 mb-2">Tests Ordered</h4>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    {order.cartItems && order.cartItems.length > 0 ? (
                                        <ul className="space-y-1">
                                            {order.cartItems.map((item, index) => (
                                                <li key={index} className="flex justify-between text-sm">
                                                    <span>{item.testName} ({item.lab})</span>
                                                    <span className="font-medium">₹{item.price}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-500">No test details available</p>
                                    )}
                                </div>
                            </div>

                            {/* Technician Notes */}
                            {order.technicianNotes && (
                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-700 mb-2">Notes</h4>
                                    <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                                        {order.technicianNotes}
                                    </p>
                                </div>
                            )}

                            {/* Report Download Button */}
                            {order.reportUrl && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => handleDownloadReport(order.reportUrl)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Download Report
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
