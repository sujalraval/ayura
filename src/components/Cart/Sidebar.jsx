import React from 'react';
import PatientInfoForm from './PatientInfoForm';
import AddressForm from './AddressForm';
import PaymentOptions from './PaymentOptions';
import { FaTimes } from 'react-icons/fa';

const Sidebar = ({
    currentStep,
    patientInfo,
    onInputChange,
    onBack,
    onNext,
    handleCloseMobileForm
}) => {
    const setGender = (gender) => {
        onInputChange({ target: { name: 'gender', value: gender } });
    };

    const getSidebarContent = () => {
        switch (currentStep) {
            case 2:
                return {
                    title: 'Patient Information',
                    subtext: "Tell us who we're testing for",
                    content: (
                        <PatientInfoForm
                            patientInfo={patientInfo}
                            onInputChange={onInputChange}
                            setGender={setGender}
                            onBack={onBack}
                            onNext={onNext}
                        />
                    )
                };
            case 3:
                return {
                    title: 'Address & Time Slot',
                    subtext: 'Tell us where and when to collect the sample',
                    content: (
                        <AddressForm
                            patientInfo={patientInfo}
                            onInputChange={onInputChange}
                            onBack={onBack}
                            onNext={onNext}
                        />
                    )
                };
            case 4:
                return {
                    title: 'Payment Method',
                    subtext: 'Choose your preferred payment option',
                    content: <PaymentOptions onBack={onBack} onNext={onNext} />
                };
            default:
                return { title: '', subtext: '', content: null };
        }
    };

    const { title, subtext, content } = getSidebarContent();

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block bg-white shadow-lg rounded-lg border border-gray-200">
                <div className="p-6 border-b bg-gradient-to-r from-[#FF7A7A] to-[#E23744] text-white rounded-t-lg">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <p className="text-sm opacity-90 mt-1">{subtext}</p>
                </div>
                <div className="p-6">{content}</div>
            </div>

            {/* Mobile Form Overlay */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 top-20 z-40 bg-white shadow-xl overflow-y-auto pb-16">
                <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-[#FF7A7A] to-[#E23744] text-white">
                    <div>
                        <h2 className="text-xl font-bold">{title}</h2>
                        <p className="text-sm opacity-90">{subtext}</p>
                    </div>
                    <button
                        onClick={handleCloseMobileForm}
                        className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                        title="Close form"
                    >
                        <FaTimes className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6">{content}</div>
            </div>
        </>
    );
};

export default Sidebar;
