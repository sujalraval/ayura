import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";

const ProfileHeader = () => {
    const { user, token } = useAuth();
    const [profileImage, setProfileImage] = useState("/defaultProfile.png");
    const [userData, setUserData] = useState({
        fullName: "",
        contact: "",
        email: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [tempData, setTempData] = useState(userData);

    useEffect(() => {
        if (user) {
            const newUserData = {
                fullName: user.name || user.displayName || "",
                contact: user.contact || "",
                email: user.email || "",
            };
            setUserData(newUserData);
            setTempData(newUserData);
            if (user.photoURL || user.picture || user.avatar) {
                setProfileImage(user.photoURL || user.picture || user.avatar);
            }
        }
    }, [user]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setProfileImage(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleFieldChange = (field, value) => {
        setTempData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            setUserData(tempData);
            setIsEditing(false);
            // API call to update user profile
            await fetch("/api/v1/auth/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: tempData.fullName,
                    phone: tempData.contact,
                }),
            });
        } catch (error) {
            alert("Error updating profile.");
        }
    };

    const handleCancel = () => {
        setTempData(userData);
        setIsEditing(false);
    };

    if (!user) {
        return (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="animate-pulse flex items-center space-x-4">
                    <div className="rounded-full bg-gray-300 h-16 w-16 sm:h-20 sm:w-20"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-0">Profile Information</h2>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-md text-[#E23744] bg-[#E23744]/10 hover:bg-[#E23744]/20 transition-colors duration-200"
                    >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        {isEditing ? "Cancel" : "Edit Profile"}
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    {/* Profile Image */}
                    <div className="relative flex-shrink-0">
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        {isEditing && (
                            <label className="absolute -bottom-2 -right-2 bg-[#E23744] rounded-full p-2 cursor-pointer hover:bg-[#c5313d] transition-colors duration-200 shadow-lg">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>

                    {/* Profile Details */}
                    <div className="flex-1 w-full sm:w-auto min-w-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={tempData.fullName}
                                        onChange={(e) => handleFieldChange("fullName", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E23744] focus:border-transparent"
                                        placeholder="Enter full name"
                                    />
                                ) : (
                                    <p className="text-sm sm:text-base text-gray-900 truncate">{userData.fullName || "Not specified"}</p>
                                )}
                            </div>

                            {/* Contact Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={tempData.contact}
                                        onChange={(e) => handleFieldChange("contact", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E23744] focus:border-transparent"
                                        placeholder="Enter contact number"
                                    />
                                ) : (
                                    <p className="text-sm sm:text-base text-gray-900 truncate">{userData.contact || "Not specified"}</p>
                                )}
                            </div>

                            {/* Email Address */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <p className="text-sm sm:text-base text-gray-900 truncate">{userData.email || "Not specified"}</p>
                                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                            </div>

                            {/* User ID */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                                <p className="text-sm sm:text-base text-gray-600 font-mono truncate">
                                    ID: {user.id || "#HD12345"}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                                <button
                                    onClick={handleSave}
                                    className="w-full sm:w-auto px-4 py-2 bg-[#E23744] text-white text-sm font-medium rounded-md hover:bg-[#c5313d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E23744] transition-colors duration-200"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
