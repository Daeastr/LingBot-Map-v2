import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal = ({ isOpen, onClose, title, children, className }: ModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#E4E3E0] border border-[#141414] rounded-xl shadow-2xl z-[51] overflow-hidden flex flex-col font-sans",
              className
            )}
          >
            <div className="p-6 border-b border-[#141414] flex items-center justify-between bg-[#dbdad7]">
              <h2 className="text-sm font-bold uppercase tracking-widest">{title}</h2>
              <button onClick={onClose} className="hover:opacity-50 transition-opacity">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[80vh]">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export const AlertDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm" }: any) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-sm">
      <div className="space-y-4">
        <p className="text-sm text-[#141414]/70 leading-relaxed italic-serif">
          {message}
        </p>
        <div className="flex gap-3 pt-2">
          <Button variant="ghost" className="flex-1" onClick={onClose}>
            CANCEL
          </Button>
          <Button variant="technical" className="flex-1 bg-rose-600 border-rose-600 hover:bg-rose-700" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
