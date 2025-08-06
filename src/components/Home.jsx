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
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [showHeaderSearch, setShowHeaderSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTests, setFilteredTests] = useState([]);
    const [allTests, setAllTests] = useState([]);
    const [cartLoading, setCartLoading] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const heroRef = useRef(null);
    const navigate = useNavigate(); // Add this line
    const { user: authUser, token } = useAuth();
    const API_BASE_URL = 'https://ayuras.life/api/v1';

    // All your existing useEffects and functions remain exactly the same...
    // [I'm keeping the existing logic unchanged for brevity]

    // Load all tests on component mount for fallback search
    useEffect(() => {
        const loadAllTests = async () => {
            try {
                const endpoints = [
                    `${API_BASE_URL}/lab-tests`,
                    `${API_BASE_URL}/tests`,
                    `${API_BASE_URL}/labtests`,
                    `${API_BASE_URL}/lab-test`
                ];

                for (const endpoint of endpoints) {
                    try {
                        const response = await axios.get(endpoint);
                        if (response.data && Array.isArray(response.data)) {
                            setAllTests(response.data);
                            console.log('Loaded tests from:', endpoint);
                            break;
                        } else if (response.data.data && Array.isArray(response.data.data)) {
                            setAllTests(response.data.data);
                            console.log('Loaded tests from:', endpoint);
                            break;
                        } else if (response.data.tests && Array.isArray(response.data.tests)) {
                            setAllTests(response.data.tests);
                            console.log('Loaded tests from:', endpoint);
                            break;
                        }
                    } catch (err) {
                        console.log(`Failed to load from ${endpoint}:`, err.response?.status);
                        continue;
                    }
                }
            } catch (error) {
                console.error('Error loading all tests:', error);
            }
        };

        loadAllTests();
    }, []);

    // Load cart items on mount
    useEffect(() => {
        const loadCartItems = async () => {
            try {
                const userId = authUser?.email || localStorage.getItem('userEmail');
                if (!userId) {
                    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
                    setCartItems(items);
                    return;
                }

                const cartEndpoints = [
                    `${API_BASE_URL}/cart/${userId}`,
                    `${API_BASE_URL}/user/cart/${userId}`,
                    `${API_BASE_URL}/carts/${userId}`
                ];

                for (const endpoint of cartEndpoints) {
                    try {
                        const response = await axios.get(endpoint, {
                            headers: token ? { Authorization: `Bearer ${token}` } : {}
                        });
                        setCartItems(response.data.items || response.data.cart?.items || response.data || []);
                        break;
                    } catch (err) {
                        continue;
                    }
                }
            } catch (error) {
                console.error('Error loading cart:', error);
                const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
                setCartItems(items);
            }
        };

        loadCartItems();

        const handleCartUpdate = () => loadCartItems();
        window.addEventListener('cartUpdated', handleCartUpdate);

        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, [authUser, token]);

    // Enhanced search functionality with multiple fallback approaches
    useEffect(() => {
        const searchTests = async () => {
            if (!searchTerm || searchTerm.trim().length < 2) {
                setFilteredTests([]);
                return;
            }

            setSearchLoading(true);

            try {
                const searchEndpoints = [
                    `${API_BASE_URL}/lab-tests/search?query=${encodeURIComponent(searchTerm.trim())}`,
                    `${API_BASE_URL}/tests/search?query=${encodeURIComponent(searchTerm.trim())}`,
                    `${API_BASE_URL}/lab-tests/search?q=${encodeURIComponent(searchTerm.trim())}`,
                    `${API_BASE_URL}/search/lab-tests?query=${encodeURIComponent(searchTerm.trim())}`,
                    `${API_BASE_URL}/search?type=lab-tests&query=${encodeURIComponent(searchTerm.trim())}`
                ];

                let searchResults = [];
                let searchSuccess = false;

                for (const endpoint of searchEndpoints) {
                    try {
                        const response = await axios.get(endpoint);
                        if (response.data) {
                            if (Array.isArray(response.data)) {
                                searchResults = response.data;
                            } else if (response.data.data && Array.isArray(response.data.data)) {
                                searchResults = response.data.data;
                            } else if (response.data.tests && Array.isArray(response.data.tests)) {
                                searchResults = response.data.tests;
                            } else if (response.data.results && Array.isArray(response.data.results)) {
                                searchResults = response.data.results;
                            }

                            if (searchResults.length >= 0) {
                                searchSuccess = true;
                                break;
                            }
                        }
                    } catch (err) {
                        console.log(`Search failed for ${endpoint}:`, err.response?.status);
                        continue;
                    }
                }

                if (!searchSuccess && allTests.length > 0) {
                    console.log('Using local search fallback');
                    searchResults = allTests.filter(test => {
                        const searchLower = searchTerm.toLowerCase();
                        return (
                            test.name?.toLowerCase().includes(searchLower) ||
                            test.title?.toLowerCase().includes(searchLower) ||
                            test.category?.toLowerCase().includes(searchLower) ||
                            test.alias?.toLowerCase().includes(searchLower) ||
                            test.description?.toLowerCase().includes(searchLower)
                        );
                    });
                }

                setFilteredTests(searchResults);

            } catch (error) {
                console.error('Search error:', error);

                if (allTests.length > 0) {
                    const filtered = allTests.filter(test => {
                        const searchLower = searchTerm.toLowerCase();
                        return (
                            test.name?.toLowerCase().includes(searchLower) ||
                            test.title?.toLowerCase().includes(searchLower) ||
                            test.category?.toLowerCase().includes(searchLower) ||
                            test.alias?.toLowerCase().includes(searchLower) ||
                            test.description?.toLowerCase().includes(searchLower)
                        );
                    });
                    setFilteredTests(filtered);
                } else {
                    setFilteredTests([]);
                }
            } finally {
                setSearchLoading(false);
            }
        };

        const debounceTimer = setTimeout(searchTests, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm, allTests]);

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

    const handleTestSelect = (test) => {
        console.log('Selected test:', test);
        const testId = test._id || test.id;
        if (testId) {
            console.log('Navigating to:', `/test-details/${testId}`);
            navigate(`/test-details/${testId}`);
        } else {
            console.error('No test ID found:', test);
        }
    };

    const handleAddToCart = async (test) => {
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
                    setCartItems(updatedItems);

                    toast.success(`${test.name || test.title} added to cart!`);
                    window.dispatchEvent(new Event('cartUpdated'));
                } else {
                    toast.info(`${test.name || test.title} is already in your cart!`);
                }
                return;
            }

            const cartItem = {
                testId: test._id || test.id,
                testName: test.name || test.title,
                price: test.price,
                category: test.category,
                description: test.description
            };

            const addEndpoints = [
                `${API_BASE_URL}/cart/add`,
                `${API_BASE_URL}/user/cart/add`,
                `${API_BASE_URL}/carts/add`
            ];

            let addSuccess = false;

            for (const endpoint of addEndpoints) {
                try {
                    const response = await axios.post(endpoint, {
                        userId,
                        ...cartItem
                    }, {
                        headers: token ? { Authorization: `Bearer ${token}` } : {}
                    });

                    if (response.data.success || response.status === 200 || response.status === 201) {
                        toast.success(`${test.name || test.title} added to cart!`);
                        setCartItems(response.data.cart?.items || response.data.items || []);
                        window.dispatchEvent(new Event('cartUpdated'));
                        addSuccess = true;
                        break;
                    }
                } catch (err) {
                    if (err.response?.status === 400 && err.response?.data?.message) {
                        toast.info(err.response.data.message);
                        addSuccess = true;
                        break;
                    }
                    continue;
                }
            }

            if (!addSuccess) {
                throw new Error('All cart endpoints failed');
            }

        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add item to cart. Please try again.');
        } finally {
            setCartLoading(false);
        }
    };

    const isTestInCart = (testId) => {
        return cartItems.some(item =>
            item._id === testId ||
            item.testId === testId ||
            item.id === testId
        );
    };

    const handleRemoveFromCart = async (testId) => {
        try {
            const userId = authUser?.email || localStorage.getItem('userEmail');

            if (!userId) {
                const existingItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
                const updatedItems = existingItems.filter(item =>
                    item._id !== testId && item.testId !== testId && item.id !== testId
                );
                localStorage.setItem('cartItems', JSON.stringify(updatedItems));
                setCartItems(updatedItems);
                window.dispatchEvent(new Event('cartUpdated'));
                return;
            }

            const removeEndpoints = [
                `${API_BASE_URL}/cart/remove/${userId}/${testId}`,
                `${API_BASE_URL}/user/cart/remove/${userId}/${testId}`,
                `${API_BASE_URL}/carts/remove/${userId}/${testId}`
            ];

            for (const endpoint of removeEndpoints) {
                try {
                    await axios.delete(endpoint, {
                        headers: token ? { Authorization: `Bearer ${token}` } : {}
                    });
                    break;
                } catch (err) {
                    continue;
                }
            }

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
        <div className="min-h-screen">
            <Header
                showSearch={showHeaderSearch}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filteredTests={filteredTests}
                onTestSelect={handleTestSelect}
                onAddToCart={handleAddToCart}
                isInCart={isTestInCart}
                cartLoading={cartLoading}
                searchLoading={searchLoading}
            />

            <main className="w-full max-w-none">
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
                        searchLoading={searchLoading}
                    />
                </div>

                {/* Categories without padding wrapper */}
                <Categories />

                <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
                    <WhyChoose />
                </div>

                {/* PopularTests without padding wrapper - allows full width background */}
                <PopularTests
                    onAddToCart={handleAddToCart}
                    isInCart={isTestInCart}
                    cartLoading={cartLoading}
                />

                <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
                    <ExpectFromUs />
                </div>

                <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
                    <CustomersSay />
                </div>

                <div className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
                    <TakeControl />
                </div>
            </main>

            {/* Back to Top Button */}
            {showBackToTop && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 bg-[#E23744] text-white p-3 rounded-full shadow-lg hover:bg-[#c5313d] transition-all duration-300 z-40 hover:shadow-xl"
                    aria-label="Back to top"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                    </svg>
                </motion.button>
            )}

            <Footer />
        </div>
    );
}
