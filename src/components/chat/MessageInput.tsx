
import React from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '../ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

interface MessageInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  isInputFocused: boolean;
  setIsInputFocused: React.Dispatch<React.SetStateAction<boolean>>;
  isInitial: boolean;
  isRecording: boolean;
  placeholders: string[];
  currentPlaceholder: number;
  onSendMessage: () => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

const MessageInput: React.FC<MessageInputProps> = ({
  input,
  setInput,
  handleKeyDown,
  isInputFocused,
  setIsInputFocused,
  isInitial,
  isRecording,
  placeholders,
  currentPlaceholder,
  onSendMessage,
  inputRef
}) => {
  const showTooltip = input.trim() === '';
  
  return (
    <div className="relative">
      {isRecording ? (
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          placeholder=""
          className={`resize-none w-full bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground ${isInitial ? 'min-h-[50px] max-h-[50px]' : 'min-h-[36px] max-h-[36px]'} pr-12`}
          rows={1}
        />
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                placeholder={placeholders[currentPlaceholder]}
                className={`resize-none w-full bg-transparent border-none focus:outline-none text-foreground placeholder:text-muted-foreground ${isInitial ? 'min-h-[50px] max-h-[50px]' : 'min-h-[36px] max-h-[36px]'} pr-12`}
                rows={1}
              />
            </TooltipTrigger>
            {showTooltip && (
              <TooltipContent>
                Click here and press TAB key to use this prompt
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      )}
      
      <div className="absolute bottom-0 right-0 flex items-center gap-2">
        <Button
          onClick={onSendMessage}
          size="icon"
          className="rounded-full bg-draconic-orange hover:bg-draconic-orange-light"
          disabled={(!input.trim())}
        >
          <ArrowUp size={18} />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
