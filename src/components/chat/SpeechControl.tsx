
import React, { useState } from 'react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { usePlaceholders } from '@/hooks/usePlaceholders';
import { useToast } from '@/hooks/use-toast';
import { useChatContext } from '@/contexts/ChatContext';

interface SpeechControlProps {
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

export const useSpeechControl = ({ inputRef }: SpeechControlProps) => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isTalkModeEnabled, setIsTalkModeEnabled] = useState(false);
  const { input, setInput } = useChatContext();
  const { toast } = useToast();
  
  const placeholders = [
    "Ask me about trade validation for HDFC",
    "Ask me about open interest analysis in Nifty Options",
    "I want to validate my banknifty long trade at entry price of 51000",
    "Show me the resistance levels for Reliance",
    "Analyze market sentiment for IT sector"
  ];

  const { isRecording, isMuted, transcript, toggleRecording, toggleMute, clearTranscript } = useSpeechRecognition();
  const { currentPlaceholder } = usePlaceholders(placeholders, isInputFocused, input, isRecording);

  React.useEffect(() => {
    if (isRecording && transcript && !isMuted) {
      setInput(transcript);
    }
  }, [isRecording, transcript, setInput, isMuted]);

  const handleTalkModeToggle = () => {
    setIsTalkModeEnabled(prev => !prev);
    
    if (!isTalkModeEnabled) {
      toast({ 
        title: "Talk mode enabled",
        description: "AI responses will be spoken back to you" 
      });
    } else {
      toast({ 
        title: "Talk mode disabled",
        description: "AI responses will not be spoken" 
      });
    }
  };

  return {
    isInputFocused,
    setIsInputFocused,
    isTalkModeEnabled,
    handleTalkModeToggle,
    isRecording,
    isMuted,
    transcript,
    toggleRecording,
    toggleMute,
    clearTranscript,
    placeholders,
    currentPlaceholder,
    focusInput: () => {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };
};
