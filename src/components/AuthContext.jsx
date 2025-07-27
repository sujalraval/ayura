import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('ayura_token') || null);

    const API_BASE_URL = import.meta.env.PROD
        ? 'https://ayuras.life/api/v1'
        : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1');

    useEffect(() => {
        const initializeAuth = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const urlToken = urlParams.get('token');
            const localToken = localStorage.getItem('ayura_token');

            if (urlToken) {
                localStorage.setItem('ayura_token', urlToken);
                setToken(urlToken);
                window.history.replaceState({}, document.title, window.location.pathname);
                await fetchUserData(urlToken);
            } else if (localToken) {
                await fetchUserData(localToken);
            } else {
                setLoading(false);
            }
        };

        initializeAuth();
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
                    localStorage.setItem('ayura_user', JSON.stringify(data.data));
                    localStorage.setItem('userEmail', data.data.email);

                    // Handle redirect after login
                    const redirectPath = localStorage.getItem('redirectAfterLogin');
                    if (redirectPath) {
                        localStorage.removeItem('redirectAfterLogin');
                        window.location.href = redirectPath;
                    }
                } else {
                    clearAuthData();
                }
            } else {
                clearAuthData();
            }
        } catch (error) {
            console.error('Fetch user error:', error);
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
                API_BASE_URL
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