// src/components/Cart.jsx
import React from 'react';
import CartPage from '../components/Cart/CartPage'; // or CartMain

const Cart = () => {
  return <CartPage />;
};

export default Cart;




















// import React, { useState } from 'react';
// import {
//   FaSyringe, FaTimes, FaWallet, FaBoxOpen, FaCheckCircle,
//   FaUser, FaEnvelope, FaPhone, FaCalendar, FaVenusMars,
//   FaMapMarker, FaUserFriends, FaChevronDown, FaArrowRight,
//   FaCreditCard
// } from 'react-icons/fa';

// function Cart() {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [highestStepReached, setHighestStepReached] = useState(1);
//   const [cartItems, setCartItems] = useState([
//     { id: 1, testName: 'Complete Blood Count', lab: 'HealthLab Diagnostics', price: 599 },
//     { id: 2, testName: 'Thyroid Profile', lab: 'MediCare Labs', price: 899 }
//   ]);
//   const [patientInfo, setPatientInfo] = useState({
//     name: '',
//     relation: '',
//     email: '',
//     phone: '',
//     dob: '',
//     address: '',
//     gender: ''
//   });

//   const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

//   const steps = [
//     { id: 1, name: 'Cart Review' },
//     { id: 2, name: 'Patient Info' },
//     { id: 3, name: 'Address' },
//     { id: 4, name: 'Payment' }
//   ];

//   const handleRemoveItem = (itemId) => {
//     setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
//   };

//   const handleInputChange = (e) => {
//     setPatientInfo({ ...patientInfo, [e.target.name]: e.target.value });
//   };

//   const handlePrevStep = () => setCurrentStep(prev => Math.max(1, prev - 1));

//   const handleNextStep = () => {
//     const nextStep = Math.min(4, currentStep + 1);
//     setCurrentStep(nextStep);
//     setHighestStepReached(prev => Math.max(prev, nextStep));
//   };

//   const handleStepClick = (stepId) => {
//     if (stepId <= highestStepReached) {
//       setCurrentStep(stepId);
//     }
//   };

//   const closeMobileForm = () => {
//     setCurrentStep(1);
//   };

