import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaArrowRight } from 'react-icons/fa';

const ExpectFromUs = () => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchExpectations = async () => {
            try {
                const res = await axios.get('https://ayuras.life/api/v1/expectations');
                setServices(res.data);
            } catch (err) {
                console.error('Failed to fetch expectations:', err);
            }
        };

        fetchExpectations();
    }, []);

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        What You Can Expect From Us
                    </h2>
                </div>

                <div className="flex md:grid overflow-x-auto md:overflow-visible flex-nowrap md:grid-cols-2 lg:grid-cols-3 gap-8 pb-4 scrollbar-hide">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-[85vw] md:w-full bg-white rounded-xl shadow-lg mx-2 md:mx-0"
                        >
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={`/uploads/expectations/${service.image}`}
                                    alt={service.title}
                                    className="w-full h-full object-cover"
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
            </div>
        </section>
    );
};

export default ExpectFromUs;
