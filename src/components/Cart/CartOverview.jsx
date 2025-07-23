import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaTrash, FaShoppingCart } from 'react-icons/fa';

const CartOverview = ({ cartItems, totalPrice, onRemoveItem }) => {
    const [isExpanded, setIsExpanded] = useState(true); // Default expanded for center display

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div
                className="p-6 border-b border-gray-200 cursor-pointer bg-gradient-to-r from-[#FF7A7A] to-[#E23744] text-white rounded-t-lg"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <FaShoppingCart className="text-xl" />
                        <h3 className="text-xl font-semibold">Your Lab Tests</h3>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm opacity-90">{cartItems.length} items</p>
                            <p className="text-2xl font-bold">₹{totalPrice}</p>
                        </div>
                        {isExpanded ? <FaChevronUp className="text-xl" /> : <FaChevronDown className="text-xl" />}
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="p-6">
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {cartItems.map((item, index) => (
                            <div key={item.testId} className={`flex justify-between items-start p-4 rounded-lg border ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h4>
                                    {item.lab && (
                                        <p className="text-sm text-gray-500 mb-2">Lab: {item.lab}</p>
                                    )}
                                    <div className="flex items-center justify-between">
                                        <p className="text-xl font-bold text-[#E23744]">₹{item.price}</p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (window.confirm('Are you sure you want to remove this test?')) {
                                                    onRemoveItem(item.testId);
                                                }
                                            }}
                                            className="ml-4 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors p-2 rounded-lg border border-red-200"
                                            title="Remove item"
                                        >
                                            <FaTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {cartItems.length === 0 && (
                        <div className="text-center py-8">
                            <FaShoppingCart className="mx-auto text-4xl text-gray-300 mb-4" />
                            <p className="text-gray-500">No items in cart</p>
                        </div>
                    )}

                    {cartItems.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
                                <span className="text-2xl font-bold text-[#E23744]">₹{totalPrice}</span>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-sm text-yellow-800">
                                    <strong>Note:</strong> Sample will be collected at your provided address during the selected time slot.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CartOverview;
