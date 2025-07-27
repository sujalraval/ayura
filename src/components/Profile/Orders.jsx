import { useAuth } from "../AuthContext";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Orders = () => {
    const { user, token, API_BASE_URL } = useAuth(); // Use API_BASE_URL from context
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("current");
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError(null);

                // Use API_BASE_URL from AuthContext instead of hardcoded localhost
                const apiUrl = API_BASE_URL || 'https://ayuras.life/api/v1';

                const response = await axios.get(`${apiUrl}/orders/user`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000 // Add timeout
                });

                if (response.data.success) {
                    setOrders(response.data.orders || []);
                } else {
                    throw new Error(response.data.message || "Failed to fetch orders");
                }
            } catch (error) {
                console.error("Error fetching orders:", error);

                // Better error handling
                if (error.code === 'ERR_NETWORK' || error.code === 'NETWORK_ERROR') {
                    setError("Unable to connect to server. Please check your internet connection.");
                } else if (error.response?.status === 401) {
                    setError("Session expired. Please log in again.");
                    // Redirect to login
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
            // Set up polling to check for updates every 30 seconds
            const interval = setInterval(fetchOrders, 30000);
            return () => clearInterval(interval);
        } else {
            setLoading(false);
            setError("Please log in to view your orders.");
        }
    }, [user, token, API_BASE_URL]);

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
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                    <div className="text-center">
                        <div className="text-red-500 text-xl mb-4">⚠️</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Orders</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const renderOrders = (ordersList) => {
        if (ordersList.length === 0) {
            return (
                <div className="text-center py-8">
                    <p className="text-gray-500">You don't have any orders in this category</p>
                </div>
            );
        }

        return ordersList.map((order) => (
            <div key={order._id} className="bg-white shadow rounded-lg p-6 mb-4">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-semibold">Order #{order._id?.slice(-8)}</h3>
                        <p className="text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                        }`}>
                        {order.status}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">{order.patientInfo?.name || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Relation</p>
                        <p className="font-medium">{order.patientInfo?.relation || "Self"}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{order.patientInfo?.phone || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="font-medium">₹{order.totalPrice || 0}</p>
                    </div>
                </div>

                {order.technicianNotes && (
                    <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-gray-600">Notes</p>
                        <p className="text-sm">{order.technicianNotes}</p>
                    </div>
                )}

                {order.reportUrl && (
                    <div className="mt-4">
                        <a
                            href={order.reportUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            📄 Download Report
                        </a>
                    </div>
                )}
            </div>
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab("current")}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "current"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                            >
                                Current Orders ({currentOrders.length})
                            </button>
                            <button
                                onClick={() => setActiveTab("previous")}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "previous"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                            >
                                Previous Orders ({previousOrders.length})
                            </button>
                        </nav>
                    </div>
                </div>

                <div>
                    {activeTab === "current" ? renderOrders(currentOrders) : renderOrders(previousOrders)}
                </div>
            </div>
        </div>
    );
};

export default Orders;
