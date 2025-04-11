
import React from 'react';
import { Book, Github, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center">
              <Book className="h-6 w-6 mr-2 text-buddy-primary" />
              <span className="font-bold text-xl">StudyBuddy</span>
            </div>
            <p className="mt-4 text-gray-600 max-w-md">
              Connect with like-minded learners and achieve your educational goals together.
              Our platform makes collaborative learning easy and effective.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-buddy-primary">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-buddy-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-buddy-primary">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
            <div>
              <h4 className="font-semibold text-sm uppercase text-gray-500 mb-4">Platform</h4>
              <ul className="space-y-2">
                {['How It Works', 'Features', 'Testimonials', 'Pricing', 'FAQ'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 hover:text-buddy-primary">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm uppercase text-gray-500 mb-4">Resources</h4>
              <ul className="space-y-2">
                {['Study Tips', 'Blog', 'Events', 'Guides', 'Success Stories'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 hover:text-buddy-primary">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm uppercase text-gray-500 mb-4">Company</h4>
              <ul className="space-y-2">
                {['About Us', 'Careers', 'Privacy Policy', 'Terms of Service', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-600 hover:text-buddy-primary">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © 2025 StudyBuddy. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-buddy-primary">Privacy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-buddy-primary">Terms</a></li>
              <li><a href="#" className="text-gray-600 hover:text-buddy-primary">Cookies</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
