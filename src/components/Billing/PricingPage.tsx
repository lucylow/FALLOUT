import React, { useState } from 'react';
import axios from 'axios';
import { motion } from "motion/react";
import { Check, Zap, Shield, Sparkles, CreditCard, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface Plan {
  id: string;
  name: string;
  priceId: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  icon: any;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Standard',
    priceId: '',
    price: '$0',
    description: 'Basic quantum oversight for individual researchers.',
    features: [
      '1,000 BB84 Handshakes / mo',
      'Standard Intelligence Core',
      'Basic Amenity Logs',
      'Community Support'
    ],
    icon: Shield,
  },
  {
    id: 'pro',
    name: 'Enterprise Pro',
    priceId: (import.meta as any).env.VITE_STRIPE_MONTHLY_PRICE_ID || 'price_1Q...', // Fallback or placeholder
    price: '$49/mo',
    description: 'High-frequency key rotation for mission-critical apps.',
    features: [
      'Unlimited QKD Handshakes',
      'Advanced Multi-Agent Reasoning',
      'Real-time Threat Monitoring',
      '24/7 Priority Support',
      'Audit Log Persistence (90 days)'
    ],
    highlighted: true,
    icon: Zap,
  },
  {
    id: 'quantum',
    name: 'Military Grade',
    priceId: (import.meta as any).env.VITE_STRIPE_YEARLY_PRICE_ID || 'price_1Q...',
    price: '$499/mo',
    description: 'Air-gapped dedicated quantum hardware orchestration.',
    features: [
      'Dedicated Quantum Node Ingress',
      'Custom Agent Policy Engine',
      'Hardware Entropy Integration',
      'White-glove Deployment',
      'Zero-Latency Topology'
    ],
    icon: Sparkles,
  },
];

const PricingPage = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const { user } = useAuth();

  const handleSubscribe = async (plan: Plan) => {
    if (!plan.priceId) {
      // Free or contact sales
      return;
    }

    setLoading(plan.id);
    try {
      const response = await axios.post('/api/billing/create-checkout-session', {
        priceId: plan.priceId,
        email: user?.email,
        name: user?.name
      });
      
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      console.error("[BILLING_INIT_FAILED]", err);
      alert("Failed to initialize secure checkout. Please check configuration.");
    } finally {
      setLoading(plan.id);
    }
  };

  return (
    <div className="animate-in fade-in duration-700 space-y-12 pb-20">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-quantum-primary/10 border border-quantum-primary/20 text-quantum-primary text-[10px] font-bold font-mono uppercase tracking-widest"
        >
          <CreditCard size={12} />
          <span>Access Tiering</span>
        </motion.div>
        <h1 className="text-4xl font-black tracking-tighter text-white italic uppercase">Monetization Protocols</h1>
        <p className="text-[#8E9299] text-lg font-medium leading-relaxed">
          Scale your quantum defensive perimeter with enterprise-grade subscription layers. 
          Secured by Stripe handshakes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`relative flex flex-col p-8 rounded-[2rem] border transition-all duration-500 overflow-hidden ${
              plan.highlighted 
                ? 'bg-quantum-panel/80 border-quantum-primary/40 shadow-quantum scale-105 z-10' 
                : 'bg-quantum-panel/40 border-quantum-border hover:border-quantum-border/80'
            }`}
          >
            {plan.highlighted && (
              <div className="absolute top-0 right-0 px-4 py-1 bg-quantum-primary text-black text-[10px] font-black uppercase italic tracking-tighter rounded-bl-xl shadow-lg">
                Recommended Tier
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-2xl ${plan.highlighted ? 'bg-quantum-primary text-black' : 'bg-white/5 text-quantum-primary'}`}>
                <plan.icon size={24} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-white uppercase italic tracking-tight">{plan.name}</h3>
                <span className="text-[10px] font-mono text-[#454545] uppercase tracking-widest">Protocol Tier v4</span>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white italic tracking-tighter">{plan.price}</span>
                <span className="text-xs text-[#454545] font-mono uppercase tracking-widest">/ instance</span>
              </div>
              <p className="text-[#8E9299] text-sm mt-3 leading-relaxed">
                {plan.description}
              </p>
            </div>

            <div className="flex-1 space-y-4 mb-10">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-1 p-0.5 rounded-full ${plan.highlighted ? 'bg-quantum-primary/20 text-quantum-primary' : 'bg-white/5 text-[#454545]'}`}>
                    <Check size={10} />
                  </div>
                  <span className="text-[13px] text-[#8E9299] leading-tight font-medium">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSubscribe(plan)}
              disabled={loading === plan.id}
              className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-sm uppercase italic transition-all relative overflow-hidden group ${
                plan.highlighted 
                  ? 'bg-quantum-primary text-black hover:shadow-quantum' 
                  : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
              }`}
            >
              {loading === plan.id ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <>
                  <span>
                    {plan.id === 'free' ? 'Deploy Baseline' : plan.id === 'quantum' ? 'Contact Logistics' : 'Initialize Upgrade'}
                  </span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="bg-quantum-panel/20 border border-quantum-border rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-[#454545]">
            <Sparkles size={32} />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-xl font-bold text-white uppercase italic tracking-tight">Enterprise Customization</h4>
            <p className="text-[#8E9299] text-sm max-w-md">
              Need more than 10,000 handshakes per minute? Contact our quantum logistics team for air-gapped dedicated node pricing.
            </p>
          </div>
        </div>
        <button className="px-8 py-4 bg-white/5 text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-all uppercase italic text-sm tracking-tight">
          Request Quote [SECURE]
        </button>
      </div>
    </div>
  );
};

export default PricingPage;

const RefreshCw = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
  </svg>
);
