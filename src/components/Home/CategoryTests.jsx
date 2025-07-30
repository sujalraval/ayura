import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Header';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useAuth } from '../AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Custom hook for media queries
const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const media = window.matchMedia(query);
        const listener = () => setMatches(media.matches);
        listener();
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [query]);
    return matches;
};

// Detail View Component
const TestDetailView = ({ test, onClose, onAddToCart, onRemoveFromCart, isInCart, cartLoading }) => {
    if (!test) return null;

    const getDiscountPercentage = (original, current) => {
        if (!original || original <= current) return 0;
        return Math.round(((original - current) / original) * 100);
    };

    const handleCartAction = async () => {
        if (cartLoading) return;

        try {
            if (isInCart(test._id)) {
                await onRemoveFromCart(test._id);
            } else {
                await onAddToCart(test);
            }
            onClose();
        } catch (error) {
            console.error('Cart action error:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-[#2D2D2D] pr-4">{test.name}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                            aria-label="Close details"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>

                    <div className="flex items-center mb-4">
                        {test.originalPrice && test.originalPrice > test.price && (
                            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-3">
                                {getDiscountPercentage(test.originalPrice, test.price)}% OFF
                            </div>
                        )}
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-[#E23744]">₹{test.price}</span>
                            {test.originalPrice && test.originalPrice > test.price && (
                                <span className="text-gray-500 line-through">₹{test.originalPrice}</span>
                            )}
                        </div>
                    </div>

                    <p className="text-gray-700 mb-6">
                        {test.detailedDescription || test.description || 'No description available.'}
                    </p>

                    {/* Test Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {test.sample && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <h4 className="font-semibold text-gray-800">Sample Type</h4>
                                <p className="text-gray-600">{test.sample}</p>
                            </div>
                        )}
                        {test.fasting && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <h4 className="font-semibold text-gray-800">Fasting Required</h4>
                                <p className="text-gray-600">{test.fasting}</p>
                            </div>
                        )}
                        {test.duration && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <h4 className="font-semibold text-gray-800">Report Time</h4>
                                <p className="text-gray-600">{test.duration}</p>
                            </div>
                        )}
                        {test.ageGroup && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <h4 className="font-semibold text-gray-800">Age Group</h4>
                                <p className="text-gray-600">{test.ageGroup}</p>
                            </div>
                        )}
                    </div>

                    {/* Parameters */}
                    {test.parameters && test.parameters.length > 0 && (
                        <div className="bg-blue-50 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-gray-800 mb-2">Test Parameters:</h3>
                            <ul className="list-disc pl-5 space-y-1 text-gray-700">
                                {test.parameters.map((param, idx) => (
                                    <li key={idx}>{param}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Why it's important */}
                    {test.whyItIsImportant && (
                        <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                            <h3 className="font-semibold text-gray-800 mb-2">Why this test is important:</h3>
                            <p className="text-gray-700">{test.whyItIsImportant}</p>
                        </div>
                    )}

                    <button
                        onClick={handleCartAction}
                        disabled={cartLoading}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${isInCart(test._id)
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-[#E23744] text-white hover:bg-[#c12531] hover:shadow-md'
                            } ${cartLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {cartLoading ? (
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                        ) : isInCart(test._id) ? (
                            <>
                                <i className="fas fa-trash mr-2"></i>
                                Remove from Cart
                            </>
                        ) : (
                            <>
                                <i className="fas fa-cart-plus mr-2"></i>
                                Add to Cart
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

const CategoryTests = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [tests, setTests] = useState([]);
    const [selectedTest, setSelectedTest] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [cartLoading, setCartLoading] = useState(false);
    const [error, setError] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const detailPanelRef = useRef(null);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const { user, token, API_BASE_URL } = useAuth();

    // Open and close detail functions
    const openDetail = (test) => {
        setSelectedTest(test);
        setIsDetailOpen(true);
    };

    const closeDetail = () => {
        setIsDetailOpen(false);
        setSelectedTest(null);
    };

    useEffect(() => {
        if (!slug) return;

        const fetchTests = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`${API_BASE_URL}/lab-tests/category/slug/${slug}`);

                if (response.data && Array.isArray(response.data)) {
                    setTests(response.data);
                    setCategoryName(response.data[0]?.category ||
                        slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
                } else {
                    setTests([]);
                    setError("No tests found for this category");
                }
            } catch (err) {
                console.error("Error fetching lab tests:", err);
                setError("Failed to load tests. Please try again.");
                setTests([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTests();
    }, [slug, API_BASE_URL]);

    const fetchCart = useCallback(async () => {
        try {
            setCartLoading(true);
            const userEmail = user?.email || localStorage.getItem('userEmail');

            if (!userEmail) {
                setCart([]);
                localStorage.removeItem('cart');
                return;
            }

            const response = await axios.get(`${API_BASE_URL}/cart/${userEmail}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            const serverCart = response.data?.items || [];
            setCart(serverCart);
            localStorage.setItem('cart', JSON.stringify(serverCart));
        } catch (err) {
            console.error("Error fetching cart:", err);
            const cachedCart = localStorage.getItem('cart');
            if (cachedCart) {
                try {
                    setCart(JSON.parse(cachedCart));
                } catch {
                    setCart([]);
                    localStorage.removeItem('cart');
                }
            }
        } finally {
            setCartLoading(false);
        }
    }, [user?.email, token, API_BASE_URL]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (test) => {
        if (!user) {
            localStorage.setItem('redirectAfterLogin', window.location.pathname);
            toast.info('Please login to add items to cart');
            return navigate('/login');
        }

        try {
            setCartLoading(true);
            const newCartItem = { ...test, quantity: 1, testId: test._id };
            const updatedCart = [...cart, newCartItem];
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));

            await axios.post(`${API_BASE_URL}/cart/add`, {
                userId: user.email,
                test
            }, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            toast.success('Test added to cart!');
        } catch (err) {
            setCart(cart.filter(item => item._id !== test._id));
            localStorage.setItem('cart', JSON.stringify(cart.filter(item => item._id !== test._id)));
            toast.error('Failed to add test to cart');
            console.error("Error adding to cart:", err);
        } finally {
            setCartLoading(false);
        }
    };

    const removeFromCart = async (testId) => {
        if (!user) {
            localStorage.setItem('redirectAfterLogin', window.location.pathname);
            toast.info('Please login to manage cart');
            return navigate('/login');
        }

        try {
            setCartLoading(true);
            const updatedCart = cart.filter(item => item._id !== testId && item.testId !== testId);
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));

            await axios.delete(`${API_BASE_URL}/cart/remove/${user.email}/${testId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            toast.info('Test removed from cart');
        } catch (err) {
            toast.error('Failed to remove test from cart');
            console.error("Error removing from cart:", err);
            await fetchCart();
        } finally {
            setCartLoading(false);
        }
    };

    const handleCartToggle = async (test) => {
        if (!user) {
            localStorage.setItem('redirectAfterLogin', window.location.pathname);
            toast.info('Please login to manage cart');
            return navigate('/login');
        }

        if (cartLoading) return;

        if (isInCart(test._id)) {
            await removeFromCart(test._id);
        } else {
            await addToCart(test);
        }
    };

    const isInCart = (testId) => {
        return cart.some(item => item._id === testId || item.testId === testId);
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    };

    const getDiscountPercentage = (original, current) => {
        if (!original || original <= current) return 0;
        return Math.round(((original - current) / original) * 100);
    };

    const clearCart = async () => {
        if (!user) {
            localStorage.setItem('redirectAfterLogin', window.location.pathname);
            toast.info('Please login to manage cart');
            return navigate('/login');
        }

        try {
            setCartLoading(true);
            setCart([]);
            localStorage.removeItem('cart');

            await axios.delete(`${API_BASE_URL}/cart/clear/${user.email}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            toast.info('Cart cleared');
        } catch (err) {
            toast.error('Failed to clear cart');
            console.error("Error clearing cart:", err);
            await fetchCart();
        } finally {
            setCartLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="container mx-auto px-4 pt-26 pb-18">
                    <div className="flex justify-center items-center py-20">
                        <i className="fas fa-spinner fa-spin text-3xl text-[#E23744]"></i>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="container mx-auto px-4 pt-26 pb-18">
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-[#E23744] hover:text-[#c12531] transition-colors"
                    >
                        <i className="fas fa-arrow-left mr-2"></i>
                        Back to Categories
                    </button>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-4">
                        {categoryName} Tests
                    </h1>
                    <p className="text-gray-600 text-lg">Choose from our comprehensive range of lab tests</p>
                </div>

                {error ? (
                    <div className="text-center py-12">
                        <i className="fas fa-exclamation-triangle text-6xl text-yellow-400 mb-4"></i>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">{error}</h3>
                        <p className="text-gray-500">Please try again later or contact support.</p>
                    </div>
                ) : tests.length === 0 ? (
                    <div className="text-center py-12">
                        <i className="fas fa-flask text-6xl text-gray-300 mb-4"></i>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            No tests found for this category
                        </h3>
                        <p className="text-gray-500">
                            Please try another category or contact us for more information.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {tests.map((test) => {
                            const testInCart = isInCart(test._id);
                            return (
                                <div key={test._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2 flex-1 pr-2">{test.name}</h3>
                                            {test.originalPrice && test.originalPrice > test.price && (
                                                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0">
                                                    {getDiscountPercentage(test.originalPrice, test.price)}% OFF
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                                            {test.description || 'No description available'}
                                        </p>

                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-2xl font-bold text-[#E23744]">₹{test.price}</span>
                                                {test.originalPrice && test.originalPrice > test.price && (
                                                    <span className="text-sm text-gray-500 line-through">₹{test.originalPrice}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex space-x-2 mt-4">
                                            <button
                                                onClick={() => handleCartToggle(test)}
                                                disabled={cartLoading}
                                                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 text-sm ${testInCart
                                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                                        : 'bg-[#E23744] text-white hover:bg-[#c12531] hover:shadow-md'
                                                    } ${cartLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {cartLoading ? (
                                                    <i className="fas fa-spinner fa-spin" />
                                                ) : testInCart ? (
                                                    <i className="fas fa-trash" />
                                                ) : (
                                                    <i className="fas fa-cart-plus" />
                                                )}
                                            </button>

                                            <button
                                                onClick={() => openDetail(test)}
                                                className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 text-sm transition-colors"
                                            >
                                                <i className="fas fa-info-circle mr-2"></i>
                                                View More
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Cart Summary */}
                {cart.length > 0 && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t p-3 z-40">
                        <div className="container mx-auto flex items-center justify-between">
                            <div className="flex items-center">
                                <span className="text-sm font-semibold text-[#2D2D2D] mr-2">
                                    {cart.length} item{cart.length > 1 ? 's' : ''}
                                </span>
                                <span className="text-sm font-bold text-[#E23744]">₹{getTotalPrice()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={clearCart}
                                    disabled={cartLoading}
                                    className="text-gray-500 hover:text-gray-700 px-2 py-1 text-sm disabled:opacity-50"
                                >
                                    {cartLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Clear'}
                                </button>
                                <button
                                    onClick={() => {
                                        if (!user) {
                                            localStorage.setItem('redirectAfterLogin', window.location.pathname);
                                            return navigate('/login');
                                        }
                                        navigate('/cart');
                                    }}
                                    className="bg-[#E23744] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#c12531] transition-colors text-sm"
                                >
                                    View Cart
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Detail Modal */}
                {isDetailOpen && selectedTest && (
                    <TestDetailView
                        test={selectedTest}
                        onClose={closeDetail}
                        onAddToCart={addToCart}
                        onRemoveFromCart={removeFromCart}
                        isInCart={isInCart}
                        cartLoading={cartLoading}
                    />
                )}
            </div>
        </div>
    );
};

export default CategoryTests;
