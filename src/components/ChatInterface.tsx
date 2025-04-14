
import React, { useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import MessageList from './chat/MessageList';
import InputArea from './chat/InputArea';
import WelcomeHeader from './chat/WelcomeHeader';
import CollapsedChatButton from './chat/CollapsedChatButton';
import { ChatProvider, useChatContext } from '@/contexts/ChatContext';
import { useSpeechControl } from './chat/SpeechControl';

interface ChatInterfaceProps {
  selectedChatId?: string;
}

const ChatContent: React.FC = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();
  
  const {
    input,
    setInput,
    isInitial,
    isCollapsed,
    setIsCollapsed,
    handleSendMessage,
    handleFollowUpClick,
    currentChatMessages,
    authError
  } = useChatContext();

  const {
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
    focusInput
  } = useSpeechControl({ inputRef });

  return (
    <div className="relative w-full max-w-4xl mx-auto h-full">
      <WelcomeHeader isVisible={isInitial} />
      
      {isCollapsed ? (
        <CollapsedChatButton onExpand={() => setIsCollapsed(false)} />
      ) : (
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
            onTalkModeToggle={handleTalkModeToggle}
            authError={authError}
            clearTranscript={clearTranscript}
          />
        </div>
      )}
      
      {!isInitial && (
        <MessageList 
          messages={currentChatMessages} 
          onFollowUpClick={(text) => {
            handleFollowUpClick(text);
            focusInput();
          }} 
        />
      )}
    </div>
  );
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedChatId }) => {
  return (
    <ChatProvider selectedChatId={selectedChatId}>
      <ChatContent />
    </ChatProvider>
  );
};

export default ChatInterface;
