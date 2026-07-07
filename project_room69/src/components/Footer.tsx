import { Instagram, Mail, MessageCircle, Facebook } from 'lucide-react';
import { RevealOnScroll } from './Animations';
import logoPreview from '../assets/LOGO-removebg-preview.png';
import tiktokIcon from '../assets/tiktok-icon.png';

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
                  <img
                    src={tiktokIcon}
                    alt="TikTok"
                    className="w-6 h-6 object-contain"
                  />
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