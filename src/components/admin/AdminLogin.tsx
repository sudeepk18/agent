import React, { useState } from 'react';
import { apiUrl } from '../../config/api';

interface AdminLoginProps {
  onLoginSuccess: (token: string) => void;
  onReturnToSite: () => void;
}

export function AdminLogin({ onLoginSuccess, onReturnToSite }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        sessionStorage.setItem('admin_token', data.token);
        onLoginSuccess(data.token);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection failed. Please ensure server is running.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden select-none bg-[#05040a]">
      {/* Ambient background glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#7c3aed]/20 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#38bdf8]/20 blur-[120px] pointer-events-none" />

      <div
        className="w-full max-w-md rounded-2xl p-8 backdrop-blur-2xl relative z-10"
        style={{
          backgroundColor: 'rgba(13, 11, 26, 0.92)',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(139, 92, 246, 0.25)',
        }}
      >
        {/* Top Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#a855f7] shadow-lg shadow-[#7c3aed]/40 text-2xl font-bold mb-4 text-white">
            🔒
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">AgentBlazer Admin</h1>
          <p className="text-xs text-[#94a3b8] mt-1.5">Secure Content Management System</p>
        </div>

        {/* Credentials Info Pill */}
        <div className="mb-6 p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-[#cbd5e1] flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#38bdf8]">🔑 Admin Credentials</span>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@agentblazer.sjec.ac.in');
                setPassword('AgentBlazer@2026');
              }}
              className="text-[11px] px-2 py-0.5 rounded-md bg-[#7c3aed]/30 hover:bg-[#7c3aed]/60 text-purple-200 border border-purple-400/30 transition-all cursor-pointer"
            >
              Auto-fill
            </button>
          </div>
          <div className="font-mono text-[11px] text-[#94a3b8] space-y-0.5">
            <div>Email: <span className="text-white select-all">admin@agentblazer.sjec.ac.in</span></div>
            <div>Password: <span className="text-white select-all">AgentBlazer@2026</span></div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-medium flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-2 uppercase tracking-wider">
              Administrator Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@agentblazer.sjec.ac.in"
              required
              className="w-full px-4 py-3 rounded-xl text-sm text-white bg-white/[0.05] border border-white/10 focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/30 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#94a3b8] mb-2 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full px-4 py-3 rounded-xl text-sm text-white bg-white/[0.05] border border-white/10 focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/30 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all duration-300 mt-2 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={onReturnToSite}
            className="text-xs text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
          >
            ← Return to AgentBlazer Public Website
          </button>
        </div>
      </div>
    </div>
  );
}
