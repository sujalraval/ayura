import React from 'react';

const CartReview = ({ cartItems, onRemoveItem, onNextStep, totalPrice }) => {
    return (
        <>
            <div className="flex-1">
                {cartItems.map(item => (
                    <div key={item.testId} className="border-b border-gray-200 pb-4 mb-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-semibold">{item.name}</h3>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold">₹{item.price}</p>
                                <button
                                    onClick={() => onRemoveItem(item.testId)}
                                    className="text-red-500 hover:text-red-700 mt-2"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-auto pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">Total:</span>
                    <span className="text-xl font-bold">₹{totalPrice}</span>
                </div>
                <button
                    onClick={onNextStep}
                    className="w-full mt-4 border-2 border-[#E23744] text-[#E23744] py-3 px-6 rounded-lg font-semibold hover:bg-[#E23744] hover:text-white transition-all duration-300"
                >
                    Proceed to Patient Details
                </button>
            </div>
        </>
    );
};

export default CartReview;
