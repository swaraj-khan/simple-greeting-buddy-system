
import React, { useState } from 'react';
import { User, Clock, LogOut, CreditCard, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { HistorySidebar } from './HistorySidebar';
import AlertsSidebar from './AlertsSidebar';
import { Badge } from './ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const { logout, user } = useAuth();
  
  // Count of open alerts - we're using the mockData from AlertsSidebar
  const openAlertsCount = 2; // This is the count of items in mockAlerts.openAlerts
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4 px-6 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/55efddea-3c93-4ddd-ac9b-dbfa1c6a12c2.png" 
            alt="Draconic Logo" 
            className="h-8 object-contain"
          />
        </div>
        
        <div className="flex items-center gap-4">
          {/* Alerts Button */}
          <Sheet open={alertsOpen} onOpenChange={setAlertsOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground relative"
              >
                <Bell size={18} />
                {openAlertsCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {openAlertsCount}
                  </Badge>
                )}
                <span className="hidden sm:inline">Alerts</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 sm:w-96">
              <SheetHeader>
                <SheetTitle>Alerts</SheetTitle>
              </SheetHeader>
              <AlertsSidebar />
            </SheetContent>
          </Sheet>
          
          {/* History Button */}
          <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Clock size={18} />
                <span className="hidden sm:inline">History</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 sm:w-96">
              <SheetHeader>
                <SheetTitle>History</SheetTitle>
              </SheetHeader>
              <HistorySidebar />
            </SheetContent>
          </Sheet>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <User size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="flex flex-col">
                <div className="font-semibold">My Account</div>
                {user && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {user.name || user.email}
                  </div>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <User size={16} /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <CreditCard size={16} /> Billing
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="flex items-center gap-2 cursor-pointer text-red-500"
                onClick={logout}
              >
                <LogOut size={16} /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
