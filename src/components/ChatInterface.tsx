
import React, { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { usePlaceholders } from '@/hooks/usePlaceholders';
import MessageList from './chat/MessageList';
import InputArea from './chat/InputArea';
import WelcomeHeader from './chat/WelcomeHeader';
import CollapsedChatButton from './chat/CollapsedChatButton';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  keywords?: string[];
  summary?: string[];
  followUps?: string[];
}

interface ChatInterfaceProps {}

const placeholders = [
  "Ask me about trade validation for HDFC",
  "Ask me about open interest analysis in Nifty Options",
  "I want to validate my banknifty long trade at entry price of 51000",
  "Show me the resistance levels for Reliance",
  "Analyze market sentiment for IT sector"
];

const ChatInterface: React.FC<ChatInterfaceProps> = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isInitial, setIsInitial] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isTalkModeEnabled, setIsTalkModeEnabled] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const { isRecording, isMuted, transcript, toggleRecording, toggleMute, clearTranscript } = useSpeechRecognition();
  const { currentPlaceholder } = usePlaceholders(placeholders, isInputFocused, input, isRecording);

  const handleSendMessage = () => {
    const messageContent = input.trim() || transcript.trim();
    if (!messageContent) return;
    
    // If not in talk mode, stop recording after sending the message
    if (isRecording && !isTalkModeEnabled) {
      toggleRecording();
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      isUser: true,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    clearTranscript();
    
    if (isInitial) {
      setIsInitial(false);
      setIsCollapsed(true);
      
      setTimeout(() => {
        setIsCollapsed(false);
      }, 1000);
    }
    
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Here's your analysis",
        isUser: false,
        keywords: ["HDFC", "Resistance", "Bullish", "Support"],
        summary: [
          "Strong resistance at 1450 levels",
          "Positive momentum indicators",
          "Suggested stop loss at 1380"
        ],
        followUps: [
          "Show me volume analysis",
          "What's the target price?",
          "Compare with sector performance"
        ]
      };
      
      setMessages(prev => [...prev, botMessage]);

      // If talk mode is enabled, simulate text-to-speech for the bot response
      if (isTalkModeEnabled && isRecording) {
        toast({
          title: "Speaking response",
          description: "AI is speaking the response"
        });
      }
    }, 1500);
  };

  const handleFollowUpClick = (text: string) => {
    setInput(text);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

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
          />
        </div>
      )}
      
      {!isInitial && (
        <MessageList 
          messages={messages} 
          onFollowUpClick={handleFollowUpClick} 
        />
      )}
    </div>
  );
};

export default ChatInterface;
