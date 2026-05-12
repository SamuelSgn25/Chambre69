import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User as UserIcon, ArrowLeft } from 'lucide-react';
import { API_URL } from '../config';

interface AuthPageProps {
  onAuthSuccess: (user: any, token: string) => void;
  onNavigate: (page: string) => void;
}

export const AuthPage = ({ onAuthSuccess, onNavigate }: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { email, password } : { email, password, name };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      onAuthSuccess(data.user, data.token);
      onNavigate('shop');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD] relative overflow-hidden px-4 font-sans">
      {/* Premium Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#C9A96E]/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#C9A96E]/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Back Button */}
        <button 
          onClick={() => onNavigate('home')}
          className="group flex items-center gap-2 text-gray-400 hover:text-[#C9A96E] transition-all mb-8 ml-4"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Retour à l'accueil</span>
        </button>

        {/* Premium Glassmorphic Card */}
        <div className="relative group">
          {/* External Gold Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#C9A96E]/20 via-[#C9A96E]/40 to-[#C9A96E]/20 rounded-[3rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
          
          <div className="relative bg-white/60 backdrop-blur-3xl border-2 border-[#C9A96E]/30 p-10 md:p-14 rounded-[3rem] shadow-2xl overflow-hidden">
            {/* Top Shine */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>
            
            <div className="text-center mb-12 relative">
              <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4 tracking-tight">
                {isLogin ? 'Ravi de vous revoir' : 'Rejoindre la Maison'}
              </h1>
              <div className="w-12 h-0.5 bg-[#C9A96E] mx-auto mb-4"></div>
              <p className="text-gray-400 text-xs italic tracking-wide">
                {isLogin ? 'Entrez vos identifiants pour accéder à votre univers.' : 'Créez votre compte pour une expérience personnalisée.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 relative">
              {!isLogin && (
                <div className="space-y-2 group/field">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 group-focus-within/field:text-[#C9A96E] transition-colors">
                    <UserIcon className="w-3 h-3" /> Nom Complet
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/40 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[#C9A96E] focus:ring-4 focus:ring-[#C9A96E]/5 transition-all placeholder-gray-300 shadow-inner"
                    placeholder="Sarah Martin"
                    required
                  />
                </div>
              )}

              <div className="space-y-2 group/field">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 group-focus-within/field:text-[#C9A96E] transition-colors">
                  <Mail className="w-3 h-3" /> Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/40 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[#C9A96E] focus:ring-4 focus:ring-[#C9A96E]/5 transition-all placeholder-gray-300 shadow-inner"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div className="space-y-2 group/field">
                <div className="flex justify-between items-center px-1">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 group-focus-within/field:text-[#C9A96E] transition-colors">
                    <Lock className="w-3 h-3" /> Mot de passe
                  </label>
                  {isLogin && (
                    <button type="button" className="text-[9px] font-bold text-[#C9A96E] hover:text-black transition-colors uppercase tracking-widest">
                      Oublié ?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/40 border border-gray-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[#C9A96E] focus:ring-4 focus:ring-[#C9A96E]/5 transition-all placeholder-gray-300 shadow-inner pr-14"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#C9A96E] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 animate-shake">
                  <p className="text-red-500 text-[10px] text-center font-bold uppercase tracking-widest">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full relative group/btn overflow-hidden rounded-2xl bg-black text-white text-[10px] font-bold uppercase tracking-[0.4em] py-5 transition-all hover:bg-gray-900 active:scale-95 disabled:opacity-50 shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                {loading ? 'Traitement en cours...' : (isLogin ? 'Se Connecter' : 'Créer mon compte')}
              </button>
            </form>

            <div className="mt-12 text-center relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px bg-gray-100 flex-1"></div>
                <span className="text-[9px] text-gray-300 font-bold uppercase tracking-[0.2em]">ou</span>
                <div className="h-px bg-gray-100 flex-1"></div>
              </div>
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-[#C9A96E] transition-all hover:tracking-[0.4em]"
              >
                {isLogin ? "Nouveau ici ? S'inscrire gratuitement" : "Déjà membre ? Se connecter à l'espace"}
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer info */}
        <p className="mt-12 text-center text-[10px] text-gray-300 font-medium uppercase tracking-[0.2em]">
          &copy; 2026 Maison Chambre 69 • Tous droits réservés
        </p>
      </div>
    </div>
  );
};
