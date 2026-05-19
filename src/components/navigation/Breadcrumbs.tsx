import React from "react";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#8E9299] mb-6">
      <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer opacity-60">
        <Home size={12} />
        <span>Root</span>
      </div>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={10} className="text-[#454545]" />
          <div 
            onClick={item.onClick}
            className={`transition-colors cursor-pointer ${
              item.active ? "text-quantum-primary font-bold" : "hover:text-white opacity-80"
            }`}
          >
            {item.label}
          </div>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
