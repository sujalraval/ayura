import React from 'react';
import { FaWallet, FaCreditCard } from 'react-icons/fa';

const PaymentOptions = ({ onBack, onNext }) => {
    return (
        <div className="space-y-6">
            {/* Payment Methods */}
            <div className="space-y-4">
                <div className="flex items-center p-4 border rounded-lg bg-gray-50 cursor-pointer">
                    <input type="radio" id="cod" name="payment" className="mr-3" defaultChecked />
                    <label htmlFor="cod" className="flex items-center cursor-pointer">
                        <FaWallet className="text-xl mr-3 text-[#E23744]" />
                        <span className="text-gray-700">Cash on Delivery</span>
                    </label>
                </div>

                <div className="flex items-center p-4 border rounded-lg cursor-pointer opacity-50">
                    <input type="radio" id="card" name="payment" className="mr-3" disabled />
                    <label htmlFor="card" className="flex items-center cursor-not-allowed">
                        <FaCreditCard className="text-xl mr-3 text-gray-400" />
                        <span className="text-gray-500">Credit/Debit Card (Coming Soon)</span>
                    </label>
                </div>

                <div className="flex items-center p-4 border rounded-lg cursor-pointer opacity-50">
                    <input type="radio" id="upi" name="payment" className="mr-3" disabled />
                    <label htmlFor="upi" className="flex items-center cursor-not-allowed">
                        <FaWallet className="text-xl mr-3 text-gray-400" />
                        <span className="text-gray-500">UPI Payment (Coming Soon)</span>
                    </label>
                </div>
            </div>

            {/* Note */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Our technician will collect the payment at the time of sample collection.
                </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-8">
                <button
                    type="button"
                    onClick={onBack}
                    className="w-1/2 border-2 border-[#E23744] text-[#E23744] py-3 px-6 rounded-lg font-semibold hover:bg-[#E23744]/10"
                >
                    Back
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    className="w-1/2 bg-gradient-to-r from-[#FF7A7A] to-[#E23744] text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg"
                >
                    Place Order
                </button>
            </div>
        </div>
    );
};

export default PaymentOptions;
