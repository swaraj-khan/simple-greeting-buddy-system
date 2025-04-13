
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { usePlaceholders } from '@/hooks/usePlaceholders';
import MessageList from './chat/MessageList';
import InputArea from './chat/InputArea';
import WelcomeHeader from './chat/WelcomeHeader';
import CollapsedChatButton from './chat/CollapsedChatButton';
import { useChatHistory, ChatMessage } from '@/hooks/useChatHistory';
import { useAuth } from '@/contexts/AuthContext';

interface ChatInterfaceProps {
  selectedChatId?: string;
}

const placeholders = [
  "Ask me about trade validation for HDFC",
  "Ask me about open interest analysis in Nifty Options",
  "I want to validate my banknifty long trade at entry price of 51000",
  "Show me the resistance levels for Reliance",
  "Analyze market sentiment for IT sector"
];

const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedChatId }) => {
  const [input, setInput] = useState('');
  const [isInitial, setIsInitial] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isTalkModeEnabled, setIsTalkModeEnabled] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  const { isRecording, isMuted, transcript, toggleRecording, toggleMute, clearTranscript } = useSpeechRecognition();
  const { currentPlaceholder } = usePlaceholders(placeholders, isInputFocused, input, isRecording);
  
  const { 
    currentChatId, 
    currentChatMessages, 
    setCurrentChatId,
    loadChatSession,
    addMessageToChat,
    createNewChat
  } = useChatHistory();

  // Handle loading the selected chat
  useEffect(() => {
    if (selectedChatId && selectedChatId !== currentChatId) {
      loadChatSession(selectedChatId);
      if (isInitial) {
        setIsInitial(false);
      }
    }
  }, [selectedChatId, currentChatId]);

  const handleSendMessage = async () => {
    const messageContent = input.trim() || transcript.trim();
    if (!messageContent) return;
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to send messages",
        variant: "destructive"
      });
      return;
    }
    
    // If not in talk mode, stop recording after sending the message
    if (isRecording && !isTalkModeEnabled) {
      toggleRecording();
    }
    
    // Add user message
    const userMessage = await addMessageToChat({
      content: messageContent,
      isUser: true,
    });
    
    if (!userMessage) {
      return; // Exit if message creation failed
    }
    
    setInput('');
    clearTranscript();
    
    if (isInitial) {
      setIsInitial(false);
      setIsCollapsed(true);
      
      setTimeout(() => {
        setIsCollapsed(false);
      }, 1000);
    }
    
    // Simulate bot response
    setTimeout(async () => {
      await addMessageToChat({
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
      });

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

  // Start a new chat if none is active and user is logged in
  useEffect(() => {
    if (user && !isInitial && !currentChatId && currentChatMessages.length === 0) {
      // Only create new chat if user is authenticated
      createNewChat();
    }
  }, [user, isInitial, currentChatId, currentChatMessages.length]);

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
          messages={currentChatMessages} 
          onFollowUpClick={handleFollowUpClick} 
        />
      )}
    </div>
  );
};

export default ChatInterface;
