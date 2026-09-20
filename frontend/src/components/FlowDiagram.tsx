import React from 'react';
import { ConversationFlow } from '../types';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface FlowDiagramProps {
  flow: ConversationFlow;
  activeStepIndex?: number;
}

export const FlowDiagram: React.FC<FlowDiagramProps> = ({ flow, activeStepIndex = 0 }) => {
  return (
    <div className="bg-navy p-6 rounded-2xl border border-navy-light space-y-4">
      <div className="flex items-center justify-between border-b border-navy-light pb-3">
        <div>
          <h3 className="text-base font-bold text-surface">{flow.name}</h3>
          <p className="text-xs text-neutral-dark">{flow.description}</p>
        </div>
        <span className="px-2.5 py-1 text-xs font-semibold bg-accent/10 text-accent rounded-lg border border-accent/20">
          {flow.category}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flow.steps.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          const isCompleted = idx < activeStepIndex;

          return (
            <div
              key={step.id}
              className={`relative p-4 rounded-xl border transition-all ${
                isActive
                  ? 'bg-accent/15 border-accent text-surface shadow-lg shadow-accent/10'
                  : isCompleted
                  ? 'bg-navy-dark border-emerald-500/40 text-neutral'
                  : 'bg-navy-dark border-navy-light text-neutral-dark'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-dark/40 text-accent">
                  Step 0{idx + 1}
                </span>
                {isCompleted ? (
                  <CheckCircle size={16} className="text-emerald-400" />
                ) : (
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-dark">
                    {step.action}
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-surface mb-1">{step.label}</h4>
              <p className="text-xs text-neutral leading-relaxed">{step.description}</p>

              {idx < flow.steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-navy border border-navy-light p-1 rounded-full text-accent shadow">
                  <ArrowRight size={14} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