//   if (cartItems.length === 0) {
//     return (
//       <div className="container mx-auto px-4 pt-20 pb-32 min-h-screen flex items-center justify-center">
//         <div className="text-center max-w-md">
//           <div className="mb-6 text-gray-400">
//             <FaBoxOpen className="text-6xl inline-block" />
//           </div>
//           <h1 className="text-3xl font-bold mb-4 flex items-center justify-center">
//             <FaSyringe className="mr-2" /> Your Cart is Empty
//           </h1>
//           <p className="text-gray-600 mb-8">
//             It looks like you haven't added any lab tests yet. Explore our comprehensive
//             health tests and add them to your cart for a seamless diagnostic experience.
//           </p>
//           <button className="border-2 border-[#E23744] text-[#E23744] py-3 px-8 rounded-lg font-semibold hover:bg-[#E23744] hover:text-white transition-all duration-300">
//             Browse Available Tests
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const getSidebarContent = () => {
//     switch (currentStep) {
//       case 2:
//         return {
//           title: "Patient Information",
//           subtext: "Tell us who we're testing for",
//           content: (
//             <div className="space-y-6">
//               <div className="relative">
//                 <label className="block text-sm font-medium mb-2 text-gray-700">Full Name</label>
//                 <div className="relative">
//                   <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     name="name"
//                     value={patientInfo.name}
//                     onChange={handleInputChange}
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E23744] focus:border-[#E23744] transition-all"
//                     placeholder="John Doe"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="relative">
//                 <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
//                 <div className="relative">
//                   <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="email"
//                     name="email"
//                     value={patientInfo.email}
//                     onChange={handleInputChange}
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E23744] focus:border-[#E23744] transition-all"
//                     placeholder="johndoe@example.com"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="relative">
//                 <label className="block text-sm font-medium mb-2 text-gray-700">Phone Number</label>
//                 <div className="relative">
//                   <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={patientInfo.phone}
//                     onChange={handleInputChange}
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E23744] focus:border-[#E23744] transition-all"
//                     placeholder="+91 98765 43210"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="relative">
//                 <label className="block text-sm font-medium mb-2 text-gray-700">Date of Birth</label>
//                 <div className="relative">
//                   <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="date"
//                     name="dob"
//                     value={patientInfo.dob}
//                     onChange={handleInputChange}
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E23744] focus:border-[#E23744] appearance-none transition-all"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="relative">
//                 <label className="block text-sm font-medium mb-2 text-gray-700">Relationship</label>
//                 <div className="relative">
//                   <FaUserFriends className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <select
//                     name="relation"
//                     value={patientInfo.relation}
//                     onChange={handleInputChange}
//                     className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E23744] focus:border-[#E23744] appearance-none bg-white transition-all"
//                     required
//                   >
//                     <option value="">Select Relationship</option>
//                     <option value="self">Self</option>
//                     <option value="child">Child</option>
//                     <option value="spouse">Spouse</option>
//                     <option value="parent">Parent</option>
//                     <option value="other">Other</option>
//                   </select>
//                   <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
//                 </div>
//               </div>

//               <div className="relative">
//                 <label className="block text-sm font-medium mb-2 text-gray-700">Gender</label>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                   <button
//                     type="button"
//                     onClick={() => setPatientInfo({ ...patientInfo, gender: 'male' })}
//                     className={`p-3 rounded-lg flex items-center justify-center space-x-2 transition-all
//                                         ${patientInfo.gender === 'male'
//                         ? 'bg-[#E23744] text-white border-2 border-[#E23744]'
//                         : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-[#E23744]/40'}`}
//                   >
//                     <FaVenusMars />
//                     <span>Male</span>
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setPatientInfo({ ...patientInfo, gender: 'female' })}
//                     className={`p-3 rounded-lg flex items-center justify-center space-x-2 transition-all
//                                         ${patientInfo.gender === 'female'
//                         ? 'bg-[#E23744] text-white border-2 border-[#E23744]'
//                         : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-[#E23744]/40'}`}
//                   >
//                     <FaVenusMars />
//                     <span>Female</span>
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setPatientInfo({ ...patientInfo, gender: 'other' })}
//                     className={`p-3 rounded-lg flex items-center justify-center space-x-2 transition-all
//                                         ${patientInfo.gender === 'other'
//                         ? 'bg-[#E23744] text-white border-2 border-[#E23744]'
//                         : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-[#E23744]/40'}`}
//                   >
//                     <FaVenusMars />
//                     <span>Other</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )
//         };
//       case 3:
//         return {
//           title: "Address Details",
//           subtext: "Tell us where to collect the sample",
//           content: (
//             <div className="space-y-6">
//               <div className="relative">
//                 <label className="block text-sm font-medium mb-2 text-gray-700">Full Address</label>
//                 <div className="relative">
//                   <FaMapMarker className="absolute left-3 top-4 text-gray-400" />
//                   <textarea
//                     name="address"
//                     value={patientInfo.address}
//                     onChange={handleInputChange}
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E23744] focus:border-[#E23744]"
//                     rows="4"
//                     placeholder="Enter full address with landmark"
//                     required
//                   />
//                 </div>
//               </div>
//               <div className="relative">
//                 <label className="block text-sm font-medium mb-2 text-gray-700">City</label>
//                 <div className="relative">
//                   <FaMapMarker className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="text"
//                     name="city"
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E23744] focus:border-[#E23744] transition-all"
//                     placeholder="City"
//                     required
//                   />
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="relative">
//                   <label className="block text-sm font-medium mb-2 text-gray-700">State</label>
//                   <input
//                     type="text"
//                     name="state"
//                     className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E23744] focus:border-[#E23744] transition-all"
//                     placeholder="State"
//                     required
//                   />
//                 </div>
//                 <div className="relative">
//                   <label className="block text-sm font-medium mb-2 text-gray-700">PIN Code</label>
//                   <input
//                     type="text"
//                     name="pincode"
//                     className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E23744] focus:border-[#E23744] transition-all"
//                     placeholder="PIN Code"
//                     required
//                   />
//                 </div>
//               </div>
//             </div>
//           )
//         };
//       case 4:
//         return {
//           title: "Payment Method",
//           subtext: "Choose your preferred payment option",
//           content: (
//             <div className="space-y-6">
//               <div className="space-y-4">
//                 <div className="flex items-center p-4 border rounded-lg bg-gray-50 cursor-pointer">
//                   <input
//                     type="radio"
//                     id="cod"
//                     name="payment"
//                     className="mr-3"
//                     defaultChecked
//                   />
//                   <label htmlFor="cod" className="flex items-center cursor-pointer">
//                     <FaWallet className="text-xl mr-3 text-[#E23744]" />
//                     <span className="text-gray-700">Cash on Delivery</span>
//                   </label>
//                 </div>

//                 <div className="flex items-center p-4 border rounded-lg cursor-pointer opacity-50">
//                   <input
//                     type="radio"
//                     id="card"
//                     name="payment"
//                     className="mr-3"
//                     disabled
//                   />
//                   <label htmlFor="card" className="flex items-center cursor-not-allowed">
//                     <FaCreditCard className="text-xl mr-3 text-gray-400" />
//                     <span className="text-gray-500">Credit/Debit Card (Coming Soon)</span>
//                   </label>
//                 </div>

//                 <div className="flex items-center p-4 border rounded-lg cursor-pointer opacity-50">
//                   <input
//                     type="radio"
//                     id="upi"
//                     name="payment"
//                     className="mr-3"
//                     disabled
//                   />
//                   <label htmlFor="upi" className="flex items-center cursor-not-allowed">
//                     <FaWallet className="text-xl mr-3 text-gray-400" />
//                     <span className="text-gray-500">UPI Payment (Coming Soon)</span>
//                   </label>
//                 </div>
//               </div>

//               <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//                 <p className="text-sm text-yellow-800">
//                   <strong>Note:</strong> Our technician will collect the payment at the time of sample collection.
//                 </p>
//               </div>
//             </div>
//           )
//         };
//       default:
//         return { title: "", subtext: "", content: null };
//     }
//   };

//   const { title, subtext, content } = getSidebarContent();

//   return (
//     <div className="container mx-auto px-4 pt-28 pb-32 relative">
//       {(currentStep === 2 || currentStep === 3 || currentStep === 4) && (
//         <div className="lg:hidden fixed inset-0 bg-black/50 z-30"></div>
//       )}

//       <div className="flex flex-col lg:flex-row gap-8 relative">
//         <div className={`flex-1 ${(currentStep === 2 || currentStep === 3 || currentStep === 4) ? 'lg:pr-8 lg:border-r lg:border-gray-200' : ''}`}>
//           <h1 className="text-3xl font-bold mb-8 flex items-center">
//             <FaSyringe className="mr-2" /> Your Lab Tests Cart
//           </h1>

//           <div className="mb-8 sm:mb-12 px-2 sm:px-0">
//             <nav aria-label="Progress">
//               <ol className="flex items-center justify-between">
//                 {steps.map((step, index) => (
//                   <li key={step.id} className="relative flex-1">
//                     <div
//                       className={`flex flex-col items-center ${step.id <= highestStepReached ? 'cursor-pointer' : 'cursor-not-allowed'}`}
//                       onClick={() => handleStepClick(step.id)}
//                       title={step.id <= highestStepReached ? `Go to ${step.name}` : `Complete previous steps first`}
//                     >
//                       {index > 0 && (
//                         <div className="absolute left-[-35%] right-[35%] sm:left-[-45%] sm:right-[55%] top-3 sm:top-4 h-[2px]">
//                           <div className={`h-full ${currentStep > step.id ? 'bg-gradient-to-r from-[#FF7A7A] to-[#E23744]' : 'bg-gray-200'}`} />
//                         </div>
//                       )}
//                       <div className="relative mb-2 sm:mb-4">
//                         <div className={`h-7 w-7 sm:h-9 sm:w-9 rounded-full flex items-center justify-center transition-all duration-300 
//                                                 ${currentStep > step.id ? 'bg-gradient-to-br from-[#FF7A7A] to-[#E23744] shadow-lg'
//                             : currentStep === step.id ? 'border-2 border-[#E23744] bg-white ring-2 sm:ring-4 ring-[#E23744]/20'
//                               : step.id <= highestStepReached ? 'border-2 border-[#E23744]/60 bg-white hover:ring-2 hover:ring-[#E23744]/20'
//                                 : 'border-2 border-gray-300 bg-white'}`}>
//                           {currentStep > step.id ? (
//                             <FaCheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
//                           ) : (
//                             <span className={`text-sm sm:text-base font-semibold 
//                                                         ${currentStep === step.id ? 'text-[#E23744]'
//                                 : step.id <= highestStepReached ? 'text-[#E23744]/70'
//                                   : 'text-gray-400'}`}>
//                               {step.id}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                       <span className={`text-xs sm:text-sm font-medium text-center px-1 sm:px-2 
//                                             ${currentStep === step.id ? 'text-[#E23744] font-bold'
//                           : step.id <= highestStepReached ? 'text-[#E23744]/80'
//                             : 'text-gray-500'}`}>
//                         {step.name}
//                       </span>
//                     </div>
//                   </li>
//                 ))}
//               </ol>
//             </nav>
//           </div>

//           <div className="bg-white rounded-lg shadow-md p-6 flex flex-col min-h-[500px]">
//             <div className="flex-1">
//               {cartItems.map(item => (
//                 <div key={item.id} className="border-b border-gray-200 pb-4 mb-4">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <h3 className="text-xl font-semibold">{item.testName}</h3>
//                       <p className="text-gray-600">{item.lab}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-lg font-bold">₹{item.price}</p>
//                       {currentStep === 1 && (
//                         <button
//                           onClick={() => handleRemoveItem(item.id)}
//                           className="text-red-500 hover:text-red-700 mt-2"
//                         >
//                           Remove
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-auto pt-6 border-t border-gray-200">
//               <div className="flex justify-between items-center">
//                 <span className="text-xl font-bold">Total:</span>
//                 <span className="text-xl font-bold">₹{totalPrice}</span>
//               </div>
//               {currentStep === 1 && (
//                 <button
//                   onClick={() => {
//                     setCurrentStep(2);
//                     setHighestStepReached(prev => Math.max(prev, 2));
//                   }}
//                   className="w-full mt-4 border-2 border-[#E23744] text-[#E23744] py-3 px-6 rounded-lg font-semibold hover:bg-[#E23744] hover:text-white transition-all duration-300"
//                 >
//                   Proceed to Patient Details
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {(currentStep === 2 || currentStep === 3 || currentStep === 4) && (
//           <>
//             <div className="hidden lg:block lg:w-96 lg:sticky lg:top-20 lg:self-start bg-white shadow-lg rounded-lg border border-gray-200">
//               <div className="p-6 border-b bg-gradient-to-r from-[#FF7A7A] to-[#E23744] text-white rounded-t-lg">
//                 <h2 className="text-2xl font-bold">{title}</h2>
//                 <p className="text-sm opacity-90 mt-1">{subtext}</p>
//               </div>

//               <div className="p-6">
//                 {content}

//                 <div className="flex gap-4 mt-8">
//                   <button
//                     type="button"
//                     onClick={handlePrevStep}
//                     className="w-1/2 border-2 border-[#E23744] text-[#E23744] py-3 px-6 rounded-lg font-semibold hover:bg-[#E23744]/10 transition-all duration-300"
//                   >
//                     Back
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleNextStep}
//                     className="w-1/2 bg-gradient-to-r from-[#FF7A7A] to-[#E23744] text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg hover:from-[#FF6A6A] hover:to-[#D12734] transition-all duration-300 flex items-center justify-center"
//                   >
//                     {currentStep === 4 ? 'Place Order' : 'Continue'}
//                     <FaArrowRight className="ml-2" />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="lg:hidden fixed bottom-0 left-0 right-0 top-20 z-40 bg-white shadow-xl overflow-y-auto pb-16">
//               <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-[#FF7A7A] to-[#E23744] text-white">
//                 <div>
//                   <h2 className="text-xl font-bold">{title}</h2>
//                   <p className="text-sm opacity-90">{subtext}</p>
//                 </div>
//                 <button
//                   onClick={closeMobileForm}
//                   className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
//                   title="Close form"
//                 >
//                   <FaTimes className="w-6 h-6" />
//                 </button>
//               </div>

//               <div className="p-6">
//                 {content}

//                 <div className="flex gap-4 mt-8 mb-4">
//                   <button
//                     type="button"
//                     onClick={handlePrevStep}
//                     className="w-1/2 border-2 border-[#E23744] text-[#E23744] py-3 px-6 rounded-lg font-semibold hover:bg-[#E23744]/10 transition-all duration-300"
//                   >
//                     Back
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleNextStep}
//                     className="w-1/2 bg-gradient-to-r from-[#FF7A7A] to-[#E23744] text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg hover:from-[#FF6A6A] hover:to-[#D12734] transition-all duration-300 flex items-center justify-center"
//                   >
//                     {currentStep === 4 ? 'Place Order' : 'Continue'}
//                     <FaArrowRight className="ml-2" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {currentStep === 5 && (
//         <div className="bg-white rounded-lg shadow-md p-6 mt-8">
//           <div className="text-center space-y-6 py-12">
//             <FaCheckCircle className="text-6xl text-[#E23744] mx-auto animate-bounce" />
//             <h2 className="text-3xl font-bold text-gray-800">Order Confirmed!</h2>
//             <div className="text-lg space-y-2 text-gray-600">
//               <p>Order ID: #{(Math.random() * 1000000).toFixed(0)}</p>
//               <p>Total Paid: ₹{totalPrice}</p>
//               <p>Expected Sample Collection: Tomorrow 8-10 AM</p>
//             </div>
//             <button
//               className="border-2 border-[#E23744] text-[#E23744] py-3 px-8 rounded-lg font-semibold hover:bg-[#E23744] hover:text-white transition-all duration-300"
//               onClick={() => setCurrentStep(1)}
//             >
//               Back to Cart
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Cart;


