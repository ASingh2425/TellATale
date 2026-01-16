
import React, { useState } from 'react';
import { signup, login } from '../services/storageService';
import { User } from '../types';

interface AuthFormProps {
  onAuthSuccess: (user: User) => void;
  mode: 'Dark' | 'Light';
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess, mode }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isLogin) {
      const user = login(username, password);
      if (user) onAuthSuccess(user);
      else setError('Invalid credentials');
    } else {
      const user = signup(username, password);
      if (user) onAuthSuccess(user);
      else setError('Username already taken');
    }
  };

  const bgColor = mode === 'Dark' ? 'bg-slate-900/80 border-slate-700' : 'bg-white/90 border-slate-200';
  const textColor = mode === 'Dark' ? 'text-slate-100' : 'text-slate-900';

  return (
    <div className={`max-w-md mx-auto p-10 rounded-[2.5rem] border shadow-2xl backdrop-blur-xl transition-all duration-500 ${bgColor} ${textColor}`}>
      <h2 className="text-3xl font-serif font-bold text-center mb-2 bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
        {isLogin ? 'Welcome Back' : 'Join the Tale'}
      </h2>
      <p className="text-center text-sm opacity-50 mb-8">
        Your chronicles await your return.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Username</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full p-4 rounded-2xl border bg-transparent outline-none focus:border-amber-500 transition-colors ${mode === 'Dark' ? 'border-slate-700' : 'border-slate-200'}`}
          />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-4 rounded-2xl border bg-transparent outline-none focus:border-amber-500 transition-colors ${mode === 'Dark' ? 'border-slate-700' : 'border-slate-200'}`}
          />
        </div>

        {error && <p className="text-rose-500 text-xs text-center font-bold">{error}</p>}

        <button
          type="submit"
          className="w-full py-4 bg-amber-500 text-slate-950 font-black rounded-2xl shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          {isLogin ? 'Enter the World' : 'Begin Journey'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="text-xs opacity-50 hover:opacity-100 transition-opacity font-bold underline underline-offset-4"
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
