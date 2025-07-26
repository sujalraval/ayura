import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('ayura_token') || null);

    // **FIXED**: Use production API URL
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ayuras.life/api/v1';

    useEffect(() => {
        const localToken = localStorage.getItem('ayura_token');
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');

        if (urlToken) {
            localStorage.setItem('ayura_token', urlToken);
            setToken(urlToken);
            fetchUserData(urlToken).then(() => {
                const redirectPath = localStorage.getItem('redirectAfterLogin');
                if (redirectPath) {
                    localStorage.removeItem('redirectAfterLogin');
                    window.location.href = redirectPath;
                } else {
                    window.location.href = '/';
                }
            });
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (localToken) {
            setToken(localToken);
            fetchUserData(localToken);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUserData = async (token) => {
        try {
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
                    setUser(data.data);
                    setToken(token);
                    localStorage.setItem('ayura_user', JSON.stringify(data.data));
                    localStorage.setItem('userEmail', data.data.email);
                } else {
                    localStorage.removeItem('ayura_token');
                    localStorage.removeItem('ayura_user');
                    setToken(null);
                }
            } else {
                localStorage.removeItem('ayura_token');
                localStorage.removeItem('ayura_user');
                setToken(null);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            localStorage.removeItem('ayura_token');
            localStorage.removeItem('ayura_user');
            setToken(null);
        } finally {
            setLoading(false);
        }
    };

    const signInWithGoogle = () => {
        const currentPath = window.location.pathname;
        if (currentPath !== '/login') {
            localStorage.setItem('redirectAfterLogin', currentPath);
        }
        // **FIXED**: Use production API URL
        window.location.href = `${API_BASE_URL}/auth/google`;
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
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem('ayura_token');
            localStorage.removeItem('ayura_user');
            localStorage.removeItem('userEmail');
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







