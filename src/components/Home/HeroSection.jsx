"use client"

import { useEffect, useRef, useState } from "react"
import { Search, ShoppingCart, Eye, Plus, Check } from "lucide-react"

export default function HeroSection({
    searchTerm,
    setSearchTerm,
    filteredTests,
    onTestSelect,
    onAddToCart,
    onRemoveFromCart,
    isInCart,
    cartLoading
}) {
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [loadingTestId, setLoadingTestId] = useState(null)
    const searchRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSuggestionClick = (test) => {
        if (onTestSelect) {
            onTestSelect(test)
        }
    }

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value)
        setShowSuggestions(e.target.value.length > 0)
    }

    const handleAddToCart = async (test, e) => {
        e.stopPropagation()
        if (cartLoading || loadingTestId === test._id) return

        setLoadingTestId(test._id)

        try {
            if (isInCart && isInCart(test._id)) {
                if (onRemoveFromCart) {
                    await onRemoveFromCart(test._id)
                }
            } else {
                if (onAddToCart) {
                    await onAddToCart(test)
                }
            }
        } catch (error) {
            console.error('Cart action error:', error)
        } finally {
            setLoadingTestId(null)
        }
    }

    const handleViewDetails = (test, e) => {
        e.stopPropagation()
        if (onTestSelect) {
            onTestSelect(test)
        }
    }

    const getDiscountPercentage = (originalPrice, currentPrice) => {
        if (!originalPrice || originalPrice <= currentPrice) return 0
        return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    }

    return (
        <section id="home" className="relative pt-36 pb-32 md:pb-48 bg-white">
            <style>{`
                @keyframes slideMessages {
                    0%, 19% { transform: translateY(0); }
                    20%, 39% { transform: translateY(-64px); }
                    40%, 59% { transform: translateY(-128px); }
                    60%, 79% { transform: translateY(-192px); }
                    80%, 99% { transform: translateY(-256px); }
                    100% { transform: translateY(-320px); }
                }
                .animate-slide-messages {
                    animation: slideMessages 25s infinite linear;
                }
            `}</style>

            <div className="container mx-auto px-4 max-w-6xl relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                    <div className="h-16 overflow-hidden mb-8">
                        <div className="animate-slide-messages">
                            <div className="h-16 flex items-center justify-center text-2xl font-bold text-red-500">
                                Looking for the right test? Start here!
                            </div>
                            <div className="h-16 flex items-center justify-center text-2xl font-bold text-red-500">
                                Your health matters. Because you matter!
                            </div>
                            <div className="h-16 flex items-center justify-center text-2xl font-bold text-red-500">
                                We care for you, every step of the way!
                            </div>
                            <div className="h-16 flex items-center justify-center text-2xl font-bold text-red-500">
                                Your well-being comes first - Always!
                            </div>
                            <div className="h-16 flex items-center justify-center text-2xl font-bold text-red-500">
                                Health - Care - Trust. We're always with you.
                            </div>
                        </div>
                    </div>

                    <div className="mb-10 relative" ref={searchRef}>
                        <div className="flex items-center bg-white rounded-full shadow-lg px-5 py-3 max-w-xl mx-auto relative">
                            <Search className="text-red-500 w-5 h-5 mr-3" />
                            <input
                                type="text"
                                placeholder="Search for tests or health packages..."
                                className="flex-1 border-none outline-none bg-transparent text-base"
                                value={searchTerm}
                                onChange={handleInputChange}
                                onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
                            />
                        </div>

                        {showSuggestions && filteredTests.length > 0 && (
                            <div className="absolute top-full left-0 w-full bg-white rounded-b-lg shadow-xl mt-1 z-50 max-h-80 overflow-y-auto border border-gray-200">
                                {filteredTests.map((test, index) => (
                                    <div
                                        key={test._id || index}
                                        className="px-4 py-4 cursor-pointer hover:bg-red-50 transition-all duration-200 border-b border-gray-100 last:border-b-0"
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div
                                                    className="font-semibold text-gray-800 text-left mb-1 hover:text-red-600 transition-colors cursor-pointer"
                                                    onClick={() => handleSuggestionClick(test)}
                                                >
                                                    {test.name}
                                                </div>

                                                {test.alias && (
                                                    <div className="text-xs text-gray-500 mb-1 text-left">
                                                        Also known as: {test.alias}
                                                    </div>
                                                )}

                                                {test.category && (
                                                    <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full inline-block mb-2">
                                                        {test.category}
                                                    </div>
                                                )}

                                                {test.description && (
                                                    <div className="text-xs text-gray-600 text-left mb-2 line-clamp-2">
                                                        {test.description.length > 100
                                                            ? `${test.description.substring(0, 100)}...`
                                                            : test.description
                                                        }
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-2 text-left">
                                                    {test.price && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg font-bold text-red-600">
                                                                ₹{test.price}
                                                            </span>
                                                            {test.originalPrice && test.originalPrice > test.price && (
                                                                <>
                                                                    <span className="text-sm text-gray-500 line-through">
                                                                        ₹{test.originalPrice}
                                                                    </span>
                                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                                        {getDiscountPercentage(test.originalPrice, test.price)}% OFF
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}

                                                    {test.duration && (
                                                        <span className="text-xs text-gray-500">
                                                            • Report in {test.duration}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 ml-4">
                                                <button
                                                    onClick={(e) => handleViewDetails(test, e)}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-full text-xs hover:bg-blue-600 transition-colors whitespace-nowrap"
                                                >
                                                    <Eye className="w-3 h-3" />
                                                    View Details
                                                </button>

                                                <button
                                                    onClick={(e) => handleAddToCart(test, e)}
                                                    disabled={loadingTestId === test._id}
                                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${isInCart && isInCart(test._id)
                                                            ? 'bg-green-500 text-white hover:bg-green-600'
                                                            : 'bg-red-500 text-white hover:bg-red-600'
                                                        } ${loadingTestId === test._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {loadingTestId === test._id ? (
                                                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                                                    ) : isInCart && isInCart(test._id) ? (
                                                        <Check className="w-3 h-3" />
                                                    ) : (
                                                        <Plus className="w-3 h-3" />
                                                    )}
                                                    {isInCart && isInCart(test._id) ? 'Added' : 'Add to Cart'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {showSuggestions && searchTerm.length > 0 && filteredTests.length === 0 && (
                            <div className="absolute top-full left-0 w-full bg-white rounded-b-lg shadow-lg mt-1 z-50 border border-gray-200">
                                <div className="px-5 py-4 text-gray-500 text-center">
                                    <div className="text-sm">No tests found for "{searchTerm}"</div>
                                    <div className="text-xs mt-1">Try searching with different keywords</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full leading-0 z-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path
                        fill="#FAF3F0"
                        fillOpacity="1"
                        d="M0,192L48,192C96,192,192,192,288,186.7C384,181,480,171,576,186.7C672,203,768,245,864,245.3C960,245,1056,203,1152,186.7C1248,171,1344,181,1392,186.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                    ></path>
                </svg>
            </div>
        </section>
    )
}
