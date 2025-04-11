
import React from 'react';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import SignUpForm from '@/components/SignUpForm';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { ArrowRight, Book } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Book className="h-6 w-6 mr-2 text-buddy-primary" />
              <span className="font-bold text-xl">StudyBuddy</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-buddy-primary">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-buddy-primary">How It Works</a>
              <a href="#sign-up" className="text-gray-600 hover:text-buddy-primary">Sign Up</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline">Login</Button>
              <Link to="/dashboard">
                <Button className="bg-buddy-primary hover:bg-blue-600 hidden md:inline-flex">
                  Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <section id="features">
        <Features />
      </section>
      
      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">How StudyBuddy Works</h2>
            <p className="text-gray-600">
              Our simple process gets you connected with the right study partner in just a few steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Your Profile",
                description: "Sign up and tell us about your study goals, preferences, and availability."
              },
              {
                step: "2",
                title: "Get Matched",
                description: "Our algorithm finds compatible study buddies based on your profile information."
              },
              {
                step: "3",
                title: "Start Collaborating",
                description: "Connect with your matches and begin your collaborative learning journey."
              }
            ].map((item, idx) => (
              <div key={idx} className="relative bg-white p-8 rounded-lg shadow-md border border-gray-100">
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-buddy-primary text-white flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mt-4 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Sign Up Section */}
      <section id="sign-up" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Study Buddy?</h2>
            <p className="text-gray-600">
              Sign up today and get matched with compatible study partners who share your goals.
            </p>
          </div>
          
          <SignUpForm />
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
