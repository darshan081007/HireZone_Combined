import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HubCard = ({ title, description, icon: Icon, links = [] }) => {
  return (
    <div className="card-hover-elevation surface-card flex h-full flex-col rounded-2xl border border-[#D5E8DA] bg-white p-6">
      <div className="mb-4 flex items-center gap-3">
        {Icon && (
          <div className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-[#9AD9B1]/30 text-[#176B3A]">
            <Icon size={20} />
          </div>
        )}
        <h3 className="text-lg font-bold text-[#176B3A]">{title}</h3>
      </div>

      <p className="mb-5 text-xs leading-5 text-[#6B7280]">{description}</p>

      <div className="mt-auto space-y-1.5">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-[#24352A] transition hover:bg-[#9AD9B1]/20 hover:text-[#176B3A]"
          >
            <span>{link.label}</span>
            <ArrowRight
              size={14}
              className="text-[#6B7280] transition group-hover:translate-x-1 group-hover:text-[#176B3A]"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HubCard;