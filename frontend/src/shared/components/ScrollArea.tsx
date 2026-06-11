import { forwardRef } from "react";
import type { ReactNode, CSSProperties } from "react";

interface ScrollAreaProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ children, className = "", style }, ref) => {
    return (
      <div ref={ref} className={`group overflow-y-auto ${className}`} style={style}>
        {children}
        <style>{`
          .group::-webkit-scrollbar { width: 3px; display: block; }
          .group::-webkit-scrollbar-track { background: transparent; }
          .group::-webkit-scrollbar-thumb { background: transparent; border-radius: 1.5px; }
          .group { scrollbar-width: thin; scrollbar-color: transparent transparent; }
          .group:hover::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.3); }
          .group:hover { scrollbar-color: rgba(0,0,0,0.3) transparent; }
        `}</style>
      </div>
    );
  }
);

export default ScrollArea;
