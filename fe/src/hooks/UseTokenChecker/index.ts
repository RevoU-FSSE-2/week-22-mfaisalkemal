// useTokenChecker.js
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';


const useTokenChecker = (token: string | null) => {
  const showNotification = useNotification();
  const navigate = useNavigate();

  const checkToken = useCallback((token: string) => {
    if (!token) {
      showNotification('warning', 'Unauthorized', 'Lu debt collector mana bro?');
      navigate('/login');
    }
  }, [showNotification, navigate]);

  useEffect(() => {
    checkToken(token!);
  }, [checkToken, token]);
};

export default useTokenChecker;
