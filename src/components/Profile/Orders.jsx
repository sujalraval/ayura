import { useAuth } from "../AuthContext";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Orders = () => {
    const { user, token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("current");
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get('http://localhost:5000/api/v1/orders/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.success) {
                    setOrders(response.data.orders || []);
                } else {
                    throw new Error(response.data.message || "Failed to fetch orders");
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                setError(error.response?.data?.message || error.message || "Failed to fetch orders");
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
        }
    }, [user, token]);

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
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E23744]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6 mx-2 sm:mx-0">
                <div className="text-center py-8">
                    <div className="text-red-500 text-lg mb-2">⚠️ Error</div>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white rounded-xl p-4 sm:p-6 shadow-sm mb-6 mx-2 sm:mx-0">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">My Orders</h2>
                <div className="flex border rounded-lg overflow-hidden">
                    <button
                        onClick={() => setActiveTab("current")}
                        className={`px-4 py-2 text-sm font-medium ${activeTab === "current" ? "bg-[#E23744] text-white" : "bg-white text-gray-700"}`}
                    >
                        Current Orders ({currentOrders.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("previous")}
                        className={`px-4 py-2 text-sm font-medium ${activeTab === "previous" ? "bg-[#E23744] text-white" : "bg-white text-gray-700"}`}
                    >
                        Previous Orders ({previousOrders.length})
                    </button>
                </div>
            </div>

            {activeTab === "current" ? (
                <OrderList orders={currentOrders} />
            ) : (
                <OrderList orders={previousOrders} />
            )}
        </section>
    );
};

const OrderList = ({ orders }) => {
    if (!orders.length) {
        return (
            <div className="text-center py-8">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">No orders found</h3>
                <p className="text-gray-500">You don't have any orders in this category</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
            ))}
        </div>
    );
};

const OrderCard = ({ order }) => {
    const [expanded, setExpanded] = useState(false);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "pending": return "bg-yellow-100 text-yellow-800";
            case "approved":
            case "processing": return "bg-blue-100 text-blue-800";
            case "sample collected": return "bg-purple-100 text-purple-800";
            case "completed":
            case "report submitted": return "bg-green-100 text-green-800";
            case "cancelled":
            case "denied": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-medium text-gray-900">
                            Order #{order._id?.substring(18, 24)?.toUpperCase()}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                                year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                            })}
                        </p>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                        </span>
                        <span className="text-sm font-medium mt-1">₹{order.totalPrice}</span>
                    </div>
                </div>
            </div>
            {expanded && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Patient Details</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><p className="text-gray-500">Name</p><p>{order.patientInfo?.name || 'N/A'}</p></div>
                        <div><p className="text-gray-500">Relation</p><p>{order.patientInfo?.relation || "Self"}</p></div>
                        <div><p className="text-gray-500">Phone</p><p>{order.patientInfo?.phone || 'N/A'}</p></div>
                        <div><p className="text-gray-500">Status</p><p>{order.status}</p></div>
                    </div>
                    <h4 className="text-sm font-medium text-gray-700 mt-4 mb-2">Tests ({order.cartItems?.length || 0})</h4>
                    <ul className="space-y-2">
                        {order.cartItems?.map((item, idx) => (
                            <li key={idx} className="flex justify-between text-sm">
                                <span>{item.testName}</span>
                                <span>₹{item.price}</span>
                            </li>
                        ))}
                    </ul>

                    {order.reportUrl && (
                        <div className="mt-4">
                            <a
                                href={order.reportUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-[#E23744] bg-[#E23744]/10 hover:bg-[#E23744]/20"
                            >
                                Download Report
                            </a>
                        </div>
                    )}

                    {order.technicianNotes && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Technician Notes</h4>
                            <p className="text-sm text-gray-600">{order.technicianNotes}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );  
};

export default Orders;