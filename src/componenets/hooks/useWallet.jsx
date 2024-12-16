import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const useWallet = (userId) => {
  const [walletAmount, setWalletAmount] = useState(0);

  useEffect(() => {
    const initializeWallet = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/wallet`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setWalletAmount(response.data.walletAmount);
        toast.success('Wallet initialized successfully!');
      } catch (error) {
        console.error('Error initializing wallet:', error);
        toast.error('Failed to initialize wallet.');
      }
    };

    if (userId) {
      initializeWallet();
    }
  }, [userId]);

  return [walletAmount, setWalletAmount];
};

export default useWallet;
