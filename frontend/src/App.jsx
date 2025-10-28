import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Footer from "./components/Footer.jsx";
import EntryForm from "./components/EntryForm.jsx";
import Cart from "./components/Cart.jsx";

import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrderReviewPage from "./pages/OrderReviewPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";

import ManageDishes from "./pages/ManageDishes.jsx";
import OrdersList from "./pages/OrdersList.jsx"; // <-- Added import

import { CartProvider } from "./context/CartProvider.jsx";

const AppRoutes = ({ userDetails, setUserDetails }) => {
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close cart on route change
  useEffect(() => {
    setCartOpen(false);
  }, [location]);

  const handleEntrySubmit = (details) => {
    setUserDetails(details);
    navigate("/");
  };

  const toggleCart = () => {
    setCartOpen((prev) => !prev);
  };

  if (!userDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <EntryForm onSubmit={handleEntrySubmit} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {cartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Shopping cart"
        >
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg p-6 relative">
            <button
              onClick={toggleCart}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              aria-label="Close cart"
            >
              ✕
            </button>
            <Cart />
          </div>
        </div>
      )}

      <main className="flex-grow container mx-auto px-4 py-6">
        <Routes>
          {/* Separate Routes for "/" and "/checkout" */}
          <Route
            path="/"
            element={
              <CheckoutPage userDetails={userDetails} onCartToggle={toggleCart} />
            }
          />
          <Route
            path="/checkout"
            element={
              <CheckoutPage userDetails={userDetails} onCartToggle={toggleCart} />
            }
          />
          <Route
            path="/checkout/review"
            element={<OrderReviewPage userDetails={userDetails} />}
          />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/cart" element={<Cart />} />

          {/* Manage Dishes Route */}
          <Route path="/manage-dishes" element={<ManageDishes />} />

          {/* Orders List Route */}
          <Route path="/orders" element={<OrdersList />} />

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <div className="text-center text-xl py-10">
                404 - Page Not Found
                <br />
                <button
                  onClick={() => navigate("/")}
                  className="mt-4 text-blue-600 underline"
                >
                  Go back to Home
                </button>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

const App = () => {
  const [userDetails, setUserDetails] = useState(() => {
    try {
      const saved = localStorage.getItem("userDetails");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (userDetails) {
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
    } else {
      localStorage.removeItem("userDetails");
    }
  }, [userDetails]);

  return (
    <CartProvider>
      <BrowserRouter>
        <AppRoutes userDetails={userDetails} setUserDetails={setUserDetails} />
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;
