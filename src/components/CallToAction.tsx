
import { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import { useLocation } from "react-router-dom";

interface CallToActionProps {
  phoneNumber: string;
  hideAfterSeconds?: number;
}

const CallToAction = ({ phoneNumber, hideAfterSeconds = 10 }: CallToActionProps) => {
  const [visible, setVisible] = useState(true);
  const location = useLocation();
  
  // Only show on homepage and contact page
  const shouldShow = location.pathname === "/" || location.pathname === "/contact";
  
  useEffect(() => {
    if (!shouldShow) return;
    
    let timeout: ReturnType<typeof setTimeout>;
    let lastActivity = Date.now();
    
    const handleActivity = () => {
      lastActivity = Date.now();
      setVisible(true);
      
      // Clear existing timeout
      if (timeout) clearTimeout(timeout);
      
      // Set new timeout
      timeout = setTimeout(() => {
        // Only hide if there's been no activity
        if (Date.now() - lastActivity >= hideAfterSeconds * 1000) {
          setVisible(false);
        }
      }, hideAfterSeconds * 1000);
    };
    
    // Set initial timeout
    handleActivity();
    
    // Add event listeners to detect user activity
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("touchstart", handleActivity);
    window.addEventListener("scroll", handleActivity);
    
    return () => {
      if (timeout) clearTimeout(timeout);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      window.removeEventListener("scroll", handleActivity);
    };
  }, [hideAfterSeconds, shouldShow]);
  
  if (!shouldShow || !visible) return null;
  
  return (
    <div className="fixed bottom-10 right-10 z-50">
      <a
        href={`tel:${phoneNumber}`}
        className="flex flex-col items-center bg-white p-4 rounded-full shadow-lg"
      >
        <div className="bg-cornerstone-orange p-3 rounded-full mb-2 animate-pulse-icon">
          <Phone className="text-white" size={24} />
        </div>
        <span className="text-cornerstone-blue font-bold whitespace-nowrap">
          {phoneNumber}
        </span>
      </a>
    </div>
  );
};

export default CallToAction;
