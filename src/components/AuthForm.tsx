import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Loader, CheckCircle, AlertCircle, Github } from 'lucide-react';
import { authService } from '../lib/auth';
import toast from 'react-hot-toast';

interface AuthFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
  initialMode?: 'signin' | 'signup' | 'reset';
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess, onClose, initialMode = 'signin' }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset' | 'email-sent'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (mode !== 'reset' && !formData.password) {
      toast.error('Please enter your password');
      return false;
    }

    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const result = await authService.signUp(formData.email, formData.password);
        
        if (result.success) {
          if (result.needsEmailVerification) {
            setUserEmail(formData.email);
            setMode('email-sent');
            toast.success('Account created! Please check your email for verification.');
          } else {
            toast.success('Account created successfully!');
            if (onSuccess) onSuccess();
          }
        } else {
          toast.error(result.error || 'Failed to create account');
        }
      } else if (mode === 'signin') {
        const result = await authService.signIn(formData.email, formData.password);
        
        if (result.success) {
          toast.success('Signed in successfully!');
          if (onSuccess) onSuccess();
        } else {
          toast.error(result.error || 'Failed to sign in');
        }
      } else if (mode === 'reset') {
        const result = await authService.resetPassword(formData.email);
        
        if (result.success) {
          setUserEmail(formData.email);
          setMode('email-sent');
          toast.success('Password reset email sent!');
        } else {
          toast.error(result.error || 'Failed to send reset email');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    
    try {
      const result = provider === 'google' 
        ? await authService.signInWithGoogle()
        : await authService.signInWithGitHub();
      
      if (!result.success) {
        toast.error(result.error || `Failed to sign in with ${provider}`);
      }
      // Success will be handled by redirect
    } catch (error) {
      console.error(`${provider} auth error:`, error);
      toast.error(`Failed to sign in with ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resendConfirmation = async () => {
    if (!userEmail) return;
    
    setIsLoading(true);
    try {
      const result = await authService.resendConfirmation(userEmail);
      
      if (result.success) {
        toast.success('Confirmation email sent!');
      } else {
        toast.error(result.error || 'Failed to resend email');
      }
    } catch (error) {
      console.error('Resend error:', error);
      toast.error('Failed to resend confirmation email');
    } finally {
      setIsLoading(false);
    }
  };

  // Email Sent Confirmation Screen
  if (mode === 'email-sent') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h2>
            <p className="text-gray-600 mb-4">
              We've sent a {mode === 'reset' ? 'password reset' : 'verification'} link to:
            </p>
            <p className="text-teal-600 font-semibold text-lg">
              {userEmail}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the link in the email</li>
                <li>Return here and sign in</li>
              </ol>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={resendConfirmation}
              disabled={isLoading}
              className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader className="h-5 w-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Resend Email'
              )}
            </button>
            
            <button
              onClick={() => setMode('signin')}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {mode === 'signup' ? 'Create Account' : 
             mode === 'reset' ? 'Reset Password' : 
             'Welcome Back'}
          </h2>
          <p className="text-gray-600">
            {mode === 'signup' 
              ? 'Join CareerKit to save and manage your career documents' 
              : mode === 'reset'
              ? 'Enter your email to receive a password reset link'
              : 'Sign in to access your saved resumes and cover letters'
            }
          </p>
        </div>

        {/* Social Auth Buttons */}
        {mode !== 'reset' && (
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialAuth('google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            
            <button
              onClick={() => handleSocialAuth('github')}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Github className="h-5 w-5 mr-3" />
              Continue with GitHub
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Field */}
          {mode !== 'reset' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                  autoComplete={mode === 'signup' ? "new-password" : "current-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Confirm Password Field (Sign Up Only) */}
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  placeholder="Confirm your password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-teal-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader className="h-5 w-5 mr-2 animate-spin" />
                {mode === 'signup' ? 'Creating Account...' : 
                 mode === 'reset' ? 'Sending Email...' : 
                 'Signing In...'}
              </>
            ) : (
              <>
                {mode === 'signup' ? 'Create Account' : 
                 mode === 'reset' ? 'Send Reset Email' : 
                 'Sign In'}
              </>
            )}
          </button>
        </form>

        {/* Mode Toggle */}
        <div className="mt-6 text-center space-y-2">
          {mode === 'reset' ? (
            <p className="text-gray-600">
              Remember your password?
              <button
                onClick={() => setMode('signin')}
                className="ml-2 text-teal-600 hover:text-teal-700 font-medium transition-colors duration-200"
              >
                Sign In
              </button>
            </p>
          ) : (
            <>
              <p className="text-gray-600">
                {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                <button
                  onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                  className="ml-2 text-teal-600 hover:text-teal-700 font-medium transition-colors duration-200"
                >
                  {mode === 'signup' ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
              
              {mode === 'signin' && (
                <p className="text-sm text-gray-500">
                  Forgot your password?{' '}
                  <button
                    onClick={() => setMode('reset')}
                    className="text-teal-600 hover:text-teal-700 font-medium transition-colors duration-200"
                  >
                    Reset it here
                  </button>
                </p>
              )}
            </>
          )}
        </div>

        {/* Features List */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">With your CareerKit account:</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span>Save unlimited resumes and cover letters</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span>Access your documents from any device</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span>Track ATS optimization scores</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span>Sync across all your devices</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;