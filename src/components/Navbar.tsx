
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useIsMobile } from "../hooks/use-mobile";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { getTotalItems } = useCart();
  const isMobile = useIsMobile();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path ? 
      "text-cornerstone-orange font-bold" : 
      "text-cornerstone-blue hover:text-cornerstone-orange transition-colors";
  };
  
  const links = [
    { name: "Accueil", path: "/" },
    { name: "Nos Produits", path: "/services" },
    { name: "Galerie", path: "/galerie" },
    { name: "Avis", path: "/avis" },
    { name: "À propos", path: "/a-propos" },
    { name: "Contact", path: "/contact" },
    { name: "Suivi en temps réel", path: "/suivi" },
  ];

  return (
    <nav className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/0f03497a-90ea-4042-aa11-20e4635b1346.png" 
            alt="Cornerstone Briques Logo" 
            className={`${isMobile ? 'h-8' : 'h-10'} mr-2 transition-all`}
          />
          <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-cornerstone-blue transition-all`}>
            <span className="text-cornerstone-orange">CORNERSTONE</span> {!isMobile && 'BRIQUES'}
          </h1>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4 lg:space-x-6 overflow-x-auto pb-2 flex-nowrap">
          {links.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`font-bold whitespace-nowrap ${isActive(link.path)}`}
            >
              {link.name}
            </Link>
          ))}
        </div>
        
        {/* Cart, Account Icons and Order Now Button */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/panier">
            <Button 
              variant="orange" 
              className="font-bold whitespace-nowrap"
            >
              Commander Maintenant
            </Button>
          </Link>
          <Link to="/mon-compte" className="text-cornerstone-blue hover:text-cornerstone-orange transition-colors">
            <User size={24} />
          </Link>
          <Link to="/panier" className="text-cornerstone-blue hover:text-cornerstone-orange transition-colors relative">
            <ShoppingCart size={24} />
            {getTotalItems() > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-cornerstone-orange text-xs">
                {getTotalItems()}
              </Badge>
            )}
          </Link>
        </div>
        
        {/* Mobile Navigation Toggle */}
        <div className="flex md:hidden items-center space-x-2 sm:space-x-4">
          <Link to="/panier">
            <Button 
              variant="orange" 
              className="font-bold text-xs py-1 px-2 sm:text-sm sm:py-1 sm:px-3"
              size="sm"
            >
              Commander
            </Button>
          </Link>
          <Link to="/panier" className="text-cornerstone-blue hover:text-cornerstone-orange transition-colors relative">
            <ShoppingCart size={22} />
            {getTotalItems() > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-cornerstone-orange text-xs">
                {getTotalItems()}
              </Badge>
            )}
          </Link>
          <button 
            onClick={toggleMenu} 
            className="text-cornerstone-blue focus:outline-none"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg py-4 animate-fade-in fixed inset-x-0 top-16 z-40 max-h-[80vh] overflow-y-auto">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            {links.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`font-bold text-lg ${isActive(link.path)}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link 
              to="/mon-compte"
              className="font-bold text-lg text-cornerstone-blue hover:text-cornerstone-orange transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Mon Compte
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
