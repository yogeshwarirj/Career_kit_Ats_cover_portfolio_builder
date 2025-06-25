import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Search, Filter, Star, Crown, Zap, Shield, Eye, Download, Heart, Grid, List, ChevronDown, Award, Users, CheckCircle, Sparkles } from 'lucide-react';

const ResumeBuilder: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  // Comprehensive template data
  const templates = [
    {
      id: 1,
      name: 'Modern Professional',
      category: 'modern',
      description: 'Clean, contemporary design perfect for tech and business professionals',
      rating: 4.9,
      tags: ['ATS-Friendly', 'Tech', 'Business'],
      colors: ['#2563eb', '#1e40af', '#3b82f6'],
      isPremium: false,
      isPopular: true,
      layout: 'modern'
    },
    {
      id: 2,
      name: 'Executive Elite',
      category: 'executive',
      description: 'Sophisticated template for C-level executives and senior management',
      rating: 4.8,
      tags: ['Executive', 'Leadership', 'Premium'],
      colors: ['#1f2937', '#374151', '#6b7280'],
      isPremium: true,
      isPopular: true,
      layout: 'executive'
    },
    {
      id: 3,
      name: 'Creative Studio',
      category: 'creative',
      description: 'Bold, artistic design for designers, artists, and creative professionals',
      rating: 4.7,
      tags: ['Creative', 'Design', 'Portfolio'],
      colors: ['#7c3aed', '#a855f7', '#c084fc'],
      isPremium: true,
      isPopular: false,
      layout: 'creative'
    },
    {
      id: 4,
      name: 'Minimal Clean',
      category: 'minimal',
      description: 'Simple, distraction-free design that lets your content shine',
      rating: 4.6,
      tags: ['Minimal', 'Clean', 'Simple'],
      colors: ['#059669', '#10b981', '#34d399'],
      isPremium: false,
      isPopular: true,
      layout: 'minimal'
    },
    {
      id: 5,
      name: 'Tech Innovator',
      category: 'tech',
      description: 'Modern template designed specifically for software engineers and developers',
      rating: 4.9,
      tags: ['Tech', 'Developer', 'Engineering'],
      colors: ['#0ea5e9', '#0284c7', '#0369a1'],
      isPremium: true,
      isPopular: true,
      layout: 'tech'
    },
    {
      id: 6,
      name: 'Healthcare Pro',
      category: 'healthcare',
      description: 'Professional template for medical professionals and healthcare workers',
      rating: 4.8,
      tags: ['Healthcare', 'Medical', 'Professional'],
      colors: ['#dc2626', '#ef4444', '#f87171'],
      isPremium: true,
      isPopular: false,
      layout: 'healthcare'
    },
    {
      id: 7,
      name: 'Academic Scholar',
      category: 'academic',
      description: 'Traditional format perfect for academic positions and research roles',
      rating: 4.5,
      tags: ['Academic', 'Research', 'Traditional'],
      colors: ['#7c2d12', '#dc2626', '#ef4444'],
      isPremium: false,
      isPopular: false,
      layout: 'academic'
    },
    {
      id: 8,
      name: 'Sales Champion',
      category: 'sales',
      description: 'Dynamic template designed to showcase sales achievements and results',
      rating: 4.7,
      tags: ['Sales', 'Marketing', 'Results'],
      colors: ['#ea580c', '#f97316', '#fb923c'],
      isPremium: true,
      isPopular: true,
      layout: 'sales'
    },
    {
      id: 9,
      name: 'Finance Expert',
      category: 'finance',
      description: 'Professional template for finance, accounting, and banking professionals',
      rating: 4.6,
      tags: ['Finance', 'Banking', 'Accounting'],
      colors: ['#166534', '#16a34a', '#22c55e'],
      isPremium: true,
      isPopular: false,
      layout: 'finance'
    },
    {
      id: 10,
      name: 'Startup Founder',
      category: 'startup',
      description: 'Innovative template for entrepreneurs and startup founders',
      rating: 4.8,
      tags: ['Startup', 'Entrepreneur', 'Innovation'],
      colors: ['#7c3aed', '#8b5cf6', '#a78bfa'],
      isPremium: true,
      isPopular: false,
      layout: 'startup'
    },
    {
      id: 11,
      name: 'Legal Professional',
      category: 'legal',
      description: 'Conservative, professional template for lawyers and legal professionals',
      rating: 4.7,
      tags: ['Legal', 'Law', 'Professional'],
      colors: ['#1e293b', '#334155', '#475569'],
      isPremium: true,
      isPopular: false,
      layout: 'legal'
    },
    {
      id: 12,
      name: 'Fresh Graduate',
      category: 'entry-level',
      description: 'Perfect template for new graduates and entry-level professionals',
      rating: 4.4,
      tags: ['Graduate', 'Entry-Level', 'Student'],
      colors: ['#0891b2', '#06b6d4', '#22d3ee'],
      isPremium: false,
      isPopular: true,
      layout: 'graduate'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', count: templates.length },
    { id: 'modern', name: 'Modern', count: templates.filter(t => t.category === 'modern').length },
    { id: 'executive', name: 'Executive', count: templates.filter(t => t.category === 'executive').length },
    { id: 'creative', name: 'Creative', count: templates.filter(t => t.category === 'creative').length },
    { id: 'tech', name: 'Tech', count: templates.filter(t => t.category === 'tech').length },
    { id: 'healthcare', name: 'Healthcare', count: templates.filter(t => t.category === 'healthcare').length },
    { id: 'academic', name: 'Academic', count: templates.filter(t => t.category === 'academic').length },
    { id: 'sales', name: 'Sales', count: templates.filter(t => t.category === 'sales').length },
    { id: 'finance', name: 'Finance', count: templates.filter(t => t.category === 'finance').length },
    { id: 'minimal', name: 'Minimal', count: templates.filter(t => t.category === 'minimal').length },
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.rating - a.rating;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id - a.id;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // Template Preview Component
  const TemplatePreview: React.FC<{ template: any }> = ({ template }) => {
    const getLayoutStyle = (layout: string) => {
      switch (layout) {
        case 'modern':
          return (
            <div className="p-4 h-full bg-white">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full mr-3" style={{ backgroundColor: template.colors[0] }}></div>
                <div>
                  <div className="h-3 w-20 mb-1 rounded" style={{ backgroundColor: template.colors[0] }}></div>
                  <div className="h-2 w-16 bg-gray-300 rounded"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-1.5 bg-gray-200 rounded w-full"></div>
                <div className="h-1.5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-1.5 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="mt-4">
                <div className="h-2 w-16 mb-2 rounded" style={{ backgroundColor: template.colors[1] }}></div>
                <div className="space-y-1">
                  <div className="h-1 bg-gray-200 rounded w-full"></div>
                  <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                  <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 w-14 mb-2 rounded" style={{ backgroundColor: template.colors[1] }}></div>
                <div className="space-y-1">
                  <div className="h-1 bg-gray-200 rounded w-full"></div>
                  <div className="h-1 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          );
        case 'executive':
          return (
            <div className="p-4 h-full bg-white">
              <div className="text-center mb-4">
                <div className="h-4 w-24 mx-auto mb-2 rounded" style={{ backgroundColor: template.colors[0] }}></div>
                <div className="h-2 w-20 bg-gray-300 mx-auto rounded"></div>
                <div className="h-1 w-16 bg-gray-200 mx-auto rounded mt-1"></div>
              </div>
              <div className="border-t-2 border-gray-300 pt-3">
                <div className="h-2 w-20 mb-2 rounded" style={{ backgroundColor: template.colors[0] }}></div>
                <div className="space-y-1">
                  <div className="h-1 bg-gray-200 rounded w-full"></div>
                  <div className="h-1 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                </div>
              </div>
              <div className="mt-3">
                <div className="h-2 w-18 mb-2 rounded" style={{ backgroundColor: template.colors[0] }}></div>
                <div className="space-y-1">
                  <div className="h-1 bg-gray-200 rounded w-full"></div>
                  <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          );
        case 'creative':
          return (
            <div className="p-4 h-full bg-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-8" style={{ backgroundColor: template.colors[0] }}></div>
              <div className="pt-10">
                <div className="h-3 w-22 mb-2 rounded" style={{ backgroundColor: template.colors[1] }}></div>
                <div className="h-2 w-18 bg-gray-300 rounded mb-3"></div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <div className="h-1 bg-gray-200 rounded w-full"></div>
                    <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-1 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1 bg-gray-200 rounded w-full"></div>
                    <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full" style={{ backgroundColor: template.colors[2] }}></div>
            </div>
          );
        case 'minimal':
          return (
            <div className="p-4 h-full bg-white">
              <div className="mb-4">
                <div className="h-3 w-24 mb-2 rounded" style={{ backgroundColor: template.colors[0] }}></div>
                <div className="h-2 w-20 bg-gray-300 rounded"></div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="h-1.5 w-16 mb-2 rounded" style={{ backgroundColor: template.colors[0] }}></div>
                  <div className="space-y-1">
                    <div className="h-1 bg-gray-200 rounded w-full"></div>
                    <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-1 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
                <div>
                  <div className="h-1.5 w-14 mb-2 rounded" style={{ backgroundColor: template.colors[0] }}></div>
                  <div className="space-y-1">
                    <div className="h-1 bg-gray-200 rounded w-full"></div>
                    <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
                <div>
                  <div className="h-1.5 w-12 mb-2 rounded" style={{ backgroundColor: template.colors[0] }}></div>
                  <div className="space-y-1">
                    <div className="h-1 bg-gray-200 rounded w-full"></div>
                    <div className="h-1 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          );
        case 'tech':
          return (
            <div className="p-4 h-full bg-gray-900 text-white">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded mr-3" style={{ backgroundColor: template.colors[0] }}></div>
                <div>
                  <div className="h-2 w-18 mb-1 bg-white rounded"></div>
                  <div className="h-1.5 w-14 bg-gray-400 rounded"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-1 bg-gray-400 rounded w-full"></div>
                <div className="h-1 bg-gray-400 rounded w-5/6"></div>
                <div className="h-1 bg-gray-400 rounded w-4/5"></div>
              </div>
              <div className="mt-4 flex space-x-2">
                <div className="h-1.5 w-10 rounded" style={{ backgroundColor: template.colors[1] }}></div>
                <div className="h-1.5 w-8 rounded" style={{ backgroundColor: template.colors[2] }}></div>
                <div className="h-1.5 w-9 rounded" style={{ backgroundColor: template.colors[0] }}></div>
              </div>
              <div className="mt-4">
                <div className="h-1.5 w-16 mb-2 bg-white rounded"></div>
                <div className="space-y-1">
                  <div className="h-1 bg-gray-400 rounded w-full"></div>
                  <div className="h-1 bg-gray-400 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          );
        case 'healthcare':
          return (
            <div className="p-4 h-full bg-white">
              <div className="text-center mb-3">
                <div className="w-8 h-8 rounded-full mx-auto mb-2" style={{ backgroundColor: template.colors[0] }}></div>
                <div className="h-3 w-22 mx-auto mb-1 rounded" style={{ backgroundColor: template.colors[0] }}></div>
                <div className="h-2 w-18 bg-gray-300 mx-auto rounded"></div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="h-2 w-20 mb-2 rounded" style={{ backgroundColor: template.colors[1] }}></div>
                  <div className="space-y-1">
                    <div className="h-1 bg-gray-200 rounded w-full"></div>
                    <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                  </div>
                </div>
                <div>
                  <div className="h-2 w-16 mb-2 rounded" style={{ backgroundColor: template.colors[1] }}></div>
                  <div className="space-y-1">
                    <div className="h-1 bg-gray-200 rounded w-full"></div>
                    <div className="h-1 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          );
        case 'academic':
          return (
            <div className="p-4 h-full bg-white">
              <div className="text-center mb-4">
                <div className="h-3 w-24 mx-auto mb-2 rounded" style={{ backgroundColor: template.colors[0] }}></div>
                <div className="h-1.5 w-20 bg-gray-300 mx-auto rounded"></div>
                <div className="h-1 w-16 bg-gray-200 mx-auto rounded mt-1"></div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="h-1.5 w-18 mb-2 rounded font-bold" style={{ backgroundColor: template.colors[0] }}></div>
                  <div className="space-y-1">
                    <div className="h-1 bg-gray-200 rounded w-full"></div>
                    <div className="h-1 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                  </div>
                </div>
                <div>
                  <div className="h-1.5 w-16 mb-2 rounded" style={{ backgroundColor: template.colors[0] }}></div>
                  <div className="space-y-1">
                    <div className="h-1 bg-gray-200 rounded w-full"></div>
                    <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          );
        case 'sales':
          return (
            <div className="p-4 h-full bg-white">
              <div className="flex items-center mb-3">
                <div>
                  <div className="h-3 w-20 mb-1 rounded" style={{ backgroundColor: template.colors[0] }}></div>
                  <div className="h-2 w-16 bg-gray-300 rounded"></div>
                </div>
                <div className="ml-auto">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: template.colors[1] }}></div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="h-2 w-18 mb-2 rounded" style={{ backgroundColor: template.colors[0] }}></div>
                  <div className="flex space-x-2">
                    <div className="flex-1 space-y-1">
                      <div className="h-1 bg-gray-200 rounded w-full"></div>
                      <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                    </div>
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: template.colors[2] }}></div>
                  </div>
                </div>
                <div>
                  <div className="h-2 w-16 mb-2 rounded" style={{ backgroundColor: template.colors[0] }}></div>
                  <div className="space-y-1">
                    <div className="h-1 bg-gray-200 rounded w-full"></div>
                    <div className="h-1 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          );
        case 'finance':
          return (
            <div className="p-4 h-full bg-white">
              <div className="text-center mb-3">
                <div className="h-3 w-22 mx-auto mb-2 rounded" style={{ backgroundColor: template.colors[0] }}></div>
                <div className="h-2 w-18 bg-gray-300 mx-auto rounded"></div>
              </div>
              <div className="border-t border-gray-300 pt-3">
                <div className="space-y-3">
                  <div>
                    <div className="h-2 w-20 mb-2 rounded" style={{ backgroundColor: template.colors[1] }}></div>
                    <div className="space-y-1">
                      <div className="h-1 bg-gray-200 rounded w-full"></div>
                      <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                      <div className="h-1 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                  <div>
                    <div className="h-2 w-16 mb-2 rounded" style={{ backgroundColor: template.colors[1] }}></div>
                    <div className="space-y-1">
                      <div className="h-1 bg-gray-200 rounded w-full"></div>
                      <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        case 'startup':
          return (
            <div className="p-4 h-full bg-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-12 rounded-bl-full" style={{ backgroundColor: template.colors[0] }}></div>
              <div className="mb-3">
                <div className="h-3 w-20 mb-2 rounded" style={{ backgroundColor: template.colors[1] }}></div>
                <div className="h-2 w-16 bg-gray-300 rounded"></div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="h-2 w-18 mb-2 rounded" style={{ backgroundColor: template.colors[1] }}></div>
                  <div className="space-y-1">
                    <div className="h-1 bg-gray-200 rounded w-full"></div>
                    <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-2 w-8 rounded" style={{ backgroundColor: template.colors[2] }}></div>
                  <div className="h-2 w-6 rounded" style={{ backgroundColor: template.colors[0] }}></div>
                  <div className="h-2 w-7 rounded" style={{ backgroundColor: template.colors[1] }}></div>
                </div>
              </div>
            </div>
          );
        case 'legal':
          return (
            <div className="p-4 h-full bg-white">
              <div className="text-center mb-4">
                <div className="h-3 w-24 mx-auto mb-2 rounded" style={{ backgroundColor: template.colors[0] }}></div>
                <div className="h-1.5 w-20 bg-gray-300 mx-auto rounded"></div>
                <div className="h-1 w-18 bg-gray-200 mx-auto rounded mt-1"></div>
              </div>
              <div className="border-t-2 border-gray-400 pt-3">
                <div className="space-y-3">
                  <div>
                    <div className="h-2 w-20 mb-2 rounded" style={{ backgroundColor: template.colors[0] }}></div>
                    <div className="space-y-1">
                      <div className="h-1 bg-gray-200 rounded w-full"></div>
                      <div className="h-1 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                    </div>
                  </div>
                  <div>
                    <div className="h-2 w-18 mb-2 rounded" style={{ backgroundColor: template.colors[0] }}></div>
                    <div className="space-y-1">
                      <div className="h-1 bg-gray-200 rounded w-full"></div>
                      <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        case 'graduate':
          return (
            <div className="p-4 h-full bg-white">
              <div className="mb-3">
                <div className="h-3 w-22 mb-2 rounded" style={{ backgroundColor: template.colors[0] }}></div>
                <div className="h-2 w-18 bg-gray-300 rounded"></div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="h-2 w-16 mb-2 rounded" style={{ backgroundColor: template.colors[1] }}></div>
                  <div className="space-y-1">
                    <div className="h-1 bg-gray-200 rounded w-full"></div>
                    <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-1 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
                <div>
                  <div className="h-2 w-14 mb-2 rounded" style={{ backgroundColor: template.colors[1] }}></div>
                  <div className="space-y-1">
                    <div className="h-1 bg-gray-200 rounded w-full"></div>
                    <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
                <div>
                  <div className="h-2 w-12 mb-2 rounded" style={{ backgroundColor: template.colors[1] }}></div>
                  <div className="flex space-x-1">
                    <div className="h-1 w-8 bg-gray-200 rounded"></div>
                    <div className="h-1 w-6 bg-gray-200 rounded"></div>
                    <div className="h-1 w-7 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          );
        default:
          return (
            <div className="p-4 h-full bg-white">
              <div className="text-center mb-3">
                <div className="h-3 w-20 mx-auto mb-2 rounded" style={{ backgroundColor: template.colors[0] }}></div>
                <div className="h-2 w-16 bg-gray-300 mx-auto rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-1 bg-gray-200 rounded w-full"></div>
                <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                <div className="h-1 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="mt-3">
                <div className="h-1.5 w-14 mb-2 rounded" style={{ backgroundColor: template.colors[1] }}></div>
                <div className="space-y-1">
                  <div className="h-1 bg-gray-200 rounded w-full"></div>
                  <div className="h-1 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          );
      }
    };

    return (
      <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
        {getLayoutStyle(template.layout)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-teal-100/30 to-blue-100/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-orange-100/30 to-pink-100/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-r from-purple-100/30 to-indigo-100/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <ArrowLeft className="h-5 w-5 text-gray-600 mr-3 group-hover:text-teal-600 transition-colors duration-200" />
                <FileText className="h-8 w-8 text-teal-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">CareerKit</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-teal-600 text-white hover:bg-teal-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                Sign In to Save
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800 text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
            Professional Resume Templates Marketplace
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-[1.1] animate-fade-in-up">
            Choose from{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 animate-gradient-x">
              {templates.length}+ Professional
            </span>
            <br />
            Resume Templates
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed animate-fade-in-up delay-200">
            Discover industry-specific templates designed by HR experts. From modern to traditional, 
            find the perfect template that matches your career goals.
          </p>

          {/* Stats */}
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-500 mb-8">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-blue-500 mr-1" />
              <span>2M+ Users</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span>4.8 Avg Rating</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-green-500 mr-1" />
              <span>ATS-Optimized</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                  <option value="name">Name A-Z</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="flex items-center space-x-2 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-teal-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {sortedTemplates.length} of {templates.length} templates
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Templates Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedTemplates.map((template) => (
              <div
                key={template.id}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Template Preview */}
                <div className="relative">
                  <TemplatePreview template={template} />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                      <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200">
                        <Eye className="h-4 w-4 text-gray-700" />
                      </button>
                      <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200">
                        <Heart className="h-4 w-4 text-gray-700" />
                      </button>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col space-y-1">
                    {template.isPremium && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </span>
                    )}
                    {template.isPopular && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-pink-500 to-red-500 text-white">
                        <Zap className="h-3 w-3 mr-1" />
                        Popular
                      </span>
                    )}
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors duration-200">
                      {template.name}
                    </h3>
                    <div className="flex items-center text-yellow-400">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-xs text-gray-600 ml-1">{template.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {template.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                    {template.tags.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{template.tags.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Color Palette */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>Color Scheme</span>
                    <div className="flex space-x-1">
                      {template.colors.map((color, index) => (
                        <div 
                          key={index}
                          className="w-4 h-4 rounded-full border border-gray-200"
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-gradient-to-r from-teal-600 to-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-teal-700 hover:to-blue-700 transition-all duration-200">
                      Use Template
                    </button>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <Download className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {sortedTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center space-x-6">
                  {/* Template Preview */}
                  <div className="w-32 h-40 flex-shrink-0">
                    <TemplatePreview template={template} />
                  </div>

                  {/* Template Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-xl font-semibold text-gray-900">{template.name}</h3>
                          {template.isPremium && (
                            <Crown className="h-5 w-5 text-yellow-500" />
                          )}
                          {template.isPopular && (
                            <Zap className="h-5 w-5 text-pink-500" />
                          )}
                        </div>
                        <p className="text-gray-600 mb-3 text-lg">{template.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {template.tags.map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-yellow-400 mb-2">
                          <Star className="h-5 w-5 fill-current" />
                          <span className="text-lg text-gray-600 ml-1 font-medium">{template.rating}</span>
                        </div>
                        <div className="flex space-x-1 mb-3">
                          {template.colors.map((color, index) => (
                            <div 
                              key={index}
                              className="w-5 h-5 rounded-full border border-gray-200"
                              style={{ backgroundColor: color }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="text-right">
                    <div className="flex space-x-3">
                      <button className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-3 px-8 rounded-lg text-lg font-medium hover:from-teal-700 hover:to-blue-700 transition-all duration-200">
                        Use Template
                      </button>
                      <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <Eye className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {sortedTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Can't Find the Perfect Template?</h2>
          <p className="text-xl mb-8 opacity-90">Get access to our premium collection with 100+ exclusive templates</p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-white text-teal-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Upgrade to Premium
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-teal-600 transition-all duration-300">
              Request Custom Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;