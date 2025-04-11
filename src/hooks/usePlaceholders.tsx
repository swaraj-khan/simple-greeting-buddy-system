
import { useState, useEffect } from 'react';

export const usePlaceholders = (placeholders: string[], isInputFocused: boolean, input: string, isRecording: boolean) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  useEffect(() => {
    // Don't rotate placeholders during recording or when input is focused or has text
    if (isRecording || isInputFocused || input !== '') {
      return;
    }
    
    const intervalId = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [isInputFocused, input, placeholders, isRecording]);

  return { currentPlaceholder };
};
