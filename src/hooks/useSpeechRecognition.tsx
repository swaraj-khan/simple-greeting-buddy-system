
import { useState, useRef, useEffect } from 'react';
import { useToast } from './use-toast';

export const useSpeechRecognition = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef<string>('');
  const { toast } = useToast();

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event) => {
          // Skip processing results if muted
          if (isMuted) return;
          
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              // Append the final result to the existing transcript
              finalTranscriptRef.current += ' ' + result;
              // Trim any leading space that might have been added
              finalTranscriptRef.current = finalTranscriptRef.current.trim();
            } else {
              interimTranscript = result;
            }
          }
          
          // Set transcript to be the final transcript plus any interim results
          setTranscript(finalTranscriptRef.current + (interimTranscript ? ' ' + interimTranscript : ''));
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          if (event.error === 'not-allowed') {
            toast({
              title: "Microphone access denied",
              description: "Please allow microphone access to use voice input",
              variant: "destructive"
            });
            setIsRecording(false);
          }
        };
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast, isMuted]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Speech recognition not supported",
        description: "Your browser doesn't support speech recognition",
        variant: "destructive"
      });
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      // Reset transcript when starting a new recording
      setTranscript('');
      finalTranscriptRef.current = '';
      recognitionRef.current.start();
      setIsRecording(true);
      toast({
        title: "Voice mode activated",
        description: "Speak now. Click the X button to stop recording."
      });
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
    // Clear any transcript that might have accumulated while muted when unmuting
    if (isMuted) {
      // We're going to unmute, so clear any pending transcript
      recognitionRef.current?.stop();
      setTimeout(() => {
        if (isRecording) {
          recognitionRef.current?.start();
        }
      }, 100);
      // We don't reset the transcript when unmuting anymore
      // This allows continuous dictation even after muting/unmuting
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    finalTranscriptRef.current = '';
  };

  return {
    isRecording,
    isMuted,
    transcript,
    toggleRecording,
    toggleMute,
    clearTranscript
  };
};
