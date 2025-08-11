
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Tag, Info } from "lucide-react";
import { useCart, CartProduct } from '../contexts/CartContext';
import { Input } from './ui/input';
import { useToast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import ProductDetail from './ProductDetail';

export interface ProductProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type: string;
  size: string;
  isComingSoon?: boolean;
}

const PRODUCT_DETAILS: { [key: string]: { description: string, dimensions: string, weight: string, usage: string } } = {
  "creux-10": {
    description: "La brique creuse de 10 cm est légère, facile à manipuler et économique. Elle est principalement utilisée pour les cloisons intérieures non porteuses, les séparations légères et les aménagements intérieurs. Elle offre une isolation thermique correcte et réduit le poids total de la structure.",
    dimensions: "40 × 20 × 10 cm",
    weight: "~11 kg",
    usage: "Cloisons intérieures, séparations légères"
  },
  "creux-12": {
    description: "La brique creuse de 12 cm convient aux murs légers nécessitant une résistance légèrement supérieure à la brique de 10. Elle est souvent employée pour les murs internes et certaines petites structures, tout en restant économique et rapide à poser.",
    dimensions: "40 × 20 × 12 cm",
    weight: "~14 kg",
    usage: "Murs légers, cloisons, petits murs"
  },
  "creux-15": {
    description: "La brique creuse de 15 cm offre une meilleure isolation acoustique et thermique. Elle est idéale pour les murs extérieurs légers ou pour améliorer l'efficacité énergétique des bâtiments.",
    dimensions: "40 × 20 × 15 cm",
    weight: "~16 kg",
    usage: "Murs extérieurs légers, isolation améliorée"
  },
  "creux-20": {
    description: "La brique creuse de 20 cm est la plus épaisse de sa catégorie. Elle permet de bâtir des murs extérieurs solides, tout en gardant un bon rapport poids/performance. Elle réduit les charges sur les fondations et améliore l'isolation.",
    dimensions: "40 × 20 × 20 cm",
    weight: "~20 kg",
    usage: "Murs porteurs légers, façades extérieures"
  },
  "plein-10": {
    description: "Compacte et dense, la brique pleine de 10 cm est idéale pour des ouvrages nécessitant une forte résistance mécanique. Elle est souvent utilisée pour des bordures, des fondations légères ou des éléments décoratifs solides.",
    dimensions: "40 × 20 × 10 cm",
    weight: "~19 kg",
    usage: "Bordures, fondations légères, petits ouvrages"
  },
  "plein-12": {
    description: "La brique pleine de 12 cm offre plus de solidité pour les murs porteurs de petites constructions ou pour des applications où la robustesse est essentielle.",
    dimensions: "40 × 20 × 12 cm",
    weight: "~21 kg",
    usage: "Murs porteurs, renforts, structures robustes"
  },
  "plein-15": {
    description: "La brique pleine de 15 cm combine résistance et épaisseur pour assurer la durabilité des murs porteurs, des soubassements et des éléments soumis à des charges importantes.",
    dimensions: "40 × 20 × 15 cm",
    weight: "~25 kg",
    usage: "Murs porteurs, fondations, ouvrages résistants"
  },
  "plein-20": {
    description: "La brique pleine de 20 cm est la plus massive, idéale pour les gros œuvres, les murs porteurs épais et les structures nécessitant une résistance maximale.",
    dimensions: "40 × 20 × 20 cm",
    weight: "~34 kg",
    usage: "Gros œuvre, murs porteurs lourds, fondations massives"
  },
  "hourdis-12": {
    description: "L'hourdi de 12 cm est un élément préfabriqué en béton, utilisé pour le remplissage des planchers et la réduction du poids total de la dalle, tout en maintenant une bonne résistance. Il est compatible avec les poutrelles.",
    dimensions: "60 × 20 × 12 cm",
    weight: "~24 kg",
    usage: "Planchers légers, dalles sur poutrelles"
  },
  "hourdis-15": {
    description: "L'hourdi de 15 cm assure une meilleure isolation et une capacité de charge plus élevée pour les planchers et les dalles de grandes portées.",
    dimensions: "60 × 20 × 15 cm",
    weight: "~26 kg",
    usage: "Planchers renforcés, dalles à grande portée"
  }
};

const ProductCard = ({ id, name, description, price, image, type, size, isComingSoon = false }: ProductProps) => {
  const [quantity, setQuantity] = useState(0);
  const [showPrice, setShowPrice] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setQuantity(value >= 0 ? value : 0);
    setShowPrice(value > 0);
  };

  const handleAddToCart = () => {
    if (quantity <= 0) {
      toast({
        title: "Quantité invalide",
        description: "Veuillez entrer une quantité valide.",
        variant: "destructive"
      });
      return;
    }
    
    const product: CartProduct = {
      id,
      name,
      price,
      quantity,
      image,
      type,
      size
    };
    
    addToCart(product);
    
    toast({
      title: "Produit ajouté au panier",
      description: `${quantity} ${name} ajouté${quantity > 1 ? 's' : ''} au panier.`,
    });
    
    navigate('/panier');
  };

  const detailInfo = PRODUCT_DETAILS[id] || {
    description: description,
    dimensions: `40 × 20 × ${size}`,
    weight: "Non spécifié",
    usage: "Multiple utilisations"
  };
  
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <>
      <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg">
        <div className="relative">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {isComingSoon && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-cornerstone-orange text-white font-bold">
                <Tag className="mr-1 h-4 w-4" /> À venir
              </Badge>
            </div>
          )}
        </div>
        <CardHeader>
          <CardTitle className="text-cornerstone-blue text-xl">{name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-cornerstone-gray mb-4">{description}</p>
          <div className="space-y-4">
            <div>
              <label htmlFor={`quantity-${id}`} className="block text-sm font-medium text-cornerstone-gray mb-1">
                Quantité
              </label>
              <Input
                id={`quantity-${id}`}
                type="number"
                min="0"
                value={quantity}
                onChange={handleQuantityChange}
                placeholder="Entrez la quantité"
                disabled={isComingSoon}
                className="w-full"
              />
            </div>
            
            {showPrice && !isComingSoon && (
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-medium text-cornerstone-gray">Prix unitaire:</span>
                <span className="font-bold text-cornerstone-blue">{price} FCFA</span>
              </div>
            )}
            
            {showPrice && !isComingSoon && (
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-bold text-cornerstone-gray">Total:</span>
                <span className="font-bold text-cornerstone-orange">{price * quantity} FCFA</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button 
            onClick={toggleDetails}
            variant="outline"
            className="w-full border-cornerstone-blue text-cornerstone-blue hover:bg-cornerstone-blue hover:text-white"
          >
            <Info className="mr-2 h-4 w-4" />
            Voir les détails
          </Button>
        
          <Button 
            onClick={handleAddToCart}
            disabled={isComingSoon || quantity <= 0}
            className="w-full bg-cornerstone-orange hover:bg-cornerstone-orange/90"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isComingSoon ? "Bientôt disponible" : "Ajouter au panier"}
          </Button>
        </CardFooter>
      </Card>
      
      <ProductDetail
        id={id}
        name={name}
        description={detailInfo.description}
        dimensions={detailInfo.dimensions}
        weight={detailInfo.weight}
        usage={detailInfo.usage}
        image={image}
        isOpen={showDetails}
        onClose={toggleDetails}
      />
    </>
  );
};

export default ProductCard;
