import React from 'react';

interface ControlsProps {
  topic: string;
  setTopic: (topic: string) => void;
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onStop: () => void;
  onPauseToggle: () => void;
  onDownload: () => void;
  isConversationStarted: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  topic,
  setTopic,
  isRunning,
  isPaused,
  onStart,
  onStop,
  onPauseToggle,
  onDownload,
  isConversationStarted,
}) => {
  return (
    <div className="mb-4 p-4 bg-slate-800 rounded-lg shadow-md flex-shrink-0">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Introduce el tema de la conversación..."
          disabled={isRunning}
          className="flex-grow bg-slate-700 border border-slate-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none disabled:opacity-50 transition-colors"
          aria-label="Tema de la conversación"
        />
        <div className="flex items-center justify-center gap-2">
          {!isRunning ? (
            <button
              onClick={onStart}
              disabled={!topic.trim()}
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              Iniciar
            </button>
          ) : (
            <>
              <button
                onClick={onPauseToggle}
                className="px-6 py-2 bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-500 transition-all transform hover:scale-105"
              >
                {isPaused ? 'Reanudar' : 'Pausar'}
              </button>
              <button
                onClick={onStop}
                className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-500 transition-all transform hover:scale-105"
              >
                Detener
              </button>
            </>
          )}
          <button
            onClick={onDownload}
            disabled={isRunning || !isConversationStarted}
            className="px-6 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all"
          >
            Descargar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;