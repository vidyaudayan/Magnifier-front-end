import React, { useState } from "react";
import axios from "axios";
import { CreditCard, User, Lock } from "lucide-react";
import { Modal } from "./Model";
import { SuccessAnimation } from "./SuccesAnimation";
import { Button } from "./Button";
import { useNavigate } from "react-router-dom";

export const VoterSubscriptionModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const appName = import.meta.env.VITE_APP_NAME || "voterMagnifier";

  const handleSubscribe = () => {
    setShowConfirmation(true);
  };

  const handleLogin = () => {
    alert("Proceeding to login...");
    onClose();
  };

  const handleConfirmSubscription = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("No authentication token found. Please log in first.");
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/subscribe/with-points`,
        {
          username: formData.username,
          password: formData.password,
          appName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setShowConfirmation(false);
          onClose();
          navigate("/dashboard/voter");
        }, 2000);
      } else {
        alert(response.data.message || "Subscription failed.");
      }
    } catch (error) {
      if (error.response) {
        const errorMsg = error.response.data.message || "";

        if (
          errorMsg.toLowerCase().includes("insufficient") &&
          errorMsg.toLowerCase().includes("point")
        ) {
          alert("You don't have enough points. Redirecting to Wallet...");
          onClose();
          navigate("/livefeed/wallet");
        } else {
          alert(errorMsg || "Something went wrong!");
        }

        console.error("Backend error response:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("No response from server.");
      } else {
        console.error("Error setting up request:", error.message);
        alert("Error: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setShowConfirmation(false);
  };

  if (showSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="">
        <SuccessAnimation />
      </Modal>
    );
  }

  if (showConfirmation) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Confirm Subscription">
        <form onSubmit={handleConfirmSubscription} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <User size={18} />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, username: e.target.value }))
                  }
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, password: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={handleBack}
              disabled={isLoading}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Confirm Subscription"}
            </Button>
          </div>
        </form>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Subscription Options">
      <div className="space-y-6">
        <div className="text-center mb-4">
          <h4 className="text-lg font-medium">Choose your subscription option</h4>
          <p className="text-gray-500 mt-1">Get access to premium features</p>
        </div>

        <div className="p-4 border border-blue-100 bg-blue-50 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-600 rounded-full text-white">
              <CreditCard size={20} />
            </div>
            <div>
              <h5 className="font-medium">Subscribe with Points</h5>
              <p className="text-gray-600 text-sm mt-1">
                Use 100 points to subscribe to our premium plan
              </p>
              <Button onClick={handleSubscribe} className="mt-3" variant="primary">
                Subscribe for 100 Points
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
