
import { useState } from "react";
import ReviewForm from "@/components/ReviewForm";
import ReviewDisplay, { Review } from "@/components/ReviewDisplay";
import { v4 as uuidv4 } from "uuid";

// Sample reviews
const sampleReviews: Review[] = [
  {
    id: "1",
    name: "Thomas Kokou",
    rating: 5,
    comment: "Excellente qualité de briques! J'ai utilisé leurs produits pour ma nouvelle maison et je suis très satisfait du résultat. Je recommande vivement.",
    date: "15/03/2023",
  },
  {
    id: "2",
    name: "Afi Mensah",
    rating: 4,
    comment: "Service client très réactif et produits livrés rapidement. Seul petit bémol sur quelques briques légèrement endommagées, mais l'équipe a rapidement résolu le problème.",
    date: "28/01/2023",
  },
  {
    id: "3",
    name: "Kossi Ametowoyona",
    rating: 5,
    comment: "Un fournisseur fiable pour tous mes projets de construction à Lomé. Les briques sont solides et uniformes, et leurs prix sont très compétitifs.",
    date: "12/04/2023",
  },
  {
    id: "4",
    name: "Kouamé Adjété",
    rating: 5,
    comment: "Excellent rapport qualité-prix! J'ai commandé depuis la Côte d'Ivoire pour un projet à Abidjan, et j'ai été impressionné par la qualité et le service. Livraison internationale impeccable.",
    date: "05/02/2023",
  },
  {
    id: "5",
    name: "Ouedraogo Mathieu",
    rating: 4,
    comment: "Très bons matériaux de construction. J'ai commandé pour un projet au Burkina Faso et la qualité des briques est remarquable. Je ferai certainement appel à leurs services pour mes futurs projets.",
    date: "20/05/2023",
  },
  {
    id: "6",
    name: "Yawo Mawuli",
    rating: 5,
    comment: "Les briques de Cornerstone ont parfaitement résisté à la saison des pluies. Excellente durabilité et service client attentif. Je suis pleinement satisfait.",
    date: "03/06/2023",
  },
  {
    id: "7",
    name: "Komla Agbéko",
    rating: 4,
    comment: "J'ai comparé plusieurs fournisseurs à Lomé et Cornerstone offre le meilleur équilibre entre qualité et prix. Leur équipe est également très professionnelle lors des livraisons.",
    date: "17/04/2023",
  },
];

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);
  
  const handleSubmitReview = (reviewData: {
    name: string;
    rating: number;
    comment: string;
  }) => {
    const newReview: Review = {
      id: uuidv4(),
      name: reviewData.name,
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date().toLocaleDateString("fr-FR"),
      isNew: true,
    };
    
    setReviews((prevReviews) => [newReview, ...prevReviews]);
    
    // Remove isNew flag after animation
    setTimeout(() => {
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === newReview.id ? { ...review, isNew: false } : review
        )
      );
    }, 1000);
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <h1 className="title text-center mb-12">Avis Clients</h1>
        
        {/* Form and Reviews layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Review Form */}
          <div className="lg:col-span-1">
            <ReviewForm onSubmit={handleSubmitReview} />
          </div>
          
          {/* Orange border on medium and larger screens */}
          <div className="hidden lg:block lg:col-span-1 border-r-2 border-cornerstone-orange mx-4"></div>
          
          {/* Reviews Display */}
          <div className="lg:col-span-1">
            <h2 className="section-title mb-6">Avis récents</h2>
            <ReviewDisplay reviews={reviews} />
          </div>
        </div>
        
        {/* Orange border on mobile */}
        <div className="block lg:hidden border-b-2 border-cornerstone-orange my-8"></div>
        
        {/* Testimonial Section */}
        <section className="mt-16">
          <h2 className="section-title text-center mb-8">Ce que nos clients disent de nous</h2>
          
          <div className="bg-cornerstone-blue text-white p-8 rounded-lg shadow-lg">
            <blockquote className="text-lg italic text-center">
              "CORNERSTONE BRIQUES a été un partenaire crucial pour notre projet de construction d'école. Leurs briques sont robustes, de haute qualité, et leur équipe est professionnelle et fiable. Je les recommande sans hésitation pour tout projet de construction important."
            </blockquote>
            <div className="mt-4 text-right">
              <p className="font-bold">- Directeur, École Primaire Avenir Brillant</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Reviews;
