import React, { useEffect, useState } from 'react';
import {
    FaSyringe,
    FaBoxOpen,
    FaUser,
    FaMapMarker,
    FaWallet,
    FaCheckCircle
} from 'react-icons/fa';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import CartReview from './CartReview';
import PatientInfoForm from './PatientInfoForm';
import AddressForm from './AddressForm';
import PaymentOptions from './PaymentOptions';
import Stepper from './Stepper';
import Sidebar from './Sidebar';
import OrderConfirmation from './OrderConfirmation';
import CartOverview from './CartOverview';
import axios from 'axios';

const CartPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [highestStepReached, setHighestStepReached] = useState(1);
    const [cartItems, setCartItems] = useState([]);
    const [orderDetails, setOrderDetails] = useState(null);
    const [patientInfo, setPatientInfo] = useState({
        name: '',
        relation: '',
        email: '',
        phone: '',
        dob: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        gender: '',
        timeSlot: '',
    });
    const [paymentMethod] = useState("COD");
    const { user: authUser, token, API_BASE_URL } = useAuth();
    const navigate = useNavigate();

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

    const handleRemoveItem = async (itemId) => {
        try {
            const userId = authUser?.email || localStorage.getItem('userEmail');
            if (!userId) {
                console.error('No user ID found');
                return;
            }

            // Updated to match backend route: DELETE /api/v1/cart/remove/:userId/:testId
            await axios.delete(`${API_BASE_URL}/cart/remove/${userId}/${itemId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            setCartItems(prevItems => prevItems.filter(item =>
                item.testId !== itemId && item._id !== itemId && item.id !== itemId
            ));
        } catch (err) {
            console.error("Error removing item", err);
            alert("Failed to remove item. Please try again.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPatientInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePrevStep = () => setCurrentStep(prev => Math.max(1, prev - 1));

    const handleStepClick = (stepId) => {
        if (stepId <= highestStepReached) setCurrentStep(stepId);
    };

    const handlePlaceOrder = async () => {
        try {
            // Ensure user is authenticated
            if (!authUser || !token) {
                localStorage.setItem('redirectAfterLogin', window.location.pathname);
                return navigate('/login');
            }

            const userId = authUser.email || localStorage.getItem('userEmail');
            if (!userId) {
                alert("Please login to place an order");
                return navigate('/login');
            }

            const orderPayload = {
                userId,
                patientInfo: {
                    ...patientInfo,
                    email: patientInfo.email || userId,
                },
                cartItems: cartItems.map(item => ({
                    testId: item.testId || item._id || item.id,
                    testName: item.name || item.testName,
                    lab: item.lab || 'Default Lab',
                    price: item.price
                })),
                totalPrice,
                paymentMethod,
            };

            console.log('Placing order with payload:', orderPayload);

            const res = await axios.post(`${API_BASE_URL}/orders/place`, orderPayload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Order response:', res.data);

            setOrderDetails({
                orderId: res.data.order?._id || res.data.orderId,
                totalPrice,
                cartItems: [...cartItems],
                patientInfo: { ...patientInfo }
            });

            // Clear cart after successful order
            await axios.delete(`${API_BASE_URL}/cart/clear/${userId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            setCurrentStep(5);
        } catch (error) {
            console.error("Order placement failed", error);
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to place order. Please try again.";
            alert(errorMessage);
        }
    };

    const validateCurrentStep = () => {
        switch (currentStep) {
            case 2:
                return patientInfo.name && patientInfo.email && patientInfo.phone &&
                    patientInfo.dob && patientInfo.gender && patientInfo.relation;
            case 3:
                return patientInfo.address && patientInfo.city && patientInfo.state &&
                    patientInfo.pincode && patientInfo.timeSlot;
            default:
                return true;
        }
    };

    const handleNextStep = async () => {
        if (!authUser || !token) {
            localStorage.setItem('redirectAfterLogin', window.location.pathname);
            return navigate('/login');
        }

        if (!validateCurrentStep()) {
            alert("Please fill in all required fields before proceeding.");
            return;
        }

        if (currentStep === 4) {
            await handlePlaceOrder();
            return;
        }

        const nextStep = Math.min(5, currentStep + 1);
        setCurrentStep(nextStep);
        setHighestStepReached(prev => Math.max(prev, nextStep));
    };

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const userId = authUser?.email || localStorage.getItem('userEmail');
                if (!userId) return;

                const res = await axios.get(`${API_BASE_URL}/cart/${userId}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                console.log('Fetched cart items:', res.data.items);
                setCartItems(res.data.items || []);
            } catch (err) {
                console.error("Failed to load cart", err);
            }
        };

        // Only fetch cart items if not on confirmation step
        if (currentStep !== 5) {
            fetchCartItems();
        }
    }, [currentStep, API_BASE_URL, authUser, token]);

    // Auto-populate email if user is logged in
    useEffect(() => {
        if (authUser && authUser.email && !patientInfo.email) {
            setPatientInfo(prev => ({
                ...prev,
                email: authUser.email
            }));
        }
    }, [authUser, patientInfo.email]);

    const handleCloseMobileForm = () => setCurrentStep(1);

    const steps = [
        { id: 1, name: 'Cart Review', icon: FaBoxOpen },
        { id: 2, name: 'Patient Info', icon: FaUser },
        { id: 3, name: 'Address & Time', icon: FaMapMarker },
        { id: 4, name: 'Payment', icon: FaWallet },
        { id: 5, name: 'Confirmation', icon: FaCheckCircle }
    ];

    // Show empty cart message only if not on confirmation step
    if (cartItems.length === 0 && currentStep !== 5) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <FaBoxOpen className="mx-auto text-6xl text-gray-300 mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-600 mb-2">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-6">It looks like you haven't added any lab tests yet.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-[#E23744] text-white px-6 py-3 rounded-lg transition-colors"
                    >
                        Browse Lab Tests
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Container with proper spacing for header */}
            <div className="container mx-auto px-4 py-8 pt-24 relative">
                {/* Stepper - Fixed position with proper z-index */}
                <div className="fixed top-16 left-0 right-0 bg-gray-50 shadow-sm border-b border-gray-200 z-50">
                    <div className="container mx-auto px-4">
                        <Stepper
                            steps={steps}
                            currentStep={currentStep}
                            highestStepReached={highestStepReached}
                            onStepClick={handleStepClick}
                        />
                    </div>
                </div>

                {/* Content with proper margin-top to account for fixed stepper */}
                <div className="mt-32">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content Area */}
                        <div className="lg:col-span-2">
                            {currentStep === 1 && (
                                <CartReview
                                    cartItems={cartItems}
                                    onRemoveItem={handleRemoveItem}
                                    onNextStep={handleNextStep}
                                    totalPrice={totalPrice}
                                />
                            )}

                            {/* Cart Overview in Center for Steps 2-4 */}
                            {(currentStep >= 2 && currentStep <= 4) && (
                                <div className="space-y-6">
                                    <CartOverview
                                        cartItems={cartItems}
                                        totalPrice={totalPrice}
                                        onRemoveItem={handleRemoveItem}
                                    />

                                    {/* Patient Info Summary (Show when available) */}
                                    {(currentStep >= 3 && patientInfo.name) && (
                                        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Patient Details</h3>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-600">Name:</span>
                                                    <span className="ml-2 font-medium">{patientInfo.name}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Relation:</span>
                                                    <span className="ml-2 font-medium capitalize">{patientInfo.relation}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Phone:</span>
                                                    <span className="ml-2 font-medium">{patientInfo.phone}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-600">Gender:</span>
                                                    <span className="ml-2 font-medium capitalize">{patientInfo.gender}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Address Summary (Show when available) */}
                                    {(currentStep >= 4 && patientInfo.address) && (
                                        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Collection Details</h3>
                                            <div className="space-y-2 text-sm">
                                                <div>
                                                    <span className="text-gray-600">Address:</span>
                                                    <p className="font-medium mt-1">{patientInfo.address}</p>
                                                    <p className="font-medium">{patientInfo.city}, {patientInfo.state} - {patientInfo.pincode}</p>
                                                </div>
                                                {patientInfo.timeSlot && (
                                                    <div>
                                                        <span className="text-gray-600">Time Slot:</span>
                                                        <span className="ml-2 font-medium">{patientInfo.timeSlot}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {currentStep === 5 && orderDetails && (
                                <OrderConfirmation
                                    totalPrice={orderDetails.totalPrice}
                                    cartItems={orderDetails.cartItems}
                                    orderId={orderDetails.orderId}
                                    onBackToCart={() => navigate('/')}
                                    patientInfo={orderDetails.patientInfo}
                                />
                            )}

                            {/* Fallback for confirmation step without order details */}
                            {currentStep === 5 && !orderDetails && (
                                <OrderConfirmation
                                    totalPrice={totalPrice}
                                    cartItems={cartItems}
                                    onBackToCart={() => navigate('/')}
                                    patientInfo={patientInfo}
                                />
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            {(currentStep >= 2 && currentStep <= 4) && (
                                <Sidebar
                                    currentStep={currentStep}
                                    patientInfo={patientInfo}
                                    onInputChange={handleInputChange}
                                    onBack={handlePrevStep}
                                    onNext={handleNextStep}
                                    handleCloseMobileForm={handleCloseMobileForm}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
