import { encryptData, decryptData } from './encryption';
import debounce from 'lodash.debounce';

export interface ResumeData {
  id: string;
  title: string;
  personalInfo: any;
  summary: string;
  experience: any[];
  education: any[];
  skills: any;
  certifications: any[];
  template: string;
  lastModified: string;
  version: number;
}

export interface ResumeVersion {
  id: string;
  resumeId: string;
  version: number;
  data: ResumeData;
  timestamp: string;
  changes: string[];
}

const STORAGE_KEYS = {
  RESUMES: 'careerkit_resumes',
  VERSIONS: 'careerkit_versions',
  CURRENT_USER: 'careerkit_user',
  SYNC_QUEUE: 'careerkit_sync_queue'
};

export class LocalStorageManager {
  private static instance: LocalStorageManager;
  private syncQueue: string[] = [];

  static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager();
    }
    return LocalStorageManager.instance;
  }

  // Save resume with encryption
  saveResume(resume: ResumeData): void {
    try {
      const resumes = this.getAllResumes();
      const existingIndex = resumes.findIndex(r => r.id === resume.id);
      
      if (existingIndex !== -1) {
        resumes[existingIndex] = resume;
      } else {
        resumes.push(resume);
      }

      const encrypted = encryptData(resumes);
      localStorage.setItem(STORAGE_KEYS.RESUMES, encrypted);
      
      // Add to sync queue for later Supabase sync
      this.addToSyncQueue(resume.id);
      
      // Save version
      this.saveVersion(resume);
    } catch (error) {
      console.error('Error saving resume:', error);
    }
  }

  // Auto-save with debounce
  autoSave = debounce((resume: ResumeData) => {
    this.saveResume(resume);
  }, 2000);

  // Get all resumes
  getAllResumes(): ResumeData[] {
    try {
      const encrypted = localStorage.getItem(STORAGE_KEYS.RESUMES);
      if (!encrypted) return [];
      
      const decrypted = decryptData(encrypted);
      return Array.isArray(decrypted) ? decrypted : [];
    } catch (error) {
      console.error('Error loading resumes:', error);
      return [];
    }
  }

  // Get specific resume
  getResume(id: string): ResumeData | null {
    const resumes = this.getAllResumes();
    return resumes.find(r => r.id === id) || null;
  }

  // Delete resume
  deleteResume(id: string): void {
    try {
      const resumes = this.getAllResumes().filter(r => r.id !== id);
      const encrypted = encryptData(resumes);
      localStorage.setItem(STORAGE_KEYS.RESUMES, encrypted);
      
      // Remove versions
      this.deleteVersions(id);
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
  }

  // Version management
  saveVersion(resume: ResumeData): void {
    try {
      const versions = this.getVersions(resume.id);
      const newVersion: ResumeVersion = {
        id: `${resume.id}_v${resume.version}`,
        resumeId: resume.id,
        version: resume.version,
        data: { ...resume },
        timestamp: new Date().toISOString(),
        changes: [] // Would track specific changes in production
      };

      versions.push(newVersion);
      
      // Keep only last 10 versions
      const limitedVersions = versions.slice(-10);
      
      const allVersions = this.getAllVersions();
      const filteredVersions = allVersions.filter(v => v.resumeId !== resume.id);
      const updatedVersions = [...filteredVersions, ...limitedVersions];
      
      const encrypted = encryptData(updatedVersions);
      localStorage.setItem(STORAGE_KEYS.VERSIONS, encrypted);
    } catch (error) {
      console.error('Error saving version:', error);
    }
  }

  getVersions(resumeId: string): ResumeVersion[] {
    const allVersions = this.getAllVersions();
    return allVersions.filter(v => v.resumeId === resumeId);
  }

  getAllVersions(): ResumeVersion[] {
    try {
      const encrypted = localStorage.getItem(STORAGE_KEYS.VERSIONS);
      if (!encrypted) return [];
      
      const decrypted = decryptData(encrypted);
      return Array.isArray(decrypted) ? decrypted : [];
    } catch (error) {
      console.error('Error loading versions:', error);
      return [];
    }
  }

  deleteVersions(resumeId: string): void {
    try {
      const allVersions = this.getAllVersions();
      const filteredVersions = allVersions.filter(v => v.resumeId !== resumeId);
      const encrypted = encryptData(filteredVersions);
      localStorage.setItem(STORAGE_KEYS.VERSIONS, encrypted);
    } catch (error) {
      console.error('Error deleting versions:', error);
    }
  }

  // Sync queue management
  addToSyncQueue(resumeId: string): void {
    if (!this.syncQueue.includes(resumeId)) {
      this.syncQueue.push(resumeId);
      localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(this.syncQueue));
    }
  }

  getSyncQueue(): string[] {
    try {
      const queue = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      return queue ? JSON.parse(queue) : [];
    } catch (error) {
      console.error('Error loading sync queue:', error);
      return [];
    }
  }

  clearSyncQueue(): void {
    this.syncQueue = [];
    localStorage.removeItem(STORAGE_KEYS.SYNC_QUEUE);
  }

  // Clear all data
  clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    this.syncQueue = [];
  }
}