
import React from 'react';

interface WatchlistItem {
  name: string;
}

interface WatchlistCardProps {
  title: string;
  description: string;
  items: WatchlistItem[];
}

const WatchlistCard = ({ title, description, items }: WatchlistCardProps) => {
  // Split items into two columns
  const firstColumn = items.slice(0, Math.ceil(items.length / 2));
  const secondColumn = items.slice(Math.ceil(items.length / 2));

  return (
    <div className="overflow-hidden h-[400px] flex flex-col rounded-lg bg-secondary">
      <div className="flex flex-col h-full">
        {/* Top 25% section - fixed height ratio */}
        <div style={{ height: "25%" }} className="honeycomb-bg border-b border-border flex-none">
          <div className="p-4">
            <h3 className="text-primary text-xl font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        
        {/* Bottom 75% section */}
        <div style={{ height: "75%" }} className="overflow-auto flex-grow">
          <div className="p-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-2">
                {firstColumn.map((item, index) => (
                  <div 
                    key={`item-${index}`} 
                    className="text-sm p-2 bg-background rounded-md"
                  >
                    {item.name}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                {secondColumn.map((item, index) => (
                  <div 
                    key={`item-${index}`} 
                    className="text-sm p-2 bg-background rounded-md"
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchlistCard;
