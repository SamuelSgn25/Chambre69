import { Instagram, Mail, MessageCircle, Facebook } from 'lucide-react';
import { RevealOnScroll } from './Animations';
import logoPreview from '../assets/LOGO-removebg-preview.png';

const TikTokIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.944 4.538a6.369 6.369 0 0 1-2.148-.43v4.4c.093.022.188.032.283.032 1.715 0 3.107 1.4 3.107 3.12 0 1.72-1.392 3.117-3.107 3.117-1.716 0-3.108-1.397-3.108-3.117 0-.242.03-.478.083-.7a4.295 4.295 0 0 1 1.33.28 2.325 2.325 0 0 0-1.382-2.19 2.33 2.33 0 0 0-1.077-.24c-1.29 0-2.342 1.048-2.342 2.34 0 1.292 1.052 2.34 2.342 2.34 1.221 0 2.236-.88 2.325-2.01a1.788 1.788 0 0 1-.582-.185c-.484-.2-.904-.537-1.217-.97a4.894 4.894 0 0 0-.547 2.53c0 2.7 2.18 4.89 4.876 4.89 2.696 0 4.876-2.19 4.876-4.89V4.538h-1.321Z" />
  </svg>
);

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer = ({ onNavigate }: FooterProps) => {
  return (
    <RevealOnScroll delay={0.2}>
      <footer className="bg-black text-white mt-16 md:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Partie gauche : Logo + réseaux sociaux sous le logo */}
            <div className="text-center md:text-left">
              <div className="inline-block breathe">
                <img
                  src={logoPreview}
                  alt="Chambre 69"
                  className="h-30 w-auto mx-auto md:mx-0"
                />
              </div>
              {/* Icônes réseaux sociaux */}
              <div className="flex justify-center md:justify-start space-x-4 mt-4 md:ml-4">
                <a
                  href="https://www.instagram.com/chambre_69?igsh=MXdwbzdiM2QwYWhocA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E4405F] hover:scale-110 transition-transform duration-200"
                  aria-label="Instagram"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="https://www.facebook.com/share/1JYeqd2NQm/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1877F2] hover:scale-110 transition-transform duration-200"
                  aria-label="Facebook"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="https://www.tiktok.com/@chambre__69?_r=1&_t=ZS-97mdadipuh2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white hover:scale-110 transition-transform duration-200"
                  aria-label="TikTok"
                >
                  <TikTokIcon />
                </a>
              </div>
            </div>

            {/* Partie centrale : Navigation - boutons arrondis */}
            <div className="text-center md:text-left flex flex-col justify-center">
              <h4 className="text-sm font-bold tracking-wide mb-4 text-[#C9A96E]">Navigation</h4>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <button
                  onClick={() => onNavigate('home')}
                  className="px-4 py-2 text-sm rounded-full border border-[#C9A96E] bg-transparent text-gray-300 hover:bg-[#C9A96E] hover:text-black transition-all duration-300 shadow-md hover:shadow-lg breathe"
                >
                  Accueil
                </button>
                <button
                  onClick={() => onNavigate('shop')}
                  className="px-4 py-2 text-sm rounded-full border border-[#C9A96E] bg-transparent text-gray-300 hover:bg-[#C9A96E] hover:text-black transition-all duration-300 shadow-md hover:shadow-lg breathe"
                >
                  Visite de la Boutique
                </button>
                <button
                  onClick={() => onNavigate('about')}
                  className="px-4 py-2 text-sm rounded-full border border-[#C9A96E] bg-transparent text-gray-300 hover:bg-[#C9A96E] hover:text-black transition-all duration-300 shadow-md hover:shadow-lg breathe"
                >
                  À propos
                </button>
                <button
                  onClick={() => onNavigate('contact')}
                  className="px-4 py-2 text-sm rounded-full border border-[#C9A96E] bg-transparent text-gray-300 hover:bg-[#C9A96E] hover:text-black transition-all duration-300 shadow-md hover:shadow-lg breathe"
                >
                  Contact
                </button>
              </div>
            </div>

            {/* Partie droite : Contact - boutons arrondis */}
            <div className="text-center md:text-left flex flex-col justify-center">
              <h4 className="text-sm font-bold tracking-wide mb-4 text-[#C9A96E]">Contact</h4>
              <div className="flex flex-col gap-3 items-center md:items-start">
                <a
                  href="https://wa.me/221787040505"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full border border-[#C9A96E] bg-transparent text-gray-300 hover:bg-[#C9A96E] hover:text-black transition-all duration-300 shadow-md hover:shadow-lg breathe"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>+221 78 704 05 05</span>
                </a>
                <a
                  href="mailto:contact@chambre69.com"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full border border-[#C9A96E] bg-transparent text-gray-300 hover:bg-[#C9A96E] hover:text-black transition-all duration-300 shadow-md hover:shadow-lg breathe"
                >
                  <Mail className="h-4 w-4" />
                  <span>contact@chambre69.com</span>
                </a>
                <a
                  href="https://maps.app.goo.gl/esHahAj9vbtdqTjV8?g_st=iw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full border border-[#C9A96E] bg-transparent text-gray-300 hover:bg-[#C9A96E] hover:text-black transition-all duration-300 shadow-md hover:shadow-lg breathe"
                >
                  📍 <span>Notre boutique</span>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-[#C9A96E]/30 text-center">
            <p className="text-gray-400 text-xs">
              &copy; {new Date().getFullYear()} Chambre 69. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </RevealOnScroll>
  );
};