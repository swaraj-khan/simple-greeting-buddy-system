
import { supabase } from '@/integrations/supabase/client';

// Basic text-to-speech function using browser's SpeechSynthesis API
export const speakText = (text: string) => {
  if (!text || typeof window === 'undefined') return;
  
  // Stop any existing speech
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  
  // Try to use a better voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(voice => 
    voice.lang.includes('en') && (voice.name.includes('Google') || voice.name.includes('Natural'))
  );
  
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  
  window.speechSynthesis.speak(utterance);
  return true;
};

// Function to ensure voice list is loaded
export const loadVoices = () => {
  return new Promise<SpeechSynthesisVoice[]>((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    
    window.speechSynthesis.onvoiceschanged = () => {
      resolve(window.speechSynthesis.getVoices());
    };
  });
};

// Initialize voices as early as possible
if (typeof window !== 'undefined') {
  loadVoices();
}
