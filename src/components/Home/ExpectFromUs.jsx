import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaArrowRight } from 'react-icons/fa';

const ExpectFromUs = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExpectations = async () => {
            try {
                setLoading(true);
                const res = await axios.get('https://ayuras.life/api/v1/expectations');

                // Check if response has data and it's an array
                if (res.data && res.data.success && Array.isArray(res.data.data)) {
                    setServices(res.data.data);
                } else {
                    setServices([]);
                    console.warn('Unexpected API response format:', res.data);
                }
            } catch (err) {
                console.error('Failed to fetch expectations:', err);
                setError('Failed to load services. Please try again later.');
                setServices([]);
            } finally {
                setLoading(false);
            }
        };

        fetchExpectations();
    }, []);

    if (loading) {
        return (
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <p>Loading services...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-red-500">{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        What You Can Expect From Us
                    </h2>
                </div>

                {services.length > 0 ? (
                    <div className="flex md:grid overflow-x-auto md:overflow-visible flex-nowrap md:grid-cols-2 lg:grid-cols-3 gap-8 pb-4 scrollbar-hide">
                        {services.map((service, index) => (
                            <div
                                key={service._id || index}
                                className="flex-shrink-0 w-[85vw] md:w-full bg-white rounded-xl shadow-lg mx-2 md:mx-0"
                            >
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={service.image || '/placeholder-image.jpg'}
                                        alt={service.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/placeholder-image.jpg';
                                        }}
                                    />
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {service.description}
                                    </p>
                                    <a
                                        href="#"
                                        className="inline-flex items-center text-red-600 font-medium hover:text-red-700 transition-colors"
                                    >
                                        Learn More
                                        <FaArrowRight className="ml-2" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p>No services available at the moment.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ExpectFromUs;