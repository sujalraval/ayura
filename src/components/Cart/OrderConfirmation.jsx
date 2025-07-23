import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaUser, FaMapMarker, FaClock } from 'react-icons/fa';

const OrderConfirmation = ({ totalPrice, onBackToCart, patientInfo, cartItems, orderId }) => {
    const [displayPrice, setDisplayPrice] = useState(0);
    const [orderIdDisplay, setOrderIdDisplay] = useState('');

    useEffect(() => {
        // Calculate total from cartItems if totalPrice is 0 or not provided
        if (cartItems && cartItems.length > 0) {
            const calculatedTotal = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
            setDisplayPrice(calculatedTotal);
        } else if (totalPrice > 0) {
            setDisplayPrice(totalPrice);
        }

        // Generate or use provided order ID
        setOrderIdDisplay(orderId || Math.floor(Math.random() * 1000000));
    }, [totalPrice, cartItems, orderId]);

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <div className="text-center space-y-6 py-12">
                <FaCheckCircle className="text-6xl text-[#E23744] mx-auto animate-bounce" />
                <h2 className="text-3xl font-bold text-gray-800">Order Confirmed!</h2>

                <div className="text-lg space-y-2 text-gray-600">
                    <p>Order ID: #{orderIdDisplay}</p>
                    <p>Total Amount: ₹{displayPrice}</p>
                    <p>Payment Method: Cash on Delivery</p>
                </div>

                {/* Patient and Address Details */}
                <div className="bg-gray-50 rounded-lg p-6 text-left space-y-4 mt-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Booking Details</h3>

                    <div className="flex items-start space-x-3">
                        <FaUser className="text-[#E23744] mt-1" />
                        <div>
                            <p className="font-medium">{patientInfo.name}</p>
                            <p className="text-sm text-gray-600">
                                {patientInfo.relation === 'self' ? 'Self' : patientInfo.relation} • {patientInfo.gender}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <FaMapMarker className="text-[#E23744] mt-1" />
                        <div>
                            <p className="font-medium">Sample Collection Address</p>
                            <p className="text-sm text-gray-600">
                                {patientInfo.address}, {patientInfo.city}, {patientInfo.state} - {patientInfo.pincode}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <FaClock className="text-[#E23744] mt-1" />
                        <div>
                            <p className="font-medium">Expected Collection Time</p>
                            <p className="text-sm text-gray-600">{patientInfo.timeSlot}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <p className="text-sm text-[#E23744]">
                        <strong>What's Next?</strong> Our technician will contact you 30 minutes before the scheduled time slot for sample collection.
                    </p>
                </div>

                <button
                    className="border-2 border-[#E23744] text-[#E23744] py-3 px-8 rounded-lg font-semibold hover:bg-[#E23744] hover:text-white transition-all duration-300"
                    onClick={onBackToCart}
                >
                    Continue Browsing
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmation;
