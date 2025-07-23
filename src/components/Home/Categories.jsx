// import React, { useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import "@fortawesome/fontawesome-free/css/all.min.css";

// const Categories = () => {
//     const navigate = useNavigate();

//     const categories = [
//         { icon: 'fa-heartbeat', title: 'Heart Health', description: 'Comprehensive cardiac assessments', slug: 'heart-health' },
//         { icon: 'fa-brain', title: 'Neurological', description: 'Brain and nervous system tests', slug: 'neurological' },
//         { icon: 'fa-tint', title: 'Diabetes', description: 'Blood sugar and related tests', slug: 'diabetes' },
//         { icon: 'fa-venus', title: "Women's Health", description: 'Female hormones and health checks', slug: 'womens-health' },
//         { icon: 'fa-mars', title: "Men's Health", description: 'Male-specific health screenings', slug: 'mens-health' },
//         { icon: 'fa-child', title: 'Pediatric', description: 'Tests for children and adolescents', slug: 'pediatric' },
//         { icon: 'fa-shield-virus', title: 'Immunity', description: 'Immune system function tests', slug: 'immunity' },
//         { icon: 'fa-running', title: 'Fitness', description: 'Athletic performance assessments', slug: 'fitness' }
//     ];

//     const scrollContainer = useRef(null);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             if (scrollContainer.current) {
//                 scrollContainer.current.scrollBy({ left: 300, behavior: 'smooth' });
//                 if (scrollContainer.current.scrollLeft + scrollContainer.current.clientWidth >= scrollContainer.current.scrollWidth) {
//                     scrollContainer.current.scrollTo({ left: 0, behavior: 'smooth' });
//                 }
//             }
//         }, 5000);

//         return () => clearInterval(interval);
//     }, []);

//     const handleCategoryClick = (category) => {
//         navigate(`/category-tests/${category.slug}`);
//     };

//     return (
//         <section id="categories" className="py-8 md:py-16" style={{ backgroundColor: "#FAF3F0" }}>
//             <div className="container mx-auto px-4">
//                 <div className="text-center mb-8 md:mb-12">
//                     <h2 className="text-2xl md:text-3xl font-bold text-[#2D2D2D] mb-3 md:mb-4">
//                         Find the Right Test for You
//                     </h2>
//                     {/* <p className="text-xs md:text-base text-[#8A8A8A] px-2 md:px-0">
//                         Browse through our comprehensive range of health tests and packages
//                     </p> */}
//                 </div>

//                 <div
//                     ref={scrollContainer}
//                     className="flex overflow-x-auto pb-6 md:pb-8 gap-4 md:gap-6 px-2 md:px-4 hide-scrollbar"
//                     style={{ scrollBehavior: "smooth" }}
//                 >
//                     {categories.map((category, index) => (
//                         <div
//                             key={index}
//                             onClick={() => handleCategoryClick(category)}
//                             className="group flex-shrink-0 w-40 md:w-72 p-4 md:p-6 bg-white rounded-xl shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer"
//                         >
//                             <div
//                                 className="flex items-center justify-center mb-3 md:mb-5 mx-auto rounded-full transition-all duration-300 ease-in-out w-12 md:w-16 h-12 md:h-16"
//                                 style={{ backgroundColor: "#FAF3F0" }}
//                             >
//                                 <i
//                                     className={`fas ${category.icon} text-[#E23744] group-hover:text-white text-xl md:text-3xl`}
//                                     style={{ transition: "all 0.3s ease" }}
//                                 ></i>
//                             </div>
//                             <h3 className="text-sm md:text-lg font-semibold text-[#2D2D2D] mb-1 md:mb-2 text-center">
//                                 {category.title}
//                             </h3>
//                             <p className="text-xs md:text-sm text-[#8A8A8A] leading-tight md:leading-normal text-center">
//                                 {category.description}
//                             </p>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             <style jsx>{`
//                 .hide-scrollbar {
//                     -ms-overflow-style: none;
//                     scrollbar-width: none;
//                 }
//                 .hide-scrollbar::-webkit-scrollbar {
//                     display: none;
//                 }

//                 .group:hover div {
//                     background-color: #E23744 !important;
//                 }

//                 @media (max-width: 640px) {
//                     #categories .container {
//                         padding-left: 1rem;
//                         padding-right: 1rem;
//                     }
//                 }
//             `}</style>
//         </section>
//     );
// };

// export default Categories;


import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "@fortawesome/fontawesome-free/css/all.min.css";

const Categories = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollContainer = useRef(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/v1/categories");
                console.log("categories API response:", res.data);
                setCategories(res.data); // assuming res.data is an array
            } catch (err) {
                console.error("Failed to load categories", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();

        const interval = setInterval(() => {
            if (scrollContainer.current) {
                scrollContainer.current.scrollBy({ left: 300, behavior: 'smooth' });
                if (scrollContainer.current.scrollLeft + scrollContainer.current.clientWidth >= scrollContainer.current.scrollWidth) {
                    scrollContainer.current.scrollTo({ left: 0, behavior: 'smooth' });
                }
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleCategoryClick = (category) => {
        navigate(`/category-tests/${category.slug}`);
    };

    return (
        <section id="categories" className="py-8 md:py-16" style={{ backgroundColor: "#FAF3F0" }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#2D2D2D] mb-3 md:mb-4">
                        Find the Right Test for You
                    </h2>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500">Loading categories...</p>
                ) : categories.length === 0 ? (
                    <p className="text-center text-gray-500">No categories available.</p>
                ) : (
                    <div
                        ref={scrollContainer}
                        className="flex overflow-x-auto pb-6 md:pb-8 gap-4 md:gap-6 px-2 md:px-4 hide-scrollbar"
                        style={{ scrollBehavior: "smooth" }}
                    >
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                onClick={() => handleCategoryClick(category)}
                                className="group flex-shrink-0 w-40 md:w-72 p-4 md:p-6 bg-white rounded-xl shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-lg cursor-pointer"
                            >
                                <div
                                    className="flex items-center justify-center mb-3 md:mb-5 mx-auto rounded-full transition-all duration-300 ease-in-out w-12 md:w-16 h-12 md:h-16"
                                    style={{ backgroundColor: "#FAF3F0" }}
                                >
                                    <i
                                        className={`fas ${category.icon} text-[#E23744] group-hover:text-white text-xl md:text-3xl`}
                                        style={{ transition: "all 0.3s ease" }}
                                    ></i>
                                </div>
                                <h3 className="text-sm md:text-lg font-semibold text-[#2D2D2D] mb-1 md:mb-2 text-center">
                                    {category.name}
                                </h3>
                                <p className="text-xs md:text-sm text-[#8A8A8A] leading-tight md:leading-normal text-center">
                                    {category.description}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }

                .group:hover div {
                    background-color: #E23744 !important;
                }

                @media (max-width: 640px) {
                    #categories .container {
                        padding-left: 1rem;
                        padding-right: 1rem;
                    }
                }
            `}</style>
        </section>
    );
};

export default Categories;