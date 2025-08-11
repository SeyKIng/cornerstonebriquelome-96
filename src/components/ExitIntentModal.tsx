
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';

const ExitIntentModal = () => {
  const [open, setOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Only show once and only if the mouse exits from the top of the viewport
      if (!hasShown && e.clientY <= 0) {
        setOpen(true);
        setHasShown(true);
      }
    };

    // Small delay to prevent instant triggering
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 2000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShown]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Form submission logic would go here
    setOpen(false);
    
    toast({
      title: "Merci pour votre demande!",
      description: "Nous vous contacterons dès que possible avec votre devis gratuit.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-cornerstone-blue text-2xl font-bold">Besoin d'un devis gratuit?</DialogTitle>
          <DialogDescription className="text-cornerstone-gray">
            Avant de partir, laissez-nous vos coordonnées pour recevoir un devis gratuit pour votre projet de construction.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input id="name" placeholder="Votre nom" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Votre email" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" placeholder="Votre numéro de téléphone" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="project">Détails du projet</Label>
              <Textarea 
                id="project" 
                placeholder="Décrivez brièvement votre projet de construction..." 
                required
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Non merci
            </Button>
            <Button type="submit" className="bg-cornerstone-orange hover:bg-cornerstone-orange/90">
              Demander un devis gratuit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentModal;
