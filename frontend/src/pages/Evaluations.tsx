import React, { useState, useEffect } from 'react';
import { Merchant, EvaluationResult, EvaluationTestCase } from '../types';
import { api } from '../services/api';
import { CheckSquare, Play, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

interface EvaluationsProps {
  merchant: Merchant | null;
}

export const Evaluations: React.FC<EvaluationsProps> = ({ merchant }) => {
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const [testCases, setTestCases] = useState<EvaluationTestCase[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [passRate, setPassRate] = useState(100);

  useEffect(() => {
    async function loadEvals() {
      try {
        const data = await api.getEvaluations(merchant?.id);
        if (data) {
          setResults(data);
          const passed = data.filter((r: any) => r.passed).length;
          setPassRate(data.length > 0 ? Math.round((passed / data.length) * 100) : 100);
        }
      } catch (err) {
        console.error('Failed to load evals:', err);
      }
    }
    loadEvals();
  }, [merchant]);

  const handleRunSuite = async () => {
    setIsRunning(true);
    try {
      const res = await api.runEvaluations(merchant?.id || 'merchant_001');
      setResults(res.data);
      setPassRate(res.summary.passRatePercentage);
    } catch (err) {
      console.error('Run evaluation suite failed:', err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-navy-light pb-5 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-surface flex items-center space-x-2">
            <CheckSquare className="text-accent" />
            <span>AI Agent Evaluation System</span>
          </h2>
          <p className="text-xs text-neutral-dark mt-1">
            Run automated benchmark test cases for hallucination prevention, pricing accuracy, Hinglish style, and response brevity.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-navy px-4 py-2 rounded-xl border border-navy-light text-right">
            <span className="text-[10px] uppercase font-bold text-neutral-dark block">Overall Pass Score</span>
            <span className="text-xl font-black text-accent">{passRate}%</span>
          </div>

          <button
            onClick={handleRunSuite}
            disabled={isRunning}
            className="px-6 py-3 bg-accent text-dark font-extrabold text-xs rounded-xl hover:bg-accent-hover transition-all flex items-center space-x-2 shadow-lg shadow-accent/20"
          >
            <Play size={16} />
            <span>{isRunning ? 'Running Benchmark Suite...' : 'Run Evals Suite'}</span>
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-navy rounded-2xl border border-navy-light overflow-hidden shadow-md">
        <div className="p-4 border-b border-navy-light bg-navy-dark flex items-center justify-between">
          <span className="text-xs font-bold text-surface">Evaluation Benchmark Results ({results.length} Test Cases)</span>
          <span className="text-[11px] text-neutral-dark">Auto-evaluated against active merchant system prompt</span>
        </div>

        <div className="divide-y divide-navy-light overflow-x-auto">
          {results.map((res) => (
            <div key={res.id} className="p-5 space-y-3 hover:bg-navy-dark/40 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {res.passed ? (
                    <CheckCircle2 size={20} className="text-emerald-400" />
                  ) : (
                    <XCircle size={20} className="text-red-400" />
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-surface">{res.testName}</h4>
                    <span className="text-[10px] font-mono text-accent font-bold px-2 py-0.5 rounded bg-accent/10">
                      {res.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs text-neutral-dark font-mono">{res.latencyMs} ms</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    res.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {res.passed ? `PASS (${res.score}/100)` : `FAIL (${res.score}/100)`}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-navy-dark border border-navy-light space-y-1">
                  <span className="text-[10px] uppercase font-bold text-neutral-dark">Test Input Prompt:</span>
                  <p className="text-neutral italic">"{res.input}"</p>
                  <span className="text-[10px] uppercase font-bold text-neutral-dark block pt-1">Expected Behavior:</span>
                  <p className="text-neutral-dark">{res.expectedBehavior}</p>
                </div>

                <div className="p-3 rounded-xl bg-navy-dark border border-navy-light space-y-1">
                  <span className="text-[10px] uppercase font-bold text-accent">Actual Agent Output:</span>
                  <p className="text-surface font-semibold">{res.actualResponse}</p>
                  {res.failureReason && (
                    <div className="text-red-400 text-[11px] font-bold pt-1">
                      ⚠️ Failure Root Cause: {res.failureReason}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
