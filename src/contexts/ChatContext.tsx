
import React, { useState, useContext, createContext } from 'react';
import { useChatHistory } from '@/hooks/useChatHistory';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from '@/types/chat';
import { useAuth } from '@/contexts/AuthContext';

interface ChatContextType {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isInitial: boolean;
  setIsInitial: React.Dispatch<React.SetStateAction<boolean>>;
  isCollapsed: boolean; 
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  handleSendMessage: () => Promise<void>;
  handleFollowUpClick: (text: string) => void;
  currentChatMessages: ChatMessage[];
  authError: boolean;
  selectedChatId?: string;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ 
  children: React.ReactNode;
  selectedChatId?: string;
}> = ({ children, selectedChatId }) => {
  const [input, setInput] = useState('');
  const [isInitial, setIsInitial] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [authError, setAuthError] = useState(false);
  const { toast } = useToast();
  const { user, session } = useAuth();
  
  const { 
    currentChatId, 
    currentChatMessages, 
    loadChatSession,
    addMessageToChat,
    createNewChat
  } = useChatHistory();

  // Handle loading the selected chat
  React.useEffect(() => {
    if (selectedChatId && selectedChatId !== currentChatId) {
      loadChatSession(selectedChatId);
      if (isInitial) {
        setIsInitial(false);
      }
    }
  }, [selectedChatId, currentChatId]);

  // Start a new chat if none is active and user is logged in
  React.useEffect(() => {
    if (user && !isInitial && !currentChatId && currentChatMessages.length === 0) {
      console.log("Creating new chat for user:", user.id);
      createNewChat();
    }
  }, [user, isInitial, currentChatId, currentChatMessages.length]);

  const handleSendMessage = async () => {
    const messageContent = input.trim();
    if (!messageContent) return;
    
    // Check if user is authenticated
    if (!user || !session) {
      setAuthError(true);
      toast({
        title: "Authentication required",
        description: "Please log in to send messages",
        variant: "destructive"
      });
      return;
    }
    
    // Auth is valid, reset error flag if it was set
    setAuthError(false);
    
    // Add user message
    const userMessage = await addMessageToChat({
      content: messageContent,
      isUser: true,
    });
    
    if (!userMessage) {
      return; // Exit if message creation failed
    }
    
    setInput('');
    
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
    }, 1500);
  };

  const handleFollowUpClick = (text: string) => {
    setInput(text);
  };

  return (
    <ChatContext.Provider value={{
      input,
      setInput,
      isInitial,
      setIsInitial,
      isCollapsed,
      setIsCollapsed,
      handleSendMessage,
      handleFollowUpClick,
      currentChatMessages,
      authError,
      selectedChatId
    }}>
      {children}
    </ChatContext.Provider>
  );
};
