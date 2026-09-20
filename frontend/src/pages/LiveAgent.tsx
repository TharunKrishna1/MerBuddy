import React, { useState, useEffect, useRef } from 'react';
import { Merchant, ChatMessage, ChatResponsePayload } from '../types';
import { api } from '../services/api';
import { AudioVisualizer, AgentVoiceState } from '../components/AudioVisualizer';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Terminal,
  Clock,
  Globe,
  Tag,
  Wrench,
  Volume2,
  RefreshCw,
  ShoppingBag,
  AlertTriangle
} from 'lucide-react';

interface LiveAgentProps {
  merchant: Merchant | null;
}

export const LiveAgent: React.FC<LiveAgentProps> = ({ merchant }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_0',
      role: 'assistant',
      content: 'Haan bhai! UrbanKicks store mein aapka swagat hai. Aapko black running shoes ya koi bhi footwear size mein dekhein?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [textInput, setTextInput] = useState('');
  const [voiceState, setVoiceState] = useState<AgentVoiceState>('idle');
  const [isListening, setIsListening] = useState(false);
  const [latestResponse, setLatestResponse] = useState<ChatResponsePayload | null>(null);
  const [conversationId] = useState(`conv_${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Speech Recognition setup for Web Speech API
  const handleStartListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech Recognition is not supported natively in this browser. Please type your query in Text Mode below!');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = merchant?.language === 'english' ? 'en-US' : 'hi-IN';

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceState('listening');
    };

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      setVoiceState('transcribing');

      // Process query
      await handleSendQuery(transcript);
    };

    recognition.onerror = (err: any) => {
      console.warn('Speech recognition error:', err);
      setIsListening(false);
      setVoiceState('idle');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg_usr_${Date.now()}`,
      role: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setTextInput('');
    setVoiceState('thinking');

    try {
      const chatPayload = await api.sendChat(merchant?.id || 'merchant_001', queryText, conversationId);
      setLatestResponse(chatPayload);

      setVoiceState('speaking');

      const assistantMsg: ChatMessage = {
        id: `msg_ast_${Date.now()}`,
        role: 'assistant',
        content: chatPayload.response,
        timestamp: new Date().toLocaleTimeString(),
        toolCalls: chatPayload.toolsCalled,
        toolResults: chatPayload.toolResults
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Synthesize Speech for Voice Output
      speakText(chatPayload.response);
    } catch (err: any) {
      console.error('Chat processing error:', err);
      setVoiceState('idle');
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setVoiceState('idle');
      utterance.onerror = () => setVoiceState('idle');
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setVoiceState('idle'), 2000);
    }
  };

  return (
    <div className="h-[calc(100vh-65px)] grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
      {/* LEFT COLUMN: Conversation Transcript */}
      <div className="lg:col-span-4 bg-navy border-r border-navy-light flex flex-col justify-between h-full">
        <div className="p-4 border-b border-navy-light flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-surface flex items-center space-x-2">
              <span>Live Transcript</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </h3>
            <p className="text-[11px] text-neutral-dark">Hinglish & Multilingual Audio Stream</p>
          </div>
          <button
            onClick={() => setMessages([])}
            className="p-1.5 rounded-lg text-neutral-dark hover:text-surface hover:bg-navy-light"
            title="Clear conversation"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center space-x-2 text-[10px] text-neutral-dark mb-1">
                <span>{m.role === 'user' ? 'Customer' : 'MerBuddy Assistant'}</span>
                <span>•</span>
                <span>{m.timestamp}</span>
              </div>
              <div
                className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed shadow-sm ${
                  m.role === 'user'
                    ? 'bg-accent text-dark font-semibold rounded-br-none'
                    : 'bg-navy-dark text-surface border border-navy-light rounded-bl-none'
                }`}
              >
                {m.content}
                {m.role === 'assistant' && (
                  <button
                    onClick={() => speakText(m.content)}
                    className="mt-2 text-[10px] text-accent font-medium flex items-center space-x-1 hover:underline"
                  >
                    <Volume2 size={12} />
                    <span>Play Audio</span>
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Control Box */}
        <div className="p-4 border-t border-navy-light bg-navy-dark">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-dark font-medium">Input Mode:</span>
            <div className="flex bg-navy rounded-lg p-1 border border-navy-light">
              <button
                onClick={() => setInputMode('voice')}
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  inputMode === 'voice' ? 'bg-accent text-dark' : 'text-neutral'
                }`}
              >
                Voice Mode
              </button>
              <button
                onClick={() => setInputMode('text')}
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  inputMode === 'text' ? 'bg-accent text-dark' : 'text-neutral'
                }`}
              >
                Text Mode
              </button>
            </div>
          </div>

          {inputMode === 'text' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery(textInput);
              }}
              className="flex space-x-2"
            >
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type query e.g. Bhai black shoes size 9 mein hain kya?"
                className="flex-1 bg-navy text-surface placeholder:text-neutral-dark text-xs px-3.5 py-2.5 rounded-xl border border-navy-light focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                className="bg-accent text-dark p-2.5 rounded-xl font-bold hover:bg-accent-hover"
              >
                <Send size={16} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* CENTER COLUMN: AI Agent Status & Mic */}
      <div className="lg:col-span-5 p-8 bg-dark flex flex-col items-center justify-center space-y-8 text-center relative">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-xs font-bold uppercase tracking-wider">
            {merchant?.name || 'UrbanKicks'} Voice Agent
          </span>
          <h2 className="text-2xl font-extrabold text-surface">Conversational Voice Engine</h2>
          <p className="text-xs text-neutral-dark max-w-sm mx-auto">
            Simulate real-time merchant audio interaction with automatic Hinglish detection and backend pricing calculation.
          </p>
        </div>

        {/* Audio Visualizer Component */}
        <div className="w-full max-w-md">
          <AudioVisualizer state={voiceState} />
        </div>

        {/* Big Interactive Mic Button */}
        <div className="relative">
          <button
            onClick={isListening ? () => setIsListening(false) : handleStartListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
              isListening
                ? 'bg-red-500 text-surface scale-110 shadow-red-500/50 animate-pulse'
                : 'bg-accent text-dark hover:scale-105 shadow-accent/30'
            }`}
          >
            {isListening ? <MicOff size={36} /> : <Mic size={36} />}
          </button>
        </div>
        <p className="text-xs text-neutral font-medium">
          {isListening ? 'Tap mic to stop recording' : 'Tap mic and speak in Hinglish or English'}
        </p>

        {/* Quick Voice Demo Preset Queries */}
        <div className="w-full max-w-md bg-navy/60 p-4 rounded-2xl border border-navy-light text-left space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-dark">
            Sample Voice Prompts (Click to Test):
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              'Bhai black running shoes size 9 mein hain kya?',
              'FESTIVE20 coupon apply karne par kitna discount milega?',
              'Order 12345 kab tak deliver hoga?'
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuery(preset)}
                className="px-2.5 py-1.5 rounded-lg bg-navy text-xs text-neutral hover:text-accent hover:border-accent border border-navy-light transition-all text-left"
              >
                "{preset}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Real-Time Agent Context */}
      <div className="lg:col-span-3 bg-navy border-l border-navy-light p-6 overflow-y-auto space-y-6">
        <h3 className="text-sm font-bold text-surface border-b border-navy-light pb-3">
          Agent Real-Time Context
        </h3>

        {/* Prompt & Language Info */}
        <div className="space-y-3">
          <div className="bg-navy-dark p-3.5 rounded-xl border border-navy-light space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-dark flex items-center space-x-1.5">
                <Globe size={14} className="text-accent" />
                <span>Detected Language</span>
              </span>
              <span className="font-bold text-accent uppercase font-mono">
                {latestResponse?.detectedLanguage || 'HINGLISH'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-dark flex items-center space-x-1.5">
                <Tag size={14} className="text-accent" />
                <span>Active Flow</span>
              </span>
              <span className="font-semibold text-surface">
                {latestResponse?.intent || 'PRODUCT_DISCOVERY'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-dark flex items-center space-x-1.5">
                <Terminal size={14} className="text-accent" />
                <span>Prompt Version</span>
              </span>
              <span className="font-semibold text-surface">
                {latestResponse?.metadata.promptVersion || 'v3.2'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-dark flex items-center space-x-1.5">
                <Clock size={14} className="text-accent" />
                <span>Latency</span>
              </span>
              <span className="font-bold text-emerald-400">
                {latestResponse?.metadata.latencyMs || 680} ms
              </span>
            </div>
          </div>
        </div>

        {/* Agent Breaks Indicator */}
        {latestResponse?.metadata.breakDetected && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl space-y-1">
            <div className="flex items-center space-x-2 text-red-400 font-bold text-xs">
              <AlertTriangle size={16} />
              <span>Agent Break Detected!</span>
            </div>
            <p className="text-xs text-red-300/90 leading-tight">
              {latestResponse.metadata.breakReason}
            </p>
          </div>
        )}

        {/* Agentic Tools Execution Stack */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-neutral-dark uppercase tracking-wider flex items-center space-x-1.5">
            <Wrench size={14} className="text-accent" />
            <span>Executed Agent Tools</span>
          </h4>

          {latestResponse?.toolsCalled && latestResponse.toolsCalled.length > 0 ? (
            latestResponse.toolsCalled.map((tool) => (
              <div key={tool.id} className="p-3 bg-navy-dark rounded-xl border border-navy-light text-xs space-y-1">
                <div className="flex items-center justify-between font-mono text-accent font-bold">
                  <span>{tool.name}()</span>
                  <span className="text-[10px] text-emerald-400">EXECUTED</span>
                </div>
                <pre className="text-[10px] text-neutral-dark bg-dark p-2 rounded overflow-x-auto">
                  {JSON.stringify(tool.args, null, 2)}
                </pre>
              </div>
            ))
          ) : (
            <div className="p-3 bg-navy-dark rounded-xl border border-navy-light text-xs text-neutral-dark italic">
              No backend tools required for this turn.
            </div>
          )}
        </div>

        {/* Product Context Card */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-neutral-dark uppercase tracking-wider flex items-center space-x-1.5">
            <ShoppingBag size={14} className="text-accent" />
            <span>Retrieved Product Context</span>
          </h4>

          <div className="p-3.5 bg-navy-dark rounded-xl border border-navy-light text-xs space-y-2">
            <span className="font-bold text-surface">Velocity Pro Running Shoes</span>
            <div className="flex items-center justify-between text-neutral">
              <span>Size: 9 | Color: Black</span>
              <span className="font-bold text-accent">₹4,999</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold">
              ✓ 8 Units Available in Inventory
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
