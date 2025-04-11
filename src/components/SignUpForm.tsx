
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight } from 'lucide-react';

const studyFields = [
  "Computer Science",
  "Business",
  "Mathematics",
  "Engineering",
  "Biology",
  "Chemistry",
  "Physics",
  "Medicine",
  "Psychology",
  "Literature",
  "History",
  "Art & Design",
  "Economics",
  "Law",
  "Languages",
];

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    field: '',
    goals: '',
    notifications: true,
  });
  
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, field: value }));
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, notifications: checked }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show success message
    toast({
      title: "Sign-up successful!",
      description: "We'll match you with study buddies soon.",
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      field: '',
      goals: '',
      notifications: true,
    });
    setStep(1);
  };
  
  const nextStep = () => {
    if (step === 1 && (!formData.name || !formData.email)) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields to continue.",
        variant: "destructive",
      });
      return;
    }
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-buddy-primary to-buddy-purple p-6 text-white">
        <h3 className="text-xl font-bold">Join Our Study Buddy Network</h3>
        <p className="text-sm opacity-90 mt-1">Find your perfect study match in minutes</p>
        
        <div className="flex items-center mt-4">
          {[1, 2].map((i) => (
            <React.Fragment key={i}>
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm 
                  ${step >= i ? 'bg-white text-buddy-primary' : 'bg-white/30 text-white'}`}
              >
                {i}
              </div>
              {i < 2 && (
                <div 
                  className={`h-1 flex-1 mx-2 ${step > 1 ? 'bg-white' : 'bg-white/30'}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {step === 1 ? (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Enter your full name" 
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                type="button" 
                className="w-full bg-buddy-primary hover:bg-blue-600"
                onClick={nextStep}
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="field">Study Field *</Label>
                <Select 
                  value={formData.field} 
                  onValueChange={handleSelectChange}
                  required
                >
                  <SelectTrigger id="field">
                    <SelectValue placeholder="Select your field of study" />
                  </SelectTrigger>
                  <SelectContent>
                    {studyFields.map((field) => (
                      <SelectItem key={field} value={field}>{field}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="goals">Your Learning Goals</Label>
                <Input 
                  id="goals" 
                  name="goals" 
                  placeholder="What do you hope to achieve?" 
                  value={formData.goals}
                  onChange={handleChange}
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="notifications" 
                  checked={formData.notifications}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="notifications" className="text-sm">
                  Send me buddy match notifications
                </Label>
              </div>
            </div>
            
            <div className="flex space-x-4 pt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={prevStep}
                className="w-1/2"
              >
                Back
              </Button>
              <Button 
                type="submit" 
                className="w-1/2 bg-buddy-primary hover:bg-blue-600"
              >
                Sign Up
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default SignUpForm;
