import { supabase } from './supabase';
import { LocalStorageManager, ResumeData } from './localStorage';

export class SupabaseSync {
  private static instance: SupabaseSync;
  private localStorage: LocalStorageManager;

  constructor() {
    this.localStorage = LocalStorageManager.getInstance();
  }

  static getInstance(): SupabaseSync {
    if (!SupabaseSync.instance) {
      SupabaseSync.instance = new SupabaseSync();
    }
    return SupabaseSync.instance;
  }

  // Sync all local resumes to Supabase after login
  async syncToSupabase(userId: string): Promise<void> {
    try {
      const localResumes = this.localStorage.getAllResumes();
      const syncQueue = this.localStorage.getSyncQueue();

      for (const resume of localResumes) {
        if (syncQueue.includes(resume.id)) {
          await this.uploadResume(userId, resume);
        }
      }

      // Clear sync queue after successful sync
      this.localStorage.clearSyncQueue();
    } catch (error) {
      console.error('Sync error:', error);
      throw new Error('Failed to sync resumes to cloud storage');
    }
  }

  // Upload single resume to Supabase
  async uploadResume(userId: string, resume: ResumeData): Promise<void> {
    try {
      const { error } = await supabase
        .from('resumes')
        .upsert({
          id: resume.id,
          user_id: userId,
          title: resume.title,
          resume_data: {
            personalInfo: resume.personalInfo,
            summary: resume.summary,
            experience: resume.experience,
            education: resume.education,
            skills: resume.skills,
            certifications: resume.certifications
          },
          template_used: resume.template,
          version: resume.version,
          last_updated: resume.lastModified
        });

      if (error) throw error;

      // Log the change
      await this.logChange(resume.id, 'full_sync', resume);
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  // Download resumes from Supabase
  async downloadResumes(userId: string): Promise<ResumeData[]> {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .order('last_updated', { ascending: false });

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        title: item.title,
        personalInfo: item.resume_data.personalInfo,
        summary: typeof item.resume_data.summary === 'string' ? item.resume_data.summary : item.resume_data.summary?.summary || '',
        experience: item.resume_data.experience,
        education: item.resume_data.education,
        skills: item.resume_data.skills,
        certifications: item.resume_data.certifications,
        template: item.template_used,
        lastModified: item.last_updated,
        version: item.version
      }));
    } catch (error) {
      console.error('Download error:', error);
      throw new Error('Failed to download resumes from cloud storage');
    }
  }

  // Merge local and cloud data
  async mergeData(userId: string): Promise<void> {
    try {
      const localResumes = this.localStorage.getAllResumes();
      const cloudResumes = await this.downloadResumes(userId);

      // Create a map for easier comparison
      const localMap = new Map(localResumes.map(r => [r.id, r]));
      const cloudMap = new Map(cloudResumes.map(r => [r.id, r]));

      // Merge logic: keep the most recent version
      const mergedResumes: ResumeData[] = [];

      // Add all cloud resumes, updating local if cloud is newer
      for (const cloudResume of cloudResumes) {
        const localResume = localMap.get(cloudResume.id);
        
        if (!localResume || new Date(cloudResume.lastModified) > new Date(localResume.lastModified)) {
          mergedResumes.push(cloudResume);
        } else {
          mergedResumes.push(localResume);
          // Upload local version if it's newer
          await this.uploadResume(userId, localResume);
        }
      }

      // Add local-only resumes
      for (const localResume of localResumes) {
        if (!cloudMap.has(localResume.id)) {
          mergedResumes.push(localResume);
          await this.uploadResume(userId, localResume);
        }
      }

      // Save merged data locally
      mergedResumes.forEach(resume => {
        this.localStorage.saveResume(resume);
      });

    } catch (error) {
      console.error('Merge error:', error);
      throw new Error('Failed to merge local and cloud data');
    }
  }

  // Log changes for audit trail
  async logChange(resumeId: string, section: string, changeData: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('resume_changes_log')
        .insert({
          resume_id: resumeId,
          changed_section: section,
          change_data: changeData,
          change_timestamp: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Change log error:', error);
      // Don't throw - logging is not critical
    }
  }

  // Delete resume from Supabase
  async deleteResume(resumeId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resumeId);

      if (error) throw error;
    } catch (error) {
      console.error('Delete error:', error);
      throw new Error('Failed to delete resume from cloud storage');
    }
  }
}