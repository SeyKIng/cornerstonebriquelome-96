
import { Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-cornerstone-blue text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          
          {/* Company Info */}
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-4">CORNERSTONE BRIQUES</h3>
            <p className="mb-2">
              « Votre partenaire de confiance pour des briques de qualité »
            </p>
            <div className="flex items-center mt-4">
              <Phone className="mr-2" size={18} />
              <a href="tel:+22871014747" className="font-bold hover:text-cornerstone-orange transition-colors">+228 71014747</a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-4">Liens Rapides</h3>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2">
              <li><Link to="/" className="hover:text-cornerstone-orange transition-colors">Accueil</Link></li>
              <li><Link to="/services" className="hover:text-cornerstone-orange transition-colors">Nos Services</Link></li>
              <li><Link to="/galerie" className="hover:text-cornerstone-orange transition-colors">Galerie</Link></li>
              <li><Link to="/avis" className="hover:text-cornerstone-orange transition-colors">Avis</Link></li>
              <li><Link to="/a-propos" className="hover:text-cornerstone-orange transition-colors">À propos</Link></li>
              <li><Link to="/contact" className="hover:text-cornerstone-orange transition-colors">Contact</Link></li>
              <li><Link to="/mon-compte" className="hover:text-cornerstone-orange transition-colors">Mon Compte</Link></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contactez-nous</h3>
            <p className="mb-2">
              <a href="tel:+22871014747" className="hover:text-cornerstone-orange transition-colors">+228 71014747</a>
            </p>
            <p className="mb-2">
              <a href="tel:+22890964993" className="hover:text-cornerstone-orange transition-colors">+228 90 96 49 93</a> / 
              <a href="tel:+22899870195" className="hover:text-cornerstone-orange transition-colors ml-1">99 87 01 95</a>
            </p>
            <p>Lomé, Togo</p>
          </div>
        </div>
        
        <div className="border-t border-white border-opacity-20 mt-8 pt-4 text-center">
          <p>&copy; {new Date().getFullYear()} CORNERSTONE BRIQUES. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
