import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WhyChoose = () => {
    const [whyChooseItems, setWhyChooseItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWhyChooseItems = async () => {
            try {
                const response = await axios.get('/api/v1/why-choose/');
                const items = Array.isArray(response.data)
                    ? response.data
                    : response.data.data || response.data.items || [];
                setWhyChooseItems(items);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to load features');
                setLoading(false);
            }
        };

        fetchWhyChooseItems();
    }, []);

    if (loading) {
        return (
            <section id="why-choose" className="py-12 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <p>Loading...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="why-choose" className="py-12 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-red-500">{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section id="why-choose" className="py-12 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Title */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#2D2D2D] mb-3">
                        Why Choose Us?
                    </h2>
                </div>

                {/* Features Container */}
                <div
                    className="flex md:grid overflow-x-auto md:overflow-visible pb-4 flex-nowrap md:grid-cols-2 lg:grid-cols-4 md:gap-5 space-x-3 md:space-x-0 px-3 md:px-0 scrollbar-hide"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    {/* WebKit scrollbar hide */}
                    <style>{`
                        .scrollbar-hide::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>

                    {whyChooseItems.map((item) => (
                        <div
                            key={item._id}
                            className="flex-shrink-0 w-[55vw] md:w-full bg-white rounded-lg p-3 md:p-6 shadow-md md:transition-all md:duration-300 md:ease-in-out md:hover:-translate-y-2 md:hover:shadow-lg"
                        >
                            <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-2 md:mb-4 text-xl md:text-3xl text-[#E23744] bg-[#FAF3F0] rounded-full">
                                <i className={`fas ${item.icon}`}></i>
                            </div>
                            <h3 className="text-sm md:text-lg font-semibold text-[#2D2D2D] mb-1 md:mb-2">
                                {item.title}
                            </h3>
                            <p className="text-xs text-[#8A8A8A] leading-tight">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChoose;
