import { useState } from "react";
import { HelpCircle } from "lucide-react";

const Tooltip = ({ text, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="relative inline-flex items-center gap-1 cursor-help"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children || <HelpCircle size={15} className="text-[#6B7280] hover:text-[#176B3A] transition" />}
      {visible && (
        <span className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[#24352A] px-3 py-1.5 text-xs font-medium text-white shadow-lg animate-fade-in-up">
          {text}
          <span className="absolute top-full left-1/2 -ml-1 border-4 border-transparent border-t-[#24352A]" />
        </span>
      )}
    </span>
  );
};

export default Tooltip;