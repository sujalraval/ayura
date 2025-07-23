import React, { useState, useEffect } from "react";
import axios from "axios";

function CustomersSay() {
    const [testimonials, setTestimonials] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await axios.get('/api/v1/testimonials');
                setTestimonials(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching testimonials:", err);
                setError("Unable to load testimonials.");
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    const prevTestimonial = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
        );
    };

    const nextTestimonial = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
    };

    if (loading) return <div className="text-center py-10">Loading testimonials...</div>;
    if (error || testimonials.length === 0) return <div className="text-center py-10 text-red-500">{error || "No testimonials available."}</div>;

    const current = testimonials[currentIndex];

    return (
        <section className="bg-gray-100 py-10">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl font-bold text-gray-800">What Our Customers Say</h2>
            </div>

            <div className="relative max-w-xl mx-auto mt-8 overflow-hidden">
                <div className="p-6 bg-white rounded-xl shadow-md text-center">
                    <div className="flex justify-center mb-3">
                        {Array.from({ length: 5 }, (_, index) => (
                            <i
                                key={index}
                                className={`fas fa-star ${index < Math.floor(current.rating) ? "text-yellow-400" : "text-gray-300"}`}
                            ></i>
                        ))}
                    </div>

                    <p className="italic text-gray-700">{current.comment}</p>

                    <div className="flex items-center justify-center mt-4">
                        <img
                            src={current.image}
                            alt={current.name}
                            className="w-12 h-12 rounded-full object-cover border border-gray-300"
                        />
                        <div className="ml-3 text-left">
                            <h4 className="font-semibold">{current.name}</h4>
                            <p className="text-sm text-gray-500">{current.location}</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center items-center mt-4 gap-4">
                    <button
                        onClick={prevTestimonial}
                        className="p-3 rounded-full  text-gray-700 transition-all hover:scale-110"
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <button
                        onClick={nextTestimonial}
                        className="p-3 rounded-full text-gray-700 transition-all hover:scale-110"
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </section>
    );
}

export default CustomersSay;
