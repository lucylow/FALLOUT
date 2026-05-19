import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from "motion/react";
import { 
  CreditCard, 
  Settings, 
  Trash2, 
  ExternalLink, 
  RefreshCw, 
  Calendar, 
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface Subscription {
  id: string;
  status: string;
  plan: string;
  currentPeriodEnd: string;
}

const ManageSubscription = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/billing/subscriptions');
      setSubscriptions(response.data);
    } catch (err) {
      console.error("[FETCH_SUBS_FAILED]", err);
    } finally {
      setLoading(false);
    }
  };

  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const response = await axios.post('/api/billing/create-portal-session', {
        email: user?.email
      });
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      console.error("[PORTAL_FAILED]", err);
      alert("Billing portal currently restricted. Please check security clearance.");
    } finally {
      setPortalLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    active: 'text-quantum-primary bg-quantum-primary/10 border-quantum-primary/20',
    canceled: 'text-quantum-danger bg-quantum-danger/10 border-quantum-danger/20',
    past_due: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
  };

  return (
    <div className="animate-in fade-in duration-700 space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tighter text-white italic uppercase">Subscription Management</h2>
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E9299]">Manual Override & Billing Oversight</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-white">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-quantum-panel/60 border border-quantum-border rounded-3xl overflow-hidden glass">
            <div className="p-6 border-b border-quantum-border flex items-center justify-between bg-quantum-panel/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-quantum-primary/10 text-quantum-primary rounded-xl">
                  <CreditCard size={18} />
                </div>
                <span className="text-sm font-bold uppercase tracking-widest text-[#8E9299]">Active Permissions</span>
              </div>
              <button 
                onClick={fetchSubscriptions}
                className="p-2 hover:bg-white/5 rounded-lg text-[#454545] transition-colors"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>

            <div className="p-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <RefreshCw className="text-quantum-primary animate-spin" size={32} />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-quantum-primary">Synchronizing with Stripe Ledger...</span>
                </div>
              ) : subscriptions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-[#454545]">
                    <AlertCircle size={32} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-white font-bold uppercase italic tracking-tight">No active subscription found</p>
                    <p className="text-[#8E9299] text-sm max-w-xs">Your node is currently operating on the Baseline Protocol. Upgrade to Pro for high-frequency key rotation.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {subscriptions.map(sub => (
                    <div key={sub.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-quantum-primary/30 transition-all group">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-quantum-primary/10 rounded-2xl flex items-center justify-center text-quantum-primary group-hover:scale-105 transition-transform">
                          <ShieldCheck size={28} />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-lg font-bold uppercase italic tracking-tighter">Enterprise Pro</span>
                            <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded border uppercase tracking-widest ${statusColors[sub.status] || 'text-[#454545] border-[#454545]'}`}>
                              {sub.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-[#454545] font-mono text-[10px]">
                            <span className="flex items-center gap-1.5"><Calendar size={10} /> Renews: {new Date(sub.currentPeriodEnd).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1.5"><Settings size={10} /> ID: {sub.id.substring(0, 12)}...</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                         <button 
                          onClick={openPortal}
                          className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                         >
                          Manage Plan
                         </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-quantum-panel/20 border border-quantum-border rounded-3xl p-8 flex items-center gap-6 glass">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
              <AlertCircle size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#8E9299] mb-1">Security Disclaimer</p>
              <p className="text-xs text-[#454545] leading-relaxed italic">
                Billing data is offloaded to the Stripe Secure Enclave. No payment identifiers are stored within local FALLOUT memory buffers.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-quantum-panel border border-quantum-border rounded-3xl p-8 space-y-8 glass relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
              <CreditCard size={160} className="text-quantum-primary" />
             </div>
             <div className="space-y-2 relative z-10">
                <h4 className="text-lg font-bold uppercase italic tracking-tight">Billing Portal</h4>
                <p className="text-[#8E9299] text-sm leading-relaxed">
                  Access the Stripe Customer Portal to update payment methods, download invoices, or cancel your subscription.
                </p>
             </div>
             <button 
              onClick={openPortal}
              disabled={portalLoading}
              className="w-full py-4 bg-quantum-primary text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:shadow-quantum transition-all uppercase italic text-sm relative z-10"
             >
                {portalLoading ? <RefreshCw className="animate-spin" size={18} /> : (
                  <>
                    <span>Open Secure Portal</span>
                    <ExternalLink size={18} />
                  </>
                )}
             </button>
          </div>
          
          <div className="bg-quantum-panel/40 border border-quantum-border rounded-3xl p-8 space-y-6 glass">
             <h4 className="text-sm font-bold uppercase tracking-widest text-[#8E9299]">Protocol Stats</h4>
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#454545]">Next Cycle</span>
                  <span className="text-xs font-mono">Feb 18, 2026</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#454545]">Handshake Usage</span>
                  <span className="text-xs font-mono">1,242 / UNLIMITED</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-quantum-primary w-[12%] shadow-quantum" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSubscription;
