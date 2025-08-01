import { useEffect, useRef } from 'react';
import socketService from '../../../clientel/src/services/socketService';

export const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = socketService.connect();
    
    return () => {
      socketService.disconnect();
    };
  }, []);

  return socketRef.current;
};