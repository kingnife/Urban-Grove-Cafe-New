import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  Unlock, 
  ShieldCheck, 
  AlertCircle, 
  X, 
  KeyRound, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ArrowRight,
  Delete
} from 'lucide-react';
import { api } from '../utils/api';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLockedOut && lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev <= 1) {
            setIsLockedOut(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLockedOut, lockoutTimer]);

  if (!isOpen) return null;

  const handleKeypadPress = (val: string) => {
    if (isLockedOut) return;
    if (pin.length < 10) {
      const newPin = pin + val;
      setPin(newPin);
      setError(null);
      if (newPin.length === 4) {
        verifyPasscode(newPin);
      }
    }
  };

  const handleBackspace = () => {
    if (isLockedOut) return;
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  const handleClear = () => {
    if (isLockedOut) return;
    setPin('');
    setError(null);
    inputRef.current?.focus();
  };

  const verifyPasscode = async (codeToVerify: string) => {
    if (isLockedOut) return;
    const cleanCode = codeToVerify.trim();
    if (!cleanCode) {
      setError('Please enter the management passcode.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const isValid = await api.verifyAdminPasscode(cleanCode);
      if (isValid) {
        setFailedAttempts(0);
        onSuccess();
      } else {
        handleFailedAttempt();
      }
    } catch {
      // Local fallback check for standard staff credentials
      const validCodes = ['8420', '1234', 'grove2026', 'admin'];
      if (validCodes.includes(cleanCode)) {
        setFailedAttempts(0);
        onSuccess();
      } else {
        handleFailedAttempt();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFailedAttempt = () => {
    const nextAttempts = failedAttempts + 1;
    setFailedAttempts(nextAttempts);
    setPin('');
    if (nextAttempts >= 5) {
      setIsLockedOut(true);
      setLockoutTimer(30);
      setError('Too many incorrect attempts. Portal locked for 30 seconds for security.');
    } else {
      setError(`Access denied. Invalid staff passcode (${5 - nextAttempts} attempts remaining).`);
    }
    inputRef.current?.focus();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyPasscode(pin);
  };

  const fillDemoPin = () => {
    setPin('8420');
    setError(null);
    verifyPasscode('8420');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      id="admin-auth-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-auth-title"
    >
      <div 
        className="relative w-full max-w-md bg-[#2A1E17] text-[#FDFBF7] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#D4A373]/20 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#C48B47]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#1E3A2F]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          id="admin-auth-close-btn"
          className="absolute top-5 right-5 p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close portal modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-2.5">
          <div className="w-14 h-14 rounded-2xl bg-[#C48B47]/15 border border-[#C48B47]/30 text-[#D4A373] flex items-center justify-center shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[#D4A373]">
            <ShieldCheck className="w-4 h-4" />
            <span>Staff & Manager Access</span>
          </div>
          <h2 id="admin-auth-title" className="font-serif text-2xl font-bold text-white tracking-tight">
            Protected Admin Portal
          </h2>
          <p className="text-xs text-white/70 font-light max-w-xs leading-relaxed">
            This operational dashboard is restricted to authorized Urban Grove staff and shift managers. Please enter your passcode to unlock.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="mt-6 space-y-5">
          {/* PIN Input field */}
          <div className="space-y-1.5">
            <div className="relative">
              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                value={pin}
                disabled={isLockedOut || isLoading}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(null);
                }}
                placeholder="Enter 4-digit PIN"
                className="w-full text-center tracking-[0.35em] text-xl font-bold py-3.5 px-10 bg-white/5 border border-white/15 focus:border-[#D4A373] focus:bg-white/10 rounded-2xl text-white placeholder:text-white/30 placeholder:tracking-normal placeholder:font-normal placeholder:text-sm focus:outline-none transition-all"
                id="admin-passcode-input"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-1"
                aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Visual PIN Dots for 4 digits */}
            <div className="flex justify-center gap-2 pt-1">
              {[0, 1, 2, 3].map((idx) => {
                const isFilled = pin.length > idx;
                return (
                  <div
                    key={idx}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                      isFilled 
                        ? 'bg-[#D4A373] scale-110 shadow-xs' 
                        : 'bg-white/20'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Keypad for Quick POS Entry */}
          <div className="grid grid-cols-3 gap-2 pt-1 max-w-[280px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                disabled={isLockedOut || isLoading}
                onClick={() => handleKeypadPress(num)}
                className="h-11 rounded-xl bg-white/5 hover:bg-white/15 active:scale-95 text-white font-semibold text-base border border-white/10 transition-all flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              disabled={isLockedOut || isLoading || !pin}
              onClick={handleClear}
              className="h-11 rounded-xl bg-white/5 hover:bg-white/15 active:scale-95 text-white/60 hover:text-white text-xs font-semibold border border-white/10 transition-all flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none"
            >
              Clear
            </button>
            <button
              type="button"
              disabled={isLockedOut || isLoading}
              onClick={() => handleKeypadPress('0')}
              className="h-11 rounded-xl bg-white/5 hover:bg-white/15 active:scale-95 text-white font-semibold text-base border border-white/10 transition-all flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none"
            >
              0
            </button>
            <button
              type="button"
              disabled={isLockedOut || isLoading || !pin}
              onClick={handleBackspace}
              className="h-11 rounded-xl bg-white/5 hover:bg-white/15 active:scale-95 text-white/60 hover:text-white border border-white/10 transition-all flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Backspace"
            >
              <Delete className="w-4 h-4" />
            </button>
          </div>

          {/* Error notice */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-xs text-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Lockout countdown */}
          {isLockedOut && (
            <div className="text-center text-xs text-amber-300 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
              Security lockout active: {lockoutTimer}s remaining
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={isLockedOut || isLoading || !pin}
              id="admin-auth-submit-btn"
              className="w-full py-3.5 bg-gradient-to-r from-[#C48B47] to-[#D4A373] hover:from-[#b37c3b] hover:to-[#c49363] text-[#2A1E17] font-semibold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#2A1E17] border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Unlock Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 text-xs text-white/60 hover:text-white transition-colors font-medium"
            >
              Return to Customer Café
            </button>
          </div>
        </form>

        {/* Manager demo credential helper & security info */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/50">
          <span className="flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>Staff PIN: <strong className="text-white font-mono">8420</strong></span>
          </span>
          <button
            type="button"
            onClick={fillDemoPin}
            className="text-[#D4A373] hover:underline font-medium hover:text-[#e4b584] transition-colors"
          >
            Use Staff Passcode
          </button>
        </div>
      </div>
    </div>
  );
};
