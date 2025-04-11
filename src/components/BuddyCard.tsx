
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from 'lucide-react';

interface BuddyCardProps {
  id: string;
  name: string;
  field: string;
  avatar: string;
  availability: string[];
  interests: string[];
  description: string;
  matchPercentage: number;
}

const BuddyCard = ({
  id,
  name,
  field,
  avatar,
  availability,
  interests,
  description,
  matchPercentage
}: BuddyCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative">
        {matchPercentage >= 90 && (
          <div className="absolute top-0 right-0 bg-buddy-primary text-white px-3 py-1 text-xs font-bold">
            Top Match
          </div>
        )}
        <div className="h-24 bg-gradient-to-r from-buddy-primary to-buddy-purple" />
      </div>
      
      <div className="flex justify-center -mt-12">
        <div className="h-24 w-24 rounded-full border-4 border-white overflow-hidden bg-white">
          <img 
            src={avatar} 
            alt={name} 
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      
      <CardHeader className="text-center pt-2 pb-2">
        <CardTitle>{name}</CardTitle>
        <CardDescription className="font-medium text-buddy-primary">
          {field}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm font-medium text-gray-500 mb-1">Match</div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="h-2.5 rounded-full bg-gradient-to-r from-buddy-primary to-buddy-purple" 
              style={{ width: `${matchPercentage}%` }}
            />
          </div>
          <div className="text-right text-xs mt-1 text-gray-500">{matchPercentage}% compatible</div>
        </div>
        
        <p className="text-gray-600 text-sm">{description}</p>
        
        <div>
          <div className="text-sm font-medium text-gray-500 mb-1">Interests</div>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, i) => (
              <Badge key={i} variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium text-gray-500 mb-1">Availability</div>
          <div className="flex flex-wrap gap-2">
            {availability.map((time, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {time}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button variant="outline" className="w-[48%]">View Profile</Button>
        <Button className="w-[48%] bg-buddy-primary hover:bg-blue-600">
          <MessageSquare className="mr-2 h-4 w-4" /> Connect
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BuddyCard;
