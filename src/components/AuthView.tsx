import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Shield, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export const AuthView = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { authenticate, addNotification } = useStore();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate Auth Delay per UX-CONFIG.md
    setTimeout(() => {
      if (isLogin) {
        // Rule 8: Credential Failure
        if (email === 'admin@lingbot.io' && password === 'P@ssword1') {
          addNotification({ 
            type: 'success', 
            message: 'SESSION_ESTABLISHED: Authority granted to spatial index.' 
          });
          authenticate(true);
        } else {
          setError('ACCESS_DENIED: Credential mismatched or token expired.');
          addNotification({ 
            type: 'error', 
            message: 'AUTH_FAILURE: Access denied at local gateway.' 
          });
        }
      } else {
        // Rule 5: Duplicate Email
        if (email.includes('exists')) {
          setError('ACCOUNT_EXISTS: Please proceed to Login or recovery.');
          addNotification({ 
            type: 'warning', 
            message: 'IDENTITY_CONFLICT: Existing record found for this identifier.' 
          });
        } else {
          addNotification({ 
            type: 'success', 
            message: 'ACCOUNT_PROVISIONED: Verification dispatched to edge.' 
          });
          authenticate(true);
        }
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-[#dbdad7] flex items-center justify-center p-4 z-[100] font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-[#141414] text-white mb-4">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">LingBot-Map</h1>
          <p className="text-[10px] font-mono text-[#141414]/40 uppercase tracking-[0.2em] mt-1">Spatial Identity Provider v2.0</p>
        </div>

        <Card className="p-8 border-[#141414] shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
          <div className="flex gap-4 mb-8 border-b border-[#141414]/10 pb-4">
            <button 
              onClick={() => setIsLogin(true)}
              className={`text-xs font-bold uppercase tracking-widest pb-1 border-b-2 transition-all ${isLogin ? 'border-[#141414] opacity-100' : 'border-transparent opacity-30'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`text-xs font-bold uppercase tracking-widest pb-1 border-b-2 transition-all ${!isLogin ? 'border-[#141414] opacity-100' : 'border-transparent opacity-30'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <Input 
              label="Email Address" 
              placeholder="operator@lingbot.io" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <div className="space-y-1">
              {!isLogin && (
                <p className="text-[9px] font-mono text-[#141414]/40 uppercase mb-1">
                  Min 8 chars, 1 special, 1 number
                </p>
              )}
              <Input 
                label="Password" 
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-600 text-[10px] font-mono leading-relaxed"
              >
                {error.toUpperCase()}
              </motion.div>
            )}

            <Button 
              type="submit" 
              variant="technical" 
              className="w-full h-12 text-sm bg-[#141414] text-white" 
              disabled={loading}
            >
              {loading ? 'PROCESSING...' : isLogin ? 'ESTABLISH SESSION' : 'CREATE ACCOUNT'}
            </Button>
          </form>

          {isLogin && (
            <div className="mt-6 text-center">
              <button className="text-[10px] font-mono text-[#141414]/40 hover:text-[#141414] uppercase tracking-widest underline underline-offset-2">
                Forgot Access Token?
              </button>
            </div>
          )}
        </Card>

        <div className="mt-8 flex justify-center gap-6 grayscale opacity-20">
          <div className="flex items-center gap-2">
            <Lock size={12} />
            <span className="text-[10px] font-mono">SOC2</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock size={12} />
            <span className="text-[10px] font-mono">ENCRYPTED</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
