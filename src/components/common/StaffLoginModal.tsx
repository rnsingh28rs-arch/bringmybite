import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { STAFF_CREDENTIALS } from '../../data/staffConfig';
import {
  ShieldAlert,
  Briefcase,
  ChefHat,
  Lock,
  Key,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const StaffLoginModal: React.FC = () => {
  const {
    isStaffLoginOpen,
    setIsStaffLoginOpen,
    targetStaffRole,
    setTargetStaffRole,
    loginStaff
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<'admin' | 'manager' | 'chef'>(targetStaffRole || 'admin');
  const [credentialInput, setCredentialInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (targetStaffRole) {
      setSelectedRole(targetStaffRole);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [targetStaffRole, isStaffLoginOpen]);

  if (!isStaffLoginOpen) return null;

  const currentRoleConfig = STAFF_CREDENTIALS[selectedRole];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentialInput.trim()) {
      setErrorMsg('Please enter your Staff Passcode or 4-Digit PIN.');
      return;
    }

    const ok = loginStaff(selectedRole, credentialInput);
    if (ok) {
      setSuccessMsg(`Welcome, ${currentRoleConfig.name}! Access Granted.`);
      setErrorMsg('');
      setTimeout(() => {
        setIsStaffLoginOpen(false);
        setCredentialInput('');
        setSuccessMsg('');
      }, 500);
    } else {
      setErrorMsg('Incorrect Passcode or PIN. Please check the credentials provided below.');
    }
  };

  const handleQuickFill = () => {
    setCredentialInput(currentRoleConfig.defaultPasscode);
    setErrorMsg('');
  };

  const handleQuickFillPin = () => {
    setCredentialInput(currentRoleConfig.pin);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] rounded-3xl w-full max-w-lg shadow-2xl border-2 border-[#124E33] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-[#0C3822] text-white p-5 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F2C94C] text-black flex items-center justify-center font-bold shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif-title text-[#F2C94C] tracking-wide">
                Staff Authentication Portal
              </h2>
              <p className="text-xs text-emerald-200">
                Restricted to Shree Foods Authorized Staff & Operators
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsStaffLoginOpen(false)}
            className="p-2 rounded-xl text-emerald-300 hover:text-white hover:bg-emerald-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="p-4 bg-emerald-950/20 border-b border-gray-200">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
            Select Your Operational Role:
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('admin');
                setTargetStaffRole('admin');
                setErrorMsg('');
                setCredentialInput('');
              }}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                selectedRole === 'admin'
                  ? 'bg-[#5C1111] text-white border-red-700 shadow-md ring-2 ring-red-400'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-300" />
              <span>1. Admin</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('manager');
                setTargetStaffRole('manager');
                setErrorMsg('');
                setCredentialInput('');
              }}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                selectedRole === 'manager'
                  ? 'bg-blue-900 text-white border-blue-700 shadow-md ring-2 ring-blue-400'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Briefcase className="w-4 h-4 text-blue-300" />
              <span>2. Manager</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('chef');
                setTargetStaffRole('chef');
                setErrorMsg('');
                setCredentialInput('');
              }}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                selectedRole === 'chef'
                  ? 'bg-amber-900 text-white border-amber-700 shadow-md ring-2 ring-amber-400'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <ChefHat className="w-4 h-4 text-amber-300" />
              <span>3. Chef Kitchen</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} className="p-5 space-y-4">
          
          {/* Active Role Meta Card */}
          <div className="p-3.5 bg-white rounded-2xl border border-gray-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900">{currentRoleConfig.title}</span>
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${currentRoleConfig.badgeColor}`}>
                {currentRoleConfig.role.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-gray-600">
              {currentRoleConfig.description}
            </p>
            <div className="text-[11px] text-gray-500 flex items-center gap-1">
              <span>Account Email:</span>
              <strong className="font-mono text-gray-800">{currentRoleConfig.email}</strong>
            </div>
          </div>

          {/* Passcode or PIN Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700">
              Enter Staff Passcode or 4-Digit PIN <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={`e.g. ${currentRoleConfig.defaultPasscode} or PIN: ${currentRoleConfig.pin}`}
                value={credentialInput}
                onChange={(e) => {
                  setCredentialInput(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full pl-10 pr-10 py-3 bg-white border border-gray-300 rounded-xl text-sm font-mono focus:border-[#124E33] focus:ring-1 focus:ring-[#124E33] outline-none"
                autoFocus
              />
              <Key className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error / Success Feedback */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick-Fill Credentials Helper Box for Admin/Owner */}
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Credentials for {currentRoleConfig.title}:</span>
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2 rounded-xl border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 block">Default Passcode:</span>
                  <span className="font-mono font-bold text-gray-800 text-xs">{currentRoleConfig.defaultPasscode}</span>
                </div>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-[11px] font-bold"
                >
                  Auto-Fill
                </button>
              </div>

              <div className="bg-white p-2 rounded-xl border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 block">Quick PIN:</span>
                  <span className="font-mono font-bold text-gray-800 text-xs">{currentRoleConfig.pin}</span>
                </div>
                <button
                  type="button"
                  onClick={handleQuickFillPin}
                  className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-[11px] font-bold"
                >
                  Fill PIN
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-[#124E33] hover:bg-[#0A2A1B] text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#F2C94C]" />
            <span>Unlock & Access {currentRoleConfig.title}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsStaffLoginOpen(false)}
              className="text-xs text-gray-500 hover:text-gray-800 font-medium underline"
            >
              Return to Customer Website
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
