
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { usePlaceholders } from '@/hooks/usePlaceholders';
import { speakText } from '@/services/speechService';
import { useChatHistory, ChatMessage } from '@/hooks/useChatHistory';
import { useAuth } from '@/contexts/AuthContext';
import { useFileUpload, UploadedFile } from '@/utils/fileUpload';
import { FileType } from '@/types/files';
import { createFileUploader } from '@/utils/fileUploadUtils';
import ChatMessaging from './chat/ChatMessaging';
import ChatControls from './chat/ChatControls';

const placeholders = [
  "Ask me about trade validation for HDFC",
  "Ask me about open interest analysis in Nifty Options",
  "I want to validate my banknifty long trade at entry price of 51000",
  "Show me the resistance levels for Reliance",
  "Analyze market sentiment for IT sector"
];

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isInitial, setIsInitial] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isTalkModeEnabled, setIsTalkModeEnabled] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<UploadedFile[]>([]);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { uploadFile } = useFileUpload();
  
  const { 
    chats, 
    activeChat, 
    createChat, 
    selectChat, 
    saveMessage 
  } = useChatHistory();

  const { 
    isRecording, 
    isMuted, 
    transcript, 
    toggleRecording, 
    toggleMute, 
    clearTranscript 
  } = useSpeechRecognition();
  
  const { currentPlaceholder } = usePlaceholders(
    placeholders, 
    false, // isInputFocused - we'll pass this from InputArea
    input, 
    isRecording
  );

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
    
    if (isRecording && !isTalkModeEnabled) {
      toggleRecording();
    }

    console.log("Sending message, checking for active chat first");
    let currentChatId = activeChat?.id;
    
    if (!currentChatId) {
      console.log("No active chat, creating new chat");
      const firstWords = messageContent.split(' ').slice(0, 5).join(' ');
      const chatTitle = `${firstWords}${messageContent.length > firstWords.length ? '...' : ''}`;
      const newChat = await createChat(chatTitle);
      
      if (newChat) {
        console.log("New chat created with ID:", newChat.id);
        currentChatId = newChat.id;
      } else {
        console.error("Failed to create new chat");
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
    
    console.log("Proceeding with chat ID:", currentChatId);

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

    const savedMessage = await saveMessage(currentChatId, userMessage);
    if (!savedMessage) {
      console.error("Failed to save user message to database");
    }
    
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
      
      if (isTalkModeEnabled) {
        speakText(botResponse);
      }
    }, 1500);
  };

  const handleFollowUpClick = (text: string) => {
    setInput(text);
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
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  };
  
  const handleFileSelection = async (fileType: FileType) => {
    const fileUploader = createFileUploader(toast);
    
    fileUploader({
      fileType,
      onFileSelected: async (file) => {
        const uploaded = await uploadFile(file, fileType);
        if (uploaded) {
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
      <ChatControls
        input={input}
        setInput={setInput}
        isInitial={isInitial}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        handleSendMessage={handleSendMessage}
        transcript={transcript}
        isRecording={isRecording}
        toggleRecording={toggleRecording}
        isMuted={isMuted}
        toggleMute={toggleMute}
        placeholders={placeholders}
        currentPlaceholder={currentPlaceholder}
        isTalkModeEnabled={isTalkModeEnabled}
        onTalkModeToggle={handleTalkModeToggle}
        attachedFiles={attachedFiles}
        handleFileSelection={handleFileSelection}
      />
      
      <ChatMessaging
        messages={messages}
        onFollowUpClick={handleFollowUpClick}
        isInitial={isInitial}
      />
    </div>
  );
};

export default ChatInterface;
