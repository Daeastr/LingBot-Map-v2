import React from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { AppNotification } from '../types';

export const NotificationStack = () => {
  const { notifications, removeNotification } = useStore();

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 items-end pointer-events-none">
      <AnimatePresence>
        {notifications.map((notif) => (
          <NotificationItem 
            key={notif.id} 
            notification={notif} 
            onClose={() => removeNotification(notif.id)} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const NotificationItem = ({ notification, onClose }: { notification: AppNotification, onClose: () => void }) => {
  React.useEffect(() => {
    if (notification.type === 'success') {
      const timer = setTimeout(onClose, 3000); // UX-CONFIG 7.2: Success auto-dismiss
      return () => clearTimeout(timer);
    }
  }, [notification.type, onClose]);

  const icons = {
    success: <CheckCircle size={16} className="text-emerald-500" />,
    warning: <AlertTriangle size={16} className="text-amber-500" />,
    error: <AlertCircle size={16} className="text-rose-500" />,
  };

  const borders = {
    success: "border-emerald-500/50",
    warning: "border-amber-500/50",
    error: "border-rose-500/50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.1 } }}
      layout
      className={cn(
        "pointer-events-auto w-80 bg-[#141414] text-white p-4 rounded-lg border-l-4 shadow-2xl flex items-start gap-3 relative overflow-hidden",
        borders[notification.type as keyof typeof borders]
      )}
    >
      <div className="mt-0.5">{icons[notification.type as keyof typeof icons]}</div>
      <div className="flex-1">
        <p className="text-[11px] font-mono uppercase tracking-widest text-white/40 mb-1">
          {notification.type}
        </p>
        <p className="text-xs font-medium leading-relaxed italic-serif">
          {notification.message}
        </p>
      </div>
      <button 
        onClick={onClose}
        className="text-white/20 hover:text-white transition-colors"
      >
        <X size={14} />
      </button>
      
      {notification.type === 'error' && (
        <motion.div 
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-x-0 bottom-0 h-1 bg-rose-500/20"
        />
      )}
    </motion.div>
  );
};
