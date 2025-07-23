import { useState, useEffect, useRef } from 'react';
import { Search, Phone, MessageCircle } from 'lucide-react';

// SVG Components
const CartIcon = () => (
    <img src="/4.svg" alt="Cart" className="h-10 w-10" />
);

const ProfileIcon = () => (
    <img src="/1.svg" alt="Profile" className="h-10 w-10" />
);

const Header = ({ showSearch = false, searchTerm = '', setSearchTerm = () => { }, filteredTests = [] }) => {
    // State management
    const [scrolled, setScrolled] = useState(false);
    const [cartItems, setCartItems] = useState(0);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);

    // Scroll handler
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Cart items handler
    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(items.length);
    }, []);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Suggestion click handler
    const handleSuggestionClick = (test) => {
        setSearchTerm(test);
        setShowSuggestions(false);
    };

    return (
        <header
            id="header"
            className={`fixed top-0 left-0 w-full z-50 bg-white shadow-md transition-all duration-300 ${scrolled ? 'bg-opacity-95' : ''}`}
        >
            <div className="container mx-auto px-4">
                {/* Main Header Content */}
                <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-y-4 py-3 md:py-1">
                    {/* Logo */}
                    <div className="order-1 flex-shrink-0">
                        <a
                            href="/"
                            className="text-2xl md:text-3xl font-black"
                        >
                            <h1>
                                <span className="text-[#E23744]">A</span>yura's
                            </h1>
                        </a>
                    </div>

                    {/* Navigation Icons (Cart + Profile) */}
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

                    {/* Search Bar */}
                    {showSearch && (
                        <div className="order-4 md:order-2 w-full md:flex-1 md:max-w-2xl md:mx-4 relative" ref={searchRef}>
                            <div className="flex items-center bg-white rounded-full shadow-lg px-4 py-2">
                                <Search className="text-red-500 w-5 h-5 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Search tests..."
                                    className="flex-1 border-none outline-none bg-transparent text-sm md:text-base"
                                    value={searchTerm || ''}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onFocus={() => setShowSuggestions(true)}
                                />
                            </div>

                            {showSuggestions && filteredTests.length > 0 && (
                                <div className="absolute top-full left-0 w-full bg-white rounded-lg shadow-lg mt-1 z-50 max-h-60 overflow-y-auto">
                                    {filteredTests.map((test, index) => (
                                        <div
                                            key={index}
                                            className="px-4 py-2 cursor-pointer hover:bg-red-50 text-sm md:text-base"
                                            onClick={() => handleSuggestionClick(test)}
                                        >
                                            {test}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Mobile Contact Icons */}
                    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 shadow-lg">
                        <div className="flex justify-around items-center py-3">
                            <a
                                href="tel:+7779064659"
                                className="flex flex-col items-center text-xs text-gray-600 hover:text-[#E23744] transition-colors"
                            >
                                <Phone className="w-6 h-6 mb-1" />
                                <span>Contact</span>
                            </a>
                            <a
                                href="https://wa.me/1234567890"
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

                {/* Desktop Contact Information Bar */}
                <div className="hidden md:block border-t border-gray-200">
                    <div className="flex items-center justify-end py-2 px-4 gap-4">
                        <a
                            href="tel:+1234567890"
                            className="flex items-center gap-2 text-sm hover:text-[#E23744] transition-colors"
                        >
                            <Phone className="w-4 h-4 text-[#E23744]" />
                            <span>+1 (234) 567-890</span>
                        </a>
                        <a
                            href="https://wa.me/1234567890"
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