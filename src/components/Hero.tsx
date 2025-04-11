
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BookOpen, Calendar } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white -z-10" />
      
      <div className="container px-4 py-20 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in">
              Find Your Perfect <span className="text-buddy-primary">Study Buddy</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Connect with like-minded learners, collaborate on projects, and achieve your goals together. Our matching system pairs you with the ideal study partner.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button size="lg" className="bg-buddy-primary hover:bg-blue-600">
                Sign Up Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                How It Works
              </Button>
            </div>
          </div>
          
          <div className="flex-1 animate-slide-up">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-buddy-primary to-buddy-purple rounded-xl blur-xl opacity-20 -z-10" />
              <div className="relative bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                <div className="grid grid-cols-2 gap-2 p-6">
                  {[
                    { icon: <Users className="h-10 w-10 text-buddy-primary" />, text: "1000+ Active Buddies" },
                    { icon: <BookOpen className="h-10 w-10 text-buddy-purple" />, text: "50+ Study Fields" },
                    { icon: <Calendar className="h-10 w-10 text-buddy-teal" />, text: "Flexible Scheduling" },
                    { icon: <Users className="h-10 w-10 text-buddy-primary" />, text: "Smart Matching" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                      {item.icon}
                      <span className="mt-2 text-sm font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-r from-buddy-primary to-buddy-purple p-4 text-white text-center">
                  <p className="font-medium">Join 5,000+ students already connected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
