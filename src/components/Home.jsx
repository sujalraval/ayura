import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Header from './Header';
import HeroSection from './Home/HeroSection';
import Categories from './Home/Categories';
import PopularTests from './Home/PopularTests';
import WhyChoose from './Home/WhyChoose';
import ExpectFromUs from './Home/ExpectFromUs';
import CustomersSay from './Home/CustomersSay';
import TakeControl from './Home/TakeControl';
import Footer from './Footer';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

export default function Home() {
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [showHeaderSearch, setShowHeaderSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTests, setFilteredTests] = useState([]);
    const [cartLoading, setCartLoading] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const heroRef = useRef(null);

    const { user: authUser, token } = useAuth();
    const API_BASE_URL = 'https://ayuras.life/api/v1';

    // Load cart items on mount
    useEffect(() => {
        const loadCartItems = async () => {
            try {
                const userId = authUser?.email || localStorage.getItem('userEmail');
                if (!userId) {
                    // Load from localStorage if no user
                    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
                    setCartItems(items);
                    return;
                }

                const response = await axios.get(`${API_BASE_URL}/cart/${userId}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                setCartItems(response.data.items || []);
            } catch (error) {
                console.error('Error loading cart:', error);
                // Fallback to localStorage
                const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
                setCartItems(items);
            }
        };

        loadCartItems();

        // Listen for cart updates
        const handleCartUpdate = () => loadCartItems();
        window.addEventListener('cartUpdated', handleCartUpdate);

        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, [authUser, token]);

    // Enhanced search functionality with API call
    useEffect(() => {
        const searchTests = async () => {
            if (!searchTerm || searchTerm.trim().length < 2) {
                setFilteredTests([]);
                return;
            }

            try {
                const response = await axios.get(`${API_BASE_URL}/lab-tests/search?query=${encodeURIComponent(searchTerm.trim())}`);
                setFilteredTests(response.data || []);
            } catch (error) {
                console.error('Search error:', error);
                setFilteredTests([]);
            }
        };

        const debounceTimer = setTimeout(searchTests, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    // Intersection Observer for hero section
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowHeaderSearch(!entry.isIntersecting);
            },
            { threshold: 0.1, rootMargin: '-100px 0px 0px 0px' }
        );

        if (heroRef.current) {
            observer.observe(heroRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Back to top scroll handler
    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle test selection - navigate to test details
    const handleTestSelect = (test) => {
        console.log('Selected test:', test);
        // Navigate to test details page
        window.location.href = `/test-details/${test._id}`;
    };

    // Handle add to cart
    const handleAddToCart = async (test) => {
        setCartLoading(true);

        try {
            const userId = authUser?.email || localStorage.getItem('userEmail');

            if (!userId) {
                // If no user, store in localStorage
                const existingItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
                const isAlreadyInCart = existingItems.some(item => item._id === test._id || item.testId === test._id);

                if (!isAlreadyInCart) {
                    const cartItem = {
                        _id: test._id,
                        testId: test._id,
                        name: test.name,
                        price: test.price,
                        category: test.category,
                        description: test.description
                    };
                    const updatedItems = [...existingItems, cartItem];
                    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
                    setCartItems(updatedItems);

                    toast.success(`${test.name} added to cart!`);
                    window.dispatchEvent(new Event('cartUpdated'));
                } else {
                    toast.info(`${test.name} is already in your cart!`);
                }
                return;
            }

            // If user is logged in, use API
            const cartItem = {
                testId: test._id,
                testName: test.name,
                price: test.price,
                category: test.category,
                description: test.description
            };

            const response = await axios.post(`${API_BASE_URL}/cart/add`, {
                userId,
                ...cartItem
            }, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (response.data.success) {
                toast.success(`${test.name} added to cart!`);
                setCartItems(response.data.cart.items || []);
                window.dispatchEvent(new Event('cartUpdated'));
            } else {
                toast.info(response.data.message || `${test.name} is already in your cart!`);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            if (error.response?.status === 400 && error.response?.data?.message) {
                toast.info(error.response.data.message);
            } else {
                toast.error('Failed to add item to cart. Please try again.');
            }
        } finally {
            setCartLoading(false);
        }
    };

    // Check if test is in cart
    const isTestInCart = (testId) => {
        return cartItems.some(item =>
            item._id === testId ||
            item.testId === testId ||
            item.id === testId
        );
    };

    // Remove from cart
    const handleRemoveFromCart = async (testId) => {
        try {
            const userId = authUser?.email || localStorage.getItem('userEmail');

            if (!userId) {
                // Remove from localStorage
                const existingItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
                const updatedItems = existingItems.filter(item =>
                    item._id !== testId && item.testId !== testId && item.id !== testId
                );
                localStorage.setItem('cartItems', JSON.stringify(updatedItems));
                setCartItems(updatedItems);
                window.dispatchEvent(new Event('cartUpdated'));
                return;
            }

            // Remove via API
            await axios.delete(`${API_BASE_URL}/cart/remove/${userId}/${testId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            // Update local state
            setCartItems(prevItems => prevItems.filter(item =>
                item.testId !== testId && item._id !== testId && item.id !== testId
            ));
            window.dispatchEvent(new Event('cartUpdated'));
            toast.success('Item removed from cart');
        } catch (error) {
            console.error('Error removing from cart:', error);
            toast.error('Failed to remove item from cart');
        }
    };

    return (
        <>
            <Header
                showSearch={showHeaderSearch}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filteredTests={filteredTests}
                onTestSelect={handleTestSelect}
                onAddToCart={handleAddToCart}
                isInCart={isTestInCart}
                cartLoading={cartLoading}
            />

            <main>
                <div ref={heroRef}>
                    <HeroSection
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filteredTests={filteredTests}
                        onTestSelect={handleTestSelect}
                        onAddToCart={handleAddToCart}
                        onRemoveFromCart={handleRemoveFromCart}
                        isInCart={isTestInCart}
                        cartLoading={cartLoading}
                    />
                </div>
                <Categories />
                <WhyChoose />
                <PopularTests
                    onAddToCart={handleAddToCart}
                    isInCart={isTestInCart}
                    cartLoading={cartLoading}
                />
                <ExpectFromUs />
                <CustomersSay />
                <TakeControl />
            </main>

            {showBackToTop && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 bg-[#E23744] text-white p-3 rounded-full shadow-lg hover:bg-[#c5313d] transition-colors z-40"
                    aria-label="Back to top"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </motion.button>
            )}

            <Footer />
        </>
    );
}
