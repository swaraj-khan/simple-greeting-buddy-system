
import React from 'react';
import { Button } from './ui/button';
import CandlestickChart from './CandlestickChart';
import { Badge } from './ui/badge';

interface ResponseCardProps {
  keywords: string[];
  summary: string[];
  followUps: string[];
  onFollowUpClick: (text: string) => void;
}

const ResponseCard = ({ keywords, summary, followUps, onFollowUpClick }: ResponseCardProps) => {
  return (
    <div className="bg-card rounded-lg shadow-lg overflow-hidden w-full max-w-3xl border border-border">
      <div className="h-64 bg-muted p-4">
        <CandlestickChart />
      </div>
      
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <Badge key={index} variant="outline" className="bg-secondary text-foreground border-draconic-orange/30 animate-badge-pulse" style={{ animationDelay: `${index * 0.2}s` }}>
              {keyword}
            </Badge>
          ))}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-draconic-gold">Summary</h3>
          <ul className="space-y-2">
            {summary.map((point, index) => (
              <li key={index} className="flex items-start">
                <span className="text-draconic-orange mr-2">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="pt-4 border-t border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Follow-up Questions</h3>
          <div className="flex flex-wrap gap-2">
            {followUps.map((question, index) => (
              <Button 
                key={index}
                variant="outline"
                size="sm"
                className="border-draconic-orange/30 hover:bg-draconic-orange/10 hover:text-draconic-gold"
                onClick={() => onFollowUpClick(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponseCard;
