
import React from 'react';
import { Mic, MicOff, MessageCircle, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Toggle } from '../ui/toggle';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import AudioWaveform from '../AudioWaveform';
import { useIsMobile } from '@/hooks/use-mobile';

interface AudioControlBarProps {
  isRecording: boolean;
  toggleRecording: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  autoSendEnabled: boolean;
  setAutoSendEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isTalkModeEnabled?: boolean;
  onTalkModeToggle?: () => void;
}

const AudioControlBar: React.FC<AudioControlBarProps> = ({
  isRecording,
  toggleRecording,
  isMuted,
  toggleMute,
  autoSendEnabled,
  setAutoSendEnabled,
  isTalkModeEnabled = false,
  onTalkModeToggle
}) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        className={`text-muted-foreground hover:text-foreground flex items-center gap-2 ${isRecording ? 'text-red-500 hover:text-red-600' : ''}`}
        onClick={toggleRecording}
      >
        {isRecording ? (
          <>
            <X size={16} />
            <span className="hidden sm:inline">Stop</span>
          </>
        ) : (
          <>
            <Mic size={16} />
            <span className="hidden sm:inline">Voice</span>
          </>
        )}
      </Button>
      
      {isRecording && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className={`ml-2 text-muted-foreground hover:text-foreground flex items-center gap-2 ${isMuted ? 'text-amber-500 hover:text-amber-600' : ''}`}
            onClick={toggleMute}
          >
            {isMuted ? (
              <>
                <MicOff size={16} />
                <span className="hidden sm:inline">Unmute</span>
              </>
            ) : (
              <>
                <Mic size={16} />
                <span className="hidden sm:inline">Mute</span>
              </>
            )}
          </Button>
          
          {onTalkModeToggle && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Toggle 
                    pressed={isTalkModeEnabled}
                    onPressedChange={onTalkModeToggle}
                    size="sm"
                    className={`ml-2 h-8 w-auto px-3 rounded-md flex items-center justify-center gap-1 ${isTalkModeEnabled ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-muted hover:bg-muted-foreground/20'}`}
                    aria-label="Toggle talk mode"
                  >
                    <MessageCircle size={16} className="shrink-0" />
                    <span className="hidden sm:inline">Talk</span>
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                  {isTalkModeEnabled 
                    ? "Disable full conversation mode" 
                    : "Enable full conversation mode"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          <div className="flex-1 flex justify-center items-center">
            <AudioWaveform isRecording={isRecording && !isMuted} />
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle 
                  pressed={autoSendEnabled}
                  onPressedChange={setAutoSendEnabled}
                  size="sm"
                  className={`h-8 ${isMobile ? 'w-10' : 'w-12'} rounded-full flex items-center justify-center ${autoSendEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-muted hover:bg-muted-foreground/20'}`}
                  aria-label="Auto send after 3 seconds"
                >
                  <span className="text-xs font-medium">3s</span>
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                {autoSendEnabled 
                  ? "Disable the toggle to manually send your voice message" 
                  : "Enable the toggle to auto send your voice message"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      )}
    </>
  );
};

export default AudioControlBar;
