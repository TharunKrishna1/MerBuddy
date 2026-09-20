import React, { useState } from 'react';
import { Merchant } from '../types';
import { api } from '../services/api';
import { Sliders, Save, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface MerchantConfigProps {
  merchant: Merchant | null;
  onUpdateMerchant: (updated: Merchant) => void;
}

export const MerchantConfig: React.FC<MerchantConfigProps> = ({ merchant, onUpdateMerchant }) => {
  const [formData, setFormData] = useState<Merchant>(
    merchant || {
      id: 'merchant_001',
      name: 'UrbanKicks',
      language: 'hinglish',
      currency: 'INR',
      tone: 'friendly',
      maxResponseWords: 22,
      allowDiscountDiscussion: true,
      allowProductRecommendations: true,
      voiceStyle: 'warm-conversational',
      businessRules: [
        'Always confirm footwear size and color before suggesting a purchase.',
        'Never offer discounts higher than 25% without explicit coupon code.'
      ],
      activePromptId: 'prompt_001',
      createdAt: '',
      updatedAt: ''
    }
  );

  const [newRule, setNewRule] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await api.updateMerchant(formData.id, formData);
      onUpdateMerchant(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update merchant config:', err);
    }
  };

  const handleAddRule = () => {
    if (!newRule.trim()) return;
    setFormData((prev) => ({
      ...prev,
      businessRules: [...prev.businessRules, newRule.trim()]
    }));
    setNewRule('');
  };

  const handleRemoveRule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      businessRules: prev.businessRules.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-navy-light pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-surface flex items-center space-x-2">
            <Sliders className="text-accent" />
            <span>Merchant Agent Configuration</span>
          </h2>
          <p className="text-xs text-neutral-dark mt-1">
            Customize language styling, tone, response word cap, and custom store business rules.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center space-x-2 animate-fade-in">
            <CheckCircle2 size={16} />
            <span>Configuration Saved Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Store Name */}
          <div className="bg-navy p-5 rounded-2xl border border-navy-light space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-dark">
              Store / Merchant Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-navy-dark border border-navy-light text-surface px-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none focus:border-accent"
            />
          </div>

          {/* Primary Language */}
          <div className="bg-navy p-5 rounded-2xl border border-navy-light space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-dark">
              Agent Language Mode
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value as any })}
              className="w-full bg-navy-dark border border-navy-light text-surface px-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none focus:border-accent"
            >
              <option value="hinglish">Hinglish (Recommended for India)</option>
              <option value="english">English Only</option>
              <option value="hindi">Hindi Only</option>
            </select>
          </div>

          {/* Tone */}
          <div className="bg-navy p-5 rounded-2xl border border-navy-light space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-dark">
              Speech Tone
            </label>
            <select
              value={formData.tone}
              onChange={(e) => setFormData({ ...formData, tone: e.target.value as any })}
              className="w-full bg-navy-dark border border-navy-light text-surface px-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none focus:border-accent"
            >
              <option value="friendly">Friendly & Conversational</option>
              <option value="energetic">Energetic & Sporty</option>
              <option value="professional">Professional & Formal</option>
              <option value="concise">Concise & Direct</option>
            </select>
          </div>

          {/* Response Length Limit */}
          <div className="bg-navy p-5 rounded-2xl border border-navy-light space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-dark">
              Target Max Response Words ({formData.maxResponseWords} words)
            </label>
            <input
              type="range"
              min="10"
              max="40"
              value={formData.maxResponseWords}
              onChange={(e) => setFormData({ ...formData, maxResponseWords: parseInt(e.target.value, 10) })}
              className="w-full accent-accent cursor-pointer"
            />
            <p className="text-[11px] text-neutral-dark">
              Short responses (&lt; 25 words) reduce voice latency and sound natural over TTS.
            </p>
          </div>
        </div>

        {/* Business Rules Builder */}
        <div className="bg-navy p-6 rounded-2xl border border-navy-light space-y-4">
          <h3 className="text-base font-bold text-surface">Merchant Business Rules</h3>

          <div className="space-y-2">
            {formData.businessRules.map((rule, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 bg-navy-dark rounded-xl border border-navy-light text-xs text-surface"
              >
                <span>📌 {rule}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveRule(idx)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex space-x-2 pt-2">
            <input
              type="text"
              value={newRule}
              onChange={(e) => setNewRule(e.target.value)}
              placeholder="Add rule e.g. Suggest matching performance socks on orders over ₹3000."
              className="flex-1 bg-navy-dark border border-navy-light text-surface placeholder:text-neutral-dark text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:border-accent"
            />
            <button
              type="button"
              onClick={handleAddRule}
              className="px-4 py-2.5 bg-accent/20 text-accent font-bold text-xs rounded-xl hover:bg-accent/30 flex items-center space-x-1"
            >
              <Plus size={16} />
              <span>Add Rule</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-accent text-dark font-extrabold text-sm rounded-2xl hover:bg-accent-hover transition-all flex items-center justify-center space-x-2 shadow-lg shadow-accent/20"
        >
          <Save size={18} />
          <span>Save Merchant Settings</span>
        </button>
      </form>
    </div>
  );
};
