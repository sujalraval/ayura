import React from 'react';
import {
    FaUser, FaEnvelope, FaPhone, FaCalendar, FaVenusMars,
    FaUserFriends, FaChevronDown
} from 'react-icons/fa';

const PatientInfoForm = ({ patientInfo, onInputChange, setGender, onBack, onNext }) => {
    return (
        <div className="space-y-6">
            {/* Name */}
            <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        name="name"
                        value={patientInfo.name}
                        onChange={onInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E23744] focus:border-[#E23744]"
                        placeholder="Enter full name"
                        required
                    />
                </div>
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                    Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="email"
                        name="email"
                        value={patientInfo.email}
                        onChange={onInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E23744] focus:border-[#E23744]"
                        placeholder="Enter email address"
                        required
                    />
                </div>
            </div>

            {/* Phone */}
            <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="tel"
                        name="phone"
                        value={patientInfo.phone}
                        onChange={onInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E23744] focus:border-[#E23744]"
                        placeholder="Enter 10-digit mobile number"
                        maxLength="10"
                        pattern="[0-9]{10}"
                        required
                    />
                </div>
            </div>

            {/* DOB */}
            <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                    Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="date"
                        name="dob"
                        value={patientInfo.dob}
                        onChange={onInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E23744] focus:border-[#E23744]"
                        max={new Date().toISOString().split('T')[0]}
                        required
                    />
                </div>
            </div>

            {/* Relation */}
            <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                    Relationship <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <FaUserFriends className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                        name="relation"
                        value={patientInfo.relation}
                        onChange={onInputChange}
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E23744] focus:border-[#E23744] bg-white"
                        required
                    >
                        <option value="">Select Relationship</option>
                        <option value="self">Self</option>
                        <option value="child">Child</option>
                        <option value="spouse">Spouse</option>
                        <option value="parent">Parent</option>
                        <option value="sibling">Sibling</option>
                        <option value="other">Other</option>
                    </select>
                    <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Gender */}
            <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                    Gender <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {['Male', 'Female', 'Other'].map((g) => (
                        <button
                            key={g}
                            type="button"
                            onClick={() => setGender(g)}
                            className={`p-3 rounded-lg flex items-center justify-center space-x-2 transition-all
                ${patientInfo.gender === g
                                    ? 'bg-[#E23744] text-white border-2 border-[#E23744]'
                                    : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-[#E23744]/40'}`}
                        >
                            <FaVenusMars />
                            <span className="capitalize">{g}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-8">
                <button
                    type="button"
                    onClick={onBack}
                    className="w-1/2 border-2 border-[#E23744] text-[#E23744] py-3 px-6 rounded-lg font-semibold hover:bg-[#E23744]/10"
                >
                    Back
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    className="w-1/2 bg-gradient-to-r from-[#FF7A7A] to-[#E23744] text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default PatientInfoForm;
