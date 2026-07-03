import { FadeInOnLoad, RevealOnScroll } from '../components/Animations';
import { Heart, Feather, Shield, Sparkles, Users, Target } from 'lucide-react';

export const AboutPage = () => {
  return (
    <FadeInOnLoad>
      <div className="min-h-screen bg-[#F9F5F6]">
        {/* Hero Section avec image de fond */}
        {/* Hero Section - image à gauche, bloc noir à droite */}
<section className="relative min-h-[60vh] md:min-h-[70vh] flex items-stretch p-6 md:p-8">
  {/* Image à gauche - avec bordure et ombre */}
  <div className="w-1/2 hidden md:block rounded-2xl shadow-2xl overflow-hidden border-2 border-[#C9A96E]">
    <img
      src="https://chambre69.sn/wp-content/uploads/2024/12/IMG-20241204-WA0053-682x1024.jpg"
      alt="Chambre 69"
      className="w-full h-full object-cover"
    />
  </div>

  {/* Bloc noir à droite - bordure dorée, ombre, texte doré */}
  <div className="w-full md:w-1/2 bg-black border-2 border-[#C9A96E] rounded-2xl shadow-2xl flex items-center justify-center p-8 mx-0 md:ml-6">
    <div className="text-center max-w-lg mx-auto">
      <h1 className="text-5xl md:text-7xl font-bold tracking-wide mb-4 text-[#C9A96E]">
        Chambre <span className="font-normal">69</span>
      </h1>
      <p className="text-xl md:text-2xl font-light text-[#C9A96E]/80">
        L’art de sublimer la femme, en toute intimité
      </p>
    </div>
  </div>
</section>

        {/* Section : Signification du nom */}
        <RevealOnScroll delay={0.1}>
          <section className="py-20 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="flex-1 h-px bg-gray-300"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Une histoire, un symbole</h2>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-semibold text-[#C9A96E] mb-4">La Chambre</h3>
                  <p className="text-gray-700 leading-relaxed">
                    La chambre est le lieu où l’on se retrouve avec soi-même. Un espace de confort, de lâcher-prise et de reconnexion personnelle. Elle symbolise parfaitement l’expérience proposée par la boutique : un moment pour soi, en toute confiance, dans un cadre rassurant et discret.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-[#C9A96E] mb-4">Le 69</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Au-delà des interprétations, le chiffre 69 évoque l’équilibre, la complémentarité et l’harmonie entre deux énergies. Il représente la relation entre le corps et l’esprit, le regard sur soi et la perception extérieure, le confort et l’esthétique.
                  </p>
                </div>
              </div>
              <div className="mt-8 p-6 bg-[#F9F5F6] rounded-xl text-center">
                <p className="text-gray-800 italic">
                  « Chambre 69, un espace intime, élégant et équilibré, où chaque femme se reconnecte à elle-même. »
                </p>
              </div>
            </div>
          </section>
        </RevealOnScroll>

        {/* Section : L'entreprise et la fondatrice */}
        <RevealOnScroll delay={0.15}>
          <section className="py-20 px-4 bg-black text-white">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#C9A96E]">L'entreprise</h2>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    Chambre 69 est une boutique spécialisée dans la lingerie haut de gamme, située à Dakar, qui propose une sélection exclusive de marques européennes de référence, avec une large disponibilité de tailles adaptée à toutes les morphologies.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    C'est un espace d’écoute, de conseil et de valorisation de la femme, où chaque cliente vit une expérience personnalisée, intime et profondément valorisante. Ici, chaque détail compte, chaque besoin est compris, chaque femme est considérée.
                  </p>
                </div>
                <div className="relative">
                  <img
                    src="Chambre69\project_room69\src\assets\img_btq.jpeg"
                    alt="Boutique Chambre 69"
                    className="rounded-2xl shadow-2xl w-full object-cover"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-[#C9A96E] text-black px-4 py-2 rounded-full text-sm font-semibold">
                    Dakar, Sénégal
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12 mt-20 items-center">
                <div className="order-2 md:order-1">
                  <img
                    src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Fondatrice"
                    className="rounded-2xl shadow-2xl w-full object-cover"
                  />
                </div>
                <div className="order-1 md:order-2">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#C9A96E]">La fondatrice</h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Derrière Chambre 69 se trouve une entrepreneure passionnée, une femme engagée, intuitive et profondément tournée vers les autres. Une personnalité élégante, attentive et inspirante, guidée par le sens du détail et l’amour du bien-être féminin.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    « Chaque femme mérite de se sentir belle, à l’aise et pleinement elle-même. » Elle propose une expérience, une émotion, une reconnexion à soi.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </RevealOnScroll>

        {/* Section : Vision et valeurs */}
        <RevealOnScroll delay={0.1}>
          <section className="py-20 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="flex-1 h-px bg-gray-300"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Notre vision</h2>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6 border border-[#C9A96E]/20 rounded-xl hover:shadow-lg transition-shadow">
                  <Sparkles className="h-12 w-12 text-[#C9A96E] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Rayonnante</h3>
                  <p className="text-gray-600">Révéler la beauté naturelle de chaque femme</p>
                </div>
                <div className="text-center p-6 border border-[#C9A96E]/20 rounded-xl hover:shadow-lg transition-shadow">
                  <Heart className="h-12 w-12 text-[#C9A96E] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Confiante</h3>
                  <p className="text-gray-600">Apporter du confort et de l’assurance au quotidien</p>
                </div>
                <div className="text-center p-6 border border-[#C9A96E]/20 rounded-xl hover:shadow-lg transition-shadow">
                  <Feather className="h-12 w-12 text-[#C9A96E] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Épanouie</h3>
                  <p className="text-gray-600">Sublimer chaque silhouette avec élégance et finesse</p>
                </div>
              </div>
            </div>
          </section>
        </RevealOnScroll>

        {/* Section : Nos clients (femmes et hommes) */}
        <RevealOnScroll delay={0.15}>
          <section className="py-20 px-4 bg-black text-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#C9A96E]">Nos clients</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                  <h3 className="text-2xl font-semibold mb-4 text-[#C9A96E]">Les femmes</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Au cœur de notre démarche, les femmes recherchent bien plus qu’un produit : une sensation, une assurance, une harmonie avec elles-mêmes.
                  </p>
                  <ul className="space-y-2 text-gray-400">
                    <li>✓ Le confort sans compromis</li>
                    <li>✓ L’élégance au quotidien</li>
                    <li>✓ Des pièces qui valorisent leur corps</li>
                    <li>✓ Une expérience d’achat respectueuse et personnalisée</li>
                  </ul>
                </div>
                <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                  <h3 className="text-2xl font-semibold mb-4 text-[#C9A96E]">Les hommes</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    Les hommes trouvent chez Chambre 69 un espace unique pour exprimer leur attention et leur volonté de faire plaisir.
                  </p>
                  <ul className="space-y-2 text-gray-400">
                    <li>✓ Écoute attentive</li>
                    <li>✓ Diagnostic personnalisé</li>
                    <li>✓ Accompagnement vers un choix juste</li>
                    <li>✓ Un achat transformé en moment mémorable</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </RevealOnScroll>

        {/* Section : Pourquoi des marques européennes */}
        <RevealOnScroll delay={0.1}>
          <section className="py-20 px-4 bg-white">
            <div className="max-w-4xl mx-auto text-center">
              <Shield className="h-16 w-16 text-[#C9A96E] mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-light mb-6 text-gray-900">Pourquoi des marques européennes ?</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Chambre 69 sélectionne des marques européennes pour leur niveau d’exigence, leur qualité irréprochable et leur maîtrise du détail, au service du confort et de la beauté féminine.
              </p>
              <div className="grid md:grid-cols-2 gap-6 text-left mt-8">
                <div className="bg-[#F9F5F6] p-6 rounded-xl">
                  <h3 className="font-semibold text-[#C9A96E] mb-2">Expertise technique avancée</h3>
                  <p className="text-gray-600 text-sm">Des innovations textiles et un héritage reconnu</p>
                </div>
                <div className="bg-[#F9F5F6] p-6 rounded-xl">
                  <h3 className="font-semibold text-[#C9A96E] mb-2">Diversité des tailles</h3>
                  <p className="text-gray-600 text-sm">Adaptée à toutes les morphologies</p>
                </div>
                <div className="bg-[#F9F5F6] p-6 rounded-xl">
                  <h3 className="font-semibold text-[#C9A96E] mb-2">Qualité durable</h3>
                  <p className="text-gray-600 text-sm">Des produits qui durent et respectent le corps</p>
                </div>
                <div className="bg-[#F9F5F6] p-6 rounded-xl">
                  <h3 className="font-semibold text-[#C9A96E] mb-2">Expérience enrichie</h3>
                  <p className="text-gray-600 text-sm">Un pont entre les standards mondiaux et les attentes locales</p>
                </div>
              </div>
            </div>
          </section>
        </RevealOnScroll>

        {/* Section : L'expérience Chambre 69 */}
        <RevealOnScroll delay={0.15}>
          <section className="py-20 px-4 bg-black text-white">
            <div className="max-w-4xl mx-auto text-center">
              <Target className="h-16 w-16 text-[#C9A96E] mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#C9A96E]">L’expérience Chambre 69</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <ul className="space-y-3 text-gray-300">
                  <li>✓ Se sentir écoutée</li>
                  <li>✓ Être comprise</li>
                  <li>✓ Trouver des pièces adaptées à son corps réel</li>
                  <li>✓ Se redécouvrir avec confiance</li>
                </ul>
                <ul className="space-y-3 text-gray-300">
                  <li>✓ Confort absolu</li>
                  <li>✓ Maintien parfait</li>
                  <li>✓ Esthétique valorisante</li>
                  <li>✓ Qualité durable</li>
                  <li>✓ Discrétion et intimité</li>
                </ul>
              </div>
            </div>
          </section>
        </RevealOnScroll>

        {/* Section : Conclusion */}
        <RevealOnScroll delay={0.2}>
          <section className="py-20 px-4 bg-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-light mb-6 text-gray-900">Bien plus que de la lingerie</h2>
              <p className="text-gray-700 leading-relaxed mb-8">
                Chambre 69, c’est une promesse : redonner aux femmes le pouvoir de se sentir belles, fortes et sereines. Offrir des moments d’émotion, de découverte et de plaisir. Transformer chaque visite en une expérience unique.
              </p>
              <div className="bg-black border-2 border-[#C9A96E] rounded-2xl p-8 md:p-12 shadow-xl">
        <p className="text-[#C9A96E] text-lg md:text-xl font-medium italic leading-relaxed">
          Faire en sorte que chaque femme qui entre chez nous se révèle, s’affirme et reparte avec une énergie nouvelle.
        </p>
      </div>
            </div>
          </section>
        </RevealOnScroll>
      </div>
    </FadeInOnLoad>
  );
};