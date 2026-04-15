import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { toast } from "react-hot-toast";

const CheckoutPage = () => {
  const navigate = useNavigate();

  const [totalAmount, setTotalAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    address: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const savedTotal = localStorage.getItem("lastCartTotal") || "0";
    setTotalAmount(parseFloat(savedTotal));
  }, []);

  // 🔥 FORMAT PHONE
  const formatPhoneNumber = (phone) => {
    let cleaned = phone.replace(/\D/g, "");

    if (cleaned.startsWith("0")) return "94" + cleaned.substring(1);
    if (cleaned.startsWith("94")) return cleaned;

    return cleaned;
  };

  // 🔥 VALIDATION
  const validate = () => {
    let newErrors = {};

    if (!formData.address || formData.address.length < 15) {
      newErrors.address = "Address must be at least 15 characters";
    }

    const phoneRegex = /^(?:0|94|\+94)?7\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Enter valid Sri Lankan number (07XXXXXXXX)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // 🔥 PAYMENT FUNCTION (FINAL FIXED)
  const handlePayment = async () => {
    if (!validate()) {
      toast.error("Please fix errors");
      return;
    }

    setIsProcessing(true);
    const loadingToast = toast.loading("Creating Order...");

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await fetch(
        "http://localhost:8080/api/orders/checkout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            address: formData.address,
            phone: formatPhoneNumber(formData.phone),
            total: totalAmount,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Order failed", { id: loadingToast });
        setIsProcessing(false);
        return;
      }

      toast.success("Order Created", { id: loadingToast });

      // ✅ SAVE DATA FOR SUCCESS PAGE
      localStorage.setItem("orderData", JSON.stringify({
        id: result.orderId,
        total: result.amount,
        phone: formatPhoneNumber(formData.phone),
        address: formData.address,
      }));

      // 🔥 PAYHERE OBJECT
      const payment = {
        sandbox: true,
        merchant_id: "1235088",
        hash: result.hash,

        // (popup mode → these are ignored but safe to keep)
        return_url: "http://localhost:5173/order-success",
        cancel_url: "http://localhost:5173/order-success",
        notify_url: "http://localhost:8080/api/payment/notify",

        order_id: result.orderId,
        items: "Hardware Items",

        amount: result.amount,
        currency: "LKR",

        first_name: user?.name || "Customer",
        last_name: "User",
        email: user?.email || "test@gmail.com",
        phone: formatPhoneNumber(formData.phone),
        address: formData.address,
        city: "Colombo",
        country: "Sri Lanka",
      };

      // 🔥 IMPORTANT FIX (POPUP MODE)
      window.payhere.onCompleted = function () {
        console.log("Payment completed");

        // ✅ Navigate to success page
        navigate("/order-success");
      };

      window.payhere.onDismissed = function () {
        console.log("Payment popup closed");
      };

      window.payhere.onError = function (error) {
        console.log("Payment error:", error);
      };

      // 🚀 START PAYMENT
      window.payhere.startPayment(payment);

    } catch (err) {
      toast.error("Server error");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white px-6 py-12">

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 mb-10"
      >
        <ArrowLeft /> Back
      </button>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 space-y-8"
        >
          <div>
            <p className="text-yellow-400 text-xs flex items-center gap-2">
              <Lock size={14} /> Secure Checkout
            </p>
            <h1 className="text-5xl font-bold">Shipping Details</h1>
          </div>

          <textarea
            name="address"
            placeholder="Full Address"
            onChange={handleInputChange}
            className="w-full p-5 bg-[#111] border border-gray-800 rounded-xl focus:border-yellow-400 outline-none"
          />
          {errors.address && (
            <p className="text-red-400 text-sm">{errors.address}</p>
          )}

          <input
            name="phone"
            placeholder="07XXXXXXXX"
            onChange={handleInputChange}
            className="w-full p-5 bg-[#111] border border-gray-800 rounded-xl focus:border-yellow-400 outline-none"
          />
          {errors.phone && (
            <p className="text-red-400 text-sm">{errors.phone}</p>
          )}
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 bg-gradient-to-br from-[#111] to-[#0a0a0a] p-8 rounded-2xl border border-gray-800 shadow-2xl"
        >
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

          <div className="flex justify-between mb-4 text-gray-400">
            <span>Subtotal</span>
            <span>LKR {totalAmount}</span>
          </div>

          <div className="flex justify-between text-lg font-bold mb-6">
            <span>Total</span>
            <span className="text-yellow-400">LKR {totalAmount}</span>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full py-4 rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition"
          >
            {isProcessing ? "Processing..." : "Pay Securely"}
          </button>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
            <ShieldCheck size={14} />
            Secured by PayHere
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default CheckoutPage;