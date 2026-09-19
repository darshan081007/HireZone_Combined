import React, { useState, useEffect } from 'react';
import {
  Lock,
  Mail,
  User,
  GraduationCap,
  Calendar,
  Eye,
  EyeOff,
  ArrowRight,
  Database,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { api } from '../services/api';
import { AuthUser, StudentProfile } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser, profile: StudentProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('sarveswaran2510549@ssn.edu.in');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerCollege, setRegisterCollege] = useState('');
  const [registerDegree, setRegisterDegree] = useState('B.Tech Information Technology');
  const [registerGradYear, setRegisterGradYear] = useState('2026');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [dbMode, setDbMode] = useState<'checking' | 'live' | 'demo'>('checking');
  const [demoAccounts, setDemoAccounts] = useState<Array<{
    student_id: number;
    student_name: string;
    email: string;
    education: string;
    college: string;
  }>>([]);

  useEffect(() => {
    // Diagnose the backend before showing a misleading 'Live' label.
    api.getHealth()
      .then((health) => setDbMode(health?.dbStatus?.isConnected ? 'live' : 'demo'))
      .catch(() => setDbMode('demo'));

    // Load live demo accounts from Supabase
    api.getDemoAccounts()
      .then((res) => {
        if (res.accounts && res.accounts.length > 0) {
          setDemoAccounts(res.accounts);
        }
      })
      .catch((err) => console.warn('Could not fetch demo accounts:', err));
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessNotice(null);

    try {
      const res = await api.login(loginEmail.trim(), loginPassword);
      if (res.success && res.profile) {
        localStorage.setItem('hirezone_token', res.token);
        const authUser: AuthUser = {
          id: String(res.profile.id),
          studentId: Number(res.profile.id),
          name: res.profile.name,
          email: res.profile.email,
          role: 'student',
          college: res.profile.college,
          degree: res.profile.degree,
          graduationYear: res.profile.graduationYear,
          token: res.token,
        };
        localStorage.setItem('hirezone_user', JSON.stringify(authUser));
        setSuccessNotice('Logged in successfully! Redirecting...');
        setTimeout(() => {
          onLoginSuccess(authUser, res.profile);
        }, 400);
      } else {
        setErrorMessage('Invalid credentials. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName.trim() || !registerEmail.trim() || !registerPassword.trim()) {
      setErrorMessage('Name, email, and password are required.');
      return;
    }
    if (registerPassword.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessNotice(null);

    try {
      const res = await api.register({
        name: registerName.trim(),
        email: registerEmail.trim().toLowerCase(),
        password: registerPassword,
        college: registerCollege.trim() || 'SSN College of Engineering',
        degree: registerDegree.trim() || 'B.Tech Information Technology',
        graduationYear: registerGradYear || '2026',
      });

      if (res.success && res.profile) {
        localStorage.setItem('hirezone_token', res.token);
        const authUser: AuthUser = {
          id: String(res.profile.id),
          studentId: Number(res.profile.id),
          name: res.profile.name,
          email: res.profile.email,
          role: 'student',
          college: res.profile.college,
          degree: res.profile.degree,
          graduationYear: res.profile.graduationYear,
          token: res.token,
        };
        localStorage.setItem('hirezone_user', JSON.stringify(authUser));
        setSuccessNotice('Account created successfully in Supabase! Logging you in...');
        setTimeout(() => {
          onLoginSuccess(authUser, res.profile);
        }, 500);
      } else {
        setErrorMessage('Registration failed. Please try a different email.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. That email might already be registered.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (email: string) => {
    setLoginEmail(email);
    setLoginPassword('password123');
    setIsRegisterMode(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white font-bold text-2xl shadow-sm mb-4">
          HZ
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          HIREZONE Student Portal
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Live career development, verified milestones & recruiter network
        </p>

        {/* Live Supabase Indicator Pill */}
        <div className="mt-3 inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-semibold">{dbMode === 'live' ? 'Supabase PostgreSQL Live' : dbMode === 'demo' ? 'Demo mode · Supabase not connected' : 'Checking database connection…'}</span>
          <span className={`w-2 h-2 rounded-full ${dbMode === 'live' ? 'bg-emerald-500 animate-pulse' : dbMode === 'demo' ? 'bg-amber-500' : 'bg-slate-400 animate-pulse'}`} />
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xs border border-slate-200 sm:rounded-2xl sm:px-10">
          {/* Mode Switcher */}
          <div className="flex border-b border-slate-200 mb-6">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(false);
                setErrorMessage(null);
                setSuccessNotice(null);
              }}
              className={`flex-1 pb-3 text-sm font-semibold text-center border-b-2 cursor-pointer transition-colors ${
                !isRegisterMode
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(true);
                setErrorMessage(null);
                setSuccessNotice(null);
              }}
              className={`flex-1 pb-3 text-sm font-semibold text-center border-b-2 cursor-pointer transition-colors ${
                isRegisterMode
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback Notices */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successNotice && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {!isRegisterMode ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@college.edu"
                    className="block w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="block w-full pl-9 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span>Authenticating with Supabase...</span>
                ) : (
                  <>
                    <span>Sign In to Student Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick 1-Click Demo Accounts from Supabase */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold text-slate-600 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Live Supabase Demo Accounts</span>
                  </span>
                  <span className="text-[11px] text-slate-400">1-Click Sign In</span>
                </div>
                <div className="space-y-1.5">
                  {demoAccounts.map((acc) => (
                    <button
                      key={acc.student_id}
                      type="button"
                      onClick={() => handleQuickDemoLogin(acc.email)}
                      className="w-full text-left px-3 py-2 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors flex items-center justify-between text-xs cursor-pointer group"
                    >
                      <div>
                        <div className="font-semibold text-slate-800 group-hover:text-blue-600">
                          {acc.student_name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                          {acc.email} · {acc.education.split(' ')[0]}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-blue-600 bg-slate-100 group-hover:bg-blue-100 px-1.5 py-0.5 rounded">
                        ID: #{acc.student_id}
                      </span>
                    </button>
                  ))}
                  {/* Default Sarveswaran button */}
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('sarveswaran2510549@ssn.edu.in')}
                    className="w-full text-left px-3 py-2 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors flex items-center justify-between text-xs cursor-pointer group"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 group-hover:text-blue-600">
                        Sarveswaran (Your Account)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        sarveswaran2510549@ssn.edu.in · SSN College
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-blue-600 bg-slate-100 group-hover:bg-blue-100 px-1.5 py-0.5 rounded">
                      Live
                    </span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* CREATE ACCOUNT FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    placeholder="e.g. Sarveswaran"
                    className="block w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="sarveswaran2510549@ssn.edu.in"
                    className="block w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="block w-full pl-9 pr-10 py-2 bg-white border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  College / University
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Building className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={registerCollege}
                    onChange={(e) => setRegisterCollege(e.target.value)}
                    placeholder="e.g. SSN College of Engineering"
                    className="block w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Degree / Course
                  </label>
                  <input
                    type="text"
                    value={registerDegree}
                    onChange={(e) => setRegisterDegree(e.target.value)}
                    placeholder="B.Tech IT"
                    className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    value={registerGradYear}
                    onChange={(e) => setRegisterGradYear(e.target.value)}
                    placeholder="2026"
                    className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span>Registering with Supabase...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Create Live Supabase Account</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Security Guarantee */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center space-x-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Passwords securely hashed using PBKDF2 with salt</span>
          </div>
        </div>
      </div>
    </div>
  );
};
