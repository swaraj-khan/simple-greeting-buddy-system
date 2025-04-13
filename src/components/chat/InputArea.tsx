
import React, { useState, useRef, useEffect } from 'react';
import { createFileUploader } from '@/utils/fileUpload';
import { useToast } from '@/hooks/use-toast';
import AudioControlBar from './AudioControlBar';
import FileAttachmentMenu from './FileAttachmentMenu';
import MessageInput from './MessageInput';
import { FileType } from '@/types/files';

interface InputAreaProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isInitial: boolean;
  onSendMessage: () => void;
  transcript: string;
  isRecording: boolean;
  toggleRecording: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  placeholders: string[];
  currentPlaceholder: number;
  isInputFocused: boolean;
  setIsInputFocused: React.Dispatch<React.SetStateAction<boolean>>;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  isTalkModeEnabled?: boolean;
  onTalkModeToggle?: () => void;
}

const InputArea: React.FC<InputAreaProps> = ({ 
  input, 
  setInput, 
  isInitial, 
  onSendMessage, 
  transcript, 
  isRecording, 
  toggleRecording,
  isMuted,
  toggleMute,
  placeholders, 
  currentPlaceholder,
  isInputFocused,
  setIsInputFocused,
  inputRef,
  isTalkModeEnabled = false,
  onTalkModeToggle
}) => {
  const { toast } = useToast();
  const handleFileUpload = createFileUploader(toast);
  const [autoSendEnabled, setAutoSendEnabled] = useState(localStorage.getItem('autoSendEnabled') === 'true');
  const autoSendTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording && transcript && !isMuted) {
      setInput(transcript);
    }
  }, [isRecording, transcript, setInput, isMuted]);

  useEffect(() => {
    if (isRecording && autoSendEnabled && input.trim() && !isMuted) {
      if (autoSendTimerRef.current) {
        clearTimeout(autoSendTimerRef.current);
      }
      
      autoSendTimerRef.current = setTimeout(() => {
        onSendMessage();
      }, 3000);
    }
    
    return () => {
      if (autoSendTimerRef.current) {
        clearTimeout(autoSendTimerRef.current);
      }
    };
  }, [isRecording, autoSendEnabled, input, onSendMessage, isMuted]);

  useEffect(() => {
    if (!isRecording && autoSendTimerRef.current) {
      clearTimeout(autoSendTimerRef.current);
      autoSendTimerRef.current = null;
    }
  }, [isRecording]);

  useEffect(() => {
    localStorage.setItem('autoSendEnabled', autoSendEnabled.toString());
  }, [autoSendEnabled]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      setInput(placeholders[currentPlaceholder]);
    }
  };

  const handleFileSelection = (fileType: FileType) => {
    handleFileUpload({
      fileType,
      onFileSelected: (file) => {
        setInput(prev => prev + ` [Attached: ${file.name}]`);
      }
    });
  };

  return (
    <div className="chat-input-highlight relative rounded-lg bg-secondary p-4">
      <MessageInput 
        input={input}
        setInput={setInput}
        handleKeyDown={handleKeyDown}
        isInputFocused={isInputFocused}
        setIsInputFocused={setIsInputFocused}
        isInitial={isInitial}
        isRecording={isRecording}
        placeholders={placeholders}
        currentPlaceholder={currentPlaceholder}
        onSendMessage={onSendMessage}
        inputRef={inputRef}
      />
      
      <div className="pt-2 border-t border-border mt-2 flex items-center justify-between">
        <div className="flex items-center w-full">
          {isRecording ? (
            <AudioControlBar 
              isRecording={isRecording}
              toggleRecording={toggleRecording}
              isMuted={isMuted}
              toggleMute={toggleMute}
              autoSendEnabled={autoSendEnabled}
              setAutoSendEnabled={setAutoSendEnabled}
              isTalkModeEnabled={isTalkModeEnabled}
              onTalkModeToggle={onTalkModeToggle}
            />
          ) : (
            <>
              <AudioControlBar 
                isRecording={isRecording}
                toggleRecording={toggleRecording}
                isMuted={isMuted}
                toggleMute={toggleMute}
                autoSendEnabled={autoSendEnabled}
                setAutoSendEnabled={setAutoSendEnabled}
              />
              <FileAttachmentMenu handleFileSelection={handleFileSelection} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputArea;
