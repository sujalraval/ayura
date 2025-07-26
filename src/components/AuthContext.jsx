import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('ayura_token') || null);

    // **FIXED**: Always use production API
    const API_BASE_URL = import.meta.env.PROD
        ? 'https://ayuras.life/api/v1'
        : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1');

    console.log('🌐 API URL:', API_BASE_URL);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');
        const localToken = localStorage.getItem('ayura_token');

        console.log('🔍 Auth initialization:', {
            urlToken: !!urlToken,
            localToken: !!localToken,
            currentPath: window.location.pathname
        });

        if (urlToken) {
            console.log('✅ Processing URL token...');
            localStorage.setItem('ayura_token', urlToken);
            setToken(urlToken);

            // Clean URL immediately
            window.history.replaceState({}, document.title, window.location.pathname);

            fetchUserData(urlToken).then(() => {
                console.log('✅ User data fetched, staying on current page');
                // Don't redirect - stay on /profile page
            });
        } else if (localToken) {
            console.log('🔍 Using stored token');
            fetchUserData(localToken);
        } else {
            console.log('❌ No authentication tokens found');
            setLoading(false);
        }
    }, []);

    const fetchUserData = async (token) => {
        try {
            console.log('📡 Fetching user data...');
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    console.log('✅ User authenticated:', data.data.email);
                    setUser(data.data);
                    localStorage.setItem('ayura_user', JSON.stringify(data.data));
                    localStorage.setItem('userEmail', data.data.email);
                } else {
                    console.log('❌ Invalid response');
                    clearAuthData();
                }
            } else {
                console.log('❌ Auth failed:', response.status);
                clearAuthData();
            }
        } catch (error) {
            console.error('❌ Fetch user error:', error);
            clearAuthData();
        } finally {
            setLoading(false);
        }
    };

    const clearAuthData = () => {
        localStorage.removeItem('ayura_token');
        localStorage.removeItem('ayura_user');
        localStorage.removeItem('userEmail');
        setToken(null);
        setUser(null);
    };

    const signInWithGoogle = () => {
        console.log('🔐 Starting Google OAuth...');
        const authUrl = `${API_BASE_URL}/auth/google`;
        console.log('🔄 Redirecting to:', authUrl);
        window.location.href = authUrl;
    };

    const signOut = async () => {
        try {
            if (token) {
                await fetch(`${API_BASE_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            }
        } catch (error) {
            console.error('❌ Logout error:', error);
        } finally {
            clearAuthData();
            window.location.href = '/login';
        }
    };

    const isAuthenticated = () => {
        return !!(user && token);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                token,
                signInWithGoogle,
                signOut,
                isAuthenticated,
                fetchUserData
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};


// import React, { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [token, setToken] = useState(localStorage.getItem('ayura_token') || null);

//     const API_BASE_URL = import.meta.env.VITE_API_URL;

//     useEffect(() => {
//         const localToken = localStorage.getItem('ayura_token');
//         const urlParams = new URLSearchParams(window.location.search);
//         const urlToken = urlParams.get('token');

//         if (urlToken) {
//             localStorage.setItem('ayura_token', urlToken);
//             setToken(urlToken);
//             fetchUserData(urlToken).then(() => {
//                 const redirectPath = localStorage.getItem('redirectAfterLogin');
//                 if (redirectPath) {
//                     localStorage.removeItem('redirectAfterLogin');
//                     window.location.href = redirectPath;
//                 } else {
//                     window.location.href = '/';
//                 }
//             });
//             window.history.replaceState({}, document.title, window.location.pathname);
//         } else if (localToken) {
//             setToken(localToken);
//             fetchUserData(localToken);
//         } else {
//             setLoading(false);
//         }
//     }, []);

//     const fetchUserData = async (token) => {
//         try {
//             const response = await fetch(`${API_BASE_URL}/auth/me`, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 if (data.success) {
//                     setUser(data.data);
//                     setToken(token);
//                     localStorage.setItem('ayura_user', JSON.stringify(data.data));
//                     localStorage.setItem('userEmail', data.data.email);
//                 } else {
//                     localStorage.removeItem('ayura_token');
//                     localStorage.removeItem('ayura_user');
//                     setToken(null);
//                 }
//             } else {
//                 localStorage.removeItem('ayura_token');
//                 localStorage.removeItem('ayura_user');
//                 setToken(null);
//             }
//         } catch (error) {
//             console.error('Error fetching user data:', error);
//             localStorage.removeItem('ayura_token');
//             localStorage.removeItem('ayura_user');
//             setToken(null);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const signInWithGoogle = () => {
//         const currentPath = window.location.pathname;
//         if (currentPath !== '/login') {
//             localStorage.setItem('redirectAfterLogin', currentPath);
//         }
//         window.location.href = `${API_BASE_URL}/auth/google`;
//     };

//     const signOut = async () => {
//         try {
//             if (token) {
//                 await fetch(`${API_BASE_URL}/auth/logout`, {
//                     method: 'POST',
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                     },
//                 });
//             }
//         } catch (error) {
//             console.error('Logout error:', error);
//         } finally {
//             setUser(null);
//             setToken(null);
//             localStorage.removeItem('ayura_token');
//             localStorage.removeItem('ayura_user');
//             localStorage.removeItem('userEmail');
//         }
//     };

//     // Add isAuthenticated function
//     const isAuthenticated = () => {
//         return !!(user && token);
//     };

//     return (
//         <AuthContext.Provider value={{
//             user,
//             token,
//             signInWithGoogle,
//             signOut,
//             loading,
//             isAuthenticated
//         }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) throw new Error('useAuth must be used within AuthProvider');
//     return context;
// };







