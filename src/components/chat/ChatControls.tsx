
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import InputArea from './InputArea';
import CollapsedChatButton from './CollapsedChatButton';
import WelcomeHeader from './WelcomeHeader';
import { UploadedFile } from '@/utils/fileUpload';
import { FileType } from '@/types/files';

interface ChatControlsProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isInitial: boolean;
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  handleSendMessage: () => void;
  transcript: string;
  isRecording: boolean;
  toggleRecording: () => void;
  isMuted: boolean;
  toggleMute: () => void;
  placeholders: string[];
  currentPlaceholder: number;
  isTalkModeEnabled: boolean;
  onTalkModeToggle: () => void;
  attachedFiles: UploadedFile[];
  handleFileSelection: (fileType: FileType) => void;
}

const ChatControls: React.FC<ChatControlsProps> = ({
  input,
  setInput,
  isInitial,
  isCollapsed,
  setIsCollapsed,
  handleSendMessage,
  transcript,
  isRecording,
  toggleRecording,
  isMuted,
  toggleMute,
  placeholders,
  currentPlaceholder,
  isTalkModeEnabled,
  onTalkModeToggle,
  attachedFiles,
  handleFileSelection
}) => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  if (isCollapsed) {
    return <CollapsedChatButton onExpand={() => setIsCollapsed(false)} />;
  }
  
  return (
    <>
      <WelcomeHeader isVisible={isInitial} />
      
      <div className={`${isInitial ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3' : 'fixed bottom-6 left-1/2 -translate-x-1/2'} w-full max-w-2xl px-4 z-10 transition-all duration-500`}>
        <InputArea 
          input={input}
          setInput={setInput}
          isInitial={isInitial}
          onSendMessage={handleSendMessage}
          transcript={transcript}
          isRecording={isRecording}
          toggleRecording={toggleRecording}
          isMuted={isMuted}
          toggleMute={toggleMute}
          placeholders={placeholders}
          currentPlaceholder={currentPlaceholder}
          isInputFocused={isInputFocused}
          setIsInputFocused={setIsInputFocused}
          inputRef={inputRef}
          isTalkModeEnabled={isTalkModeEnabled}
          onTalkModeToggle={onTalkModeToggle}
          attachedFiles={attachedFiles}
          handleFileSelection={handleFileSelection}
        />
      </div>
    </>
  );
};

export default ChatControls;
