import React from 'react';
import { ArrowRight, Star, Users, Award } from 'lucide-react';

const CallToAction: React.FC = () => {
  return (
    <section className="py-6 bg-gradient-to-r from-teal-600 via-teal-700 to-orange-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/3 w-12 h-12 bg-white rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Social Proof */}
          <div className="flex justify-center items-center space-x-2 mb-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-10 h-10 bg-white rounded-full border-2 border-white flex items-center justify-center">
                  <Users className="h-5 w-5 text-teal-600" />
                </div>
              ))}
            </div>
            <div className="text-white font-medium ml-4">
              Join 10,000+ professionals
            </div>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-2 leading-[1.15]">
            Join thousands of users achieving{' '}
            <span className="text-orange-200">career success</span>{' '}
            with CareerKit!
          </h2>

          {/* Subheading */}
          <p className="text-xl text-teal-100 mb-4 max-w-3xl mx-auto leading-[1.15]">
            Don't let your dream job slip away. Start building your perfect resume and career toolkit today.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center">
            <a href="/resume-builder" className="group bg-white text-teal-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center">
              Create Your First Resume
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CallToAction;