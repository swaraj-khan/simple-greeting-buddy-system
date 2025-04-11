
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface Alert {
  id: number;
  title: string;
  time: string;
  description: string;
  insights: string;
}

interface AlertData {
  alert: Alert;
  type: 'open' | 'triggered';
}

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alertData: AlertData | null;
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, alertData }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Initialize audio on component mount
  useEffect(() => {
    // Try to load the custom notification sound
    audioRef.current = new Audio('/notification.mp3');
    audioRef.current.volume = 0.7; // Set volume to 70%
    
    // Add error handler for when the file doesn't exist or can't be loaded
    audioRef.current.addEventListener('error', () => {
      console.warn('Could not load notification.mp3, using fallback sound');
      audioRef.current = null;
    });
    
    return () => {
      // Clean up audio context if it exists
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(err => {
          console.error('Error closing audio context:', err);
        });
      }
    };
  }, []);

  // Create a fallback notification sound using Web Audio API
  const playFallbackSound = () => {
    try {
      // Create audio context if it doesn't exist
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const context = audioContextRef.current;
      
      // Create oscillator
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      // Configure oscillator
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, context.currentTime); // A5 note
      oscillator.frequency.exponentialRampToValueAtTime(440, context.currentTime + 0.2); // A4 note
      
      // Configure gain (volume)
      gainNode.gain.setValueAtTime(0.7, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.5);
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      // Play sound
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.5);
      
    } catch (err) {
      console.error('Error playing fallback notification sound:', err);
    }
  };

  // Play sound when modal opens
  useEffect(() => {
    if (isOpen && alertData) {
      if (audioRef.current) {
        // Reset audio to beginning if it was already playing
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(err => {
          console.error('Error playing notification sound:', err);
          // If playing the audio file fails, use the fallback sound
          playFallbackSound();
        });
      } else {
        // Use fallback if no audio element is available
        playFallbackSound();
      }
    }
  }, [isOpen, alertData]);
  
  if (!alertData) return null;
  
  const { alert, type } = alertData;
  
  const handleClose = () => {
    console.log("Close button clicked");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent 
        className="max-w-md p-0 overflow-hidden border-0 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md" 
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
        closeButton={false}
        style={{
          boxShadow: '0 0 60px 15px rgba(155, 135, 245, 0.5)',
          background: 'hsl(var(--background))',
          animation: 'purple-pulse 3s infinite alternate'
        }}
      >
        {/* Custom X close button with side panel-like styling */}
        <button 
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          aria-label="Close alert"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        <div className="p-6 honeycomb-bg honeycomb-glow border-b border-border w-full">
          <h2 className="text-xl font-semibold">{alert.title}</h2>
          <p className="text-sm mt-2 text-muted-foreground">{alert.description}</p>
        </div>
        
        <div className="p-6">
          <h3 className="text-md font-medium mb-2">Alert Insights</h3>
          <p className="text-sm mb-6 text-muted-foreground">{alert.insights}</p>
          
          <div className="flex justify-start items-center mt-12">
            <div className="text-xs text-muted-foreground">
              {type === 'open' ? (
                <p>This is an open alert created at {alert.time}</p>
              ) : (
                <p>This alert was triggered at {alert.time}</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AlertModal;
