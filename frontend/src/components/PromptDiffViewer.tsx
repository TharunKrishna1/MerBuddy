import React from 'react';
import { PromptTemplate } from '../types';

interface PromptDiffViewerProps {
  promptA: PromptTemplate;
  promptB: PromptTemplate;
}

export const PromptDiffViewer: React.FC<PromptDiffViewerProps> = ({ promptA, promptB }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-navy p-4 rounded-2xl border border-navy-light">
      <div className="space-y-2">
        <div className="flex items-center justify-between bg-navy-dark p-2.5 rounded-lg border border-navy-light">
          <span className="text-xs font-bold text-accent">{promptA.version} (Active Baseline)</span>
          <span className="text-[11px] text-neutral-dark">{promptA.title}</span>
        </div>
        <pre className="bg-dark p-4 rounded-xl text-xs text-emerald-300 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-96">
          {promptA.content}
        </pre>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between bg-navy-dark p-2.5 rounded-lg border border-navy-light">
          <span className="text-xs font-bold text-accent">{promptB.version} (Comparison Target)</span>
          <span className="text-[11px] text-neutral-dark">{promptB.title}</span>
        </div>
        <pre className="bg-dark p-4 rounded-xl text-xs text-amber-200 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-96">
          {promptB.content}
        </pre>
      </div>
    </div>
  );
};
