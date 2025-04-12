
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { usePlaceholders } from '@/hooks/usePlaceholders';
import MessageList from './chat/MessageList';
import InputArea from './chat/InputArea';
import WelcomeHeader from './chat/WelcomeHeader';
import CollapsedChatButton from './chat/CollapsedChatButton';
import { speakText } from '@/services/speechService';
import { useChatHistory, ChatMessage, ChatSession } from '@/hooks/useChatHistory';
import { useAuth } from '@/contexts/AuthContext';
import { useFileUpload, UploadedFile } from '@/utils/fileUpload';
import { FileType } from '@/types/files';

interface ChatInterfaceProps {}

const placeholders = [
  "Ask me about trade validation for HDFC",
  "Ask me about open interest analysis in Nifty Options",
  "I want to validate my banknifty long trade at entry price of 51000",
  "Show me the resistance levels for Reliance",
  "Analyze market sentiment for IT sector"
];

const ChatInterface: React.FC<ChatInterfaceProps> = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isInitial, setIsInitial] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isTalkModeEnabled, setIsTalkModeEnabled] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { uploadFile } = useFileUpload();
  
  const { 
    chats, 
    activeChat, 
    createChat, 
    selectChat, 
    saveMessage 
  } = useChatHistory();

  const { isRecording, isMuted, transcript, toggleRecording, toggleMute, clearTranscript } = useSpeechRecognition();
  const { currentPlaceholder } = usePlaceholders(placeholders, isInputFocused, input, isRecording);

  // Effect to load active chat messages
  useEffect(() => {
    if (activeChat) {
      setMessages(activeChat.messages);
      setIsInitial(false);
    } else {
      setMessages([]);
      setIsInitial(true);
    }
  }, [activeChat]);

  const handleSendMessage = async () => {
    const messageContent = input.trim() || transcript.trim();
    if (!messageContent) return;
    
    // If not in talk mode, stop recording after sending the message
    if (isRecording && !isTalkModeEnabled) {
      toggleRecording();
    }

    // Create a new chat if needed
    let currentChatId = activeChat?.id;
    if (!currentChatId) {
      const firstWords = messageContent.split(' ').slice(0, 5).join(' ');
      const chatTitle = `${firstWords}${messageContent.length > firstWords.length ? '...' : ''}`;
      const newChat = await createChat(chatTitle);
      if (newChat) {
        currentChatId = newChat.id;
      }
    }
    
    if (!currentChatId) {
      toast({
        title: "Error",
        description: "Failed to create chat session",
        variant: "destructive",
      });
      return;
    }

    // Format the message content to include attached files
    let finalContent = messageContent;
    if (attachedFiles.length > 0) {
      finalContent += '\n\n' + attachedFiles.map(file => 
        `[${file.type === 'document' ? 'Document' : 'Image'}: ${file.name}](${file.url})`
      ).join('\n');
    }
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: finalContent,
      isUser: true,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    clearTranscript();
    setAttachedFiles([]);
    
    if (isInitial) {
      setIsInitial(false);
      setIsCollapsed(true);
      
      setTimeout(() => {
        setIsCollapsed(false);
      }, 1000);
    }

    // Save the message to the database
    await saveMessage(currentChatId, userMessage);
    
    // Mock bot response
    setTimeout(() => {
      const botResponse = "Here's your analysis of the market trends you requested. The data shows a bullish pattern with strong support levels.";
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
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
      saveMessage(currentChatId, botMessage);
      
      // If talk mode is enabled, read out the response
      if (isTalkModeEnabled) {
        speakText(botResponse);
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
      // Stop any ongoing speech
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  };

  const handleSelectChat = (chat: ChatSession) => {
    selectChat(chat.id);
  };
  
  const handleNewChat = async () => {
    const newChat = await createChat('New conversation');
    if (newChat) {
      await selectChat(newChat.id);
    }
  };

  const handleFileSelection = async (fileType: FileType) => {
    const fileUploader = createFileUploader(toast);
    
    fileUploader({
      fileType,
      onFileSelected: async (file) => {
        const uploaded = await uploadFile(file, fileType);
        if (uploaded) {
          // Add the file to attached files
          setAttachedFiles(prev => [...prev, uploaded]);
          
          toast({
            title: "File attached",
            description: `${file.name} attached and will be uploaded with your message`,
          });
        }
      }
    });
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
            attachedFiles={attachedFiles}
            handleFileSelection={handleFileSelection}
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
