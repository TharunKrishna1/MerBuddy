import React from 'react';
import { Merchant } from '../types';
import { Bot, Sparkles, Store, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  merchants: Merchant[];
  selectedMerchant: Merchant | null;
  onSelectMerchant: (merchant: Merchant) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  merchants,
  selectedMerchant,
  onSelectMerchant,
}) => {
  return (
    <header className="bg-navy border-b border-navy-light text-surface px-6 py-3.5 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-dark font-bold shadow-lg shadow-accent/20">
          <Bot size={24} />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-surface">MerBuddy</h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-accent/20 text-accent rounded-full border border-accent/30">
              Voice AI Engine
            </span>
          </div>
          <p className="text-xs text-neutral-dark">Merchant Voice AI Commerce Assistant</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Merchant Selector */}
        <div className="flex items-center space-x-2 bg-navy-dark px-3 py-1.5 rounded-lg border border-navy-light">
          <Store size={16} className="text-accent" />
          <span className="text-xs text-neutral font-medium">Merchant:</span>
          <select
            value={selectedMerchant?.id || ''}
            onChange={(e) => {
              const m = merchants.find((item) => item.id === e.target.value);
              if (m) onSelectMerchant(m);
            }}
            className="bg-transparent text-xs font-semibold text-surface focus:outline-none cursor-pointer"
          >
            {merchants.map((m) => (
              <option key={m.id} value={m.id} className="bg-navy text-surface">
                {m.name} ({m.language.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {/* Integration Status Pills */}
        <div className="hidden md:flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <CheckCircle2 size={14} />
            <span>Gemini REST API</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 text-accent text-xs font-medium">
            <Sparkles size={14} />
            <span>GraphQL Admin API</span>
          </div>
        </div>
      </div>
    </header>
  );
};
