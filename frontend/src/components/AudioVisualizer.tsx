import React from 'react';

export type AgentVoiceState = 'idle' | 'listening' | 'transcribing' | 'thinking' | 'speaking';

interface AudioVisualizerProps {
  state: AgentVoiceState;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ state }) => {
  const bars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const getStateDetails = () => {
    switch (state) {
      case 'listening':
        return { label: 'Listening...', color: 'bg-emerald-500', animation: 'animate-pulse' };
      case 'transcribing':
        return { label: 'Transcribing Audio...', color: 'bg-blue-500', animation: 'animate-bounce' };
      case 'thinking':
        return { label: 'Thinking & Querying Store...', color: 'bg-accent', animation: 'animate-pulse' };
      case 'speaking':
        return { label: 'Speaking Response...', color: 'bg-emerald-400', animation: 'animate-pulse' };
      default:
        return { label: 'Ready for Voice Input', color: 'bg-neutral-dark', animation: '' };
    }
  };

  const details = getStateDetails();

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-navy-dark rounded-2xl border border-navy-light shadow-inner">
      <div className="h-16 flex items-center justify-center space-x-1.5 mb-3">
        {bars.map((bar, i) => {
          const isAnimated = state !== 'idle';
          const randomHeight = isAnimated
            ? `${Math.max(16, Math.floor(Math.sin((i + Date.now() / 200) * 0.8) * 40 + 30))}px`
            : '8px';

          return (
            <div
              key={bar}
              className={`w-2 rounded-full transition-all duration-150 ${details.color} ${details.animation}`}
              style={{ height: randomHeight }}
            />
          );
        })}
      </div>
      <span className="text-sm font-semibold tracking-wide text-neutral flex items-center space-x-2">
        <span className={`w-2.5 h-2.5 rounded-full ${details.color} animate-ping`} />
        <span>{details.label}</span>
      </span>
    </div>
  );
};
