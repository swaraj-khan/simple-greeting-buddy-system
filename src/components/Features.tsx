
import React from 'react';
import { Check, Users, Brain, Calendar, Award, MessageCircle, Compass } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: <Users className="h-12 w-12 p-2 bg-blue-100 text-buddy-primary rounded-lg" />,
      title: "Smart Matching",
      description: "Our algorithm pairs you with buddies who share your goals, learning style, and availability."
    },
    {
      icon: <Brain className="h-12 w-12 p-2 bg-purple-100 text-buddy-purple rounded-lg" />,
      title: "Knowledge Sharing",
      description: "Exchange ideas, resources, and techniques to enhance your learning experience."
    },
    {
      icon: <Calendar className="h-12 w-12 p-2 bg-teal-100 text-buddy-teal rounded-lg" />,
      title: "Scheduled Sessions",
      description: "Set up regular study sessions that fit into your schedule for consistent progress."
    },
    {
      icon: <Award className="h-12 w-12 p-2 bg-blue-100 text-buddy-primary rounded-lg" />,
      title: "Goal Tracking",
      description: "Set shared learning goals and track your progress together."
    },
    {
      icon: <MessageCircle className="h-12 w-12 p-2 bg-purple-100 text-buddy-purple rounded-lg" />,
      title: "Easy Communication",
      description: "Built-in messaging to coordinate with your study buddy efficiently."
    },
    {
      icon: <Compass className="h-12 w-12 p-2 bg-teal-100 text-buddy-teal rounded-lg" />,
      title: "Diverse Subjects",
      description: "Find buddies across various subjects and specializations."
    },
  ];

  return (
    <div className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Buddy System</h2>
          <p className="text-gray-600">
            Our platform is designed to make learning collaborative, engaging, and more effective. 
            Here's how our buddy system helps you succeed in your studies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4">Proven Success Rate</h3>
              <p className="text-gray-600 mb-6">
                Students who use our buddy system report better retention, higher 
                motivation, and improved grades compared to studying alone.
              </p>
              <ul className="space-y-2">
                {['85% report increased productivity', '73% improved their grades', '91% would recommend to friends'].map((item, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1">
              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-buddy-primary">
                <blockquote className="italic text-gray-700">
                  "Finding a study buddy through this platform completely transformed my learning experience. 
                  We keep each other accountable and tackle difficult concepts together."
                </blockquote>
                <div className="mt-4 font-medium">
                  — Sarah J., Computer Science Student
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
