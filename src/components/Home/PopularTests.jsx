import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PopularTests = () => {
    const [testData, setTestData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cart, setCart] = useState([]);
    const [cartLoading, setCartLoading] = useState(false);
    const scrollContainerRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const cardRef = useRef(null);
    const { user: authUser } = useAuth();
    const navigate = useNavigate();

    // Fetch popular tests
    useEffect(() => {
        const fetchPopularTests = async () => {
            try {
                setLoading(true);
                const res = await axios.get("http://localhost:5000/api/v1/popular-tests/public");
                if (res.data.success) {
                    setTestData(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch popular tests:", err);
                toast.error("Failed to load popular tests");
            } finally {
                setLoading(false);
            }
        };

        fetchPopularTests();
    }, []);

    // Fetch cart data
    const fetchCart = useCallback(async () => {
        try {
            setCartLoading(true);
            const userEmail = authUser?.email || localStorage.getItem('userEmail');

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
    }, [authUser?.email]);

    // Fetch cart when component mounts
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Auto-scroll functionality
    useEffect(() => {
        if (testData.length === 0) return;

        const autoScroll = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testData.length);
        }, 5000);

        return () => clearInterval(autoScroll);
    }, [testData.length]);

    useEffect(() => {
        if (scrollContainerRef.current && cardRef.current) {
            const cardWidth = cardRef.current.offsetWidth;
            const gap = 16;
            const scrollPosition = currentIndex * (cardWidth + gap);
            scrollContainerRef.current.scrollTo({
                left: scrollPosition,
                behavior: "smooth"
            });
        }
    }, [currentIndex]);

    // Check if test is in cart
    const isInCart = (testId) => {
        return cart.some(item => item._id === testId || item.testId === testId);
    };

    // Add test to cart (consistent with CategoryTests)
    const addToCart = async (test) => {
        if (!authUser) {
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

            // Then make the API call using the same structure as CategoryTests
            await axios.post('https://ayuras.life/api/v1/cart/add', {
                userId: authUser.email,
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

    // Remove test from cart
    const removeFromCart = async (testId) => {
        if (!authUser) {
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
            await axios.delete(`http://localhost:5000/api/v1/cart/remove/${authUser.email}/${testId}`);
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

    // Handle cart toggle
    const handleCartToggle = async (test) => {
        if (!authUser) {
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

    if (loading && testData.length === 0) {
        return (
            <section className="py-12 bg-[#FAF3F0]">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                        <p className="mt-4 text-gray-600">Loading popular tests...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 bg-[#FAF3F0]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Popular Lab Tests & Profiles
                    </h2>
                </div>

                <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar" ref={scrollContainerRef}>
                    {testData.map((test, index) => {
                        const labTest = test.labTest;
                        const testInCart = isInCart(labTest._id);

                        return (
                            <div
                                key={test._id}
                                ref={index === 0 ? cardRef : null}
                                className="flex-shrink-0 w-72 p-6 bg-white rounded-lg shadow-lg border border-gray-200 transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-red-500 relative flex flex-col justify-between min-h-[280px]"
                            >
                                {test.badge && (
                                    <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                                        {test.badge}
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        {labTest?.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 mt-6">
                                        {labTest?.description || "No description available"}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center my-4">
                                    <div>
                                        {labTest?.originalPrice && labTest.originalPrice > labTest.price && (
                                            <span className="block text-gray-400 text-sm line-through">
                                                ₹{labTest.originalPrice}
                                            </span>
                                        )}
                                        <span className="block text-red-500 text-xl font-bold">
                                            ₹{labTest?.price}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <span>Results in {labTest?.time || "24 hrs"}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleCartToggle(labTest)}
                                    disabled={cartLoading}
                                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${testInCart
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : 'bg-gradient-to-br from-[#E23744] to-[#FF5733] hover:brightness-110'
                                        } ${cartLoading ? 'opacity-50 cursor-not-allowed' : ''} shadow-[0_4px_15px_rgba(226,55,68,0.3)]`}
                                >
                                    {cartLoading ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin mr-2"></i>
                                            {testInCart ? 'Removing...' : 'Adding...'}
                                        </>
                                    ) : testInCart ? (
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
                    })}
                </div>

                {testData.length === 0 && !loading && (
                    <div className="text-center py-8">
                        <p className="text-gray-600">No popular tests available at the moment.</p>
                    </div>
                )}

                <style jsx>{`
                    .hide-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
            </div>
        </section>
    );
};

export default PopularTests;
