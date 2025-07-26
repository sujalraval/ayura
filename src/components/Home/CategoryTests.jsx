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

            <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">What this test includes:</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {Array.isArray(test.includes) && test.includes.length > 0 ? (
                        test.includes.map((item, idx) => <li key={idx}>{item}</li>)
                    ) : (
                        <>
                            <li>Comprehensive analysis</li>
                            <li>Detailed report with explanations</li>
                            <li>Doctor consultation (if required)</li>
                        </>
                    )}
                </ul>
            </div>

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
    const { user } = useAuth();

    // Fetch tests by category slug
    useEffect(() => {
        if (!slug) return;

        const fetchTests = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(`https://ayuras.life/api/v1/lab-tests/category/slug/${slug}`);

                console.log("API Response:", response.data);

                if (response.data && Array.isArray(response.data)) {
                    setTests(response.data);

                    if (response.data.length > 0) {
                        setCategoryName(response.data[0].category);
                    } else {
                        setCategoryName(slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
                    }
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
    }, [slug]);

    // Fetch cart data
    const fetchCart = useCallback(async () => {
        try {
            setCartLoading(true);
            const userEmail = user?.email || localStorage.getItem('userEmail');

            if (!userEmail) {
                setCart([]);
                localStorage.removeItem('cart');
                return;
            }

            const response = await axios.get(`https://ayuras.life/api/v1/cart/${userEmail}`);
            const serverCart = response.data.items || [];
            setCart(serverCart);
            localStorage.setItem('cart', JSON.stringify(serverCart));
        } catch (err) {
            console.error("Error fetching cart:", err);
            const cachedCart = localStorage.getItem('cart');
            if (cachedCart) {
                try {
                    setCart(JSON.parse(cachedCart));
                } catch (parseError) {
                    setCart([]);
                    localStorage.removeItem('cart');
                }
            } else {
                setCart([]);
            }
        } finally {
            setCartLoading(false);
        }
    }, [user?.email]);

    // Fetch cart when component mounts and when user changes
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Close detail on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDetailOpen && detailPanelRef.current && !detailPanelRef.current.contains(event.target)) {
                closeDetail();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDetailOpen]);

    // Prevent scroll when detail is open
    useEffect(() => {
        document.body.style.overflow = isDetailOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isDetailOpen]);

    const openDetail = (test) => {
        setSelectedTest(test);
        setIsDetailOpen(true);
    };

    const closeDetail = () => {
        setIsDetailOpen(false);
        setTimeout(() => setSelectedTest(null), 300);
    };

    const addToCart = async (test) => {
        if (!user) {
            localStorage.setItem('redirectAfterLogin', window.location.pathname);
            toast.info('Please login to add items to cart');
            return navigate('/login');
        }

        if (isInCart(test._id)) {
            toast.info('Test already in cart');
            return;
        }

        try {
            setCartLoading(true);

            // Optimistically update the UI first
            const newCartItem = { ...test, quantity: 1, testId: test._id };
            const updatedCart = [...cart, newCartItem];
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));

            // Then make the API call
            await axios.post('https://ayuras.life/api/v1/cart/add', {
                userId: user.email,
                test
            });

            toast.success('Test added to cart!');
        } catch (err) {
            // If API call fails, revert the optimistic update
            setCart(prevCart => prevCart.filter(item => item._id !== test._id));
            localStorage.setItem('cart', JSON.stringify(cart.filter(item => item._id !== test._id)));
            toast.error('Failed to add test to cart');
            console.error("Error adding to cart:", err.response?.data || err.message);
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

            // Optimistically update the UI first
            const updatedCart = cart.filter(item => item._id !== testId && item.testId !== testId);
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));

            // Then make the API call
            await axios.delete(`https://ayuras.life/api/v1/cart/remove/${user.email}/${testId}`);
            toast.info('Test removed from cart');
        } catch (err) {
            // If API call fails, revert the optimistic update
            toast.error('Failed to remove test from cart');
            console.error("Error removing from cart:", err.response?.data || err.message);
            // Refresh cart from server to ensure consistency
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

            // Optimistically update the UI first
            setCart([]);
            localStorage.removeItem('cart');

            // Then make the API call
            await axios.delete(`https://ayuras.life/api/v1/cart/clear/${user.email}`);
            toast.info('Cart cleared');
        } catch (err) {
            toast.error('Failed to clear cart');
            console.error("Error clearing cart:", err);
            await fetchCart(); // Refresh cart from server on error
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
                {cart.length > 0 && !(isMobile && isDetailOpen) && (
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
                                    className="bg-[#E23744] text-white px-3 py-2 rounded-lg font-medium hover:bg-[#c12531] text-sm transition-colors"
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Detail View Panels */}
                {!isMobile ? (
                    <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isDetailOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}>
                        <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" onClick={closeDetail}></div>
                        <div
                            ref={detailPanelRef}
                            className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 flex flex-col ${isDetailOpen ? 'translate-x-0' : 'translate-x-full'
                                }`}
                        >
                            <div className="flex-1 overflow-y-auto">
                                <TestDetailView
                                    test={selectedTest}
                                    onClose={closeDetail}
                                    onAddToCart={addToCart}
                                    onRemoveFromCart={removeFromCart}
                                    isInCart={isInCart}
                                    cartLoading={cartLoading}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${isDetailOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}>
                        <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" onClick={closeDetail}></div>
                        <div
                            ref={detailPanelRef}
                            className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl transform transition-transform duration-300 flex flex-col ${isDetailOpen ? 'translate-y-0' : 'translate-y-full'
                                }`}
                            style={{ height: '80vh' }}
                        >
                            <div className="flex justify-center pt-3 pb-1">
                                <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                            </div>
                            <div className="overflow-y-auto flex-1">
                                <TestDetailView
                                    test={selectedTest}
                                    onClose={closeDetail}
                                    onAddToCart={addToCart}
                                    onRemoveFromCart={removeFromCart}
                                    isInCart={isInCart}
                                    cartLoading={cartLoading}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryTests;
