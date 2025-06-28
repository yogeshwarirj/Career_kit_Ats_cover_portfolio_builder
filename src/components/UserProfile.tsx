import React, { useState, useEffect } from 'react';
import { User, FileText, Mail, Target, Briefcase, LogOut, Settings, Download, Trash2, Eye, Calendar, Star } from 'lucide-react';
import { auth } from '../lib/supabase';
import { supabaseService, CoverLetterData, ATSOptimizedResume, Portfolio } from '../lib/supabaseService';
import { ResumeData } from '../lib/localStorage';
import toast from 'react-hot-toast';

interface UserProfileProps {
  user: any;
  onClose: () => void;
  onSignOut: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onClose, onSignOut }) => {
  const [activeTab, setActiveTab] = useState<'resumes' | 'cover-letters' | 'ats-resumes' | 'portfolios'>('resumes');
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetterData[]>([]);
  const [atsResumes, setATSResumes] = useState<ATSOptimizedResume[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const [resumesResult, coverLettersResult, atsResumesResult, portfoliosResult] = await Promise.all([
        supabaseService.getResumes(),
        supabaseService.getCoverLetters(),
        supabaseService.getATSResumes(),
        supabaseService.getPortfolios()
      ]);

      if (resumesResult.success) setResumes(resumesResult.data || []);
      if (coverLettersResult.success) setCoverLetters(coverLettersResult.data || []);
      if (atsResumesResult.success) setATSResumes(atsResumesResult.data || []);
      if (portfoliosResult.success) setPortfolios(portfoliosResult.data || []);
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load your data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      toast.success('Signed out successfully');
      onSignOut();
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleDelete = async (type: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      let result;
      switch (type) {
        case 'resume':
          result = await supabaseService.deleteResume(id);
          if (result.success) {
            setResumes(prev => prev.filter(item => item.id !== id));
            toast.success('Resume deleted successfully');
          }
          break;
        case 'cover-letter':
          result = await supabaseService.deleteCoverLetter(id);
          if (result.success) {
            setCoverLetters(prev => prev.filter(item => item.id !== id));
            toast.success('Cover letter deleted successfully');
          }
          break;
        case 'ats-resume':
          result = await supabaseService.deleteATSResume(id);
          if (result.success) {
            setATSResumes(prev => prev.filter(item => item.id !== id));
            toast.success('ATS resume deleted successfully');
          }
          break;
        case 'portfolio':
          result = await supabaseService.deletePortfolio(id);
          if (result.success) {
            setPortfolios(prev => prev.filter(item => item.id !== id));
            toast.success('Portfolio deleted successfully');
          }
          break;
      }

      if (result && !result.success) {
        toast.error(result.error || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete item');
    }
  };

  const tabs = [
    { id: 'resumes', name: 'Resumes', icon: FileText, count: resumes.length },
    { id: 'cover-letters', name: 'Cover Letters', icon: Mail, count: coverLetters.length },
    { id: 'ats-resumes', name: 'ATS Optimized', icon: Target, count: atsResumes.length },
    { id: 'portfolios', name: 'Portfolios', icon: Briefcase, count: portfolios.length }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.email}</h2>
                <p className="text-teal-100">CareerKit Member</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSignOut}
                className="flex items-center px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              <span className="ml-2 text-gray-600">Loading your data...</span>
            </div>
          ) : (
            <>
              {/* Resumes Tab */}
              {activeTab === 'resumes' && (
                <div className="space-y-4">
                  {resumes.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
                      <p className="text-gray-600">Start building your first resume!</p>
                    </div>
                  ) : (
                    resumes.map((resume) => (
                      <div key={resume.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{resume.title}</h4>
                            <p className="text-sm text-gray-600">
                              Template: {resume.template} • Version: {resume.version}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Last modified: {new Date(resume.lastModified).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200">
                              <Download className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete('resume', resume.id)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Cover Letters Tab */}
              {activeTab === 'cover-letters' && (
                <div className="space-y-4">
                  {coverLetters.length === 0 ? (
                    <div className="text-center py-12">
                      <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No cover letters yet</h3>
                      <p className="text-gray-600">Generate your first cover letter!</p>
                    </div>
                  ) : (
                    coverLetters.map((letter) => (
                      <div key={letter.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{letter.job_title}</h4>
                            <p className="text-sm text-gray-600">{letter.company_name}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Created: {new Date(letter.created_at || '').toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200">
                              <Download className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete('cover-letter', letter.id!)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ATS Resumes Tab */}
              {activeTab === 'ats-resumes' && (
                <div className="space-y-4">
                  {atsResumes.length === 0 ? (
                    <div className="text-center py-12">
                      <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No ATS optimized resumes yet</h3>
                      <p className="text-gray-600">Optimize your first resume for ATS!</p>
                    </div>
                  ) : (
                    atsResumes.map((atsResume) => (
                      <div key={atsResume.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">ATS Optimized Resume</h4>
                            <p className="text-sm text-gray-600">
                              Score: {atsResume.analysis_result?.overallScore || 'N/A'}%
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Created: {new Date(atsResume.created_at || '').toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 mr-1" />
                              <span className="text-sm font-medium">
                                {atsResume.analysis_result?.overallScore || 0}%
                              </span>
                            </div>
                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-green-600 transition-colors duration-200">
                              <Download className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete('ats-resume', atsResume.id!)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Portfolios Tab */}
              {activeTab === 'portfolios' && (
                <div className="space-y-4">
                  {portfolios.length === 0 ? (
                    <div className="text-center py-12">
                      <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolios yet</h3>
                      <p className="text-gray-600">Add your first portfolio link!</p>
                    </div>
                  ) : (
                    portfolios.map((portfolio) => (
                      <div key={portfolio.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{portfolio.title}</h4>
                            <p className="text-sm text-gray-600">{portfolio.description}</p>
                            <a 
                              href={portfolio.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-teal-600 hover:text-teal-700 mt-1 inline-block"
                            >
                              {portfolio.url}
                            </a>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete('portfolio', portfolio.id!)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;