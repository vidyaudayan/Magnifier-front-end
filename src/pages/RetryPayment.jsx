import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function RetryPaymentPage() {
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const pending = localStorage.getItem("pendingPost");
    if (pending) {
      setPaymentData(JSON.parse(pending));
    } else {
      toast.error("No pending payment found.");
      navigate("/"); // Redirect if no data found
    }
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRetryPayment = async () => {
    const token = localStorage.getItem("token");
    setIsProcessing(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        throw new Error("Payment SDK failed to load.");
      }

      const retryRes = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/create-payment-intent`,
        {
          amount: Math.round(paymentData.amount * 100),
          postId: paymentData.draftId,
          duration: paymentData.duration,
          startHour: paymentData.startHour,
          endHour: paymentData.endHour,
          stickyStartUTC: paymentData.stickyStartUTC,
          stickyEndUTC: paymentData.stickyEndUTC
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { order, paymentId } = retryRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        order_id: order.id,
        name: "Retry Payment",
        description: `Retrying payment for post`,
        handler: async function (response) {
          await verifyPayment(response, paymentId);
        },
        theme: {
          color: "#3b82f6",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Retry payment error:", error);
      toast.error("Retry failed. Please try again later.");
    } finally {
      setIsProcessing(false);
    }
  };

  const verifyPayment = async (response, paymentId) => {
    const token = localStorage.getItem("token");
    try {
      const verifyRes = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/verifypayment`,
        {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          postId: paymentData.draftId,
          paymentId,
          amount: Math.round(paymentData.amount * 100),
          duration: paymentData.duration,
          startHour: paymentData.startHour,
          endHour: paymentData.endHour,
          stickyStartUTC: paymentData.stickyStartUTC,
          stickyEndUTC: paymentData.stickyEndUTC
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (verifyRes.data.success) {
        toast.success("Payment completed successfully!");
        navigate("/success");
      } else {
        throw new Error("Verification failed");
      }
    } catch (error) {
      console.error("Retry verification error:", error);
      toast.error("Retry verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Retry Payment
        </h2>

        {paymentData ? (
          <>
            <div className="mt-4 bg-red-100 p-4 rounded-md text-red-800 font-medium">
              Previous payment attempt was not completed.
            </div>
            <div className="mt-4 space-y-2">
              <p>
                <strong>Post ID:</strong> {paymentData.draftId}
              </p>
              <p>
                <strong>Amount:</strong> ₹{paymentData.amount}
              </p>
              <p>
                <strong>Slot:</strong> {paymentData.startHour}:00 - {paymentData.endHour}:00
              </p>
              <p>
                <strong>Duration:</strong> {paymentData.duration} hours
              </p>
            </div>
            <button
              className={`mt-6 w-full py-3 rounded-lg text-white ${isProcessing ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
              onClick={handleRetryPayment}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Retry Payment"}
            </button>
          </>
        ) : (
          <p>Loading payment details...</p>
        )}
      </div>
    </div>
  );
}
