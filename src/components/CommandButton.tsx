
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const CommandButton = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Set timer to hide the button after 5 seconds
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    // Clean up the timer
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 animate-fade-in">
      <Link to="/panier">
        <Button variant="orange" size="lg" className="shadow-lg">
          <ShoppingCart className="mr-2" size={18} />
          Commander
        </Button>
      </Link>
    </div>
  );
};

export default CommandButton;
