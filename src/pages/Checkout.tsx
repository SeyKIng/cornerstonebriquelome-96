
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from '../contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Checkout = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<string>('tmoney');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [paymentPhone, setPaymentPhone] = useState('');
  const [transactionStatus, setTransactionStatus] = useState<string>('');
  const [currentTransaction, setCurrentTransaction] = useState<any>(null);
  const [errorDetails, setErrorDetails] = useState<string>('');
  
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  if (cart.length === 0) {
    navigate('/panier');
    return null;
  }

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!customerInfo.firstName.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Le prénom est requis",
        variant: "destructive"
      });
      return false;
    }
    if (!customerInfo.lastName.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Le nom est requis",
        variant: "destructive"
      });
      return false;
    }
    if (!customerInfo.email.trim() || !customerInfo.email.includes('@')) {
      toast({
        title: "Erreur de validation",
        description: "Un email valide est requis",
        variant: "destructive"
      });
      return false;
    }
    if (!customerInfo.phone.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Le numéro de téléphone est requis",
        variant: "destructive"
      });
      return false;
    }
    if (!customerInfo.address.trim()) {
      toast({
        title: "Erreur de validation",
        description: "L'adresse est requise",
        variant: "destructive"
      });
      return false;
    }
    if (!paymentPhone.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Le numéro de téléphone pour le paiement est requis",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    setErrorDetails('');
    
    try {
      const orderSummary = {
        items: cart,
        customer: customerInfo,
        total: getTotalPrice(),
        currency: 'XOF'
      };

      console.log('Submitting payment with data:', {
        amount: getTotalPrice(),
        phone_number: paymentPhone,
        payment_method: paymentMethod,
        order_summary: orderSummary,
        user_id: user?.id || null
      });

      const response = await supabase.functions.invoke('semoa-payment', {
        body: {
          action: 'initiate_payment',
          amount: getTotalPrice(),
          phone_number: paymentPhone,
          payment_method: paymentMethod,
          order_summary: orderSummary,
          user_id: user?.id || null
        }
      });

      console.log('Payment response:', response);

      if (response.error) {
        console.error('Payment error:', response.error);
        setErrorDetails(response.error.message || 'Erreur inconnue');
        throw new Error(response.error.message || 'Erreur lors de l\'initiation du paiement');
      }

      const result = response.data;
      
      if (result.success && result.transaction) {
        setCurrentTransaction(result.transaction);
        setTransactionStatus('processing');
        
        toast({
          title: "Paiement initié",
          description: "Veuillez confirmer le paiement sur votre téléphone. Vérification en cours...",
        });

        // Vérifier le statut toutes les 5 secondes
        const statusInterval = setInterval(async () => {
          try {
            const statusResponse = await supabase.functions.invoke('semoa-payment', {
              body: {
                action: 'check_status',
                transaction_id: result.transaction.id
              }
            });

            if (statusResponse.data?.transaction) {
              const updatedTransaction = statusResponse.data.transaction;
              setCurrentTransaction(updatedTransaction);
              
              if (updatedTransaction.status === 'completed' || updatedTransaction.status === 'success') {
                clearInterval(statusInterval);
                setTransactionStatus('success');
                clearCart();
                
                toast({
                  title: "Paiement réussi !",
                  description: "Votre commande a été confirmée. Merci pour votre achat !",
                });
                
                setTimeout(() => navigate('/'), 3000);
              } else if (updatedTransaction.status === 'failed' || updatedTransaction.status === 'cancelled') {
                clearInterval(statusInterval);
                setTransactionStatus('failed');
                
                toast({
                  title: "Paiement échoué",
                  description: "Le paiement n'a pas pu être traité. Veuillez réessayer.",
                  variant: "destructive"
                });
              }
            }
          } catch (error) {
            console.error('Erreur lors de la vérification du statut:', error);
          }
        }, 5000);

        // Arrêter la vérification après 5 minutes
        setTimeout(() => {
          clearInterval(statusInterval);
          if (transactionStatus === 'processing') {
            setTransactionStatus('timeout');
            toast({
              title: "Délai dépassé",
              description: "La vérification du paiement a pris trop de temps. Veuillez vérifier votre commande.",
              variant: "destructive"
            });
          }
        }, 300000);

      } else {
        throw new Error(result.error || 'Erreur lors de l\'initiation du paiement');
      }

    } catch (error: any) {
      console.error('Erreur de paiement:', error);
      setTransactionStatus('failed');
      toast({
        title: "Erreur de paiement",
        description: error.message || "Une erreur est survenue lors du traitement de votre paiement.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = () => {
    switch (transactionStatus) {
      case 'processing':
        return <Loader2 className="h-6 w-6 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'failed':
      case 'timeout':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (transactionStatus) {
      case 'processing':
        return "Traitement en cours... Veuillez confirmer le paiement sur votre téléphone.";
      case 'success':
        return "Paiement réussi ! Redirection en cours...";
      case 'failed':
        return "Le paiement a échoué. Veuillez réessayer.";
      case 'timeout':
        return "La vérification du paiement a pris trop de temps.";
      default:
        return "";
    }
  };

  if (transactionStatus) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="mb-6">
              {getStatusIcon()}
            </div>
            <h2 className="text-xl font-bold mb-4">État du paiement</h2>
            <p className="text-gray-600 mb-6">{getStatusMessage()}</p>
            {transactionStatus === 'success' && (
              <div className="bg-green-50 p-4 rounded-md mb-4">
                <p className="text-green-800 text-sm">
                  Numéro de transaction: {currentTransaction?.id?.substring(0, 8)}
                </p>
              </div>
            )}
            {(transactionStatus === 'failed' || transactionStatus === 'timeout') && (
              <>
                {errorDetails && (
                  <div className="bg-red-50 p-4 rounded-md mb-4">
                    <p className="text-red-800 text-sm">
                      Détails de l'erreur: {errorDetails}
                    </p>
                  </div>
                )}
                <Button 
                  onClick={() => {
                    setTransactionStatus('');
                    setCurrentTransaction(null);
                    setErrorDetails('');
                  }}
                  className="bg-cornerstone-orange hover:bg-cornerstone-orange/90"
                >
                  Réessayer
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <h1 className="title text-center mb-8">Paiement Semoa</h1>
        
        {!user && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6 max-w-4xl mx-auto">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="text-blue-800 font-medium">Achat sans compte</p>
                <p className="text-blue-700 text-sm">
                  Vous effectuez un achat en tant qu'invité. Vos informations seront utilisées uniquement pour cette commande.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations client */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-bold text-cornerstone-blue mb-4">Informations de contact</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input 
                      id="firstName" 
                      required 
                      placeholder="Votre prénom"
                      value={customerInfo.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input 
                      id="lastName" 
                      required 
                      placeholder="Votre nom"
                      value={customerInfo.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    placeholder="votre@email.com"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input 
                    id="phone" 
                    required 
                    placeholder="Ex: +228 XX XX XX XX"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="address">Adresse de livraison *</Label>
                  <Textarea 
                    id="address" 
                    required 
                    placeholder="Votre adresse complète"
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="notes">Instructions spéciales</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Instructions particulières pour la livraison"
                    value={customerInfo.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                  />
                </div>
              </div>
              
              {/* Paiement Semoa */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-bold text-cornerstone-blue mb-4">
                  <Smartphone className="inline-block mr-2" size={20} />
                  Paiement Mobile Money via Semoa
                </h2>
                
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-3 block">Sélectionnez votre opérateur :</Label>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={setPaymentMethod}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:border-cornerstone-orange">
                      <RadioGroupItem id="tmoney" value="tmoney" />
                      <Label htmlFor="tmoney" className="cursor-pointer flex-1">
                        <div className="flex items-center">
                          <div className="bg-red-100 p-2 rounded mr-3">
                            <Smartphone className="text-red-600" size={16} />
                          </div>
                          <div>
                            <p className="font-medium">T-Money</p>
                            <p className="text-xs text-gray-500">Paiement via T-Money Togo</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:border-cornerstone-orange">
                      <RadioGroupItem id="flooz" value="flooz" />
                      <Label htmlFor="flooz" className="cursor-pointer flex-1">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded mr-3">
                            <Smartphone className="text-blue-600" size={16} />
                          </div>
                          <div>
                            <p className="font-medium">Flooz</p>
                            <p className="text-xs text-gray-500">Paiement via Flooz Togo</p>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paymentPhone">Numéro de téléphone pour le paiement *</Label>
                  <Input 
                    id="paymentPhone" 
                    required 
                    placeholder="Ex: +228 XX XX XX XX"
                    value={paymentPhone}
                    onChange={(e) => setPaymentPhone(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Assurez-vous que ce numéro correspond à votre compte {paymentMethod === 'tmoney' ? 'T-Money' : 'Flooz'} et qu'il dispose de fonds suffisants.
                  </p>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-md">
                  <h3 className="font-medium text-blue-900 mb-2">Instructions de paiement :</h3>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Remplissez tous les champs obligatoires</li>
                    <li>2. Cliquez sur "Confirmer la commande"</li>
                    <li>3. Vous recevrez une notification sur votre téléphone</li>
                    <li>4. Suivez les instructions pour confirmer le paiement</li>
                    <li>5. Votre commande sera automatiquement validée</li>
                  </ol>
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={isProcessing}
                className="w-full bg-cornerstone-orange hover:bg-cornerstone-orange/90 text-white py-3"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Traitement en cours...
                  </>
                ) : (
                  <>Confirmer la commande ({getTotalPrice()} FCFA)</>
                )}
              </Button>
            </form>
          </div>
          
          {/* Résumé commande */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
              <h2 className="text-lg font-bold text-cornerstone-blue mb-4">Résumé de la commande</h2>
              
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between border-b pb-3">
                    <div>
                      <p className="font-medium text-cornerstone-blue">
                        {item.name} <span className="text-cornerstone-gray">x {item.quantity}</span>
                      </p>
                      <p className="text-xs text-cornerstone-gray">{item.type} - {item.size}</p>
                    </div>
                    <span className="font-medium">{item.price * item.quantity} FCFA</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
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
              
              <div className="bg-green-50 p-4 rounded-md">
                <div className="flex items-start">
                  <Smartphone size={16} className="text-green-600 mt-1 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-green-800 mb-1">Paiement sécurisé par Semoa</p>
                    <p className="text-xs text-green-700">
                      Votre paiement est protégé par la technologie de sécurisation Semoa Payments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
