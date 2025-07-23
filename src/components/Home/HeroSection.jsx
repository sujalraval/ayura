"use client"

import { useEffect, useRef, useState } from "react"
import { Search } from "lucide-react"

export default function HeroSection({ searchTerm, setSearchTerm, filteredTests }) {
    const [showSuggestions, setShowSuggestions] = useState(false)
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
        setSearchTerm(test)
        setShowSuggestions(false)
    }

    return (
        <section id="home" className="relative pt-36 pb-32 md:pb-48 bg-white">
            {/* Keep all your existing styles and animations */}
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
                        {/* Keep your existing message animation */}
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
                            </div>                        </div>
                    </div>

                    <div className="mb-10 relative" ref={searchRef}>
                        <div className="flex items-center bg-white rounded-full shadow-lg px-5 py-3 max-w-xl mx-auto relative">
                            <Search className="text-red-500 w-5 h-5 mr-3" />
                            <input
                                type="text"
                                placeholder="Search for tests or health packages..."
                                className="flex-1 border-none outline-none bg-transparent text-base z-50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setShowSuggestions(true)}
                            />

                            {showSuggestions && (
                                <div className="absolute top-full left-0 w-full bg-white rounded-b-lg shadow-lg mt-1 z-50 max-h-60 overflow-y-auto">
                                    {filteredTests.map((test, index) => (
                                        <div
                                            key={index}
                                            className="px-5 py-3 cursor-pointer hover:bg-red-50 transition-colors"
                                            onClick={() => handleSuggestionClick(test)}
                                        >
                                            {test}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Keep your existing SVG wave */}
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

