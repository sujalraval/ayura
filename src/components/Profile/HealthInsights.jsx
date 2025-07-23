import { useEffect, useState } from 'react';

function HealthInsights({ lastCheckupDate }) {
    const [monthsSinceCheckup, setMonthsSinceCheckup] = useState(0);

    useEffect(() => {
        if (lastCheckupDate) {
            const calculateMonths = () => {
                const lastCheckup = new Date(lastCheckupDate);
                const now = new Date();
                const diffMonths = (now.getFullYear() - lastCheckup.getFullYear()) * 12 +
                    (now.getMonth() - lastCheckup.getMonth());
                setMonthsSinceCheckup(diffMonths);
            };

            calculateMonths();
        }
    }, [lastCheckupDate]);

    return (
        <section className="bg-white rounded-2xl p-4 md:p-8 shadow-lg mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">Health Insights</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 pb-3 gap-4 md:gap-6">
                {/* Vitamin D Insight Card */}
                {/* <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
                    <div className="w-12 h-12 md:w-14 md:h-14 mb-3 md:mb-4 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="text-red-500 w-8 h-8 md:w-10 md:h-10" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                className="fill-none stroke-current stroke-2"
                                strokeLinecap="round"
                            />
                            <path
                                d="M50 25v50M25 50h50"
                                className="stroke-current stroke-2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 md:mb-2">Vitamin D Levels</h3>
                    <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                        Your recent test shows vitamin D deficiency. Consider increasing sun exposure and supplementation.
                    </p>
                    <div className="space-y-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-red-500 h-2 rounded-full"
                                style={{ width: '65%' }}
                            />
                        </div>
                        <span className="text-xs md:text-sm text-gray-500">65% of optimal level</span>
                    </div>
                </div> */}

                {/* Checkup Insight Card */}
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
                    <div className="w-12 h-12 md:w-14 md:h-14 mb-3 md:mb-4 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="text-red-500 w-8 h-8 md:w-10 md:h-10" viewBox="0 0 100 100">
                            <path
                                d="M20 50c0-16.6 13.4-30 30-30s30 13.4 30 30"
                                className="fill-none stroke-current stroke-2"
                                strokeLinecap="round"
                            />
                            <circle cx="50" cy="50" r="5" className="fill-current" />
                        </svg>
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 md:mb-2">
                        Last Health Checkup
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                        {lastCheckupDate
                            ? `It's been ${monthsSinceCheckup} months since your last checkup.`
                            : "No checkup records found."}
                    </p>
                    {monthsSinceCheckup >= 6 && (
                        <button className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors">
                            Schedule Checkup
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}

export default HealthInsights;



