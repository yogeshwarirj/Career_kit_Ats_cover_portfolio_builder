import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const AuthCallbackPage: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      const type = searchParams.get('type');

      // Handle errors
      if (error) {
        setStatus('error');
        setMessage(errorDescription || 'Authentication failed');
        toast.error(errorDescription || 'Authentication failed');
        
        setTimeout(() => {
          navigate('/auth');
        }, 3000);
        return;
      }

      // Handle email confirmation
      if (type === 'signup') {
        setStatus('success');
        setMessage('Email confirmed successfully! You can now sign in.');
        toast.success('Email confirmed! You can now sign in.');
        
        setTimeout(() => {
          navigate('/auth');
        }, 2000);
        return;
      }

      // Handle password reset
      if (type === 'recovery') {
        setStatus('success');
        setMessage('Redirecting to password reset...');
        
        setTimeout(() => {
          navigate(`/auth/reset-password?access_token=${accessToken}&refresh_token=${refreshToken}`);
        }, 1000);
        return;
      }

      // Handle OAuth callback
      if (accessToken && refreshToken) {
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        if (sessionError) {
          setStatus('error');
          setMessage('Failed to establish session');
          toast.error('Authentication failed');
          
          setTimeout(() => {
            navigate('/auth');
          }, 3000);
          return;
        }

        if (data.user) {
          setStatus('success');
          setMessage('Successfully signed in! Redirecting...');
          toast.success('Successfully signed in!');
          
          setTimeout(() => {
            navigate('/');
          }, 1000);
          return;
        }
      }

      // If we get here, something unexpected happened
      setStatus('error');
      setMessage('Unexpected authentication state');
      
      setTimeout(() => {
        navigate('/auth');
      }, 3000);

    } catch (error) {
      console.error('Auth callback error:', error);
      setStatus('error');
      setMessage('An unexpected error occurred');
      toast.error('Authentication failed');
      
      setTimeout(() => {
        navigate('/auth');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        {/* Status Icon */}
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          {status === 'loading' && (
            <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full flex items-center justify-center">
              <Loader className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
          {status === 'success' && (
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          )}
          {status === 'error' && (
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
          )}
        </div>

        {/* Status Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {status === 'loading' && 'Processing...'}
          {status === 'success' && 'Success!'}
          {status === 'error' && 'Authentication Failed'}
        </h2>

        <p className="text-gray-600 mb-6">
          {message}
        </p>

        {/* Loading Animation */}
        {status === 'loading' && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        )}

        {/* Manual Navigation Button */}
        {status === 'error' && (
          <button
            onClick={() => navigate('/auth')}
            className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-300"
          >
            Return to Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthCallbackPage;