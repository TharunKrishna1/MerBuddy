import React, { useState, useEffect } from 'react';
import { Merchant, CallLog } from '../types';
import { api } from '../services/api';
import { PhoneCall, AlertTriangle, CheckCircle2, Terminal, Lightbulb } from 'lucide-react';

interface CallLogsProps {
  merchant: Merchant | null;
}

export const CallLogs: React.FC<CallLogsProps> = ({ merchant }) => {
  const [logs, setLogs] = useState<CallLog[]>([]);
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);

  useEffect(() => {
    async function loadLogs() {
      try {
        const list = await api.getCallLogs(merchant?.id);
        setLogs(list);
        if (list.length > 0) setSelectedCall(list[0]);
      } catch (err) {
        console.error('Failed to load call logs:', err);
      }
    }
    loadLogs();
  }, [merchant]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="border-b border-navy-light pb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-surface flex items-center space-x-2">
            <PhoneCall className="text-accent" />
            <span>Call Logs & Agent Break Detector</span>
          </h2>
          <p className="text-xs text-neutral-dark mt-1">
            Test-Listen-Iterate loop inspecting live customer calls, detecting break points, and suggesting prompt fixes.
          </p>
        </div>

        <div className="px-4 py-2 bg-navy rounded-xl border border-navy-light text-xs font-bold text-surface">
          Total Calls Logged: <span className="text-accent">{logs.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Call Logs Table */}
        <div className="lg:col-span-7 bg-navy rounded-2xl border border-navy-light overflow-hidden shadow-md space-y-2">
          <div className="p-4 border-b border-navy-light bg-navy-dark flex items-center justify-between">
            <span className="text-xs font-bold text-surface">Call History Log</span>
            <span className="text-[11px] text-neutral-dark">Click call entry to inspect root cause</span>
          </div>

          <div className="divide-y divide-navy-light max-h-[600px] overflow-y-auto">
            {logs.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCall(c)}
                className={`p-4 space-y-2 cursor-pointer transition-all ${
                  selectedCall?.id === c.id
                    ? 'bg-accent/10 border-l-4 border-l-accent'
                    : 'hover:bg-navy-dark/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-surface">Call #{c.id.replace('call_', '')}</span>
                    <span className="px-2 py-0.5 rounded bg-navy-dark text-accent font-mono text-[10px] uppercase font-bold">
                      {c.detectedLanguage}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    c.status === 'successful' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {c.status === 'successful' ? 'Successful' : `Break: ${c.breakCategory}`}
                  </span>
                </div>

                <p className="text-xs text-neutral italic line-clamp-1">"{c.customerTranscript}"</p>
                <div className="flex items-center justify-between text-[11px] text-neutral-dark pt-1">
                  <span>Intent: {c.detectedIntent}</span>
                  <span>Latency: {c.latencyMs}ms</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Call Inspector & Break Diagnostic */}
        <div className="lg:col-span-5 space-y-6">
          {selectedCall ? (
            <div className="bg-navy p-6 rounded-2xl border border-navy-light space-y-6">
              <div className="flex items-center justify-between border-b border-navy-light pb-4">
                <div>
                  <h3 className="text-base font-bold text-surface">Call Inspector #{selectedCall.id.replace('call_', '')}</h3>
                  <span className="text-xs text-neutral-dark">Prompt Version: {selectedCall.promptVersion}</span>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedCall.status === 'successful' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {selectedCall.status === 'successful' ? 'Completed' : 'Agent Break Detected'}
                </span>
              </div>

              {/* Transcripts */}
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-navy-dark rounded-xl border border-navy-light space-y-1">
                  <span className="text-[10px] font-bold uppercase text-accent">Customer Speech:</span>
                  <p className="text-surface italic font-medium">"{selectedCall.customerTranscript}"</p>
                </div>

                <div className="p-3.5 bg-navy-dark rounded-xl border border-navy-light space-y-1">
                  <span className="text-[10px] font-bold uppercase text-neutral-dark">Agent Response:</span>
                  <p className="text-surface font-semibold">{selectedCall.agentResponse}</p>
                </div>
              </div>

              {/* Agent Break Diagnostics Card */}
              {selectedCall.status === 'break_detected' && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl space-y-3">
                  <div className="flex items-center space-x-2 text-red-400 font-bold text-xs">
                    <AlertTriangle size={18} />
                    <span>Agent Break Category: {selectedCall.breakCategory}</span>
                  </div>

                  <p className="text-xs text-red-300 leading-relaxed">
                    {selectedCall.breakReason}
                  </p>

                  {selectedCall.promptFixRecommendation && (
                    <div className="p-3 bg-dark/80 rounded-xl border border-accent/30 space-y-1 text-xs">
                      <span className="text-accent font-bold flex items-center space-x-1.5">
                        <Lightbulb size={14} />
                        <span>Recommended Prompt Fix:</span>
                      </span>
                      <p className="text-emerald-300 font-mono text-[11px] leading-relaxed">
                        {selectedCall.promptFixRecommendation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-navy p-6 rounded-2xl border border-navy-light text-center text-neutral-dark text-xs">
              Select a call entry from the table to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
