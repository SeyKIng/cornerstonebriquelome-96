
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    {
      id: 1,
      src: "/lovable-uploads/6ef192e3-5877-4867-a4ba-f694a291ffeb.png",
      alt: "Gallery Image 1"
    },
    {
      id: 2,
      src: "/lovable-uploads/7bdda587-b33f-46ff-bb67-05121bc22fb8.png",
      alt: "Gallery Image 2"
    },
    {
      id: 3,
      src: "/lovable-uploads/bcc3b505-4545-49c1-a562-ccd8cae646f6.png",
      alt: "Gallery Image 3"
    },
    {
      id: 4,
      src: "/lovable-uploads/37a4e285-3958-44f1-97be-220084e4c3de.png",
      alt: "Gallery Image 4"
    },
    {
      id: 5,
      src: "/lovable-uploads/7c9d382a-aaf6-4267-a671-816664f22523.png",
      alt: "Gallery Image 5"
    },
    {
      id: 6,
      src: "/lovable-uploads/350f469e-14ca-46ab-ae62-1c11d4502d27.png",
      alt: "Gallery Image 6"
    },
    {
      id: 7,
      src: "/lovable-uploads/dd925e7d-3413-4981-a0fc-a7a19719921f.png",
      alt: "Briques empilées"
    },
    {
      id: 8,
      src: "/lovable-uploads/7a24f35e-7014-482d-9307-66c554cb9a81.png",
      alt: "Équipe Cornerstone Briques"
    },
    {
      id: 9,
      src: "/lovable-uploads/d816d0d6-bdce-49be-9d9d-a345e4d8713e.png",
      alt: "Catalogue de produits Cornerstone Briques"
    },
    {
      id: 10,
      src: "/lovable-uploads/c30caebc-9c3d-4a9b-b061-ec4ae5b5325a.png",
      alt: "Machine de production"
    },
    {
      id: 11,
      src: "/lovable-uploads/4edffa2d-a821-45d1-a53c-3327e778f8af.png",
      alt: "Équipement industriel"
    },
    {
      id: 12,
      src: "/lovable-uploads/dd64084d-6f14-41e9-a8e9-d030d3a2c5d3.png",
      alt: "Moule à briques"
    }
  ];

  const openImage = (src: string) => {
    setSelectedImage(src);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8 text-cornerstone-blue text-center">Notre Galerie</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card 
            key={image.id} 
            className="overflow-hidden cursor-pointer hover-scale"
            onClick={() => openImage(image.src)}
          >
            <div className="h-64 overflow-hidden">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => closeImage()}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
          <button 
            onClick={closeImage}
            className="absolute right-2 top-2 z-50 rounded-full bg-black/30 hover:bg-black/50 p-2 text-white"
          >
            <X className="h-6 w-6" />
          </button>
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Enlarged gallery image" 
              className="w-full h-full object-contain animate-scale-in"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;
