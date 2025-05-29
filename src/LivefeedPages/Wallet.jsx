import React, { useState ,useEffect} from 'react';
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCcw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Star,
  Award,
  Coins,
  TrendingUp
} from 'lucide-react';
import { loadRazorpayScript } from '../utils/razorpayUtils';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const Wallet = () => {
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [walletData, setWalletData] = useState({
    earnedPoints: 0,
    rechargedPoints: 0,
    totalPoints: 0
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
const walletAmount = useSelector((state) => state.user.walletAmount);
  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/balance`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setWalletData({
        earnedPoints: response.data.earnedPoints,
        rechargedPoints: response.data.rechargedPoints,
        totalPoints: response.data.totalPoints
      });
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      toast.error("Failed to load wallet data");
    }
  };

  const handleRecharge = async () => {
    if (!rechargeAmount || isNaN(rechargeAmount) || rechargeAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      
      // Create Razorpay order
      const orderResponse = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/recharge`,
        { amount: rechargeAmount },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Load Razorpay script if not already loaded
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        order_id: orderResponse.data.orderId,
        name: "Your App Name",
        description: "Wallet Recharge",
        handler: async (response) => {
          await verifyPayment(response);
        },
        modal: {
          ondismiss: function() {
            toast.warn("Payment was cancelled by user");
          }
        },
        theme: {
          color: "#3399cc"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.response?.data?.message || "Payment initialization failed");
    } finally {
      setIsProcessing(false);
      setShowRechargeModal(false);
    }
  };

  const verifyPayment = async (razorpayResponse) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/verifypayment`,
        {
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
          amount: rechargeAmount
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success("Wallet recharged successfully!");
        fetchWalletData(); // Refresh wallet data
      } else {
        throw new Error(response.data.message || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Payment verification failed");
    }
  };
 

  const handleWithdraw = async () => {
    // Implement withdrawal logic
    console.log('Initiating points withdrawal');
    setShowWithdrawModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-600 dark:text-green-400';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 dark:bg-slate-800">
      <div className="flex items-center space-x-3 mb-8">
        <Coins className="w-8 h-8 text-yellow-500" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Points</h1>
      </div>

      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <Coins className="w-8 h-8" />
            <span className="text-sm text-blue-100">Total Balance</span>
          </div>
          <div className="text-3xl font-bold">
            {walletData.totalPoints} Points
          </div>
          <div className="mt-2 text-sm text-blue-100">
            Available for use
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8" />
            <span className="text-sm text-green-100">Earned Points</span>
          </div>
          <div className="text-3xl font-bold">
            {walletData.earnedPoints} Points
          </div>
          <div className="mt-2 text-sm text-green-100">
            From engagements
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" />
            <span className="text-sm text-purple-100">Recharged Points</span>
          </div>
          <div className="text-3xl font-bold">
            {walletData.rechargedPoints} Points
          </div>
          <div className="mt-2 text-sm text-purple-100">
            Added balance
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setShowRechargeModal(true)}
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl py-3 font-medium hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Get More Points
        </button>
        <button
          //onClick={() => setShowWithdrawModal(true)}
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl py-3 font-medium hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Redeem Points
        </button>
      </div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Clock className="w-6 h-6 text-gray-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Points History
            </h2>
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {transactions.map((transaction) => (
            <div
              key={transaction._id || transaction.id}
              className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                {getStatusIcon(transaction.status)}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {transaction.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(transaction.timestamp).toLocaleDateString('en-GB')}
                    </span>
                    {transaction.reference && (
                      <>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Ref: {transaction.reference}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Coins className={`w-4 h-4 ${getStatusColor(transaction.status)}`} />
                  <span className={`font-medium ${getStatusColor(transaction.status)}`}>
                    {transaction.type === 'withdraw' ? '-' : '+'}{transaction.amount}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recharge Modal */}
      {showRechargeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Coins className="w-6 h-6 text-yellow-500" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Get More Points
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter Points Amount
                </label>
                <div className="relative">
                  <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={rechargeAmount}
                    onChange={(e) => setRechargeAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter points amount"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRechargeModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRecharge}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700"
                >
                  Purchase Points
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Award className="w-6 h-6 text-green-500" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Redeem Points
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Coins className="w-5 h-5 text-yellow-500" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Available points for redemption: {walletData.earnedPoints}
                  </p>
                </div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter Points to Redeem
                </label>
                <div className="relative">
                  <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter points"
                    max={walletData.earnedPoints}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
               <button
  //onClick={handleWithdraw}
  disabled={isButtonDisabled} 
  className={`px-4 py-2 bg-gradient-to-r text-white rounded-lg ${
    isButtonDisabled 
      ? 'from-gray-400 to-gray-500 cursor-not-allowed' 
      : 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
  }`}
>
  Redeem Points
</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;