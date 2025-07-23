import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Profile from './components/Profile';
import Cart from './components/Cart';
import CategoryTests from './components/Home/CategoryTests';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="font-poppins">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/category-tests/:slug" element={<CategoryTests />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
          </Routes>
          {/* <Footer /> */}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;