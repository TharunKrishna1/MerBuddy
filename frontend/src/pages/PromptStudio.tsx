import React, { useState, useEffect } from 'react';
import { Merchant, PromptTemplate } from '../types';
import { api } from '../services/api';
import { PromptDiffViewer } from '../components/PromptDiffViewer';
import {
  Terminal,
  AlertTriangle,
  Play,
  Save,
  Copy,
  CheckCircle2,
  Columns,
  Sparkles
} from 'lucide-react';

interface PromptStudioProps {
  merchant: Merchant | null;
}

export const PromptStudio: React.FC<PromptStudioProps> = ({ merchant }) => {
  const [prompts, setPrompts] = useState<PromptTemplate[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<PromptTemplate | null>(null);
  const [promptContent, setPromptContent] = useState('');
  const [promptTitle, setPromptTitle] = useState('');
  const [promptVersion, setPromptVersion] = useState('');
  const [compareMode, setCompareMode] = useState(false);
  const [testInput, setTestInput] = useState('Bhai black running shoes size 9 mein hain kya?');
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    async function loadPrompts() {
      try {
        const list = await api.getPrompts(merchant?.id);
        setPrompts(list);
        if (list.length > 0) {
          setSelectedPrompt(list[0]);
          setPromptContent(list[0].content);
          setPromptTitle(list[0].title);
          setPromptVersion(list[0].version);
        }
      } catch (err) {
        console.error('Failed to load prompts:', err);
      }
    }
    loadPrompts();
  }, [merchant]);

  const handleSelectPrompt = (p: PromptTemplate) => {
    setSelectedPrompt(p);
    setPromptContent(p.content);
    setPromptTitle(p.title);
    setPromptVersion(p.version);
    setTestResult(null);
  };

  const handleSavePrompt = async () => {
    if (!selectedPrompt) return;
    try {
      const updated = await api.savePrompt({
        ...selectedPrompt,
        title: promptTitle,
        version: promptVersion,
        content: promptContent
      });
      setSelectedPrompt(updated);
      setPrompts(prompts.map(p => p.id === updated.id ? updated : p));
      alert('Prompt Template Saved & Hygiene Checks Updated!');
    } catch (err) {
      console.error('Failed to save prompt:', err);
    }
  };

  const handleTestPrompt = async () => {
    if (!selectedPrompt) return;
    setIsTesting(true);
    try {
      const res = await api.testPrompt(selectedPrompt.id, testInput, merchant?.id);
      setTestResult(res);
    } catch (err) {
      console.error('Test prompt failed:', err);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-navy-light pb-5 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-surface flex items-center space-x-2">
            <Terminal className="text-accent" />
            <span>Prompt Studio & Hygiene Engine</span>
          </h2>
          <p className="text-xs text-neutral-dark mt-1">
            Author reusable merchant system prompts, validate hygiene rules, compare prompt versions, and test turn responses.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-2 ${
              compareMode
                ? 'bg-accent text-dark border-accent'
                : 'bg-navy-light text-surface border-navy-light hover:bg-navy-dark'
            }`}
          >
            <Columns size={16} />
            <span>{compareMode ? 'Exit Diff Mode' : 'Compare Versions'}</span>
          </button>

          <button
            onClick={handleSavePrompt}
            className="px-5 py-2.5 bg-accent text-dark font-extrabold text-xs rounded-xl hover:bg-accent-hover transition-all flex items-center space-x-2 shadow-lg shadow-accent/20"
          >
            <Save size={16} />
            <span>Save Prompt</span>
          </button>
        </div>
      </div>

      {/* Version Selector Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {prompts.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelectPrompt(p)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border whitespace-nowrap transition-all ${
              selectedPrompt?.id === p.id
                ? 'bg-accent text-dark border-accent'
                : 'bg-navy border-navy-light text-neutral hover:text-surface'
            }`}
          >
            {p.version} - {p.title}
          </button>
        ))}
      </div>

      {/* Compare Diff Mode */}
      {compareMode && prompts.length >= 2 ? (
        <PromptDiffViewer promptA={prompts[0]} promptB={prompts[1]} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Prompt Editor */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-navy p-6 rounded-2xl border border-navy-light space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-dark">Template Title</label>
                  <input
                    type="text"
                    value={promptTitle}
                    onChange={(e) => setPromptTitle(e.target.value)}
                    className="w-full bg-navy-dark border border-navy-light text-surface px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-dark">Version Tag</label>
                  <input
                    type="text"
                    value={promptVersion}
                    onChange={(e) => setPromptVersion(e.target.value)}
                    className="w-full bg-navy-dark border border-navy-light text-surface px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-dark mb-1 block">
                  System Prompt Template Content
                </label>
                <textarea
                  rows={14}
                  value={promptContent}
                  onChange={(e) => setPromptContent(e.target.value)}
                  className="w-full bg-dark text-emerald-300 font-mono text-xs p-4 rounded-xl border border-navy-light focus:outline-none focus:border-accent leading-relaxed"
                />
              </div>

              {/* Supported Variable Injection Badges */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-dark block mb-2">
                  Available Prompt Variables:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'merchant_name',
                    'language',
                    'tone',
                    'max_response_words',
                    'currency',
                    'business_rules',
                    'product_context',
                    'customer_message'
                  ].map((v) => (
                    <span
                      key={v}
                      className="px-2 py-1 rounded bg-navy-dark text-[10px] font-mono font-semibold text-accent border border-navy-light cursor-pointer hover:bg-navy"
                      onClick={() => setPromptContent((prev) => `${prev} {{${v}}}`)}
                    >
                      {`{{${v}}}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Prompt Hygiene Warnings */}
            <div className="bg-navy p-6 rounded-2xl border border-navy-light space-y-3">
              <h3 className="text-sm font-bold text-surface flex items-center space-x-2">
                <AlertTriangle size={16} className="text-amber-400" />
                <span>Automated Prompt Hygiene Analysis</span>
              </h3>

              {selectedPrompt?.hygieneWarnings && selectedPrompt.hygieneWarnings.length > 0 ? (
                selectedPrompt.hygieneWarnings.map((w, idx) => (
                  <div key={idx} className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1 text-xs">
                    <span className="font-bold text-amber-400">WARNING: {w.message}</span>
                    <p className="text-neutral leading-relaxed">💡 <span className="font-semibold">Suggestion:</span> {w.suggestion}</p>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-medium flex items-center space-x-2">
                  <CheckCircle2 size={16} />
                  <span>Prompt Hygiene Score: 100/100 (Clean - No Contradictions or Missing Variables)</span>
                </div>
              )}
            </div>
          </div>

          {/* Test Playground */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-navy p-6 rounded-2xl border border-navy-light space-y-4">
              <h3 className="text-sm font-bold text-surface flex items-center space-x-2">
                <Sparkles size={16} className="text-accent" />
                <span>Prompt Test Playground</span>
              </h3>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-dark mb-1 block">
                  Simulated Customer Turn Input
                </label>
                <input
                  type="text"
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  className="w-full bg-navy-dark border border-navy-light text-surface px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:border-accent"
                />
              </div>

              <button
                onClick={handleTestPrompt}
                disabled={isTesting}
                className="w-full py-2.5 bg-accent text-dark font-bold text-xs rounded-xl hover:bg-accent-hover transition-all flex items-center justify-center space-x-2 shadow"
              >
                <Play size={14} />
                <span>{isTesting ? 'Running Gemini Test Turn...' : 'Run Test Turn'}</span>
              </button>

              {testResult && (
                <div className="space-y-3 pt-2">
                  <div className="p-3 rounded-xl bg-navy-dark border border-navy-light space-y-1">
                    <span className="text-[10px] uppercase font-bold text-accent">Voice Agent Output Response:</span>
                    <p className="text-xs text-surface font-semibold">{testResult.agentResponse}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-navy-dark border border-navy-light space-y-1">
                    <span className="text-[10px] uppercase font-bold text-neutral-dark">Turn Latency:</span>
                    <div className="text-xs font-mono font-bold text-emerald-400">{testResult.latencyMs} ms</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
