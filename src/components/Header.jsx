// Header.jsx
import { useState, useEffect, useRef } from 'react';
import { Search, Phone, MessageCircle, Loader2 } from 'lucide-react';

const CartIcon = () => (
    <img src="/4.png" alt="Cart" className="h-10 w-10" />
);

const ProfileIcon = () => (
    <img src="/1.png" alt="Profile" className="h-10 w-10" />
);

const Header = ({
    showSearch = false,
    searchTerm = '',
    setSearchTerm = () => { },
    filteredTests = [],
    onTestSelect,
    onAddToCart,
    isInCart,
    cartLoading,
    searchLoading
}) => {
    const [scrolled, setScrolled] = useState(false);
    const [cartItems, setCartItems] = useState(0);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loadingTestId, setLoadingTestId] = useState(null);
    const searchRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const updateCartCount = () => {
            const items = JSON.parse(localStorage.getItem('cartItems')) || [];
            setCartItems(items.length);
        };

        updateCartCount();
        const handleCartUpdate = () => updateCartCount();
        window.addEventListener('cartUpdated', handleCartUpdate);

        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSuggestionClick = (test) => {
        setSearchTerm(test.name || test.title || '');
        setShowSuggestions(false);
        if (onTestSelect) {
            onTestSelect(test);
        }
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        setShowSuggestions(e.target.value.length > 0);
    };

    const handleViewDetails = (test, e) => {
        e.stopPropagation();
        if (onTestSelect) {
            onTestSelect(test);
        }
    };

    const getDiscountPercentage = (originalPrice, currentPrice) => {
        if (!originalPrice || originalPrice <= currentPrice) return 0;
        return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    };

    return (
        <header
            id="header"
            className={`fixed top-0 left-0 w-full z-50 bg-white shadow-md transition-all duration-300 ${scrolled ? 'bg-opacity-95' : ''
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-y-4 py-3 md:py-1">
                    <div className="order-1 flex-shrink-0">
                        <a href="/" className="text-2xl md:text-3xl font-black">
                            <h1>
                                <span className="text-[#E23744]">A</span>yura's
                            </h1>
                        </a>
                    </div>

                    <div className="order-3 flex items-center gap-4 flex-shrink-0">
                        <div className="relative">
                            <a
                                href="/cart"
                                className="p-2 relative md:hover:bg-gray-100 rounded-full transition-colors inline-flex"
                            >
                                <CartIcon />
                                {cartItems > 0 && (
                                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-[#E23744] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                        {cartItems}
                                    </span>
                                )}
                            </a>
                        </div>
                        <a
                            href="/profile"
                            className="p-2 md:hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ProfileIcon />
                        </a>
                    </div>

                    {showSearch && (
                        <div className="order-4 md:order-2 w-full md:flex-1 md:max-w-2xl md:mx-4 relative" ref={searchRef}>
                            <div className="flex items-center bg-white rounded-full shadow-lg px-4 py-2">
                                <Search className="text-red-500 w-5 h-5 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Search tests..."
                                    className="flex-1 border-none outline-none bg-transparent text-sm md:text-base"
                                    value={searchTerm || ''}
                                    onChange={handleInputChange}
                                    onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
                                />
                                {searchLoading && (
                                    <Loader2 className="w-4 h-4 animate-spin text-red-500 ml-2" />
                                )}
                            </div>

                            {showSuggestions && searchLoading && (
                                <div className="absolute top-full left-0 w-full bg-white rounded-lg shadow-lg mt-1 z-50">
                                    <div className="px-4 py-3 text-center">
                                        <Loader2 className="w-5 h-5 animate-spin text-red-500 mx-auto mb-1" />
                                        <div className="text-xs text-gray-500">Searching...</div>
                                    </div>
                                </div>
                            )}

                            {showSuggestions && !searchLoading && filteredTests.length > 0 && (
                                <div className="absolute top-full left-0 w-full bg-white rounded-lg shadow-lg mt-1 z-50 max-h-80 overflow-y-auto">
                                    {filteredTests.map((test, index) => {
                                        const testId = test._id || test.id;
                                        const testName = test.name || test.title;

                                        return (
                                            <div
                                                key={testId || index}
                                                className="px-4 py-3 cursor-pointer hover:bg-red-50 text-sm md:text-base border-b border-gray-100 last:border-b-0"
                                                onClick={() => handleSuggestionClick(test)}
                                            >
                                                <div className="flex justify-between items-start gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-gray-800">
                                                            {testName}
                                                        </div>
                                                        {test.category && (
                                                            <div className="text-xs text-gray-500 mt-1">{test.category}</div>
                                                        )}
                                                        <div className="flex items-center gap-2 mt-1">
                                                            {test.price && (
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-sm font-semibold text-red-500">₹{test.price}</span>
                                                                    {test.originalPrice && test.originalPrice > test.price && (
                                                                        <>
                                                                            <span className="text-xs text-gray-400 line-through">₹{test.originalPrice}</span>
                                                                            <span className="text-xs bg-green-100 text-green-700 px-1 py-0.5 rounded">
                                                                                {getDiscountPercentage(test.originalPrice, test.price)}% OFF
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={(e) => handleViewDetails(test, e)}
                                                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs transition-all whitespace-nowrap hover:bg-gray-200"
                                                    >
                                                        View
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {showSuggestions && !searchLoading && searchTerm.length > 0 && filteredTests.length === 0 && (
                                <div className="absolute top-full left-0 w-full bg-white rounded-lg shadow-lg mt-1 z-50">
                                    <div className="px-4 py-3 text-gray-500 text-center text-sm">
                                        No tests found for "{searchTerm}"
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 shadow-lg">
                        <div className="flex justify-around items-center py-3">
                            <a
                                href="tel:+917779064659"
                                className="flex flex-col items-center text-xs text-gray-600 hover:text-[#E23744] transition-colors"
                            >
                                <Phone className="w-6 h-6 mb-1" />
                                <span>Contact</span>
                            </a>
                            <a
                                href="https://wa.me/7779064659"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center text-xs text-gray-600 hover:text-green-600 transition-colors"
                            >
                                <MessageCircle className="w-6 h-6 mb-1" />
                                <span>WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="hidden md:block border-t border-gray-200">
                    <div className="flex items-center justify-end py-2 px-4 gap-4">
                        <a
                            href="tel:+917779064659"
                            className="flex items-center gap-2 text-sm hover:text-[#E23744] transition-colors"
                        >
                            <Phone className="w-4 h-4 text-[#E23744]" />
                            <span>+91 7779064659</span>
                        </a>
                        <a
                            href="https://wa.me/7779064659"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm hover:text-green-600 transition-colors"
                        >
                            <MessageCircle className="w-4 h-4 text-green-500" />
                            <span>WhatsApp Support</span>
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;