// Footer.jsx
import { useState, useEffect } from 'react';
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaWhatsapp,
    FaArrowUp
} from 'react-icons/fa';

const Footer = () => {
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 500) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const openWhatsAppSupport = (e) => {
        e.preventDefault();
        const phoneNumber = "7779064659";
        const message = "Hi! I'd like to know more about Ayura's healthcare services.";
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <>
            {/* Footer Section */}
            <footer className="bg-[#292929] text-white py-20 pt-[80px] pb-[30px]">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                        {/* Footer Logo */}
                        <div>
                            <h2 className="text-3xl font-bold mb-2">
                                <span className="text-red-500">A</span>yura
                            </h2>
                            <p className="text-gray-400 mb-5">Your Healthcare Partner</p>
                            <div className="flex gap-4">
                                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-500 hover:-translate-y-1 transition-all duration-300">
                                    <FaFacebookF />
                                </a>
                                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-500 hover:-translate-y-1 transition-all duration-300">
                                    <FaTwitter />
                                </a>
                                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-500 hover:-translate-y-1 transition-all duration-300">
                                    <FaInstagram />
                                </a>
                                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-500 hover:-translate-y-1 transition-all duration-300">
                                    <FaLinkedinIn />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-300 hover:text-red-500 hover:pl-1 transition-all duration-300">Home</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-red-500 hover:pl-1 transition-all duration-300">Tests & Packages</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-red-500 hover:pl-1 transition-all duration-300">Health Blog</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-red-500 hover:pl-1 transition-all duration-300">About Us</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-red-500 hover:pl-1 transition-all duration-300">Contact Us</a></li>
                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <h3 className="text-xl font-semibold mb-6">Services</h3>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-300 hover:text-red-500 hover:pl-1 transition-all duration-300">Lab Tests</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-red-500 hover:pl-1 transition-all duration-300">Health Packages</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-red-500 hover:pl-1 transition-all duration-300">Home Collection</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-red-500 hover:pl-1 transition-all duration-300">Corporate Wellness</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-red-500 hover:pl-1 transition-all duration-300">Online Reports</a></li>
                            </ul>
                        </div>
                        {/* support */}
                        <div>
                            <h3 className="text-xl font-semibold mb-6">Support</h3>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-300 hover:text-red-500 hover:pl-1 transition-all duration-300">Help Center</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-red-500 hover:pl-1 transition-all duration-300">Terms & Condition</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-red-500 hover:pl-1 transition-all duration-300">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-red-500 hover:pl-1 transition-all duration-300">Refund Policy</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-red-500 hover:pl-1 transition-all duration-300">Careers</a></li>
                            </ul>
                        </div>

                        {/* Contact Us */}
                        <div>
                            <h3 className="text-xl font-semibold mb-6">Contact Us</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <FaMapMarkerAlt className="text-red-500 mr-3 mt-1" />
                                    <span className="text-gray-300">123 Health Avenue, Mumbai, India</span>
                                </li>
                                <li className="flex items-start">
                                    <FaPhoneAlt className="text-red-500 mr-3 mt-1" />
                                    <span className="text-gray-300">+91 9876543210</span>
                                </li>
                                <li className="flex items-start">
                                    <FaEnvelope className="text-red-500 mr-3 mt-1" />
                                    <span className="text-gray-300">info@ayura.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400">&copy; 2025 Ayura Healthcare. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="text-gray-300 hover:text-red-500 transition-colors duration-300">Terms & Conditions</a>
                            <a href="#" className="text-gray-300 hover:text-red-500 transition-colors duration-300">Privacy Policy</a>
                            <a href="#" className="text-gray-300 hover:text-red-500 transition-colors duration-300">Sitemap</a>
                        </div>
                    </div>
                </div>
            </footer>


            {/* Back to Top Button */}
            {/* <div
                className={`fixed bottom-18 left-8 w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-red-600 hover:-translate-y-1 transition-all duration-300 z-50 ${showBackToTop ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={scrollToTop}
            >
                <FaArrowUp />
            </div> */}
        </>
    );
};

export default Footer;