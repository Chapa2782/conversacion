import React, { forwardRef } from 'react';
import { Message, Speaker } from '../types';
import MessageBubble from './MessageBubble';

interface ConversationViewProps {
  conversation: Message[];
  isLoading: boolean;
  currentSpeaker: Speaker;
}

const ConversationView = forwardRef<HTMLDivElement, ConversationViewProps>(
  ({ conversation, isLoading, currentSpeaker }, ref) => {
    return (
      <div
        ref={ref}
        className="flex-1 bg-slate-950/50 rounded-lg p-4 overflow-y-auto space-y-6 scroll-smooth border border-slate-700"
        aria-live="polite"
      >
        {conversation.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}
        {isLoading && (
          <div className={`flex items-end gap-3 ${currentSpeaker === Speaker.A ? 'justify-start' : 'justify-end'}`}>
            {currentSpeaker === Speaker.A && (
              <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-slate-900 flex-shrink-0">A</div>
            )}
            <div className={`max-w-xs md:max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl ${currentSpeaker === Speaker.A ? 'bg-slate-700 rounded-bl-none' : 'bg-indigo-600 rounded-br-none'}`}>
              <div className="flex items-center space-x-2" role="status" aria-label="Escribiendo...">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
            {currentSpeaker === Speaker.B && (
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-slate-900 flex-shrink-0">B</div>
            )}
          </div>
        )}
         {conversation.length === 0 && !isLoading && (
            <div className="flex items-center justify-center h-full">
                <p className="text-slate-500 text-lg">La conversación aparecerá aquí...</p>
            </div>
        )}
      </div>
    );
  }
);

export default ConversationView;