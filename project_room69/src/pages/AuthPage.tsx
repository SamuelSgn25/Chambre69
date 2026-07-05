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
      let response: Response;
      try {
        response = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } catch {
        throw new Error('Impossible de joindre le serveur. Veuillez vérifier votre connexion internet ou réessayer plus tard.');
      }

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
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden px-4 font-sans pt-36 sm:pt-40 pb-20">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#C9A96E]/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gray-200 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-1000 relative z-10">
        <div className="relative group">
          {/* External Gold Border Glow */}
          <div className="absolute -inset-0.5 bg-[#C9A96E] rounded-[3rem] opacity-30 blur-sm group-hover:opacity-100 transition-opacity duration-700"></div>
          
          {/* Glassmorphic Card - Transparent Gray Style */}
          <div className="relative bg-gray-400/10 backdrop-blur-3xl border-[3px] border-[#C9A96E] p-10 md:p-16 rounded-[3rem] shadow-2xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4 tracking-tighter">
                {isLogin ? 'Ravi de vous revoir' : 'Rejoindre la Maison'}
              </h1>
              <div className="w-16 h-1 bg-[#C9A96E] mx-auto mb-6 rounded-full"></div>
              <p className="text-gray-500 text-sm italic tracking-wide">
                {isLogin ? 'Entrez vos identifiants pour accéder à votre univers.' : 'Créez votre compte pour une expérience personnalisée.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">
                    <UserIcon className="w-3 h-3 text-[#C9A96E]" /> Nom Complet
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/20 border border-gray-200 rounded-2xl px-6 py-5 text-sm focus:outline-none focus:border-[#C9A96E] transition-all placeholder-gray-400"
                    placeholder="Sarah Martin"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">
                  <Mail className="w-3 h-3 text-[#C9A96E]" /> Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/20 border border-gray-200 rounded-2xl px-6 py-5 text-sm focus:outline-none focus:border-[#C9A96E] transition-all placeholder-gray-400"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                    <Lock className="w-3 h-3 text-[#C9A96E]" /> Mot de passe
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/20 border border-gray-200 rounded-2xl px-6 py-5 text-sm focus:outline-none focus:border-[#C9A96E] transition-all placeholder-gray-400 pr-16"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C9A96E] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="flex justify-end px-1 mt-2">
                  <button type="button" className="text-[10px] font-bold text-[#C9A96E] hover:text-black transition-colors uppercase tracking-widest">
                    Modifier le mot de passe ?
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50/50 border border-red-100 rounded-xl p-4">
                  <p className="text-red-500 text-[10px] text-center font-bold uppercase tracking-widest">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white text-[11px] font-black uppercase tracking-[0.4em] py-6 rounded-2xl hover:bg-[#C9A96E] transition-all shadow-2xl disabled:opacity-50"
              >
                {loading ? 'Chargement...' : (isLogin ? 'Se Connecter' : 'S\'inscrire')}
              </button>
            </form>

            <div className="mt-12 text-center">
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-[#C9A96E] transition-all"
              >
                {isLogin ? "Nouveau ici ? S'inscrire" : "Déjà membre ? Se connecter"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate('home')}
            className="group flex items-center justify-center gap-2 text-gray-400 hover:text-black transition-colors mx-auto"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Retour à la Maison</span>
          </button>
        </div>
      </div>
    </div>
  );
};
