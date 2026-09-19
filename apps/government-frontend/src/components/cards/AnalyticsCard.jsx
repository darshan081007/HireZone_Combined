import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import Tooltip from "../ui/Tooltip";

const AnalyticsCard = ({ label, title, description, actions, tooltipText, children, expandableDetails }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="card-hover-elevation surface-card overflow-hidden rounded-2xl border border-[#D5E8DA] bg-white">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#D5E8DA] px-6 py-4">
        <div>
          {label && (
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7A5535]">
              {label}
            </p>
          )}
          <div className="flex items-center gap-2 mt-0.5">
            <h2 className="text-lg font-bold text-[#176B3A]">{title}</h2>
            {tooltipText && <Tooltip text={tooltipText} />}
          </div>
          {description && (
            <p className="mt-0.5 text-xs text-[#6B7280]">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {actions}
          {expandableDetails && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#D5E8DA] text-[#6B7280] hover:bg-[#9AD9B1]/20 hover:text-[#176B3A] transition"
              title={expanded ? "Collapse card" : "Expand details"}
            >
              {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          )}
        </div>
      </div>

      <div className="min-h-[280px] p-5 sm:p-6">{children}</div>

      {expanded && expandableDetails && (
        <div className="border-t border-[#D5E8DA] bg-[#F3FBF5] p-5 text-xs text-[#24352A] animate-fade-in-up">
          <p className="font-bold text-[#176B3A] mb-1">Detailed Analysis & Insights:</p>
          {expandableDetails}
        </div>
      )}
    </section>
  );
};

export default AnalyticsCard;