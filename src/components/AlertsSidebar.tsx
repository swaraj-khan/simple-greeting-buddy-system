
import React from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import { Separator } from './ui/separator';

interface Alert {
  id: number;
  title: string;
  time: string;
  description: string;
  insights: string;
}

interface MockAlerts {
  openAlerts: Alert[];
  triggeredAlerts: Alert[];
}

// Mock data for alerts
// In a real application, this would come from a database or API
const mockAlerts: MockAlerts = {
  openAlerts: [
    { id: 1, title: 'Price target reached for AAPL', time: '2:30 PM', description: 'Apple stock has reached your target price of $180.', insights: 'The stock has been trending upward for the last 3 days with increased volume.' },
    { id: 2, title: 'Unusual market volatility detected', time: '11:45 AM', description: 'Market volatility has increased significantly in the last hour.', insights: 'VIX index has risen 15% since market open, suggesting increased uncertainty.' },
  ],
  triggeredAlerts: [
    { id: 3, title: 'Earnings report for TSLA released', time: '3:15 PM', description: 'Tesla has released their quarterly earnings report.', insights: 'The company reported earnings of $2.27 per share, beating estimates of $1.81.' },
    { id: 4, title: 'Breaking news affecting portfolio', time: '10:20 AM', description: 'Major news affecting stocks in your portfolio.', insights: 'Federal Reserve announced unexpected rate changes, impacting financial sector stocks.' },
  ]
};

interface AlertsSidebarProps {}

export const AlertsSidebar: React.FC<AlertsSidebarProps> = () => {
  return (
    <div className="h-full pt-4 overflow-y-auto">
      {/* Open Alerts Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 px-4 mb-2">
          <Bell size={16} className="text-muted-foreground" />
          <h3 className="text-sm font-medium text-muted-foreground">Open Alerts</h3>
        </div>
        
        <div className="space-y-1">
          {mockAlerts.openAlerts.map((alert) => (
            <button
              key={alert.id}
              className="w-full text-left px-4 py-3 flex items-start hover:bg-accent rounded-md transition-colors group"
              onClick={() => window.dispatchEvent(new CustomEvent('show-alert-detail', { detail: { alert, type: 'open' } }))}
            >
              <Bell size={16} className="mt-0.5 mr-3 text-muted-foreground group-hover:text-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-foreground">
                  {alert.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  created at {alert.time}
                </p>
              </div>
            </button>
          ))}
        </div>
        
        <Separator className="mt-4 mb-4" />
      </div>

      {/* Triggered Alerts Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 px-4 mb-2">
          <CheckCircle size={16} className="text-muted-foreground" />
          <h3 className="text-sm font-medium text-muted-foreground">Triggered Alerts</h3>
        </div>
        
        <div className="space-y-1">
          {mockAlerts.triggeredAlerts.map((alert) => (
            <button
              key={alert.id}
              className="w-full text-left px-4 py-3 flex items-start hover:bg-accent rounded-md transition-colors group"
              onClick={() => window.dispatchEvent(new CustomEvent('show-alert-detail', { detail: { alert, type: 'triggered' } }))}
            >
              <CheckCircle size={16} className="mt-0.5 mr-3 text-muted-foreground group-hover:text-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-foreground">
                  {alert.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  triggered at {alert.time}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="px-4 py-3 mt-auto">
        <p className="text-xs text-center text-muted-foreground">
          Your alerts are updated in real-time
        </p>
      </div>
    </div>
  );
};

export default AlertsSidebar;
