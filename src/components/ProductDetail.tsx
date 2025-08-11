
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export interface ProductDetailProps {
  id: string;
  name: string;
  description: string;
  dimensions: string;
  weight: string;
  usage: string;
  image: string;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetail = ({ 
  id,
  name, 
  description, 
  dimensions, 
  weight, 
  usage, 
  image, 
  isOpen, 
  onClose 
}: ProductDetailProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold text-cornerstone-blue">{name}</DialogTitle>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
              <X size={20} />
            </button>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="overflow-hidden rounded-lg">
            <img 
              src={image} 
              alt={name} 
              className="w-full h-auto object-cover"
            />
          </div>
          
          <div>
            <DialogDescription className="text-base text-cornerstone-gray mb-4">
              {description}
            </DialogDescription>
            
            <div className="space-y-4 mt-6">
              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg text-cornerstone-blue mb-4">Caractéristiques</h3>
                
                <div className="space-y-3">
                  <div>
                    <span className="font-medium block">Dimensions:</span>
                    <Badge variant="outline" className="mt-1 text-sm">{dimensions}</Badge>
                  </div>
                  
                  <div>
                    <span className="font-medium block">Poids approximatif:</span>
                    <Badge variant="outline" className="mt-1 text-sm">{weight}</Badge>
                  </div>
                  
                  <div>
                    <span className="font-medium block">Utilisation typique:</span>
                    <p className="text-sm text-cornerstone-gray mt-1">{usage}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetail;
