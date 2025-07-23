import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import HeroSection from './Home/HeroSection';
import Categories from './Home/Categories';
import PopularTests from './Home/PopularTests';
import WhyChoose from './Home/WhyChoose';
import ExpectFromUs from './Home/ExpectFromUs';
import CustomersSay from './Home/CustomersSay';
import TakeControl from './Home/TakeControl';
import Footer from './Footer';

const testsList = [
    "Complete Blood Count (CBC)",
    "Diabetes Profile",
    "Thyroid Function Test",
    "Lipid Profile",
    "Liver Function Test",
    "Kidney Function Test",
    "Vitamin D Test",
    "Iron Studies",
    "Hemoglobin A1c",
    "Urine Routine Analysis",
    "HIV Screening",
    "Hepatitis B Surface Antigen",
    "Hepatitis C Antibody",
    "PSA (Prostate Specific Antigen)",
    "Dengue NS1 Antigen",
    "Malaria Parasite Test",
    "Thyroid Stimulating Hormone (TSH)",
    "Free T3 and Free T4",
    "Complete Urine Examination",
    "Stool Routine Examination"
];

export default function Home() {
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [showHeaderSearch, setShowHeaderSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTests, setFilteredTests] = useState([]);
    const heroRef = useRef(null);

    // Search functionality
    useEffect(() => {
        if (!searchTerm || searchTerm.trim().length < 2) {
            setFilteredTests([]);
            return;
        }

        const filtered = testsList.filter(test =>
            test.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTests(filtered);
    }, [searchTerm]);

    // Intersection Observer for hero section
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowHeaderSearch(!entry.isIntersecting);
            },
            { threshold: 0.1, rootMargin: '-100px 0px 0px 0px' }
        );

        if (heroRef.current) {
            observer.observe(heroRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Back to top scroll handler
    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <Header
                showSearch={showHeaderSearch}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filteredTests={filteredTests}
            />

            <main>
                <div ref={heroRef}>
                    <HeroSection
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        filteredTests={filteredTests}
                    />
                </div>
                <Categories />
                <WhyChoose />
                <PopularTests />
                <ExpectFromUs />
                <CustomersSay />
                <TakeControl />
            </main>

            {showBackToTop && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 bg-[#E23744] text-white p-3 rounded-full shadow-lg hover:bg-[#c5313d] transition-colors z-40"
                    aria-label="Back to top"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </motion.button>
            )}

            <Footer />
        </>
    );
}