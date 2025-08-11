
import { Star } from "lucide-react";

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  isNew?: boolean;
}

interface ReviewDisplayProps {
  reviews: Review[];
}

const ReviewDisplay = ({ reviews }: ReviewDisplayProps) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-cornerstone-gray">
        <p className="font-bold">Aucun avis pour le moment.</p>
        <p>Soyez le premier à donner votre avis!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className={`bg-white p-6 rounded-lg shadow-md ${
            review.isNew ? "animate-slide-in-right" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">{review.name}</h3>
            <span className="text-cornerstone-gray text-sm">{review.date}</span>
          </div>
          
          <div className="flex mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={20}
                className={`${
                  star <= review.rating
                    ? "text-cornerstone-orange fill-cornerstone-orange"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          
          <p className="text-cornerstone-gray">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewDisplay;
