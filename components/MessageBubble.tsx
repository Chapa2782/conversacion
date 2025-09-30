
import React from 'react';
import { Message, Speaker } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isSpeakerA = message.speaker === Speaker.A;

  const bubbleClasses = isSpeakerA
    ? 'bg-slate-700 text-slate-200 rounded-bl-none'
    : 'bg-indigo-600 text-white rounded-br-none';

  const containerClasses = `flex items-end gap-3 ${isSpeakerA ? 'justify-start' : 'justify-end'}`;

  const avatar = (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-slate-900 flex-shrink-0 ${
        isSpeakerA ? 'bg-cyan-500' : 'bg-indigo-400'
      }`}
    >
      {message.speaker}
    </div>
  );

  return (
    <div className={containerClasses}>
      {isSpeakerA && avatar}
      <div className={`max-w-xs md:max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl shadow-md ${bubbleClasses}`}>
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
      {!isSpeakerA && avatar}
    </div>
  );
};

export default MessageBubble;
