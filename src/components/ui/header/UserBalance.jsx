import React, { useState, useEffect } from 'react';
import { CreditCard, Loader2, ShoppingBag, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../button';
import { useAuth } from '../../../context/AuthContext'; // 
import { motion } from 'framer-motion';
import { toast } from 'sonner'; // Ensure you have sonner ins
import {  getBalanceUser } from '../../../lib/walletApi';


const UserBalance = () => {
  const { user } = useAuth();
  const [userBalance, setUserBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showBalanceUpdated, setShowBalanceUpdated] = useState(false);
  const [prevBalance, setPrevBalance] = useState(0);
  const navigate = useNavigate();

  const fetchUserBalance = async () => {
  if (user) {
        try {
          const response = await getBalanceUser(user.id);
          const safeBalance = Math.max(0, response.balance || 0);

          if (userBalance !== 0 && safeBalance !== userBalance) {
            setPrevBalance(userBalance);
            setShowBalanceUpdated(true);

            if (safeBalance < 10) {
              toast.warning('Your balance is low', {
                description: 'Please add funds to continue making purchases.'
              });
            }

            setTimeout(() => {
              setShowBalanceUpdated(false);
            }, 3000);
          }

          setUserBalance(safeBalance);
        } catch (error) {
          console.error('Error fetching user balance:', error);
          toast.error('Failed to fetch balance');
        } finally {
          setIsLoading(false);
        }
      }
  };

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    fetchUserBalance();

    const intervalId = setInterval(fetchUserBalance, 30 * 60 * 1000); 

    const handlePurchaseEvent = () => {
      fetchUserBalance();
    };

    const handleInsufficientFundsEvent = () => {
      toast.error('Insufficient balance', {
        description: 'Please add funds to your account'
      });
      navigate('/payment');
    };

    window.addEventListener('purchase-completed', handlePurchaseEvent);
    window.addEventListener('insufficient-funds', handleInsufficientFundsEvent);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('purchase-completed', handlePurchaseEvent);
      window.removeEventListener('insufficient-funds', handleInsufficientFundsEvent);
    };
  }, [user, userBalance]);

  const handleClick = () => {
    navigate('/payment');
  };

  if ( isLoading) {
      return (
   <Loader2 className="h-8 w-8 animate-spin text-primary" />
  );
  }

  const balanceChange = userBalance - prevBalance;
  const isPositiveChange = balanceChange > 0;

  return (
    
      
       <div className="relative flex items-center mr-2">
      {showBalanceUpdated && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`absolute -bottom-10 right-0 px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
            isPositiveChange 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}
        >
         Balance {isPositiveChange ? 'increased' : 'decreased'} by {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(balanceChange))}

        </motion.div>
      )}
      {
        user && (
          
      <Link to='/payment' className='hover:text-white hover:bg-blue-950 font-medium flex items-center mt-auto rounded-full border border-gray-400 px-4 m-1 p-2 w-fit'
      >
        <CreditCard className="h-4 w-4" />
        <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(userBalance)}</span>
        {userBalance < 10 && user &&    (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Low
          </span>
        )}
        </Link>
    

        )
      }

      {
        user && (
      
      <Link to="/checkout" className='hover:text-white hover:bg-blue-950 font-medium flex items-center mt-auto rounded-full border border-gray-400 px-4 p-2 m-1 w-fit' >
          <ShoppingBag className="h-6 w-6 hover:red-600" />
      </Link>
         
         
        )
      }
      {
        user && (

          
                  <Link to="/account"  className='hover:text-white hover:bg-blue-950 font-medium flex items-center  rounded-full border border-gray-400 px-4 py-2 w-fit'>
                        <User className="h-6 w-6" />
                    </Link>
                
        )
      }
    </div>
    
    
 
  );
};

export default UserBalance;
