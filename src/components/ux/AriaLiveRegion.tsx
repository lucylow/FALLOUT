import React, { useEffect } from "react";

const AriaLiveRegion = ({ message }: { message: string }) => {
  return (
    <div 
      className="sr-only" 
      role="status" 
      aria-live="polite" 
      aria-atomic="true"
    >
      {message}
    </div>
  );
};

export default AriaLiveRegion;
