// components/Home/TestDetails.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Check, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../AuthContext';

const TestDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: authUser, token } = useAuth();
    const [test, setTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cartLoading, setCartLoading] = useState(false);
    const [isInCart, setIsInCart] = useState(false);

    const API_BASE_URL = 'https://ayuras.life/api/v1';

    useEffect(() => {
        const fetchTestDetails = async () => {
            if (!id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/lab-tests/${id}`);

                if (!response.ok) {
                    const errorData = await response.json();
                    console.log('Error response:', errorData);
                    throw new Error(`Failed to fetch test details: ${response.status}`);
                }

                const result = await response.json();
                console.log('Success response:', result);

                // Adjust according to your API response structure
                setTest(result.data || result);
            } catch (error) {
                console.error('Error fetching test details:', error);
                setTest(null);
            } finally {
                setLoading(false);
            }
        };

        fetchTestDetails();
    }, [id]);


    // Check if test is in cart
    useEffect(() => {
        const checkCartStatus = () => {
            const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
            const inCart = cartItems.some(item =>
                item._id === id || item.testId === id || item.id === id
            );
            setIsInCart(inCart);
        };

        checkCartStatus();
        window.addEventListener('cartUpdated', checkCartStatus);
        return () => window.removeEventListener('cartUpdated', checkCartStatus);
    }, [id]);

    const handleAddToCart = async () => {
        if (!test) return;

        setCartLoading(true);
        try {
            const userId = authUser?.email || localStorage.getItem('userEmail');

            if (!userId) {
                const existingItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
                const isAlreadyInCart = existingItems.some(item =>
                    item._id === test._id || item.testId === test._id || item.id === test._id
                );

                if (!isAlreadyInCart) {
                    const cartItem = {
                        _id: test._id || test.id,
                        testId: test._id || test.id,
                        name: test.name || test.title,
                        price: test.price,
                        category: test.category,
                        description: test.description
                    };
                    const updatedItems = [...existingItems, cartItem];
                    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
                    setIsInCart(true);
                    toast.success(`${test.name || test.title} added to cart!`);
                    window.dispatchEvent(new Event('cartUpdated'));
                }
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add to cart');
        } finally {
            setCartLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
        );
    }

    if (!test) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Test not found</h1>
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6 md:p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Test Info */}
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                                    {test.name || test.title}
                                </h1>

                                {test.category && (
                                    <div className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm mb-4">
                                        {test.category}
                                    </div>
                                )}

                                {test.description && (
                                    <div className="text-gray-600 mb-6">
                                        <h3 className="font-semibold mb-2">Description</h3>
                                        <p>{test.description}</p>
                                    </div>
                                )}

                                {/* Price */}
                                <div className="mb-6">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl font-bold text-red-600">
                                            ₹{test.price}
                                        </span>
                                        {test.originalPrice && test.originalPrice > test.price && (
                                            <>
                                                <span className="text-lg text-gray-500 line-through">
                                                    ₹{test.originalPrice}
                                                </span>
                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                                                    {Math.round(((test.originalPrice - test.price) / test.originalPrice) * 100)}% OFF
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={cartLoading || isInCart}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${isInCart
                                        ? 'bg-green-100 text-green-700 cursor-default'
                                        : 'bg-red-500 text-white hover:bg-red-600'
                                        }`}
                                >
                                    {cartLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : isInCart ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <ShoppingCart className="w-5 h-5" />
                                    )}
                                    {isInCart ? 'Added to Cart' : 'Add to Cart'}
                                </button>
                            </div>

                            {/* Additional Info */}
                            <div>
                                {test.parameters && (
                                    <div className="mb-6">
                                        <h3 className="font-semibold mb-3">Test Parameters</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-green-500" />
                                                <span>{test.parameters}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {test.sampleType && (
                                    <div className="mb-4">
                                        <h3 className="font-semibold mb-2">Sample Type</h3>
                                        <p className="text-gray-600">{test.sampleType}</p>
                                    </div>
                                )}

                                {test.reportTime && (
                                    <div className="mb-4">
                                        <h3 className="font-semibold mb-2">Report Time</h3>
                                        <p className="text-gray-600">{test.reportTime}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestDetails;
