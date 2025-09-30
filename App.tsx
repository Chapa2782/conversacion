import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Chat } from '@google/genai';
import { Message, Speaker } from './types';
import ConversationView from './components/ConversationView';
import Controls from './components/Controls';
import { createAIChatSession } from './services/geminiService';

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const chatA = useRef<Chat | null>(null);
  const chatB = useRef<Chat | null>(null);
  const isRunningRef = useRef(isRunning);
  const isPausedRef = useRef(isPaused);
  const conversationContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTop = conversationContainerRef.current.scrollHeight;
    }
  }, [conversation, isLoading]);
  
  const handleStart = useCallback(async () => {
    if (!topic.trim()) {
      alert('Por favor, introduce un tema para iniciar la conversación.');
      return;
    }

    setConversation([]);
    setIsRunning(true);
    setIsPaused(false);
    setIsLoading(true);

    try {
      chatA.current = createAIChatSession(topic, Speaker.A);
      chatB.current = createAIChatSession(topic, Speaker.B);

      const initialPrompt = `Comencemos nuestra conversación sobre ${topic}. ¿Cuáles son tus pensamientos iniciales?`;
      
      const response = await chatA.current.sendMessage({ message: initialPrompt });
      const newMessages: Message[] = [
        { speaker: Speaker.A, text: initialPrompt },
        { speaker: Speaker.B, text: response.text },
      ];
      
      setConversation(newMessages);

    } catch (error) {
      console.error("Error al iniciar la conversación:", error);
      alert("No se pudo iniciar la conversación. Por favor, revisa tu clave de API y conexión de red.");
      setIsRunning(false);
    } finally {
      setIsLoading(false);
    }
  }, [topic]);

  const runConversationStep = useCallback(async () => {
      if (!isRunningRef.current || isPausedRef.current || chatA.current === null || chatB.current === null) return;
      
      const lastMessage = conversation[conversation.length - 1];
      if (!lastMessage) return;

      setIsLoading(true);
      
      try {
        const currentSpeaker = lastMessage.speaker;
        const nextSpeaker = currentSpeaker === Speaker.A ? Speaker.B : Speaker.A;
        const currentChat = nextSpeaker === Speaker.B ? chatA.current : chatB.current;
        
        const response = await currentChat.sendMessage({ message: lastMessage.text });
        const newMessage: Message = { speaker: nextSpeaker, text: response.text };

        if (isRunningRef.current && !isPausedRef.current) {
            setConversation(prev => [...prev, newMessage]);
        }
      } catch (error) {
          console.error("Error durante el paso de la conversación:", error);
          setIsRunning(false); 
          alert("Ocurrió un error durante la conversación. Se ha detenido.");
      } finally {
          if (isRunningRef.current) {
             setIsLoading(false);
          }
      }

  }, [conversation]);

  useEffect(() => {
    if (isRunning && !isPaused && conversation.length > 0 && !isLoading) {
      const timer = setTimeout(() => {
          runConversationStep();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isRunning, isPaused, conversation, isLoading, runConversationStep]);


  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsLoading(false);
  };

  const handlePauseToggle = () => {
    setIsPaused(prev => !prev);
  }

  const handleDownload = () => {
    if (conversation.length === 0) {
      alert('No hay ninguna conversación para descargar.');
      return;
    }
    const formattedConversation = conversation
      .map(msg => `${msg.speaker}: ${msg.text}`)
      .join('\n\n');
    
    const blob = new Blob([formattedConversation], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversacion-ia-${topic.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans">
      <header className="p-4 border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm shadow-lg">
        <h1 className="text-2xl font-bold text-cyan-400 text-center">Simulador de Conversación IA</h1>
        <p className="text-center text-slate-400 mt-1">Dos IAs discuten un tema indefinidamente hasta que las detengas.</p>
      </header>

      <main className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
        <Controls
          topic={topic}
          setTopic={setTopic}
          isRunning={isRunning}
          isPaused={isPaused}
          onStart={handleStart}
          onStop={handleStop}
          onPauseToggle={handlePauseToggle}
          onDownload={handleDownload}
          isConversationStarted={conversation.length > 0}
        />
        <ConversationView
          ref={conversationContainerRef}
          conversation={conversation}
          isLoading={isLoading}
          currentSpeaker={conversation.length > 0 ? (conversation[conversation.length - 1].speaker === Speaker.A ? Speaker.B : Speaker.A) : Speaker.B}
        />
      </main>
    </div>
  );
};

export default App;