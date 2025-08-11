
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Panier vide",
        description: "Votre panier est vide. Ajoutez des produits avant de procéder au paiement.",
        variant: "destructive"
      });
      return;
    }
    
    navigate('/paiement');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <h1 className="title text-center mb-8">Mon Panier</h1>
          
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <ShoppingCart size={64} className="mx-auto text-cornerstone-gray mb-4" />
              <h2 className="text-2xl font-bold text-cornerstone-blue mb-4">Votre panier est vide</h2>
              <p className="text-cornerstone-gray mb-6">
                Vous n'avez aucun article dans votre panier. Découvrez notre gamme de produits et commencez à ajouter des articles.
              </p>
              <Link to="/services">
                <Button className="bg-cornerstone-orange hover:bg-cornerstone-orange/90">
                  Découvrir nos produits
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <h1 className="title text-center mb-8">Mon Panier</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-cornerstone-gray uppercase tracking-wider">
                        Produit
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-cornerstone-gray uppercase tracking-wider">
                        Prix
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-cornerstone-gray uppercase tracking-wider">
                        Quantité
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-cornerstone-gray uppercase tracking-wider">
                        Total
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-cornerstone-gray uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cart.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-cornerstone-blue">{item.name}</div>
                              <div className="text-xs text-cornerstone-gray">{item.type} - {item.size}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-cornerstone-gray">
                          {item.price} FCFA
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="mx-2 h-8 w-16 text-center"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-cornerstone-gray">
                          {item.price * item.quantity} FCFA
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between mt-6 gap-4">
              <Link to="/services">
                <Button variant="outline" className="border-cornerstone-blue text-cornerstone-blue w-full sm:w-auto">
                  Continuer les achats
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                onClick={() => {
                  clearCart();
                  toast({
                    title: "Panier vidé",
                    description: "Tous les articles ont été retirés du panier."
                  });
                }}
                className="text-red-500 hover:text-red-700 w-full sm:w-auto"
              >
                Vider le panier
              </Button>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-bold text-cornerstone-blue mb-4">Résumé de la commande</h2>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-cornerstone-gray">Sous-total:</span>
                  <span className="font-medium">{getTotalPrice()} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cornerstone-gray">Livraison:</span>
                  <span className="text-cornerstone-gray">À définir</span>
                </div>
              </div>
              
              <div className="flex justify-between font-bold border-t pt-2 mb-6">
                <span>Total TTC:</span>
                <span className="text-cornerstone-orange">{getTotalPrice()} FCFA</span>
              </div>
              
              <Button 
                className="w-full bg-cornerstone-orange hover:bg-cornerstone-orange/90 text-white"
                onClick={handleProceedToCheckout}
              >
                Payer avec Semoa <ArrowRight size={16} className="ml-2" />
              </Button>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-xs text-blue-800 text-center">
                  Paiement sécurisé via Mobile Money (T-Money, Flooz)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
