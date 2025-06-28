import { supabase } from './supabase';
import { AuthError, AuthResponse, User, Session } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

export interface AuthResult {
  success: boolean;
  user?: User;
  session?: Session;
  error?: string;
  needsEmailVerification?: boolean;
}

export interface PasswordResetResult {
  success: boolean;
  error?: string;
}

export class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Validate email format
   */
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  private validatePassword(password: string): { valid: boolean; error?: string } {
    if (password.length < 6) {
      return { valid: false, error: 'Password must be at least 6 characters long' };
    }
    return { valid: true };
  }

  /**
   * Check if email exists in database
   */
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      // Attempt to sign in with a dummy password to check if email exists
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: 'dummy_password_check'
      });

      // If error is invalid_credentials, email exists but password is wrong
      // If error is user_not_found, email doesn't exist
      if (error?.message.includes('Invalid login credentials')) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  }

  /**
   * Register new user
   */
  async signUp(email: string, password: string): Promise<AuthResult> {
    try {
      // Validate input
      if (!this.validateEmail(email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      const passwordValidation = this.validatePassword(password);
      if (!passwordValidation.valid) {
        return { success: false, error: passwordValidation.error };
      }

      // Check if email already exists
      const emailExists = await this.checkEmailExists(email);
      if (emailExists) {
        return { success: false, error: 'An account with this email already exists. Please sign in instead.' };
      }

      // Create new account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        return this.handleAuthError(error);
      }

      if (data.user && !data.session) {
        // Email confirmation required
        return {
          success: true,
          user: data.user,
          needsEmailVerification: true
        };
      }

      return {
        success: true,
        user: data.user,
        session: data.session
      };

    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'An unexpected error occurred during registration' };
    }
  }

  /**
   * Sign in existing user
   */
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      // Validate input
      if (!this.validateEmail(email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      if (!password) {
        return { success: false, error: 'Please enter your password' };
      }

      // Attempt sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return this.handleAuthError(error);
      }

      return {
        success: true,
        user: data.user,
        session: data.session
      };

    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'An unexpected error occurred during sign in' };
    }
  }

  /**
   * Sign in with Google OAuth
   */
  async signInWithGoogle(): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        return this.handleAuthError(error);
      }

      // OAuth redirect will handle the rest
      return { success: true };

    } catch (error) {
      console.error('Google sign in error:', error);
      return { success: false, error: 'Failed to sign in with Google. Please try again.' };
    }
  }

  /**
   * Sign in with GitHub OAuth
   */
  async signInWithGitHub(): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        return this.handleAuthError(error);
      }

      // OAuth redirect will handle the rest
      return { success: true };

    } catch (error) {
      console.error('GitHub sign in error:', error);
      return { success: false, error: 'Failed to sign in with GitHub. Please try again.' };
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<PasswordResetResult> {
    try {
      if (!this.validateEmail(email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) {
        if (error.message.includes('User not found')) {
          return { success: false, error: 'No account found with this email address' };
        }
        return { success: false, error: error.message };
      }

      return { success: true };

    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: 'Failed to send password reset email. Please try again.' };
    }
  }

  /**
   * Update password (for reset flow)
   */
  async updatePassword(newPassword: string): Promise<PasswordResetResult> {
    try {
      const passwordValidation = this.validatePassword(newPassword);
      if (!passwordValidation.valid) {
        return { success: false, error: passwordValidation.error };
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };

    } catch (error) {
      console.error('Password update error:', error);
      return { success: false, error: 'Failed to update password. Please try again.' };
    }
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };

    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: 'Failed to sign out. Please try again.' };
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<{ user: User | null; session: Session | null }> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      const { data: { session } } = await supabase.auth.getSession();

      if (error) {
        console.error('Get user error:', error);
        return { user: null, session: null };
      }

      return { user, session };

    } catch (error) {
      console.error('Get current user error:', error);
      return { user: null, session: null };
    }
  }

  /**
   * Listen for auth state changes
   */
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  /**
   * Resend email confirmation
   */
  async resendConfirmation(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.validateEmail(email)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };

    } catch (error) {
      console.error('Resend confirmation error:', error);
      return { success: false, error: 'Failed to resend confirmation email. Please try again.' };
    }
  }

  /**
   * Handle authentication errors with specific messages
   */
  private handleAuthError(error: AuthError): AuthResult {
    console.error('Auth error:', error);

    let errorMessage = 'An unexpected error occurred';

    if (error.message.includes('email_not_confirmed') || error.message.includes('Email not confirmed')) {
      errorMessage = 'Please check your email and click the verification link to activate your account';
    } else if (error.message.includes('invalid_credentials') || error.message.includes('Invalid login credentials')) {
      errorMessage = 'Invalid email or password. Please check your credentials and try again';
    } else if (error.message.includes('User already registered')) {
      errorMessage = 'An account with this email already exists. Please sign in instead';
    } else if (error.message.includes('Password should be at least 6 characters')) {
      errorMessage = 'Password must be at least 6 characters long';
    } else if (error.message.includes('Invalid email')) {
      errorMessage = 'Please enter a valid email address';
    } else if (error.message.includes('User not found')) {
      errorMessage = 'No account found with this email address';
    } else if (error.message.includes('Network error')) {
      errorMessage = 'Network error. Please check your connection and try again';
    } else if (error.message.includes('Too many requests')) {
      errorMessage = 'Too many attempts. Please wait a moment before trying again';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage
    };
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();