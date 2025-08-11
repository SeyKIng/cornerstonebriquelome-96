
import { Button } from "@/components/ui/button";
import Slideshow from "@/components/Slideshow";
import { Link } from "react-router-dom";
import { ExternalLink, ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import ExitIntentModal from "@/components/ExitIntentModal";

const Index = () => {
  const images = [
    "/lovable-uploads/6ef192e3-5877-4867-a4ba-f694a291ffeb.png",
    "/lovable-uploads/60e0420e-09f2-4dd1-8075-472f6ffd19a2.png",
    "/lovable-uploads/7bdda587-b33f-46ff-bb67-05121bc22fb8.png",
    "/lovable-uploads/f84d0352-9184-4976-a414-b54cef2434f7.png",
    "/lovable-uploads/bcc3b505-4545-49c1-a562-ccd8cae646f6.png"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Slideshow */}
      <Slideshow 
        images={images} 
        slogan="« Votre partenaire de confiance pour des briques de qualité »"
      />
      
      {/* About Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="title mb-6">CORNERSTONE BRIQUES</h2>
          <p className="subtitle mb-8">
            Spécialiste des briques de qualité au Togo
          </p>
          <p className="text-cornerstone-gray mb-8">
            CORNERSTONE BRIQUES est votre partenaire de confiance pour la fabrication et la fourniture de briques de haute qualité pour tous vos projets de construction. Notre engagement envers l'excellence et la satisfaction client nous distingue comme leader dans l'industrie de la construction au Togo.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
            <Link to="/galerie">
              <Button className="cta-button">Voir notre galerie</Button>
            </Link>
            <Link to="/contact">
              <Button className="cta-button">Contactez-nous</Button>
            </Link>
          </div>
          
          {/* Diaspora Button - Updated URL */}
          <a
            href="https://africa.cornerstonebrique.com/"
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button 
              variant="outline" 
              className="border-cornerstone-orange border-2 text-cornerstone-orange hover:bg-cornerstone-orange hover:text-white font-bold px-6 py-3 transition-all"
            >
              Cliquez ici pour visiter l'espace Diaspora
              <ExternalLink className="ml-2" size={16} />
            </Button>
          </a>
        </div>
      </section>
      
      {/* Products Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="title text-center mb-12 font-bold">Nos Produits</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Product Image 1 */}
            <div className="bg-white p-4 rounded-lg shadow-md overflow-hidden">
              <img 
                src="/lovable-uploads/350f469e-14ca-46ab-ae62-1c11d4502d27.png" 
                alt="Brique Cornerstone 1" 
                className="w-full h-64 object-cover object-center rounded transition hover:scale-105"
              />
            </div>
            
            {/* Product Image 2 */}
            <div className="bg-white p-4 rounded-lg shadow-md overflow-hidden">
              <img 
                src="/lovable-uploads/7bd83a38-6cb2-4bc7-b3dd-19f42976e1ed.png" 
                alt="Brique Cornerstone 2" 
                className="w-full h-64 object-cover object-center rounded transition hover:scale-105"
              />
            </div>
            
            {/* Product Image 3 */}
            <div className="bg-white p-4 rounded-lg shadow-md overflow-hidden">
              <img 
                src="/lovable-uploads/a545235e-5a56-467a-b956-855dfa08d787.png" 
                alt="Brique Cornerstone 3" 
                className="w-full h-64 object-cover object-center rounded transition hover:scale-105"
              />
            </div>
            
            {/* Product Image 4 */}
            <div className="bg-white p-4 rounded-lg shadow-md overflow-hidden">
              <img 
                src="/lovable-uploads/7c9d382a-aaf6-4267-a671-816664f22523.png" 
                alt="Brique Cornerstone 4" 
                className="w-full h-64 object-cover object-center rounded transition hover:scale-105"
              />
            </div>
          </div>
          
          {/* Commander Maintenant Button */}
          <div className="text-center">
            <Link to="/panier">
              <Button 
                className="bg-cornerstone-orange text-white font-bold text-lg py-6 px-10 rounded-md hover:bg-opacity-90 transition-all"
              >
                <ShoppingCart className="mr-2" size={20} />
                Commander maintenant
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-cornerstone-blue">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Prêt à démarrer votre projet de construction?
          </h2>
          <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
            Contactez-nous dès aujourd'hui pour obtenir un devis personnalisé et bénéficier de notre expertise.
          </p>
          <Link to="/contact">
            <Button className="bg-cornerstone-orange text-white font-bold py-3 px-8 rounded-md text-lg hover:bg-opacity-90 transition-all">
              Contactez-nous
            </Button>
          </Link>
        </div>
      </section>

      {/* Exit Intent Modal */}
      <ExitIntentModal />
    </div>
  );
};

export default Index;
