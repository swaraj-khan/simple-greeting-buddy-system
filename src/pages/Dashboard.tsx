
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import BuddyCard from '@/components/BuddyCard';
import Footer from '@/components/Footer';
import { ArrowLeft, Book, Bell, MessageSquare, User, Search, Calendar, Settings } from 'lucide-react';

const fakeMatches = [
  {
    id: "1",
    name: "Jessica Chen",
    field: "Computer Science",
    avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    availability: ["Evenings", "Weekends"],
    interests: ["Machine Learning", "Web Development", "Algorithms"],
    description: "Looking for a buddy to practice coding problems and work on small projects together.",
    matchPercentage: 95,
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    field: "Business",
    avatar: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    availability: ["Mornings", "Weekdays"],
    interests: ["Marketing", "Finance", "Entrepreneurship"],
    description: "Business student interested in discussing case studies and preparing for interviews.",
    matchPercentage: 87,
  },
  {
    id: "3",
    name: "Sophia Wilson",
    field: "Mathematics",
    avatar: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    availability: ["Afternoons", "Weekends"],
    interests: ["Calculus", "Linear Algebra", "Statistics"],
    description: "Math enthusiast seeking study partner for advanced coursework and exam preparation.",
    matchPercentage: 82,
  },
  {
    id: "4",
    name: "Daniel Park",
    field: "Psychology",
    avatar: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
    availability: ["Flexible", "Weekends"],
    interests: ["Cognitive Psychology", "Research Methods", "Behavioral Analysis"],
    description: "Psychology major looking for someone to discuss theories and research papers.",
    matchPercentage: 79,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Book className="h-6 w-6 mr-2 text-buddy-primary" />
              <span className="font-bold text-xl">StudyBuddy</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Bell className="h-5 w-5 text-gray-600 cursor-pointer hover:text-buddy-primary" />
              <MessageSquare className="h-5 w-5 text-gray-600 cursor-pointer hover:text-buddy-primary" />
              <div className="h-8 w-8 rounded-full bg-buddy-purple text-white flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            className="mr-4 p-0 hover:bg-transparent"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>
          <h1 className="text-2xl font-bold">Your Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3">
            <Card className="sticky top-24">
              <CardContent className="p-4">
                <div className="flex flex-col space-y-2">
                  {[
                    { icon: <User className="h-5 w-5" />, label: "Profile" },
                    { icon: <Search className="h-5 w-5" />, label: "Find Buddies" },
                    { icon: <MessageSquare className="h-5 w-5" />, label: "Messages" },
                    { icon: <Calendar className="h-5 w-5" />, label: "Sessions" },
                    { icon: <Settings className="h-5 w-5" />, label: "Settings" },
                  ].map((item, idx) => (
                    <Button
                      key={idx}
                      variant={idx === 1 ? "default" : "ghost"}
                      className={`justify-start ${idx === 1 ? 'bg-buddy-primary hover:bg-blue-600' : ''}`}
                    >
                      {item.icon}
                      <span className="ml-2">{item.label}</span>
                    </Button>
                  ))}
                </div>
                
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-buddy-primary mb-2">Complete Your Profile</h4>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div className="h-2 rounded-full bg-buddy-primary" style={{ width: '70%' }} />
                  </div>
                  <p className="text-sm text-gray-600">70% complete. Add your study schedule to improve matches.</p>
                  <Button className="w-full mt-4 bg-buddy-primary hover:bg-blue-600">
                    Update Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="col-span-12 md:col-span-9">
            <Tabs defaultValue="matches">
              <TabsList className="w-full grid grid-cols-3 mb-8">
                <TabsTrigger value="matches">
                  Buddy Matches
                  <Badge className="ml-2 bg-buddy-primary">4</Badge>
                </TabsTrigger>
                <TabsTrigger value="upcoming">
                  Upcoming Sessions
                  <Badge variant="outline" className="ml-2">2</Badge>
                </TabsTrigger>
                <TabsTrigger value="active">
                  Active Buddies
                  <Badge variant="outline" className="ml-2">3</Badge>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="matches" className="space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold">Your Study Buddy Matches</h2>
                  <Button variant="outline">
                    <Search className="h-4 w-4 mr-2" /> Filter Matches
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fakeMatches.map((buddy) => (
                    <BuddyCard key={buddy.id} {...buddy} />
                  ))}
                </div>
                
                <div className="flex justify-center mt-8">
                  <Button variant="outline">
                    View More Matches
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="upcoming">
                <div className="text-center py-16">
                  <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Upcoming Sessions</h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-6">
                    You don't have any study sessions scheduled. Connect with a buddy to plan your first session!
                  </p>
                  <Button className="bg-buddy-primary hover:bg-blue-600">
                    Schedule a Session
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="active">
                <div className="text-center py-16">
                  <User className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Active Buddy Connections</h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-6">
                    Connect with your matches to start collaborating on your learning journey together!
                  </p>
                  <Button className="bg-buddy-primary hover:bg-blue-600">
                    Browse Matches
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
