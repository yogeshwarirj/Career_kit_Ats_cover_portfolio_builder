import { supabase } from './supabase';
import { ResumeData } from './localStorage';

export interface CoverLetterData {
  id?: string;
  user_id?: string;
  job_title: string;
  company_name: string;
  personal_info: any;
  skills: string[];
  job_description?: string;
  generated_letter: string;
  template: string;
  created_at?: string;
  last_updated?: string;
}

export interface ATSOptimizedResume {
  id?: string;
  user_id?: string;
  original_resume_id?: string;
  job_description_used: string;
  optimized_resume_data: any;
  analysis_result: any;
  created_at?: string;
  last_updated?: string;
}

export interface Portfolio {
  id?: string;
  user_id?: string;
  title: string;
  description?: string;
  url: string;
  image_url?: string;
  created_at?: string;
  last_updated?: string;
}

export class SupabaseService {
  private static instance: SupabaseService;

  static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  // Resume operations
  async saveResume(resume: ResumeData): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const resumeData = {
        user_id: user.id,
        title: resume.title,
        resume_data: resume,
        template_used: resume.template,
        version: resume.version,
        last_updated: new Date().toISOString()
      };

      const { error } = await supabase
        .from('resumes')
        .upsert(resumeData, { onConflict: 'id' });

      if (error) {
        console.error('Error saving resume:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error saving resume:', error);
      return { success: false, error: 'Failed to save resume' };
    }
  }

  async getResumes(): Promise<{ success: boolean; data?: ResumeData[]; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('last_updated', { ascending: false });

      if (error) {
        console.error('Error fetching resumes:', error);
        return { success: false, error: error.message };
      }

      const resumes = data?.map(item => item.resume_data as ResumeData) || [];
      return { success: true, data: resumes };
    } catch (error) {
      console.error('Error fetching resumes:', error);
      return { success: false, error: 'Failed to fetch resumes' };
    }
  }

  async deleteResume(resumeId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resumeId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting resume:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting resume:', error);
      return { success: false, error: 'Failed to delete resume' };
    }
  }

  // Cover Letter operations
  async saveCoverLetter(coverLetter: CoverLetterData): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const coverLetterData = {
        ...coverLetter,
        user_id: user.id,
        last_updated: new Date().toISOString()
      };

      const { error } = await supabase
        .from('cover_letters')
        .upsert(coverLetterData, { onConflict: 'id' });

      if (error) {
        console.error('Error saving cover letter:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error saving cover letter:', error);
      return { success: false, error: 'Failed to save cover letter' };
    }
  }

  async getCoverLetters(): Promise<{ success: boolean; data?: CoverLetterData[]; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('cover_letters')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cover letters:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching cover letters:', error);
      return { success: false, error: 'Failed to fetch cover letters' };
    }
  }

  async deleteCoverLetter(coverLetterId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('cover_letters')
        .delete()
        .eq('id', coverLetterId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting cover letter:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting cover letter:', error);
      return { success: false, error: 'Failed to delete cover letter' };
    }
  }

  // ATS Optimized Resume operations
  async saveATSResume(atsResume: ATSOptimizedResume): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const atsResumeData = {
        ...atsResume,
        user_id: user.id,
        last_updated: new Date().toISOString()
      };

      const { error } = await supabase
        .from('ats_optimized_resumes')
        .upsert(atsResumeData, { onConflict: 'id' });

      if (error) {
        console.error('Error saving ATS resume:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error saving ATS resume:', error);
      return { success: false, error: 'Failed to save ATS resume' };
    }
  }

  async getATSResumes(): Promise<{ success: boolean; data?: ATSOptimizedResume[]; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('ats_optimized_resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching ATS resumes:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching ATS resumes:', error);
      return { success: false, error: 'Failed to fetch ATS resumes' };
    }
  }

  async deleteATSResume(atsResumeId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('ats_optimized_resumes')
        .delete()
        .eq('id', atsResumeId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting ATS resume:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting ATS resume:', error);
      return { success: false, error: 'Failed to delete ATS resume' };
    }
  }

  // Portfolio operations
  async savePortfolio(portfolio: Portfolio): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const portfolioData = {
        ...portfolio,
        user_id: user.id,
        last_updated: new Date().toISOString()
      };

      const { error } = await supabase
        .from('portfolios')
        .upsert(portfolioData, { onConflict: 'id' });

      if (error) {
        console.error('Error saving portfolio:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error saving portfolio:', error);
      return { success: false, error: 'Failed to save portfolio' };
    }
  }

  async getPortfolios(): Promise<{ success: boolean; data?: Portfolio[]; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching portfolios:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      return { success: false, error: 'Failed to fetch portfolios' };
    }
  }

  async deletePortfolio(portfolioId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', portfolioId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting portfolio:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      return { success: false, error: 'Failed to delete portfolio' };
    }
  }
}

export const supabaseService = SupabaseService.getInstance();