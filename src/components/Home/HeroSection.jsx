"use client"

import { useEffect, useRef, useState } from "react"
import { Search, Eye, Plus, Check, Loader2 } from "lucide-react"

export default function HeroSection({
    searchTerm,
    setSearchTerm,
    filteredTests,
    onTestSelect,
    onAddToCart,
    onRemoveFromCart,
    isInCart,
    cartLoading,
    searchLoading
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
        setSearchTerm(test.name || test.title || '')
        setShowSuggestions(false)
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
        const testId = test._id || test.id
        if (cartLoading || loadingTestId === testId) return

        setLoadingTestId(testId)

        try {
            if (isInCart && isInCart(testId)) {
                if (onRemoveFromCart) {
                    await onRemoveFromCart(testId)
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
        <section id="home" className="relative pt-20 pb-20 md:pt-32 md:pb-32 bg-gradient-to-br from-red-50 to-white overflow-hidden">
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
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                    {/* Left Content - 40% on large screens */}
                    <div className="w-full lg:w-2/5 text-center lg:text-left order-2 lg:order-1">
                        {/* Main Heading */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 lg:mb-6 leading-tight">
                            Looking for a test?
                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 mb-8 lg:mb-10">
                            Find the right health test for you with our comprehensive search
                        </p>

                        {/* Search Bar */}
                        <div className="mb-8 relative" ref={searchRef}>
                            <div className="flex items-center bg-white rounded-full shadow-lg px-5 py-4 w-full max-w-2xl mx-auto lg:mx-0 relative border border-gray-200">
                                <Search className="text-red-500 w-5 h-5 mr-4 flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Search Tests"
                                    className="flex-1 border-none outline-none bg-transparent text-base placeholder-gray-500"
                                    value={searchTerm}
                                    onChange={handleInputChange}
                                    onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
                                />
                                {searchLoading && (
                                    <Loader2 className="w-5 h-5 animate-spin text-red-500 ml-2 flex-shrink-0" />
                                )}
                            </div>

                            {/* Search Loading State */}
                            {showSuggestions && searchLoading && (
                                <div className="absolute top-full left-0 w-full bg-white rounded-lg shadow-xl mt-2 z-50 border border-gray-200">
                                    <div className="px-5 py-4 text-center">
                                        <Loader2 className="w-6 h-6 animate-spin text-red-500 mx-auto mb-2" />
                                        <div className="text-sm text-gray-500">Searching...</div>
                                    </div>
                                </div>
                            )}

                            {/* Search Suggestions */}
                            {showSuggestions && !searchLoading && filteredTests.length > 0 && (
                                <div className="absolute top-full left-0 w-full bg-white rounded-lg shadow-xl mt-2 z-50 max-h-80 overflow-y-auto border border-gray-200">
                                    {filteredTests.map((test, index) => {
                                        const testId = test._id || test.id
                                        const testName = test.name || test.title
                                        const isLoading = loadingTestId === testId
                                        const inCart = isInCart && isInCart(testId)

                                        return (
                                            <div
                                                key={testId || index}
                                                className="px-4 py-4 cursor-pointer hover:bg-red-50 transition-all duration-200 border-b border-gray-100 last:border-b-0"
                                            >
                                                <div className="flex justify-between items-center gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div
                                                            className="font-semibold text-gray-800 text-left mb-1 hover:text-red-600 transition-colors cursor-pointer"
                                                            onClick={() => handleSuggestionClick(test)}
                                                        >
                                                            {testName}
                                                        </div>

                                                        {test.price && (
                                                            <div className="flex items-center gap-2 text-left">
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
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={(e) => handleViewDetails(test, e)}
                                                            className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            View
                                                        </button>

                                                        <button
                                                            onClick={(e) => handleAddToCart(test, e)}
                                                            disabled={isLoading}
                                                            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-all ${inCart
                                                                ? 'bg-green-500 text-white hover:bg-green-600'
                                                                : 'bg-red-500 text-white hover:bg-red-600'
                                                                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        >
                                                            {isLoading ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : inCart ? (
                                                                <Check className="w-4 h-4" />
                                                            ) : (
                                                                <Plus className="w-4 h-4" />
                                                            )}
                                                            {inCart ? 'Added' : 'Add'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                            {/* No Results */}
                            {showSuggestions && !searchLoading && searchTerm.length > 0 && filteredTests.length === 0 && (
                                <div className="absolute top-full left-0 w-full bg-white rounded-lg shadow-lg mt-2 z-50 border border-gray-200">
                                    <div className="px-5 py-4 text-gray-500 text-center">
                                        <div className="text-sm">No tests found for "{searchTerm}"</div>
                                        <div className="text-xs mt-1">Try searching with different keywords</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button className="px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg">
                                Select Health Package
                            </button>
                            <button className="px-8 py-3 bg-white text-red-600 border-2 border-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors">
                                Create Your Own Package
                            </button>
                        </div>
                    </div>

                    {/* Right Image - 60% on large screens with much smaller height */}
                    <div className="w-full lg:w-3/5 order-1 lg:order-2">
                        <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-[280px] xl:h-[320px]">
                            <img
                                src="/herosectionImage.jpg"
                                alt="Healthcare Professional"
                                className="w-full h-full object-cover rounded-3xl shadow-2xl"
                                loading="eager"
                            />
                            {/* Subtle overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent rounded-3xl"></div>
                        </div>
                    </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-16  border-gray-200">
                    <div className="flex flex-wrap justify-center lg:justify-start gap-8 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span>Trusted by 70+ Lakhs Patients</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Family-like Care</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span>India's Most Loved Diagnostics Lab</span>
                        </div>
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
