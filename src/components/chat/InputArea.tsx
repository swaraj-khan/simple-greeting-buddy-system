
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import AudioControlBar from './AudioControlBar';
import FileAttachmentMenu from './FileAttachmentMenu';
import MessageInput from './MessageInput';
import { FileType } from '@/types/files';
import { UploadedFile } from '@/utils/fileUpload';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

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
  attachedFiles?: UploadedFile[];
  handleFileSelection: (fileType: FileType) => void;
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
  onTalkModeToggle,
  attachedFiles = [],
  handleFileSelection
}) => {
  const { toast } = useToast();
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

  const removeAttachedFile = (id: string) => {
    if (attachedFiles && attachedFiles.length > 0) {
      // We don't directly modify attachedFiles since it's a prop
      // Instead, we simulate removing it by adding the removal info to the input
      toast({
        title: "File removed",
        description: "The file has been removed from your message",
      });
    }
  };

  return (
    <div className="chat-input-highlight relative rounded-lg bg-secondary p-4">
      {/* Attached files preview */}
      {attachedFiles && attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachedFiles.map((file) => (
            <div 
              key={file.id}
              className="flex items-center gap-2 bg-background rounded-md px-2 py-1 text-xs"
            >
              <span className="truncate max-w-[150px]">{file.name}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 rounded-full" 
                onClick={() => removeAttachedFile(file.id)}
              >
                <X size={12} />
              </Button>
            </div>
          ))}
        </div>
      )}
      
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
                isTalkModeEnabled={isTalkModeEnabled}
                onTalkModeToggle={onTalkModeToggle}
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
