import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-hot-toast";

const DELIVERY_FEE = 300;

const CheckoutPage = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [formData, setFormData] = useState({
    address: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  // 🔥 LOAD CART
  useEffect(() => {
    const fetchCart = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      try {
        const res = await fetch(`http://localhost:8080/api/cart/user/${user.id}`);
        const data = await res.json();
        setCartItems(data);

        const sub = data.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );

        setSubtotal(sub);
        setTotalAmount(sub + DELIVERY_FEE);

      } catch (err) {
        toast.error("Failed to load cart");
      }
    };

    fetchCart();
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

  // 🔥 PAYMENT
  const handlePayment = async () => {
    if (!validate()) {
      toast.error("Fix form errors");
      return;
    }

    setIsProcessing(true);

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const res = await fetch("http://localhost:8080/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          address: formData.address,
          phone: formatPhoneNumber(formData.phone),
          total: totalAmount,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error("Order failed");
        setIsProcessing(false);
        return;
      }

      const payment = {
        sandbox: true,
        merchant_id: "1235088",
        hash: result.hash,

        return_url: "http://localhost:5173/payment-success",
        cancel_url: "http://localhost:5173/payment-cancel",
        notify_url: "http://localhost:8080/api/payment/notify",

        order_id: result.orderId,
        items: "Hardware Items",

        amount: result.amount,
        currency: "LKR",

        first_name: "Customer",
        email: "test@gmail.com",
        phone: formatPhoneNumber(formData.phone),
        address: formData.address,
        city: "Colombo",
        country: "Sri Lanka",
      };

      window.payhere.onCompleted = function () {
        setOrderId(result.orderId);
        setIsSuccess(true);
        localStorage.removeItem("cart");
        localStorage.removeItem("lastCartTotal");
      };

      window.payhere.onDismissed = function () {
        toast.error("Payment Cancelled");
        setIsProcessing(false);
      };

      window.payhere.onError = function () {
        toast.error("Payment Error");
        setIsProcessing(false);
      };

      window.payhere.startPayment(payment);

    } catch (err) {
      toast.error("Server error");
      setIsProcessing(false);
    }
  };

  // ✅ SUCCESS PAGE
  if (isSuccess) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center space-y-4">
          <CheckCircle2 size={70} className="text-green-500 mx-auto" />
          <h1 className="text-3xl font-bold">Payment Successful</h1>
          <p>Order ID: {orderId}</p>
          <button onClick={() => navigate("/")}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">

      <button onClick={() => navigate(-1)} className="mb-8 text-gray-400">
        <ArrowLeft /> Back
      </button>

      <div className="grid lg:grid-cols-12 gap-10 max-w-7xl mx-auto">

        {/* LEFT */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-7 bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 space-y-6"
        >
          <h1 className="text-4xl font-bold">Shipping Details</h1>

          <textarea
            name="address"
            placeholder="Full Address"
            onChange={handleInputChange}
            className="w-full p-4 bg-black/50 border border-gray-700 rounded-xl"
          />
          {errors.address && <p className="text-red-400">{errors.address}</p>}

          <input
            name="phone"
            placeholder="07XXXXXXXX"
            onChange={handleInputChange}
            className="w-full p-4 bg-black/50 border border-gray-700 rounded-xl"
          />
          {errors.phone && <p className="text-red-400">{errors.phone}</p>}
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-5 bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10"
        >
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between mb-3">
              <div>
                <p>{item.product.name}</p>
                <p className="text-sm text-gray-400">
                  {item.quantity} × LKR {item.product.price}
                </p>
              </div>
              <p className="text-yellow-400 font-bold">
                LKR {(item.product.price * item.quantity)}
              </p>
            </div>
          ))}

          <div className="border-t border-gray-700 mt-4 pt-4">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>LKR {subtotal}</span>
            </div>

            <div className="flex justify-between text-gray-400">
              <span>Delivery</span>
              <span>LKR {DELIVERY_FEE}</span>
            </div>

            <div className="flex justify-between text-xl font-bold mt-2">
              <span>Total</span>
              <span className="text-yellow-400">LKR {totalAmount}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full mt-6 py-4 rounded-xl bg-yellow-400 text-black font-semibold"
          >
            {isProcessing ? "Processing..." : "Pay Securely"}
          </button>

        </motion.div>

      </div>
    </div>
  );
};

export default CheckoutPage;