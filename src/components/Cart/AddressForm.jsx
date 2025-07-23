import React from 'react';
import { FaMapMarker, FaClock } from 'react-icons/fa';

const AddressForm = ({ patientInfo, onInputChange, onBack, onNext }) => {
    return (
        <div className="space-y-6">
            {/* Full Address */}
            <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                    Full Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <FaMapMarker className="absolute left-3 top-4 text-gray-400" />
                    <textarea
                        name="address"
                        value={patientInfo.address}
                        onChange={onInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E23744] focus:border-[#E23744]"
                        rows="4"
                        placeholder="Enter full address with landmark"
                        required
                    />
                </div>
            </div>

            {/* City */}
            <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                    City <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <FaMapMarker className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        name="city"
                        value={patientInfo.city || ''}
                        onChange={onInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E23744] focus:border-[#E23744]"
                        placeholder="City"
                        required
                    />
                </div>
            </div>

            {/* State and Pincode */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                        State <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="state"
                        value={patientInfo.state || ''}
                        onChange={onInputChange}
                        className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E23744] focus:border-[#E23744]"
                        placeholder="State"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                        PIN Code <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="pincode"
                        value={patientInfo.pincode || ''}
                        onChange={onInputChange}
                        className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E23744] focus:border-[#E23744]"
                        placeholder="PIN Code"
                        maxLength="6"
                        pattern="[0-9]{6}"
                        required
                    />
                </div>
            </div>

            {/* Time Slot Selection */}
            <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                    Preferred Time Slot <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                        name="timeSlot"
                        value={patientInfo.timeSlot}
                        onChange={onInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E23744] focus:border-[#E23744]"
                        required
                    >
                        <option value="">Select Time Slot</option>
                        <option value="8:00 AM – 10:00 AM">8:00 AM – 10:00 AM</option>
                        <option value="10:00 AM – 12:00 PM">10:00 AM – 12:00 PM</option>
                        <option value="12:00 PM – 2:00 PM">12:00 PM – 2:00 PM</option>
                        <option value="2:00 PM – 4:00 PM">2:00 PM – 4:00 PM</option>
                        <option value="4:00 PM – 6:00 PM">4:00 PM – 6:00 PM</option>
                    </select>
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

export default AddressForm;
