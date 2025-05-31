// useRecaptcha.js
import { useEffect, useRef, useState } from 'react';
import { RecaptchaVerifier } from 'firebase/auth';

export const useRecaptcha = (auth) => {
  const recaptchaVerifier = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [error, setError] = useState(null);

  const initializeRecaptcha = async () => {
    if (initializing || isReady) return;

    setInitializing(true);
    setError(null);

    try {
      // Clear any existing instance
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear();
        recaptchaVerifier.current = null;
      }

      // Create new verifier
      recaptchaVerifier.current = new RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
          callback: () => {
            console.log('reCAPTCHA solved');
            setIsReady(true);
          },
          'expired-callback': () => {
            console.log('reCAPTCHA expired');
            setIsReady(false);
          },
          'error-callback': (error) => {
            console.error('reCAPTCHA error:', error);
            setError(error);
            setIsReady(false);
          }
        },
        auth
      );

      // Render the widget
      await recaptchaVerifier.current.render();
      console.log('reCAPTCHA initialized');
      setIsReady(true);

    } catch (err) {
      console.error('reCAPTCHA initialization failed:', err);
      setError(err);
      setIsReady(false);
    } finally {
      setInitializing(false);
    }
  };

  useEffect(() => {
    if (auth && typeof window !== 'undefined') {
      initializeRecaptcha();
    }

    return () => {
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear();
        recaptchaVerifier.current = null;
      }
    };
  }, [auth]);

  const resetRecaptcha = async () => {
    await initializeRecaptcha();
  };

  return { recaptchaVerifier, isReady, error, resetRecaptcha, initializing };
};