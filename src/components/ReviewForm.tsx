
import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ReviewFormProps {
  onSubmit: (review: {
    name: string;
    rating: number;
    comment: string;
  }) => void;
}

const ReviewForm = ({ onSubmit }: ReviewFormProps) => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer votre nom",
        variant: "destructive",
      });
      return;
    }
    
    if (rating === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez donner une note",
        variant: "destructive",
      });
      return;
    }
    
    if (!comment.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un commentaire",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit({ name, rating, comment });
    setName("");
    setRating(0);
    setComment("");
    
    toast({
      title: "Merci !",
      description: "Votre avis a été soumis avec succès",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="section-title mb-6">Laissez votre avis</h2>
      
      <div className="mb-4">
        <label htmlFor="name" className="block text-cornerstone-gray font-bold mb-2">
          Nom
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Votre nom"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-cornerstone-gray font-bold mb-2">
          Note
        </label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={32}
              className={`cursor-pointer transition-colors ${
                (hoveredRating || rating) >= star
                  ? "text-cornerstone-orange fill-cornerstone-orange"
                  : "text-gray-300"
              }`}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <label htmlFor="comment" className="block text-cornerstone-gray font-bold mb-2">
          Commentaire
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          rows={4}
          placeholder="Partagez votre expérience..."
        />
      </div>
      
      <button
        type="submit"
        className="cta-button w-full"
      >
        Soumettre
      </button>
    </form>
  );
};

export default ReviewForm;
