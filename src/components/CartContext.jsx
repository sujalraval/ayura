import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('labTestCart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem('labTestCart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (test) => {
        const existingItem = cart.find(item => item.id === test.id);
        if (existingItem) {
            setCart(cart.map(item =>
                item.id === test.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...test, quantity: 1 }]);
        }
    };

    const removeFromCart = (testId) => {
        setCart(cart.filter(item => item.id !== testId));
    };

    const updateQuantity = (testId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(testId);
            return;
        }
        setCart(cart.map(item =>
            item.id === testId
                ? { ...item, quantity }
                : item
        ));
    };

    const clearCart = () => {
        setCart([]);
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const isInCart = (testId) => {
        return cart.some(item => item.id === testId);
    };

    const getItemQuantity = (testId) => {
        const item = cart.find(item => item.id === testId);
        return item ? item.quantity : 0;
    };

    const value = {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        isInCart,
        getItemQuantity
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

// HOC for components that need cart functionality
export const withCart = (Component) => {
    return function CartWrappedComponent(props) {
        const cart = useCart();
        return <Component {...props} cart={cart} />;
    };
};