import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Tooltip from "../ui/Tooltip";

const MetricCard = ({ icon: Icon, title, value, description, loading, tooltipText, details }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`card-hover-elevation surface-card overflow-hidden rounded-2xl border border-[#D5E8DA] bg-white p-5 transition-all ${
        details ? "cursor-pointer" : ""
      }`}
      onClick={() => details && setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280]">{title}</p>
            {tooltipText && <Tooltip text={tooltipText} />}
          </div>

          <p className="mt-2 text-3xl font-extrabold tracking-tight text-[#176B3A]">
            {loading ? (
              <span className="inline-block h-8 w-20 skeleton-shimmer rounded-md" />
            ) : (
              value
            )}
          </p>

          {description && (
            <p className="mt-1 text-xs text-[#6B7280]">{description}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          {Icon && (
            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-[#9AD9B1]/30 text-[#176B3A]">
              <Icon size={20} />
            </div>
          )}
          {details && (
            <button className="text-[#176B3A] hover:text-[#15803D] mt-1">
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          )}
        </div>
      </div>

      {/* Expandable detail pane */}
      {expanded && details && (
        <div className="mt-4 border-t border-[#D5E8DA] pt-3 text-xs text-[#24352A] animate-fade-in-up">
          {details}
        </div>
      )}
    </div>
  );
};

export default MetricCard;