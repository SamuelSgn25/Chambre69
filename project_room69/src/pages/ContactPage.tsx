import { MessageCircle, Instagram, Mail, Clock, MapPin, Facebook } from 'lucide-react';
import { FadeInOnLoad, RevealOnScroll } from '../components/Animations';
import tiktokIcon from '../assets/tiktok-icon.png';

export const ContactPage = () => {
  return (
    <FadeInOnLoad>
      <div className="min-h-screen bg-[#F9F5F6] pt-36 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Titre principal */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 breathe">
              Nous Contacter
            </h1>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="h-px bg-[#C9A96E] w-16"></div>
              <span className="text-[#C9A96E]">✦</span>
              <div className="h-px bg-[#C9A96E] w-16"></div>
            </div>
          </div>

          {/* Réseaux sociaux — 5 blocs */}
          <RevealOnScroll delay={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {/* WhatsApp */}
              <div className="group bg-black border-2 border-[#C9A96E] rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="w-20 h-20 mx-auto bg-[#25D366] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <MessageCircle className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-[#C9A96E] mb-3">WhatsApp</h3>
                <p className="text-gray-300 mb-4 text-sm">
                  Service rapide et personnalisé pour vos commandes
                </p>
                <a
                  href="https://wa.me/221787040505"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-2 border border-[#C9A96E] rounded-full text-[#C9A96E] text-sm hover:bg-[#C9A96E] hover:text-black transition-all duration-300"
                >
                  +221 78 704 05 05
                </a>
              </div>

              {/* Instagram */}
              <div className="group bg-black border-2 border-[#C9A96E] rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Instagram className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-[#C9A96E] mb-3">Instagram</h3>
                <p className="text-gray-300 mb-4 text-sm">
                  Suivez-nous pour découvrir nos nouveautés
                </p>
                <a
                  href="https://www.instagram.com/chambre_69?igsh=MXdwbzdiM2QwYWhocA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-2 border border-[#C9A96E] rounded-full text-[#C9A96E] text-sm hover:bg-[#C9A96E] hover:text-black transition-all duration-300"
                >
                  @chambre_69
                </a>
              </div>

              {/* Facebook */}
              <div className="group bg-black border-2 border-[#C9A96E] rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="w-20 h-20 mx-auto bg-[#1877F2] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Facebook className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-[#C9A96E] mb-3">Facebook</h3>
                <p className="text-gray-300 mb-4 text-sm">
                  Rejoignez notre communauté sur Facebook
                </p>
                <a
                  href="https://www.facebook.com/share/1JYeqd2NQm/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-2 border border-[#C9A96E] rounded-full text-[#C9A96E] text-sm hover:bg-[#C9A96E] hover:text-black transition-all duration-300"
                >
                  Chambre 69
                </a>
              </div>

              {/* TikTok */}
              <div className="group bg-black border-2 border-[#C9A96E] rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="w-20 h-20 mx-auto bg-gray-900 border border-white/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <img
                    src="https://img.icons8.com/?size=100&id=kM0cd7be1NC1&format=png&color=000000"
                    alt="TikTok"
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-[#C9A96E] mb-3">TikTok</h3>
                <p className="text-gray-300 mb-4 text-sm">
                  Retrouvez nos vidéos et inspirations
                </p>
                <a
                  href="https://www.tiktok.com/@chambre__69?_r=1&_t=ZS-97mdadipuh2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-2 border border-[#C9A96E] rounded-full text-[#C9A96E] text-sm hover:bg-[#C9A96E] hover:text-black transition-all duration-300"
                >
                  @chambre__69
                </a>
              </div>

              {/* Email */}
              <div className="group bg-black border-2 border-[#C9A96E] rounded-2xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="w-20 h-20 mx-auto bg-[#C9A96E] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Mail className="h-10 w-10 text-black" />
                </div>
                <h3 className="text-2xl font-semibold text-[#C9A96E] mb-3">Email</h3>
                <p className="text-gray-300 mb-4 text-sm">
                  Pour toute demande d'information
                </p>
                <a
                  href="mailto:contact@chambre69.com"
                  className="inline-block px-6 py-2 border border-[#C9A96E] rounded-full text-[#C9A96E] text-sm hover:bg-[#C9A96E] hover:text-black transition-all duration-300"
                >
                  contact@chambre69.com
                </a>
              </div>
            </div>
          </RevealOnScroll>

          {/* Section horaires et localisation */}
          <RevealOnScroll delay={0.15}>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Horaires */}
              <div className="bg-black border-2 border-[#C9A96E] rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="h-8 w-8 text-[#C9A96E]" />
                  <h2 className="text-2xl font-semibold text-[#C9A96E]">Horaires d'ouverture</h2>
                </div>
                <div className="space-y-3 text-gray-300">
                  <div className="flex justify-between border-b border-[#C9A96E]/30 pb-2">
                    <span>Lundi - Vendredi</span>
                    <span className="font-medium">9h00 - 19h00</span>
                  </div>
                  <div className="flex justify-between border-b border-[#C9A96E]/30 pb-2">
                    <span>Samedi</span>
                    <span className="font-medium">10h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimanche</span>
                    <span className="text-gray-500">Fermé</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-6 italic">
                  Nous répondons généralement dans les 24 heures
                </p>
              </div>

              {/* Localisation */}
              <div className="bg-black border-2 border-[#C9A96E] rounded-2xl p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="h-8 w-8 text-[#C9A96E]" />
                  <h2 className="text-2xl font-semibold text-[#C9A96E]">Notre boutique</h2>
                </div>
                <p className="text-gray-300 mb-4">
                  Dakar, Sénégal
                </p>
                <div className="rounded-lg overflow-hidden border border-[#C9A96E]/30 h-48 mb-4">
                  <iframe
                    src="https://maps.google.com/maps?q=CHAMBRE+69+-+POINT+E,+Angle+rue+PE23,+Bd+de+St+Louis,+Dakar+13000&z=15&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localisation Chambre 69"
                    className="grayscale hover:grayscale-0 transition-all duration-500"
                  ></iframe>
                </div>
                <a
                  href="https://maps.app.goo.gl/esHahAj9vbtdqTjV8?g_st=iw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#C9A96E] hover:underline"
                >
                  Ouvrir dans Google Maps →
                </a>
              </div>
            </div>
          </RevealOnScroll>

          {/* Message supplémentaire */}
          <RevealOnScroll delay={0.2}>
            <div className="mt-16 text-center">
              <p className="text-gray-500 text-sm">
                Une question ? Une demande particulière ? N'hésitez pas à nous contacter directement par WhatsApp ou par email.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </FadeInOnLoad>
  );
};