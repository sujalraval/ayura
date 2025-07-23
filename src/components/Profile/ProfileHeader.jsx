import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";

const ProfileHeader = () => {
    const { user, token } = useAuth();
    const [profileImage, setProfileImage] = useState("/defaultProfile.png");
    const [userData, setUserData] = useState({
        fullName: "",
        contact: "",
        email: "",
        dob: "",
        gender: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [tempData, setTempData] = useState(userData);

    useEffect(() => {
        if (user) {
            const newUserData = {
                fullName: user.name || user.displayName || "",
                contact: user.contact || "",
                email: user.email || "",
                dob: user.dob || "",
                gender: user.gender || "",
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
        setTempData((prev) => ({ ...prev, [field]: value }));
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
                    dateOfBirth: tempData.dob,
                    gender: tempData.gender,
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
            <div className="animate-pulse">Loading...</div>
        );
    }

    return (
        <main className="flex flex-col lg:flex-row items-start gap-8 bg-white rounded-2xl p-6 shadow-lg mb-8 w-full">
            {/* Profile image */}
            <div className="relative w-32 h-32 mx-auto lg:mx-0">
                <div className="group relative w-full h-full rounded-full overflow-hidden">
                    <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = "/defaultProfile.png";
                        }}
                    />
                    {isEditing && (
                        <>
                            <label htmlFor="upload-photo" className="absolute bottom-1 right-1 bg-red-500 p-2 rounded-full cursor-pointer">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
                                    />
                                </svg>
                            </label>
                            <input
                                type="file"
                                id="upload-photo"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </>
                    )}
                </div>
            </div>
            {/* Profile Info Section */}
            <div className="flex-1 w-full">
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <input
                            type="text"
                            value={isEditing ? tempData.fullName : userData.fullName}
                            onChange={e => handleFieldChange("fullName", e.target.value)}
                            placeholder="Enter your full name"
                            className={`text-3xl font-bold bg-transparent border-b-2 
                ${isEditing ? "border-red-500" : "border-transparent"}
                focus:border-red-500 outline-none transition-colors duration-300`}
                            readOnly={!isEditing}
                        />
                        <p className="text-gray-500 text-sm">ID: {user.id || "#HD12345"}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Contact Number */}
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <label className="block text-sm text-gray-500 mb-1">Contact Number</label>
                        <input
                            type="tel"
                            value={isEditing ? tempData.contact : userData.contact}
                            onChange={e => handleFieldChange("contact", e.target.value)}
                            placeholder="Enter contact number"
                            className="bg-transparent border-b-2 focus:border-red-500 outline-none w-full"
                            readOnly={!isEditing}
                        />
                    </div>
                    {/* Email */}
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <label className="block text-sm text-gray-500 mb-1">Email Address</label>
                        <input
                            type="email"
                            value={isEditing ? tempData.email : userData.email}
                            onChange={e => handleFieldChange("email", e.target.value)}
                            placeholder="Enter email address"
                            className="bg-transparent border-b-2 focus:border-red-500 outline-none w-full"
                            readOnly
                        />
                    </div>
                    {/* Date of Birth */}
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <label className="block text-sm text-gray-500 mb-1">Date of Birth</label>
                        <input
                            type="date"
                            value={isEditing ? tempData.dob : userData.dob}
                            onChange={e => handleFieldChange("dob", e.target.value)}
                            className="bg-transparent w-full outline-none"
                            readOnly={!isEditing}
                        />
                    </div>
                    {/* Gender */}
                    <div className="bg-gray-50 p-4 rounded-xl">
                        <label className="block text-sm text-gray-500 mb-1">Gender</label>
                        {isEditing ? (
                            <select
                                value={tempData.gender}
                                onChange={e => handleFieldChange("gender", e.target.value)}
                                className="bg-transparent w-full outline-none"
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        ) : (
                            <p>{userData.gender ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1) : "Not specified"}</p>
                        )}
                    </div>
                </div>
                <div className="flex justify-end mt-6 gap-4">
                    {isEditing ? (
                        <>
                            <button onClick={handleCancel}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition">
                                Cancel
                            </button>
                            <button onClick={handleSave}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => {
                                setTempData(userData);
                                setIsEditing(true);
                            }}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
};

export default ProfileHeader;
