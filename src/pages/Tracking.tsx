
import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package, Truck, Check, FileText, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const trackingSteps = [
  { id: 1, name: "Commande reçue", icon: FileText },
  { id: 2, name: "En production", icon: Package },
  { id: 3, name: "Contrôle qualité", icon: Check },
  { id: 4, name: "En cours de livraison", icon: Truck },
  { id: 5, name: "Livraison effectuée", icon: Check },
];

interface TrackingInfoType {
  invoiceNumber: string;
  currentStep: number;
  estimatedDelivery?: string;
  lastUpdate?: string;
}

// Mock data for demonstration purposes
const mockTrackingData: Record<string, TrackingInfoType> = {
  "F2023001": {
    invoiceNumber: "F2023001",
    currentStep: 2,
    estimatedDelivery: "25/05/2025",
    lastUpdate: "18/05/2025"
  },
  "F2023002": {
    invoiceNumber: "F2023002",
    currentStep: 4,
    estimatedDelivery: "20/05/2025",
    lastUpdate: "19/05/2025"
  },
  "F2023003": {
    invoiceNumber: "F2023003",
    currentStep: 5,
    estimatedDelivery: "15/05/2025",
    lastUpdate: "15/05/2025"
  }
};

const Tracking = () => {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfoType | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = () => {
    setIsSearching(true);
    // Simulating API call delay
    setTimeout(() => {
      const info = mockTrackingData[invoiceNumber];
      if (info) {
        setTrackingInfo(info);
        toast({
          title: "Information trouvée",
          description: `Suivi pour la facture ${invoiceNumber}`,
        });
      } else {
        setTrackingInfo(null);
        toast({
          variant: "destructive",
          title: "Erreur de recherche",
          description: "Aucune information trouvée pour ce numéro de facture.",
        });
      }
      setIsSearching(false);
    }, 1000);
  };

  // Calculate progress percentage based on current step
  const calculateProgress = (currentStep: number) => {
    return (currentStep / trackingSteps.length) * 100;
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-cornerstone-blue text-center">Suivi en Temps Réel</h1>
      <p className="text-center mb-8 text-cornerstone-gray">
        Suivez l'état de votre commande en entrant votre numéro de facture ci-dessous
      </p>

      <div className="max-w-2xl mx-auto mb-12">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="text"
            placeholder="Entrez le numéro de facture (ex: F2023001)"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="flex-grow"
          />
          <Button 
            onClick={handleSearch} 
            disabled={!invoiceNumber || isSearching}
            className="bg-cornerstone-orange hover:bg-cornerstone-orange/80 text-white"
          >
            {isSearching ? "Recherche..." : "Rechercher"}
          </Button>
        </div>
        
        {/* Hint for testing */}
        <div className="mt-2 text-xs text-cornerstone-gray italic">
          Pour les tests, essayez les numéros: F2023001, F2023002, ou F2023003
        </div>
      </div>

      {trackingInfo && (
        <div className="mb-12">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Facture: {trackingInfo.invoiceNumber}</span>
                <span className="text-sm font-normal">
                  Mise à jour: {trackingInfo.lastUpdate}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Progress bar */}
              <div className="mb-6">
                <Progress value={calculateProgress(trackingInfo.currentStep)} className="h-2" />
                <div className="flex justify-between text-xs mt-1 text-cornerstone-gray">
                  <span>Commande reçue</span>
                  <span>Livraison effectuée</span>
                </div>
              </div>

              {/* Steps list */}
              <div className="space-y-4">
                {trackingSteps.map((step) => {
                  const isActive = step.id <= trackingInfo.currentStep;
                  const isCurrent = step.id === trackingInfo.currentStep;
                  
                  return (
                    <div 
                      key={step.id} 
                      className={`flex items-center p-3 rounded-md transition-colors ${
                        isCurrent 
                          ? "bg-cornerstone-orange/10 border border-cornerstone-orange" 
                          : isActive 
                            ? "bg-green-50" 
                            : "bg-gray-50"
                      }`}
                    >
                      <div className={`mr-4 p-2 rounded-full ${
                        isActive 
                          ? "bg-cornerstone-orange text-white" 
                          : "bg-gray-200 text-gray-500"
                      }`}>
                        <step.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className={`font-medium ${isActive ? "text-cornerstone-blue" : "text-gray-500"}`}>
                          {step.name}
                        </p>
                        {isCurrent && trackingInfo.estimatedDelivery && step.id < 5 && (
                          <p className="text-xs text-cornerstone-gray">
                            Livraison estimée le {trackingInfo.estimatedDelivery}
                          </p>
                        )}
                        {isActive && step.id === 5 && (
                          <p className="text-xs text-green-600">
                            Votre commande a été livrée le {trackingInfo.lastUpdate}
                          </p>
                        )}
                      </div>
                      {isActive && (
                        <div className="ml-auto">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Video placeholder */}
      <div className="bg-gray-100 rounded-lg p-8 text-center mt-10 mb-8">
        <Clock className="h-12 w-12 mx-auto mb-4 text-cornerstone-gray opacity-50" />
        <h2 className="text-2xl font-bold text-cornerstone-blue mb-2">Suivi vidéo en direct – À venir</h2>
        <p className="text-cornerstone-gray">
          Bientôt, vous pourrez suivre en direct la production de vos briques. Restez connecté !
        </p>
      </div>
    </div>
  );
};

export default Tracking;
