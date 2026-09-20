import React, { useEffect, useState } from 'react';
import { Merchant, AnalyticsSummary, CallLog } from '../types';
import { api } from '../services/api';
import {
  PhoneCall,
  CheckCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Play
} from 'lucide-react';

interface DashboardProps {
  selectedMerchant: Merchant | null;
  onNavigate: (tab: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ selectedMerchant, onNavigate }) => {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [recentCalls, setRecentCalls] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [aData, cData] = await Promise.all([
          api.getAnalytics(selectedMerchant?.id),
          api.getCallLogs(selectedMerchant?.id)
        ]);
        setAnalytics(aData);
        setRecentCalls(cData.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedMerchant]);

  if (loading || !analytics) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-navy p-6 rounded-3xl border border-navy-light shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-accent text-xs font-bold uppercase tracking-widest mb-1">
            <Sparkles size={16} />
            <span>Voice Commerce Control Center</span>
          </div>
          <h2 className="text-2xl font-extrabold text-surface">
            {selectedMerchant?.name || 'UrbanKicks'} Merchant Agent
          </h2>
          <p className="text-sm text-neutral-dark mt-1">
            Language: <span className="text-accent font-semibold">{selectedMerchant?.language.toUpperCase()}</span> | Tone: <span className="text-surface font-semibold">{selectedMerchant?.tone}</span> | Target Max Words: <span className="text-surface font-semibold">{selectedMerchant?.maxResponseWords}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('live_agent')}
            className="px-5 py-3 rounded-xl bg-accent text-dark font-bold text-sm hover:bg-accent-hover transition-all flex items-center space-x-2 shadow-lg shadow-accent/20"
          >
            <Play size={16} />
            <span>Launch Live Agent</span>
          </button>
          <button
            onClick={() => onNavigate('evaluations')}
            className="px-5 py-3 rounded-xl bg-navy-light text-surface font-semibold text-sm hover:bg-navy-dark transition-all border border-navy-light flex items-center space-x-2"
          >
            <ShieldCheck size={16} />
            <span>Run Evals Suite</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <div className="bg-navy p-5 rounded-2xl border border-navy-light flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-neutral-dark mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Calls</span>
            <PhoneCall size={18} className="text-accent" />
          </div>
          <div className="text-3xl font-black text-surface">{analytics.totalCalls}</div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-2 flex items-center">
            <ArrowUpRight size={12} className="mr-0.5" /> +14.2% this week
          </span>
        </div>

        <div className="bg-navy p-5 rounded-2xl border border-navy-light flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-neutral-dark mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Success Rate</span>
            <CheckCircle size={18} className="text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">{analytics.successRatePercentage}%</div>
          <span className="text-[11px] text-neutral-dark font-medium mt-2">
            {analytics.successfulCalls} completed calls
          </span>
        </div>

        <div className="bg-navy p-5 rounded-2xl border border-navy-light flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-neutral-dark mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Eval Pass Score</span>
            <ShieldCheck size={18} className="text-accent" />
          </div>
          <div className="text-3xl font-black text-accent">{analytics.evaluationPassRatePercentage}%</div>
          <span className="text-[11px] text-neutral-dark font-medium mt-2">
            10 Benchmark Test Cases
          </span>
        </div>

        <div className="bg-navy p-5 rounded-2xl border border-navy-light flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-neutral-dark mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Prompt Breaks</span>
            <AlertTriangle size={18} className="text-red-400" />
          </div>
          <div className="text-3xl font-black text-red-400">{analytics.promptFailures}</div>
          <span className="text-[11px] text-red-400/80 font-medium mt-2">
            Requires Prompt Tuning
          </span>
        </div>

        <div className="bg-navy p-5 rounded-2xl border border-navy-light flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between text-neutral-dark mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Latency</span>
            <Clock size={18} className="text-blue-400" />
          </div>
          <div className="text-3xl font-black text-surface">{analytics.averageResponseTimeMs}<span className="text-sm font-normal text-neutral-dark">ms</span></div>
          <span className="text-[11px] text-emerald-400 font-medium mt-2 flex items-center">
            <Zap size={12} className="mr-0.5" /> Real-time Streaming
          </span>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Calls Log */}
        <div className="lg:col-span-2 bg-navy p-6 rounded-2xl border border-navy-light space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-surface">Recent Live Conversations</h3>
            <button
              onClick={() => onNavigate('call_logs')}
              className="text-xs text-accent font-semibold hover:underline"
            >
              View All Logs ({recentCalls.length}) →
            </button>
          </div>

          <div className="space-y-3">
            {recentCalls.map((call) => (
              <div
                key={call.id}
                onClick={() => onNavigate('call_logs')}
                className="p-4 rounded-xl bg-navy-dark border border-navy-light hover:border-accent/40 cursor-pointer transition-all space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-surface">Call #{call.id.replace('call_', '')}</span>
                    <span className="px-2 py-0.5 rounded bg-accent/20 text-accent font-mono text-[10px] uppercase font-bold">
                      {call.detectedLanguage}
                    </span>
                    <span className="text-neutral-dark">{call.detectedIntent}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    call.status === 'successful' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {call.status === 'successful' ? 'Success' : `Break: ${call.breakCategory}`}
                  </span>
                </div>

                <p className="text-xs text-neutral italic">"{call.customerTranscript}"</p>
                <p className="text-xs text-surface font-medium">🤖 {call.agentResponse}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Store Integration & Active Rules */}
        <div className="bg-navy p-6 rounded-2xl border border-navy-light space-y-6">
          <div>
            <h3 className="text-base font-bold text-surface mb-3">Merchant Business Rules</h3>
            <div className="space-y-2">
              {selectedMerchant?.businessRules.map((rule, idx) => (
                <div key={idx} className="p-3 bg-navy-dark rounded-xl border border-navy-light text-xs text-neutral">
                  📌 {rule}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-navy-light pt-4 space-y-3">
            <h3 className="text-sm font-bold text-surface">Active Prompt Version</h3>
            <div className="p-3 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-accent">v3.2 Hinglish Footwear</span>
                <p className="text-[11px] text-neutral-dark">Updated Sep 15, 2026</p>
              </div>
              <button
                onClick={() => onNavigate('prompt_studio')}
                className="px-3 py-1.5 bg-accent text-dark font-bold text-xs rounded-lg"
              >
                Edit Prompt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
